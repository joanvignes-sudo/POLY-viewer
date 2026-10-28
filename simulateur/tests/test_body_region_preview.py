import importlib.util
import json
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

spec = importlib.util.spec_from_file_location('preview', Path(__file__).resolve().parents[1] / 'scripts/serve_body_region_preview.py')
preview = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preview)


class PreviewTest(unittest.TestCase):
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
        self.server = ThreadingHTTPServer(('127.0.0.1', 0), preview.make_handler(self.chunks, self.site))
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
