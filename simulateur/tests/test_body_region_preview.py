import importlib.util
import io
import json
import tempfile
import threading
import unittest
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

spec = importlib.util.spec_from_file_location('preview', Path(__file__).resolve().parents[1] / 'scripts/serve_body_region_preview.py')
preview = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preview)


class PreviewTest(unittest.TestCase):
    def test_optional_metabolic_mount_is_closed_by_default(self):
        with self.assertRaises(HTTPError) as caught:
            urlopen(self.base + '/simulateur/data/metabolic-observations-preview/OBSERVATIONS.json')
        self.assertEqual(caught.exception.code, 404)
        caught.exception.close()

    def test_metabolic_mount_only_serves_declared_unpublished_resources(self):
        observations = Path(self.temp.name) / 'observations'
        observations.mkdir()
        manifest = {'schema': 'poly.metabolic-preview.v1', 'published': False, 'resource': 'OBSERVATIONS.json'}
        (observations / 'MANIFEST.json').write_text(json.dumps(manifest))
        (observations / 'OBSERVATIONS.json').write_bytes(b'{"series":[]}')
        (observations / 'private.txt').write_text('must remain private')
        server = preview.PreviewHTTPServer(('127.0.0.1', 0), preview.make_handler(self.chunks, self.site, observations_root=observations))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f'http://127.0.0.1:{server.server_port}/simulateur/data/metabolic-observations-preview/'
        try:
            with urlopen(base + 'OBSERVATIONS.json') as response:
                self.assertEqual(response.read(), b'{"series":[]}')
                self.assertEqual(response.headers['Cache-Control'], 'no-store')
            with urlopen(Request(base + 'OBSERVATIONS.json', method='HEAD')) as response:
                self.assertEqual(response.read(), b'')
                self.assertEqual(response.headers['Content-Length'], '13')
            for path in ['private.txt', '../index.html', '%2e%2e/private.txt', '']:
                with self.assertRaises(HTTPError) as caught:
                    urlopen(base + path)
                self.assertEqual(caught.exception.code, 403)
                caught.exception.close()
            self.assertEqual(list(self.site.iterdir()), [self.site / 'index.html'])
        finally:
            server.shutdown()
            server.server_close()
            thread.join()
        manifest['published'] = True
        (observations / 'MANIFEST.json').write_text(json.dumps(manifest))
        with self.assertRaises(ValueError):
            preview.make_handler(self.chunks, self.site, observations_root=observations)

    def test_transfer_interruptions_record_the_resource_without_guessing_a_cause(self):
        handler_type = preview.make_handler(self.chunks, self.site).func
        handler = object.__new__(handler_type)
        handler.path = '/simulateur/web/module.mjs?unrelated-query=private'
        events = []
        handler.log_error = lambda fmt, *args: events.append(fmt % args)
        for error_type in (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            class DisconnectedWriter:
                def write(self, data):
                    raise error_type('connection interrupted')
            handler.copyfile(io.BytesIO(b'original source bytes'), DisconnectedWriter())
            self.assertIn('/simulateur/web/module.mjs', events[-1])
            self.assertIn(error_type.__name__, events[-1])
            self.assertIn('cause=unknown', events[-1])
            self.assertNotIn('private', events[-1])
        self.assertEqual(len(events), 3)
        class BrokenSource:
            def read(self, length):
                raise OSError('disk read failure')
        with self.assertRaisesRegex(OSError, 'disk read failure'):
            handler.copyfile(BrokenSource(), io.BytesIO())
        self.assertEqual(len(events), 3)

    def test_preview_listener_has_explicit_burst_accept_capacity(self):
        self.assertEqual(preview.PreviewHTTPServer.request_queue_size, 128)
        self.assertIsInstance(self.server, preview.PreviewHTTPServer)

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        root = Path(self.temp.name)
        self.chunks = root / 'external-blocks'
        self.chunks.mkdir()
        (self.chunks / 'chunks').mkdir()
        (self.chunks / 'chunks/test-000.bin.gz').write_bytes(b'fixture')
        self.manifest = {'schema': 'poly.body-source-chunks.v1', 'status': 'experimental_not_deployed', 'published': False}
        (self.chunks / 'MANIFEST.json').write_text(json.dumps(self.manifest))
        self.site = root / 'site'
        self.site.mkdir()
        (self.site / 'index.html').write_text('fixture site')
        self.server = preview.PreviewHTTPServer(('127.0.0.1', 0), preview.make_handler(self.chunks, self.site))
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.base = f'http://127.0.0.1:{self.server.server_port}'

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.temp.cleanup()

    def test_external_bytes_and_head_without_copying_into_site(self):
        with urlopen(self.base + preview.PREFIX + 'chunks/test-000.bin.gz') as response:
            self.assertEqual(response.read(), b'fixture')
            self.assertEqual(response.headers['Cache-Control'], 'no-store')
            self.assertIsNone(response.headers['Content-Encoding'])
        with urlopen(Request(self.base + preview.PREFIX + 'chunks/test-000.bin.gz', method='HEAD')) as response:
            self.assertEqual(response.read(), b'')
            self.assertEqual(response.headers['Content-Length'], '7')
        self.assertEqual(list(self.site.iterdir()), [self.site / 'index.html'])

    def test_traversal_unknown_resources_and_listing_refused(self):
        for relative in ['../index.html', '%2e%2e/index.html', 'chunks/', 'chunks/test-000.bin.gz/extra', 'unknown.json']:
            with self.assertRaises(HTTPError) as caught:
                urlopen(self.base + preview.PREFIX + relative)
            self.assertEqual(caught.exception.code, 403)
            caught.exception.close()
        (self.site / 'empty').mkdir()
        with self.assertRaises(HTTPError) as caught:
            urlopen(self.base + '/empty/')
        self.assertEqual(caught.exception.code, 403)
        caught.exception.close()

    def test_published_manifest_cannot_be_served_as_local_experiment(self):
        self.manifest['published'] = True
        (self.chunks / 'MANIFEST.json').write_text(json.dumps(self.manifest))
        with self.assertRaises(ValueError):
            preview.make_handler(self.chunks, self.site)


    def test_reference_assets_have_an_independent_local_root(self):
        reference = Path(self.temp.name) / 'reference'
        (reference / 'chunks').mkdir(parents=True)
        manifest = {'schema': 'poly.reference-source-manifest.v1', 'published': False,
                    'status': 'experimental_not_deployed', 'source_value_verification': 'PASS'}
        (reference / 'MANIFEST.json').write_text(json.dumps(manifest))
        (reference / 'chunks/reference-000.bin.gz').write_bytes(b'reference-fixture')
        server = preview.PreviewHTTPServer(('127.0.0.1', 0), preview.make_handler(self.chunks, self.site, reference))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            with urlopen(f'http://127.0.0.1:{server.server_port}/simulateur/data/reference-chunks-preview/chunks/reference-000.bin.gz') as response:
                self.assertEqual(response.read(), b'reference-fixture')
                self.assertIsNone(response.headers['Content-Encoding'])
            self.assertEqual(list(self.site.iterdir()), [self.site / 'index.html'])
        finally:
            server.shutdown()
            server.server_close()
            thread.join()
