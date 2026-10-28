import test from 'node:test';import assert from 'node:assert/strict';
import {createDayJournalStore,DAY_STORAGE_KEY,MAX_JOURNAL_BYTES} from '../web/day-journal-store.mjs';
import {defaultDay} from '../web/day-model.js';
function memory(raw=null){const values=new Map(raw===null?[]:[[DAY_STORAGE_KEY,raw]]);return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value))};}
const original=()=>({...structuredClone(defaultDay),title:'Journal fictif de test',custom_source:{preserve:true}});
test('reading absent or malformed storage makes no write and preserves the exact original bytes',()=>{
 for(const raw of [null,'{invalid',JSON.stringify({...original(),biological_prediction:true})]){const storage=memory(raw),store=createDayJournalStore(storage);const state=store.load();assert.equal(state.source,raw===null?'absent':'invalid');assert.equal(store.day,null);assert.equal(storage.getItem(DAY_STORAGE_KEY),raw);if(raw!==null)assert.equal(store.rawText(),raw);}
});
test('staged edits preserve unknown fields and IDs and back up exact bytes before an explicit save',()=>{
 const raw=JSON.stringify(original(),null,2),storage=memory(raw),store=createDayJournalStore(storage,{newBackupKey:()=> 'poly.day.backup.v1.test'});store.load();const copy=store.day;copy.title='outside mutation';assert.notEqual(store.day.title,copy.title);
 store.update(day=>{day.title='Brouillon fictif';day.events[0].detail='Ajout déclaré'});assert.equal(storage.getItem(DAY_STORAGE_KEY),raw);store.save();assert.equal(storage.getItem('poly.day.backup.v1.test'),raw);const saved=JSON.parse(storage.getItem(DAY_STORAGE_KEY));assert.equal(saved.events[0].id,'e1');assert.deepEqual(saved.custom_source,{preserve:true});assert.equal(saved.biological_prediction,false);assert.equal(store.state().dirty,false);
});
test('invalid edits/imports never change the draft, shared value or revision',()=>{
 const storage=memory(JSON.stringify(original())),store=createDayJournalStore(storage);store.load();const before=store.day,revision=store.state().revision;
 assert.throws(()=>store.update(day=>day.events[1].start=10),/chevauchent/);assert.throws(()=>store.importText('{}'));assert.throws(()=>store.importText(' '.repeat(MAX_JOURNAL_BYTES+1)));assert.deepEqual(store.day,before);assert.equal(store.state().revision,revision);assert.equal(store.state().dirty,false);
});
test('concurrent shared changes refuse saving and preserve both the external version and local draft',()=>{
 const storage=memory(JSON.stringify(original())),store=createDayJournalStore(storage);store.load();store.update(day=>day.title='Local draft');const external=JSON.stringify({...original(),title:'Autre page'});storage.setItem(DAY_STORAGE_KEY,external);assert.equal(store.state().conflict,true);assert.throws(()=>store.save(),/autre page/);assert.equal(storage.getItem(DAY_STORAGE_KEY),external);assert.equal(store.day.title,'Local draft');assert.equal(store.state().dirty,true);
});
test('backup quota/collision errors never overwrite the previous shared value',()=>{
 for(const collision of [false,true]){const raw='{invalid',storage=memory(raw),store=createDayJournalStore(storage,{newBackupKey:()=> 'poly.day.backup.v1.fixed'});store.load();store.prepareExample();if(collision)storage.values.set('poly.day.backup.v1.fixed','older');else storage.setItem=()=>{throw Error('quota')};assert.throws(()=>store.save());assert.equal(storage.getItem(DAY_STORAGE_KEY),raw);}
});
test('a shared change during backup is detected before the main write',()=>{
 const raw=JSON.stringify(original()),storage=memory(raw),write=storage.setItem;storage.setItem=(key,value)=>{write(key,value);if(key!==DAY_STORAGE_KEY)write(DAY_STORAGE_KEY,'external version')};const store=createDayJournalStore(storage);store.load();store.update(day=>day.title='Draft');assert.throws(()=>store.save(),/pendant/);assert.equal(storage.getItem(DAY_STORAGE_KEY),'external version');
});
test('exports recompute known summaries and keep unknown fields; biological values stay unknown',()=>{
 const storage=memory(JSON.stringify({...original(),summary:{stale:true}})),store=createDayJournalStore(storage,{now:()=> '2026-10-28T22:00:00Z'});store.load();const exported=JSON.parse(store.exportText());assert.equal(exported.summary.biological_prediction,false);assert.equal(exported.summary.biological.glycemia,null);assert.deepEqual(exported.custom_source,{preserve:true});assert.equal(exported.exported_at,'2026-10-28T22:00:00Z');assert.equal(store.state().dirty,false);
});
test('unreadable storage permits an exportable example draft but refuses an unsafe save',()=>{
 const store=createDayJournalStore({getItem(){throw Error('denied')},setItem(){throw Error('denied')}});assert.equal(store.load().source,'unavailable');store.prepareExample();assert.ok(store.exportText());assert.throws(()=>store.save(),/Relire/);
});
test('storage becoming inaccessible is distinguished from a concurrent edit and cannot overwrite the saved day',()=>{
 const raw=JSON.stringify(original()),storage=memory(raw),store=createDayJournalStore(storage);store.load();store.update(day=>day.title='Draft');storage.getItem=()=>{throw Error('denied')};assert.equal(store.state().storage_read,false);assert.equal(store.state().conflict,false);assert.throws(()=>store.save(),/stockage local indisponible/);assert.equal(storage.values.get(DAY_STORAGE_KEY),raw);assert.equal(store.rawText(),raw);
});
test('large valid journals round-trip through a legacy-shaped export without importing a stale derived summary',()=>{
 const day=original();day.experiences=[{at:100,kind:'fixture',text:'x'.repeat(600000)}];const store=createDayJournalStore(memory(JSON.stringify(day)));store.load();const text=store.exportText();assert.ok(new TextEncoder().encode(text).length>MAX_JOURNAL_BYTES);const target=createDayJournalStore(memory());target.load();target.importText(text);assert.deepEqual(target.day.events,day.events);assert.deepEqual(target.day.experiences,day.experiences);assert.deepEqual(target.day.custom_source,day.custom_source);assert.equal(Object.hasOwn(target.day,'summary'),false);
});
