import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const code=fs.readFileSync(new URL('../web/body-startup-guard.js',import.meta.url),'utf8');
function harness(){
 const listeners={},timers=new Map();let seq=0,mutation,observing=false,reloads=0;
 const el=()=>({hidden:true,dataset:{},handlers:{},textContent:'',addEventListener(type,fn){this.handlers[type]=fn;}});
 const main={busy:'true',getAttribute(){return this.busy;}},fallback=el(),label=el(),retry=el(),canvas=el();
 const window={addEventListener(type,fn){(listeners[type]??=[]).push(fn);}},document={querySelector(s){return {'main':main,'#body-startup-fallback':fallback,'#status':label,'#body-retry':retry,'#body':canvas}[s];}};
 class ErrorEvent{}
 class MutationObserver{constructor(fn){mutation=fn;}observe(){observing=true;}disconnect(){observing=false;}}
 vm.runInNewContext(code,{window,document,MutationObserver,ErrorEvent,setTimeout(fn){timers.set(++seq,fn);return seq;},clearTimeout(id){timers.delete(id);},location:{reload(){reloads++;}}});
 return {window,main,fallback,label,retry,canvas,timers,get reloads(){return reloads;},event(type,e={}){for(const fn of listeners[type]??[])fn(e);},deadline(){const jobs=[...timers.values()];timers.clear();jobs.forEach(fn=>fn());},ready(){main.busy='false';if(observing)mutation();}};
}
test('classic held initialization exposes alternatives and late readiness removes delay only',()=>{
 const h=harness();h.deadline();assert.equal(h.fallback.hidden,false);assert.equal(h.fallback.dataset.reason,'initialization-deadline');assert.equal(h.window.__polyClassicStartup().deadline_exceeded,true);assert.equal(h.reloads,0);
 h.label.textContent='Corps prêt';h.ready();assert.equal(h.fallback.hidden,true);assert.equal(h.label.textContent,'Corps prêt');assert.equal(h.window.__polyClassicStartup().ready,true);assert.equal(h.window.__polyClassicStartup().failure_reason,null);
});
test('classic explicit failure replaces delay and is retained after ready',()=>{
 const h=harness();h.deadline();h.event('poly-body-init-failed',{detail:{reason:'resource-load'}});h.ready();assert.equal(h.fallback.hidden,false);assert.equal(h.fallback.dataset.reason,'resource-load');assert.equal(h.timers.size,0);assert.equal(h.reloads,0);
});
test('classic ready cancels deadline; post-ready context loss still exposes fallback',()=>{
 const h=harness();h.ready();assert.equal(h.timers.size,0);h.deadline();assert.equal(h.fallback.hidden,true);let prevented=false;h.canvas.handlers.webglcontextlost({preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.equal(h.fallback.dataset.reason,'webgl-context-lost');
});
test('classic departure cancels deadline and persisted busy return arms it anew',()=>{
 const h=harness();h.event('pagehide');assert.equal(h.timers.size,0);h.event('pageshow',{persisted:true});assert.equal(h.timers.size,1);h.deadline();assert.equal(h.fallback.hidden,false);h.retry.handlers.click();assert.equal(h.reloads,1);
});
