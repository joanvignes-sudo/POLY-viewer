import {Kernel} from './kernel.mjs';
const clone=x=>structuredClone(x);
const integer=x=>Number.isSafeInteger(x)&&x>=0;
const fail=message=>{throw Error(message);};
const name=x=>typeof x==='string'&&x.length>0&&x.length<=200&&!['__proto__','prototype','constructor'].includes(x);
function record(x){if(!x||typeof x!=='object'||Array.isArray(x))fail('Expected record');}
function values(x){record(x);for(const [k,v]of Object.entries(x))if(!name(k)||!(v===null||typeof v==='boolean'||typeof v==='string'||typeof v==='number'&&Number.isFinite(v)))fail('State must contain finite JSON scalar values');}
const canonical=x=>JSON.stringify(sort(x));
function sort(x){return Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;}
function validate(definitions,state){
 values(state);
 if(!Array.isArray(definitions)||!definitions.length||definitions.length>1000)fail('Invalid definition count');
 for(const d of definitions){record(d);if(!name(d.id))fail('Invalid definition identity');values(d.when??{});values(d.set??{});
  if(!Array.isArray(d.next??[])||(d.next??[]).length>100)fail('Invalid links');
  for(const l of d.next??[]){record(l);if(!name(l.target)||!integer(l.delay)||('feedback'in l&&typeof l.feedback!=='boolean'))fail('Invalid link');}
 }
 // Removing explicitly delayed feedback edges must leave an acyclic graph.
 const map=new Map(definitions.map(d=>[d.id,d])), visiting=new Set(),done=new Set();
 function visit(id){if(visiting.has(id))fail('Cycle requires an explicit delayed feedback edge');if(done.has(id))return;const d=map.get(id);if(!d)fail('Unknown target');visiting.add(id);for(const l of d.next??[])if(!l.feedback)visit(l.target);visiting.delete(id);done.add(id);}
 for(const d of definitions)visit(d.id);
}
export class CausalKernel extends Kernel {
 constructor(definitions,state={}){
  validate(definitions,state);super(definitions,state);
  this.initialState=clone(state);this.journal=[];this.joins={};this.internal=false;this.work=0;
 }
 snapshot(){return {definitions:clone(this.definitions),state:clone(this.state),now:this.now,sequence:this.sequence,events:clone(this.events),trace:clone(this.trace),joins:clone(this.joins)};}
 transaction(operation,action){
  if(this.internal)return action();
  if(this.journal.length>=10000)fail('Operation journal budget exhausted');
  const cost=this.events.length+this.trace.length+(operation.type==='run'?operation.maxEvents:1);
  if(!Number.isSafeInteger(cost)||this.work+cost>2000000)fail('Replay work budget exhausted');
  const before=this.snapshot();this.internal=true;
  try{const result=action();this.journal.push(clone(operation));this.work+=cost;return result;}
  catch(e){Object.assign(this,before);throw e;}
  finally{this.internal=false;}
 }
 schedule(definitionId,at,parents=[]){
  if(!name(definitionId)||!integer(at)||!Array.isArray(parents)||parents.length>1000||new Set(parents).size!==parents.length)fail('Invalid schedule');
  if(this.events.length>=100000)fail('Event storage budget exhausted');
  for(const id of parents){const p=this.events.find(e=>e.id===id);if(!p||p.at>at)fail('Parent missing or scheduled after child');}
  return this.transaction({type:'schedule',definitionId,at,parents},()=>super.schedule(definitionId,at,parents));
 }
 join(key,definitionId,parents,delay=0){
  if(!name(key)||!integer(delay)||!Array.isArray(parents)||parents.length<2||parents.length>1000||new Set(parents).size!==parents.length)fail('Invalid AND join');
  const ordered=[...parents].sort((a,b)=>{const x=this.events.find(e=>e.id===a),y=this.events.find(e=>e.id===b);if(!x||!y)fail('Unknown join parent');return x.sequence-y.sequence;});
  const previous=this.joins[key];
  const signature=canonical({definitionId,parents:ordered,delay});
  if(previous){if(previous.signature!==signature)fail('Join identity collision');return previous.id;}
  return this.transaction({type:'join',key,definitionId,parents:ordered,delay},()=>{
   const at=Math.max(this.now,...ordered.map(id=>this.events.find(e=>e.id===id)?.at??fail('Unknown join parent')))+delay;
   const id=this.schedule(definitionId,at,ordered);this.joins[key]={id,signature};return id;
  });
 }
 cancel(id){return this.transaction({type:'cancel',id},()=>super.cancel(id));}
 run(until,maxEvents=1000){
  if(!Number.isSafeInteger(maxEvents)||maxEvents<1||maxEvents>10000)fail('Invalid execution budget');
  return this.transaction({type:'run',until,maxEvents},()=>super.run(until,maxEvents));
 }
 save(){const json=JSON.stringify({version:2,kind:'synthetic-only-replay',initialState:this.initialState,journal:this.journal,snapshot:this.snapshot()});if(json.length>16000000)fail('Checkpoint size limit');return json;}
 static resume(json){
  if(typeof json!=='string'||json.length>16000000)fail('Checkpoint size limit');
  const s=JSON.parse(json);record(s);
  if(s.version!==2||s.kind!=='synthetic-only-replay'||!Array.isArray(s.journal)||s.journal.length>10000)fail('Unsupported checkpoint');
  record(s.snapshot);const k=new CausalKernel(s.snapshot.definitions,s.initialState);
  for(const op of s.journal){record(op);
   switch(op.type){
    case 'schedule':k.schedule(op.definitionId,op.at,op.parents);break;
    case 'join':k.join(op.key,op.definitionId,op.parents,op.delay);break;
    case 'cancel':k.cancel(op.id);break;
    case 'run':k.run(op.until,op.maxEvents);break;
    default:fail('Unknown checkpoint operation');
   }
  }
  if(canonical(k.snapshot())!==canonical(s.snapshot)||canonical(k.journal)!==canonical(s.journal))fail('Checkpoint disagrees with deterministic replay');
  return k;
 }
}
