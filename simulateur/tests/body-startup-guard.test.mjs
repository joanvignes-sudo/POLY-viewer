import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html=fs.readFileSync(new URL('../web/index.html',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
const guard=fs.readFileSync(new URL('../web/body-startup-guard.js',import.meta.url),'utf8');
test('full-body status starts busy and fallback stays outside inert main',()=>{
 assert.match(html,/<main aria-busy="true" inert>/);
 assert.match(html,/<\/main><section id="body-startup-fallback" hidden role="alert"/);
 assert.match(html,/id="body-retry"/);
 assert.match(html,/href="cerveau\.html"/);
 assert.match(html,/href="observations-lumiere\.html"/);
 assert.match(html,/href="recherche\.html"/);
});
test('recovery guard initializes before body module and keeps scientific fallback available',()=>{
 assert.ok(html.indexOf('src="body-startup-guard.js?v=1"')<html.indexOf('src="app.js?v=0.141.1"'));
 assert.match(guard,/unhandledrejection/);
 assert.match(guard,/webglcontextlost/);
 assert.match(guard,/aria-busy/);
 assert.match(guard,/location\.reload\(\)/);
});
test('mobile coarse pointer is capped at DPR one to avoid expensive render buffers',()=>{
 assert.match(app,/renderer\.setPixelRatio\(Math\.min\(window\.devicePixelRatio\|\|1,window\.matchMedia\('\(pointer:coarse\)'\)\.matches\?1:1\.7\)\)/);
 assert.match(app,/fetch\('\.\.\/models\/body-display\.bin'\)/);
});
