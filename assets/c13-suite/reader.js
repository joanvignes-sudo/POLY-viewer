(function(root){'use strict';
// Presentation-only adapter. Never writes to the scientific graph.
const reasons={MULTIPLE_BRANCHES:'Plusieurs suites documentaires : choisissez une branche.',GAP:'La chaîne documentée s’arrête ici : raccord non établi.',HYPOTHESIS:'Hypothèse : exploration explicite nécessaire.',COMPARISON:'Comparaison documentaire : aucune chaîne expérimentale unique.',SPECIES_CHANGE:'Changement d’espèce.',STUDY_CHANGE:'Changement d’étude.',DOCUMENTARY_SET_CHANGE:'Changement d’ensemble documentaire.',INSUFFICIENT_INFORMATION:'Informations insuffisantes pour autoriser la lecture.',CONDITION:'Condition clinique — pas un signal propagé.',LESION:'Lésion — consultation sans activation.',MEASUREMENT:'Mesure / analyse : consultation explicite, pas propagation.',CYCLE:'Retour vers un élément déjà consulté : choisissez explicitement.',UNKNOWN:'Identifiant inconnu.'};
const modes={'documented-path':'Parcours documentaire — aucune propagation simulée.','hypothesis-exploration':'Exploration d’une hypothèse','after-gap':'Après une rupture documentaire — continuité non démontrée.','comparison':'Comparaison documentaire — ce raccord n’appartient pas à une chaîne expérimentale unique.','measurement-review':'Consultation de mesures / analyses — pas une chaîne causale.','context-review':'Condition clinique — consultation sans propagation.'};
reasons.CLOCK_CHANGE='Changement d’horloge expérimentale.';reasons.EXPERIMENT_CHANGE='Changement d’expérience.';
reasons.ANATOMY='Lien anatomique — pas une propagation calculée.';reasons.PHARMACOLOGY='Relation pharmacologique documentée — aucun effet calculé.';reasons.COMPOSITE_CONTEXT='Référence composite : attribution à l’expérience insuffisamment qualifiée.';modes['document-review']='Consultation documentaire — aucune continuité expérimentale ou simulation ajoutée.';
function adapt(d){
 const nodes=d.nodes.map(n=>{
  const qualification=d.readerQualifications?.[n.id]||{};
  const refs=(n.sources||[]).map(id=>(d.evidence||[]).find(e=>e.evidence_id===id||e.source_id===id));
  const resolved=refs.length>0&&refs.every(e=>e&&e.url);
  // A bibliographic identity is not an experiment or a dataset identity.
  const studyId=resolved?[...new Set(refs.map(e=>e.url))].sort().join('|'):undefined;
  return {...n,...qualification,species:qualification.species||n.species||d.species,studyId:qualification.studyId||n.studyId||studyId,documentarySetId:n.documentarySetId||n.reference_card,kind:n.kind||n.mechanism?.kind,sourceResolved:resolved,provenance:n.provenance||refs.filter(Boolean).map(e=>({sourceId:e.source_id||e.evidence_id,datasetId:e.datasetId,participantSetId:e.participantSetId,experimentId:e.experimentId}))};
 });
 return {nodes,edges:d.edges.map(e=>({...e,status:e.mechanism?.status,sourceRef:e.mechanism?.source})),sceneId:d.id};
}
function block(reason){return {allowed:false,reason};}
function canAutoTraverse({current,relation,destination,outgoingCount}){
 if(outgoingCount!==1)return block('MULTIPLE_BRANCHES');
 if(!current||!destination||!relation)return block('INSUFFICIENT_INFORMATION');
 if(relation.from!==current.id||relation.to!==destination.id)return block('INSUFFICIENT_INFORMATION');
 if(relation.status==='gap'||destination.kind==='gap')return block('GAP');
 if(relation.status==='hypothesis'||destination.evidenceStatus==='hypothesis')return block('HYPOTHESIS');
 if(relation.status==='comparison')return block('COMPARISON');
 for(const [key,reason] of [['species','SPECIES_CHANGE'],['studyId','STUDY_CHANGE'],['documentarySetId','DOCUMENTARY_SET_CHANGE']]){
  if(!current[key]||!destination[key])return block('INSUFFICIENT_INFORMATION');
  if(current[key]!==destination[key])return block(reason);
 }
 if(current.clockScope&&destination.clockScope&&current.clockScope!==destination.clockScope)return block('CLOCK_CHANGE');
 if(current.experimentId&&destination.experimentId&&current.experimentId!==destination.experimentId)return block('EXPERIMENT_CHANGE');
 if(current.kind==='lesion'||destination.kind==='lesion')return block('LESION');
 if(current.kind==='condition'||destination.kind==='condition'||relation.status==='condition')return block('CONDITION');
 if(relation.status==='measurement')return block('MEASUREMENT');
 if(relation.status==='pharmacology')return block('PHARMACOLOGY');
 if(relation.status==='anatomy')return block('ANATOMY');
 if(current.autoQualified===false||destination.autoQualified===false)return block('COMPOSITE_CONTEXT');
 if(!['intervention','association','data','reconstruction'].includes(relation.status)||!current.sourceResolved||!destination.sourceResolved||!relation.sourceRef||!current.kind||!destination.kind)return block('INSUFFICIENT_INFORMATION');
 if(relation.reference_card!==current.documentarySetId)return block('DOCUMENTARY_SET_CHANGE');
 return {allowed:true};
}
function create(d,start){
 const graph=adapt(d),nodes=new Map(graph.nodes.map(n=>[n.id,n]));
 if(!nodes.has(start))throw Error('Point de départ inconnu');
 const r={state:'READY',currentNodeId:start,history:[],availableBranches:[],selectedBranchId:undefined,blockReason:undefined,displaySpeed:1,sceneId:d.id,consultationMode:'documented-path',sourcesOpen:false,trail:[{nodeId:start,kind:'start'}]};
 const outgoing=()=>graph.edges.filter(e=>e.from===r.currentNodeId);
 function sync(){r.availableBranches=outgoing().map(e=>e.id);}
 function snapshot(){return {currentNodeId:r.currentNodeId,consultationMode:r.consultationMode,selectedBranchId:r.selectedBranchId,sourcesOpen:r.sourcesOpen,trail:r.trail.map(x=>({...x})),availableBranches:[...r.availableBranches]};}
 function restore(s){Object.assign(r,s);r.state='PAUSED';r.blockReason=undefined;sync();}
 function assess(e,count=1){return canAutoTraverse({current:nodes.get(r.currentNodeId),destination:nodes.get(e?.to),relation:e,outgoingCount:count});}
 function inspect(){
  sync();const n=nodes.get(r.currentNodeId),edges=outgoing();
  if(['lesion','condition','gap'].includes(n.kind)){r.state='BLOCKED';r.blockReason=n.kind==='lesion'?'LESION':n.kind==='gap'?'GAP':'CONDITION';return false;}
  if(!edges.length){r.state='END';r.blockReason=undefined;return false;}
  if(edges.length>1){r.state='CHOICE';r.blockReason='MULTIPLE_BRANCHES';return false;}
  const a=assess(edges[0]);if(!a.allowed){r.state='BLOCKED';r.blockReason=a.reason;return false;}
  if(r.trail.some(t=>t.nodeId===edges[0].to)){r.state='BLOCKED';r.blockReason='CYCLE';return false;}
  r.blockReason=undefined;return true;
 }
 function move(e,mode,kind,relationId){
  r.selectedBranchId=e.id;r.history.push(snapshot());r.currentNodeId=e.to;r.selectedBranchId=undefined;r.consultationMode=mode;
  r.trail.push({nodeId:e.to,kind,...(relationId?{relationId}:{consultedRelationId:e.id})});r.state='PAUSED';r.blockReason=undefined;sync();
 }
 function dispatch(a){
  if(a.type==='SET_DISPLAY_SPEED'){if([.5,1,2].includes(a.speed))r.displaySpeed=a.speed;return r;}
  if(a.type==='PAUSE'){if(r.state==='PLAYING')r.state='PAUSED';return r;}
  if(a.type==='BACK'){const s=r.history.pop();if(s)restore(s);return r;}
  if(a.type==='RETURN_TO_BRANCH'){for(let i=r.history.length-1;i>=0;i--)if(r.history[i].availableBranches.length>1){const s=r.history[i];r.history.splice(i);restore(s);r.state='CHOICE';return r;}return r;}
  if(a.type==='JUMP'){if(!nodes.has(a.nodeId)){r.state='BLOCKED';r.blockReason='UNKNOWN';return r;}r.history.push(snapshot());r.currentNodeId=a.nodeId;r.consultationMode=nodes.get(a.nodeId).kind==='lesion'?'context-review':'documented-path';r.selectedBranchId=undefined;r.trail=[{nodeId:a.nodeId,kind:'direct-consultation'}];r.state='READY';r.blockReason=undefined;sync();return r;}
  if(a.type==='PLAY'){if(inspect())r.state='PLAYING';return r;}
  if(a.type==='NEXT'||a.type==='TICK'){
   if(a.type==='TICK'&&r.state!=='PLAYING')return r;
   const playing=r.state==='PLAYING';if(inspect()){move(outgoing()[0],r.consultationMode,'documentary-relation',outgoing()[0].id);if(inspect())r.state=playing?'PLAYING':'PAUSED';}return r;
  }
  const e=outgoing().find(e=>e.id===a.relationId);if(!e){r.state='BLOCKED';r.blockReason='UNKNOWN';return r;}
  const check=assess(e);r.selectedBranchId=e.id;
  if(a.type==='SELECT_BRANCH'){if(check.allowed){move(e,r.consultationMode,'documentary-relation',e.id);}else{r.state='BLOCKED';r.blockReason=check.reason;}return r;}
  const expected={GAP:'VIEW_AFTER_GAP',HYPOTHESIS:'EXPLORE_HYPOTHESIS',COMPARISON:'COMPARE',SPECIES_CHANGE:'COMPARE',STUDY_CHANGE:'COMPARE',CLOCK_CHANGE:'COMPARE',EXPERIMENT_CHANGE:'COMPARE',DOCUMENTARY_SET_CHANGE:'COMPARE',MEASUREMENT:'VIEW_MEASUREMENT',CONDITION:'VIEW_CONTEXT',LESION:'VIEW_CONTEXT',PHARMACOLOGY:'VIEW_DOCUMENT',ANATOMY:'VIEW_DOCUMENT',COMPOSITE_CONTEXT:'VIEW_DOCUMENT',INSUFFICIENT_INFORMATION:'VIEW_DOCUMENT'}[check.reason];
  if(expected&&a.type===expected){const mode=a.type==='VIEW_AFTER_GAP'?'after-gap':a.type==='EXPLORE_HYPOTHESIS'?'hypothesis-exploration':a.type==='COMPARE'?'comparison':a.type==='VIEW_MEASUREMENT'?'measurement-review':a.type==='VIEW_CONTEXT'?'context-review':'document-review';move(e,mode,a.type.toLowerCase());}
  return r;
 }
 sync();return {state:r,dispatch,assess,graph,snapshot};
}
const api={create,adapt,canAutoTraverse,reasons,modes};root.PolyReader=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
