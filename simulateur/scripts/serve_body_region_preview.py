#!/usr/bin/env python3
"""Loopback-only regional preview. Generated blocks remain outside the site tree."""
import argparse
import json
import re
import shutil
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

REPO = Path(__file__).resolve().parents[2]
PREFIX = '/simulateur/data/body-chunks-preview/'


def make_handler(chunks_root, repo_root=REPO, reference_root=None, skeleton_root=None):
    chunks_root = Path(chunks_root).resolve(strict=True)
    manifest = json.loads((chunks_root / 'MANIFEST.json').read_text(encoding='utf-8'))
    if (manifest.get('schema') != 'poly.body-source-chunks.v1'
            or manifest.get('status') != 'experimental_not_deployed'
            or manifest.get('published') is not False):
        raise ValueError('Only unpublished experimental source chunks may be previewed')

    if reference_root is not None:
        reference_root = Path(reference_root).resolve(strict=True)
        reference_manifest = json.loads((reference_root / 'MANIFEST.json').read_text(encoding='utf-8'))
        if (reference_manifest.get('schema') != 'poly.reference-source-manifest.v1'
                or reference_manifest.get('published') is not False
                or reference_manifest.get('status') != 'experimental_not_deployed'
                or reference_manifest.get('source_value_verification') != 'PASS'):
            raise ValueError('Only verified unpublished reference chunks may be previewed')

    if skeleton_root is not None:
        skeleton_root = Path(skeleton_root).resolve(strict=True)
        skeleton_manifest = json.loads((skeleton_root / 'MANIFEST.json').read_text(encoding='utf-8'))
        if skeleton_manifest.get('schema') != 'poly.skeleton-source-manifest.v1' or skeleton_manifest.get('published') is not False or skeleton_manifest.get('source_value_verification') != 'PASS':
            raise ValueError('Only verified unpublished skeleton blocks allowed')

    class Handler(SimpleHTTPRequestHandler):
        def copyfile(self, source, outputfile):
            try:
                shutil.copyfileobj(source, outputfile)
            except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError) as error:
                # The headers may already be sent. Record interruption, never a successful retry.
                # A client cancellation and a host/network failure cannot be distinguished here.
                self.log_error('resource-transfer-interrupted path=%s exception=%s code=%s cause=unknown',
                               urlsplit(self.path).path, type(error).__name__,
                               getattr(error, 'winerror', None) or error.errno)

        def list_directory(self, path):
            self.send_error(403, 'Directory listing disabled')
            return None

        def preview(self, head=False):
            request_path = unquote(urlsplit(self.path).path)
            asset_root, prefix = chunks_root, PREFIX
            pattern = r'MANIFEST\.json|chunks/[a-z][a-z0-9_-]{1,64}\.(?:json|bin\.gz)'
            reference_prefix = '/simulateur/data/reference-chunks-preview/'
            if request_path.startswith(reference_prefix):
                if reference_root is None:
                    self.send_error(404, 'Reference preview not configured')
                    return True
                asset_root, prefix = reference_root, reference_prefix
                pattern = r'MANIFEST\.json|CATALOGUE\.json\.gz|chunks/reference-\d{3}\.(?:json|bin\.gz)'
            elif request_path.startswith('/simulateur/data/skeleton-chunks-preview/'):
                if skeleton_root is None:
                    self.send_error(404, 'Skeleton preview not configured')
                    return True
                asset_root, prefix = skeleton_root, '/simulateur/data/skeleton-chunks-preview/'
                pattern = r'MANIFEST\.json|CATALOGUE\.json\.gz|chunks/skeleton-\d{3}\.(?:json|bin\.gz)'
            elif not request_path.startswith(PREFIX):
                return False
            relative = request_path[len(prefix):]
            if not re.fullmatch(pattern, relative):
                self.send_error(403, 'Invalid preview resource')
                return True
            target = (asset_root / relative).resolve()
            if not target.is_relative_to(asset_root) or not target.is_file():
                self.send_error(404)
                return True
            with target.open('rb') as source:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json' if relative.endswith('.json') else 'application/octet-stream')
                self.send_header('Content-Length', str(target.stat().st_size))
                self.send_header('Cache-Control', 'no-store')
                self.send_header('X-Content-Type-Options', 'nosniff')
                self.end_headers()
                if not head:
                    self.copyfile(source, self.wfile)
            return True

        def do_GET(self):
            if not self.preview():
                super().do_GET()

        def do_HEAD(self):
            if not self.preview(head=True):
                super().do_HEAD()

    return partial(Handler, directory=str(Path(repo_root).resolve()))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--chunks-root', type=Path, required=True)
    parser.add_argument('--reference-chunks-root', type=Path)
    parser.add_argument('--skeleton-chunks-root', type=Path)
    parser.add_argument('--port', type=int, default=8124)
    args = parser.parse_args()
    with ThreadingHTTPServer(('127.0.0.1', args.port), make_handler(args.chunks_root, reference_root=args.reference_chunks_root, skeleton_root=args.skeleton_chunks_root)) as server:
        print(f'Local preview only: http://127.0.0.1:{server.server_port}/simulateur/web/body-region-lab.html', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    main()
