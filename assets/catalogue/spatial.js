(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PolySpatial=factory();})(typeof window==='undefined'?globalThis:window,function(){'use strict';
const names={heart:'Cœur',lungs:'Respiration / thorax',skin:'Peau / capteur',brain:'Cerveau',insula:'Insula',amygdala:'Amygdales',striatum:'Striatum',eye:'Œil',prefrontal:'Cortex préfrontal',nose:'Voies nasales / orales',face:'Visage',gut:'Appareil digestif',muscle:'Muscle',spinal:'Moelle · repère',liver:'Foie',kidney:'Rein'};
const text=n=>[n?.where,n?.title,n?.text].filter(Boolean).join(' ');
const gap=n=>n?.kind==='gap'||/à identifier|à cartographier|non identifi|non mesur|inconn[uue]|pas .*identifi|à préciser.*(?:voie|relais)/i.test([n?.title,n?.text].join(' '));
const analysis=n=>/corrélation|couplage|puissance|alignement|traitement|calcul|modèles|horloges|analyse|comparer|interprétation|synchroni/i.test([n?.title,n?.where].join(' '));
const report=n=>/rapport subjectif|questionnaire|ressenti|rapports après|comportement|décision|jugement|mémoire|réponse de tâche/i.test([n?.title,n?.where].join(' '));
function bindings(g,n){
 if(g.species!=='human'||g.renderPolicy==='DOCUMENTARY_ONLY'||!n)return [];
 if(n.region&&names[n.region])return[{anchor:n.region,reason:'Repère déjà présent dans le catalogue',namedBy:n.region}];
 if(gap(n)||analysis(n)||report(n))return [];
 // The entry source itself leaves canule/belt and nasal/oral conditions distinct.
 if(g.id==='HUMAIN:NEZ-IEEG'&&n.id?.endsWith(':N0'))return[{anchor:'nose',reason:'Contexte nasal/oral du parcours ; placement pédagogique, capteur selon sous-protocole',namedBy:'Respiration nasale ou orale'}];
 const content=text(n);const rules=[['insula',/insula/i],['amygdala',/amygdal/i],['striatum',/striatum|caudé|putamen/i],['prefrontal',/préfrontal/i],['heart',/cœur|cardiaque|ECG/i],['lungs',/respiration|respiratoire|thorax|poumon/i],['skin',/peau|cutané|électroderm|\bEDA\b|\bSCR\b/i],['eye',/\bœil\b|rétin/i],['nose',/nasal|narine|nez|voies aériennes/i],['face',/visage|facial|expression faciale/i],['gut',/intestin|digestif|estomac/i],['liver',/foie|hépat/i],['kidney',/rein|rénal/i],['muscle',/muscle|musculaire/i],['spinal',/moelle épinière/i],['brain',/cerveau|cérébral|intracrân|intracérébr|\biEEG\b|\bsEEG\b|\bIRM|\bASL\b/i]];
 const matches=rules.filter(([key,re])=>re.test(content));
 // Multiple organs named by the same measurement are not arbitrarily collapsed.
 return matches.map(([anchor])=>({anchor,reason:matches.length>1?'Plusieurs lieux nommés : sites séparés, aucun site unique imposé':'Lieu nommé dans le maillon ; repère pédagogique ajouté',namedBy:content}));
}
function site(g,n){const options=bindings(g,n);return options.length===1?options[0]:null;}
function endpoint(g,n,fallback,side){
 const binding=site(g,n);
 if(binding)return{type:'site',anchor:binding.anchor,label:n.title,binding,side};
 const multiple=bindings(g,n);if(multiple.length>1)return{type:'multi',anchors:multiple.map(b=>b.anchor),label:n.title,bindings:multiple,side};
 if(gap(n))return{type:'unknown',label:n?.title||'Raccord non établi',side};
 if(report(n))return{type:'report',label:n.title,side};
 if(analysis(n))return{type:'analysis',label:n.title,side};
 return{type:'local',label:n?.title||fallback||'Étape locale',side};
}
function plan(g,a,selectedEdgeId){
 const fromNode=g.nodes.find(n=>n.id===(a.source_node_id||a.nodeIds[0]));
 const exactEdges=(a.targets||[]).filter(t=>t.startsWith('EDGE:')).map(t=>g.edges.find(e=>e.id===t.slice(5))).filter(e=>e?.fromId===fromNode?.id);
 // Never choose an arbitrary outgoing branch for spatial display.
 const selected=g.edges.find(e=>e.id===selectedEdgeId&&e.fromId===fromNode?.id);
 const edge=selected||(exactEdges.length===1?exactEdges[0]:null);
 const toNode=edge&&g.nodes.find(n=>n.id===edge.toId);
 const human=g.species==='human'&&g.renderPolicy!=='DOCUMENTARY_ONLY';
 let from=human?endpoint(g,fromNode,a.steps?.[0]?.text,0):{type:'local',label:a.steps?.[0]?.text||a.title,side:0};
 let to=toNode&&human?endpoint(g,toNode,a.steps?.at(-1)?.text,1):{...from,label:a.steps?.at(-1)?.text||a.title,side:1};
 const unknown=!!(edge&&(/unknown|gap|hypothesis/i.test(edge.status)||gap(toNode)))||to.type==='unknown';
 if(unknown&&!to.anchor)to={...to,type:to.type==='site'?'site':to.type,label:toNode?.title||'Suite non établie',side:1};
 if(!edge&&human&&!from.anchor&&/à préciser|non renseigné/i.test(to.label))to={type:'unknown',label:to.label,side:1};
 const mode=!human?'LOCAL':unknown?'OPEN':from.anchor||to.anchor?'BODY':from.type==='multi'||to.type==='multi'||from.type==='analysis'||to.type==='analysis'||from.type==='report'||to.type==='report'?'DATA':'LOCAL';
 const boundary=unknown||from.type==='unknown'||to.type==='unknown'||!!(edge&&/comparison|condition|RECONSTRUCT/i.test(edge.status))||['condition','lesion'].includes(fromNode?.kind)||['condition','lesion'].includes(toNode?.kind)||!!(edge&&fromNode?.sourceScope&&toNode?.sourceScope&&fromNode.sourceScope!==toNode.sourceScope);
 const title={BODY:'Repères du corps · liaison schématique',DATA:'Parcours des mesures / analyses',LOCAL:'Zoom local · préparation source',OPEN:'Parcours avec raccord inconnu'}[mode];
 const detail=!human?'Mécanisme de la préparation source, dessiné à côté du corps humain.':boundary?'La trace s’interrompt devant le raccord non établi. Aucune voie nerveuse n’est déduite.':mode==='BODY'?'Les lieux nommés sont placés pour se repérer ; la ligne ne reconstruit pas un nerf.':mode==='DATA'?'Déplacement dans les opérations de mesure et de lecture, sans propagation physiologique revendiquée.':'Schéma local : lieu anatomique ou état de sortie non renseigné.';
 return{group:g.id,interval:a.id,mode,title,detail,from,to,boundary,edgeId:edge?.id||null,edgeStatus:edge?.status||null,sourceNode:fromNode?.id||null,targetNode:toNode?.id||null,phases:a.steps.map(s=>s.label),human,coordinateMeaning:'GRAPHIC_LAYOUT_ONLY',biologicalTimingAdded:false,visible:true};
}
function progress(plan,value){if(!Number.isFinite(value))throw Error('Position non finie');const p=Math.max(0,Math.min(1,value));return plan.boundary?p*.42:p;}
return{plan,site,bindings,progress,names};});
