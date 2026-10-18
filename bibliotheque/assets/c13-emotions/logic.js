(function(root){'use strict';
const statusNames={intervention:'Intervention',association:'Association observée',gap:'Raccord non établi',hypothesis:'Hypothèse'};
const cues={'P01-LIGHT':'thorax','P01-OPSIN':'heart','P01-HEART':'heart','P01-NODOSE':null,'P01-NTS':'stem','P01-LC':'stem','P01-GAP':null,'P01-PIC':'brain','P01-CONTEXT':null,'P01-ICPP':'brain','P01-BEHAV':null};
function check(d){if(!d||!Array.isArray(d.nodes)||!Array.isArray(d.edges)||!Array.isArray(d.annotations))throw Error('Dossier incomplet');if(d.nodes.length!==11||d.edges.length!==15)throw Error('Couverture P01 incorrecte');const ids=new Set(d.nodes.map(n=>n.id));if(ids.size!==11||d.annotations.length!==11||new Set(d.annotations.map(n=>n.id)).size!==11)throw Error('Identifiants dupliqués');if(new Set(d.edges.map(e=>e.id)).size!==15)throw Error('Relations dupliquées');for(const n of d.nodes)if(n.reference_card!=='P01'||!n.scope.startsWith('Souris')||!(n.id in cues)||!d.annotations.some(a=>a.id===n.id))throw Error('Contexte ou annotation incompatible');for(const e of d.edges)if(!ids.has(e.from)||!ids.has(e.to)||e.mechanism.from!==e.from||e.mechanism.to!==e.to||!statusNames[e.mechanism.status])throw Error('Relation incompatible');return d;}
function selected(d,id){return d.nodes.find(n=>n.id===id)||null;}
function outgoing(d,id){return d.edges.filter(e=>e.from===id);}
function needsReading(e){return ['gap','hypothesis'].includes(e.mechanism.status);}
function cue(id){return cues[id]??null;}
function hash(id){return '#node='+encodeURIComponent(id);}
const api={check,selected,outgoing,needsReading,cue,hash,statusNames};root.C13Logic=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
