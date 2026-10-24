export const STATE_STYLES=Object.freeze({
 unknown:{label:'Non renseigné',symbol:'?',color:'#8997a8'},
 reference:{label:'Référence saisie',symbol:'=',color:'#58b5e4'},
 increased:{label:'Hausse saisie',symbol:'↑',color:'#ffbf69'},
 decreased:{label:'Baisse saisie',symbol:'↓',color:'#bfa1ff'},
 mixed:{label:'États distincts',symbol:'≋',color:'#9ddbcf'}
});
const STATE_IDS=['unknown','reference','increased','decreased'];
const keys=['schema','catalog_id','source_doi','selected_chain','selected_step','contrast','states','notes','state_origin','physiological_clock_s','quantitative_results','automatic_propagation'];
const clone=x=>JSON.parse(JSON.stringify(x));
export function activeCaseWorksite(registry){
 if(registry?.schema!=='poly.worksites.v1'||!Array.isArray(registry.items)||new Set(registry.items.map(x=>x.id)).size!==registry.items.length)throw Error('Registre des chantiers incompatible');
 const active=registry.items.find(x=>x.id===registry.active);
 if(!active||active.status!=='active'||active.panel!=='chains'||typeof active.catalog!=='string'||!/^[a-zA-Z0-9-]+\.json$/.test(active.catalog))throw Error('Dossier actif non défini');
 return {...active};
}
export function validateCatalog(c){
 if(c?.schema!=='poly.case-catalog.v1'||!Array.isArray(c.nodes)||!Array.isArray(c.chains)||!Array.isArray(c.zones))throw Error('Catalogue de chantier incompatible');
 const ids=c.nodes.map(n=>n.id),zones=c.zones.map(z=>z.id);
 if(new Set(ids).size!==ids.length||new Set(zones).size!==zones.length||new Set(c.chains.map(x=>x.id)).size!==c.chains.length)throw Error('Identités répétées');
 for(const n of c.nodes)if(!zones.includes(n.zone)||n.kinetic_model!==null||n.human_parameters!==null)throw Error('Contrat de mécanisme inattendu');
 for(const chain of c.chains)if(!chain.nodes.length||chain.nodes.some(id=>!ids.includes(id)))throw Error('Chaîne incomplète');
 return c;
}
export function createCaseSession(c){validateCatalog(c);return {schema:'poly.case-workspace.v1',catalog_id:c.id,source_doi:c.source.doi,selected_chain:c.chains[0].id,selected_step:0,contrast:0.8,states:Object.fromEntries(c.nodes.map(n=>[n.id,'unknown'])),notes:'',state_origin:'manual',physiological_clock_s:null,quantitative_results:false,automatic_propagation:false};}
export function validateCaseSession(value,c){
 validateCatalog(c);const p=value;
 if(!p||typeof p!=='object'||Array.isArray(p)||Object.keys(p).length!==keys.length||keys.some(k=>!Object.hasOwn(p,k)))throw Error('Format de chantier refusé');
 if(p.schema!=='poly.case-workspace.v1'||p.catalog_id!==c.id||p.source_doi!==c.source.doi)throw Error('Dossier ou source différents');
 if(p.state_origin!=='manual'||p.physiological_clock_s!==null||p.quantitative_results!==false||p.automatic_propagation!==false)throw Error('Portée des états incompatible');
 const chain=c.chains.find(x=>x.id===p.selected_chain);
 if(!chain||!Number.isInteger(p.selected_step)||p.selected_step<0||p.selected_step>=chain.nodes.length)throw Error('Étape absente de la chaîne');
 if(typeof p.contrast!=='number'||!Number.isFinite(p.contrast)||p.contrast<0.35||p.contrast>1)throw Error('Contraste hors limites');
 if(typeof p.notes!=='string'||p.notes.length>5000)throw Error('Notes trop longues');
 if(!p.states||typeof p.states!=='object'||Array.isArray(p.states)||Object.keys(p.states).length!==c.nodes.length||c.nodes.some(n=>!Object.hasOwn(p.states,n.id)||!STATE_IDS.includes(p.states[n.id])))throw Error('États de mécanismes incompatibles');
 return clone(p);
}
export function selectCaseChain(p,id,c){const q=validateCaseSession(p,c);if(!c.chains.some(x=>x.id===id))throw Error('Chaîne inconnue');q.selected_chain=id;q.selected_step=0;return q;}
export function updateCaseState(p,id,state,c){const q=validateCaseSession(p,c);if(!Object.hasOwn(q.states,id)||!STATE_IDS.includes(state))throw Error('État ou mécanisme inconnu');q.states[id]=state;return q;}
export function summarizeZone(p,zone,c){const nodes=c.nodes.filter(n=>n.zone===zone),values=nodes.map(n=>p.states[n.id]),unique=new Set(values);return {state:unique.size===1?values[0]:'mixed',documented:values.filter(v=>v!=='unknown').length,total:values.length};}
export function zoneColor(state,contrast){const hex=STATE_STYLES[state]?.color;if(!hex)throw Error('Couleur inconnue');const rgb=[1,3,5].map((n,i)=>Math.round(24+(parseInt(hex.slice(n,n+2),16)-24)*contrast));return '#'+rgb.map(n=>n.toString(16).padStart(2,'0')).join('');}
