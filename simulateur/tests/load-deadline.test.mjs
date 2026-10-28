import test from 'node:test';
import assert from 'node:assert/strict';
import {startLoadDeadline} from '../web/load-deadline.mjs';
function clock(){let callback,cancelled=0;return {schedule:fn=>(callback=fn,17),cancel:id=>{assert.equal(id,17);cancelled++},fire:()=>callback(),cancelled:()=>cancelled};}
test('expired deadline really aborts a pending load with an explicit non-biological reason',()=>{
 const c=new AbortController(),fake=clock(),d=startLoadDeadline(c,{timeoutMs:30,...fake});assert.equal(c.signal.aborted,false);fake.fire();assert.equal(c.signal.aborted,true);assert.equal(c.signal.reason.code,'POLY_LOAD_TIMEOUT');assert.equal(d.expired(),true);assert.equal(fake.cancelled(),1);d.dispose();assert.equal(fake.cancelled(),1);
});
test('normal completion and user cancellation release timers without reporting timeout',()=>{
 for(const abort of [false,true]){const c=new AbortController(),fake=clock(),d=startLoadDeadline(c,{...fake});if(abort)c.abort(Error('User cancelled'));else d.dispose();fake.fire();assert.equal(d.expired(),false);assert.equal(fake.cancelled(),1);assert.equal(c.signal.aborted,abort);}
});
test('already cancelled loads never schedule a deadline and invalid durations fail',()=>{
 const c=new AbortController();c.abort();const d=startLoadDeadline(c,{schedule:()=>{throw Error('should not schedule')}});assert.equal(d.expired(),false);
 for(const timeoutMs of [0,-1,Infinity,'30'])assert.throws(()=>startLoadDeadline(new AbortController(),{timeoutMs}));
});
