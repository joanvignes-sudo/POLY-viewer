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


def make_handler(chunks_root, repo_root=REPO):
    chunks_root = Path(chunks_root).resolve(strict=True)
    manifest = json.loads((chunks_root / 'MANIFEST.json').read_text(encoding='utf-8'))
    if (manifest.get('schema') != 'poly.body-source-chunks.v1'
            or manifest.get('status') != 'experimental_not_deployed'
            or manifest.get('published') is not False):
        raise ValueError('Only unpublished experimental source chunks may be previewed')

    class Handler(SimpleHTTPRequestHandler):
        def list_directory(self, path):
            self.send_error(403, 'Directory listing disabled')
            return None

        def preview(self, head=False):
            request_path = unquote(urlsplit(self.path).path)
            if not request_path.startswith(PREFIX):
                return False
            relative = request_path[len(PREFIX):]
            if not re.fullmatch(r'MANIFEST\.json|chunks/[a-z][a-z0-9_-]{1,64}\.(?:json|bin\.gz)', relative):
                self.send_error(403, 'Invalid preview resource')
                return True
            target = (chunks_root / relative).resolve()
            if not target.is_relative_to(chunks_root) or not target.is_file():
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
                    try:
                        shutil.copyfileobj(source, self.wfile)
                    except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
                        pass  # Expected when the viewer cancels an obsolete download.
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
    parser.add_argument('--port', type=int, default=8124)
    args = parser.parse_args()
    with ThreadingHTTPServer(('127.0.0.1', args.port), make_handler(args.chunks_root)) as server:
        print(f'Local preview only: http://127.0.0.1:{server.server_port}/simulateur/web/body-region-lab.html', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    main()
