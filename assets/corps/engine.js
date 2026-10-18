(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PolyMotion=factory();})(typeof window==='undefined'?globalThis:window,function(){'use strict';
const regions=new Set(['heart','lungs','skin','amygdala','insula','striatum','eye','prefrontal','brain']);
function create(group){if(group.species!=='human'&&group.renderPolicy!=='DOCUMENTARY_ONLY')throw Error('Corps humain : espèce incompatible');const nodes=new Map(group.nodes.map(n=>[n.id,n]));if(nodes.size!==group.nodes.length||!nodes.size)throw Error('Nœuds invalides');for(const e of group.edges)if(!nodes.has(e.fromId)||!nodes.has(e.toId))throw Error('Relation hors dossier');
const state={node:group.nodes[0].id,edge:null,status:'READY',progress:0,speed:1,history:[]};
const outgoing=()=>group.edges.filter(e=>e.fromId===state.node),edge=()=>group.edges.find(e=>e.id===state.edge),node=()=>nodes.get(state.node);
function assess(e){if(!e||e.fromId!==state.node)return 'INVALID';const a=nodes.get(e.fromId),b=nodes.get(e.toId);if(group.renderPolicy==='DOCUMENTARY_ONLY')return 'UNPLACED';if(a.sourceScope&&b.sourceScope&&a.sourceScope!==b.sourceScope)return 'BOUNDARY';if(['gap','hypothesis','comparison','condition'].includes(e.status)||b.kind==='gap'||['condition','lesion'].includes(a.kind)||['condition','lesion'].includes(b.kind))return 'BOUNDARY';if(!regions.has(a.region)||!regions.has(b.region))return 'UNPLACED';return 'VISIBLE';}
function choose(id){const e=group.edges.find(e=>e.id===id);if(!e||e.fromId!==state.node)throw Error('Relation non disponible');state.edge=id;state.progress=0;state.status=assess(e)==='VISIBLE'?'PLAYING':'BLOCKED';return state;}
function play(){if(state.status==='PLAYING')return;if(state.edge&&assess(edge())==='VISIBLE'){state.status='PLAYING';return;}const choices=outgoing();if(choices.length===1)choose(choices[0].id);else state.status=choices.length?'CHOICE':'END';}
function tick(dt){if(!Number.isFinite(dt)||dt<0)throw Error('Temps invalide');if(state.status!=='PLAYING')return;state.progress=Math.min(1,state.progress+dt*state.speed/3);if(state.progress===1){const e=edge();state.history.push(state.node);state.node=e.toId;state.edge=null;state.progress=0;const choices=outgoing();state.status=choices.length>1?'CHOICE':choices.length?'READY':'END';if(choices.length===1)choose(choices[0].id);}}
function pause(){if(state.status==='PLAYING')state.status='PAUSED';}
function select(id){if(!nodes.has(id))throw Error('Nœud hors dossier');state.node=id;state.edge=null;state.progress=0;state.status='READY';state.history=[];}
function consult(){const e=edge();if(!e||state.status!=='BLOCKED')return;state.history.push(state.node);state.node=e.toId;state.edge=null;state.progress=0;state.status='PAUSED';}
function back(){if(!state.history.length)return;state.node=state.history.pop();state.edge=null;state.progress=0;state.status='PAUSED';}
function speed(value){if(![.5,1,2].includes(value))throw Error('Rythme invalide');state.speed=value;}
return{state,node,edge,outgoing,assess,choose,play,pause,tick,select,consult,back,speed,group};}
return{create,regions:[...regions]};});
