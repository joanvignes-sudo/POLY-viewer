(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PolyJourney=factory();})(typeof window==='undefined'?globalThis:window,function(){'use strict';
function primary(a){return a.nodeIds?.[0];}
function links(group,action){
 const explicit=action.continuations;
 if(explicit?.length)return explicit.map(c=>{const target=group.intervals.find(a=>a.id===c.to),matches=group.edges.filter(e=>e.fromId===primary(action)&&e.toId===primary(target||{}));return{...c,action:target,edge:matches.length===1?matches[0]:undefined};}).filter(c=>c.action);
 const node=primary(action),i=group.intervals.indexOf(action),next=group.intervals[i+1];
 if(next&&primary(next)===node&&(!action.branch||!next.branch||action.branch===next.branch))return[{to:next.id,kind:'DECOMPOSITION_SAME_NODE',label:'Suite du même maillon',action:next}];
 return group.edges.filter(e=>e.fromId===node).map(e=>({to:group.intervals.find(a=>primary(a)===e.toId)?.id,kind:e.status,label:e.label,detail:e.detail,edge:e,action:group.intervals.find(a=>primary(a)===e.toId)})).filter(c=>c.action&&c.action!==action);
}
function decision(group,action,link){
 const a=group.nodes.find(n=>n.id===primary(action)),b=group.nodes.find(n=>n.id===primary(link.action));
 if(!a||!b)return{auto:false,reason:'Raccord non renseigné'};
 if(['gap','condition','lesion'].includes(a.kind)||['gap','condition','lesion'].includes(b.kind))return{auto:false,reason:'Lacune ou condition : choix explicite'};
 if(a.sourceScope&&b.sourceScope&&a.sourceScope!==b.sourceScope)return{auto:false,reason:'Changement de préparation'};
 if(/RECONSTRUCT|PEDAGOGICAL|hypothesis|gap|comparison|condition|unknown/i.test([link.kind,link.edge?.status].join(' ')))return{auto:false,reason:'Raccord documentaire / reconstruit ou inconnu'};
 if(a.id===b.id)return{auto:true,reason:'Décomposition du même maillon'};
 if(!link.edge)return{auto:false,reason:'Raccord sans relation expérimentale locale'};
 if(group.renderPolicy==='DOCUMENTARY_ONLY')return{auto:false,reason:'Changement de maillon documentaire'};
 return{auto:true,reason:'Relation du registre · rythme visuel'};
}
function createClock(seconds=24){let progress=0,playing=false,duration=seconds;return{
 tick(dt){if(!Number.isFinite(dt)||dt<0)throw Error('Temps invalide');if(playing)progress=Math.min(1,progress+dt/duration);return progress;},
 seek(value){if(!Number.isFinite(value))throw Error('Position invalide');progress=Math.max(0,Math.min(1,value));},
 duration(value){if(!Number.isFinite(value)||value<6||value>120)throw Error('Durée visuelle invalide');duration=value;},
 play(){if(progress===1)progress=0;playing=true;},pause(){playing=false;},get progress(){return progress;},get playing(){return playing;},get seconds(){return duration;}
};}
return{links,decision,createClock,primary};});
