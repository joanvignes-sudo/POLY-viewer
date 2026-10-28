import {validateLiTable,arithmeticAudit,selectRates,sampleStats,conditionalLactateScenario,TISSUES,VARIABLES} from './li-metabolism-core.mjs';
const $=id=>document.getElementById(id),format=(x,n=3)=>Number(x).toFixed(n).replace('.',',');
let data=null,audit=null,current=null;
const tissue=$('tissue'),subject=$('subject'),alpha=$('alpha'),beta=$('beta');
function metricCard(v,rates){
 const card=document.createElement('article');card.className='metric';
 const label=document.createElement('p');label.className='label';label.textContent=data.variables[v].label;
 const value=document.createElement('strong');value.textContent=format(rates[v]);
 const help=document.createElement('small');
 if(subject.value==='mean'){
  const sd=sampleStats(data.subjects.map(s=>s[tissue.value][v])).sd;
  help.textContent='Moyenne non arrondie · écart-type '+format(sd,3);
 }else help.textContent='Participant '+Number(subject.value)+' · valeur publiée arrondie';
 const strip=document.createElement('div');strip.className='strip';strip.setAttribute('aria-hidden','true');
 const fill=document.createElement('span');fill.style.width=(100*rates[v]/Math.max(...data.subjects.map(s=>s[tissue.value][v]))).toFixed(1)+'%';strip.append(fill);
 card.append(label,value,help,strip);return card;
}
function render(){
 const t=tissue.value,s=subject.value;
 const rates=selectRates(data,t,s);
 $('metrics').replaceChildren(...VARIABLES.map(v=>metricCard(v,rates)));
 $('alpha-value').textContent=alpha.value+' %';
 $('beta-value').textContent=beta.value+' %';
 current=conditionalLactateScenario(data,{tissue:t,subject:s,alpha:Number(alpha.value)/100,beta:Number(beta.value)/100});
 const o=current.model_only;
 $('a-produced').textContent=format(o.astrocyte_production,4);
 $('n-produced').textContent=format(o.neuronal_production,4);
 $('j-transfer').textContent=format(o.assumed_internal_transfer,4);
 $('a-remain').textContent=format(o.astrocyte_remaining,4);
 $('n-total').textContent=format(o.neuronal_pool_contribution,4);
 $('p-total').textContent=format(rates.CMRLac,4);
 $('balance').textContent=format(o.balance_residual,8);
 $('comparison').textContent='';
}
function compare(){
 const input={tissue:tissue.value,subject:subject.value,alpha:Number(alpha.value)/100};
 const none=conditionalLactateScenario(data,{...input,beta:0});
 const full=conditionalLactateScenario(data,{...input,beta:1});
 const p=none.observables.CMRLac;
 $('comparison').textContent='Même production tissulaire estimée ('+format(p,4)+' µmol/g/min), alors que le transfert hypothétique passe de '+format(none.model_only.assumed_internal_transfer,4)+' à '+format(full.model_only.assumed_internal_transfer,4)+' µmol/g/min. Cette différence n’est pas identifiable par le total tissulaire seul.';
}
function exportReceipt(){
 if(!data||!current||!audit?.all_pass)return;
 const receipt={schema:'poly.li2025.demonstration-receipt.v1',created_utc:new Date().toISOString(),source:{...data.source},arithmetic_audit:{n_subjects:audit.n_subjects,rows_checked:audit.rows.length,all_pass:audit.all_pass},selected:current,limitations:[...data.boundaries,'No inference of cellular fluxes, biological necessity or clinical effects.','The export is an illustrative computational receipt, not experimental replication.']};
 const blob=new Blob([JSON.stringify(receipt,null,2)+'\n'],{type:'application/json'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='POLY_Li2025_'+tissue.value+'_'+subject.value+'_scenario.json';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),3000);
}
async function start(){
 try{
  const res=await fetch(new URL('../data/li-2025-table1.json',import.meta.url),{cache:'no-store'});
  if(!res.ok)throw new Error('Tableau non disponible (HTTP '+res.status+')');
  data=validateLiTable(await res.json());audit=arithmeticAudit(data);
  if(!audit.all_pass)throw new Error('Contrôle des statistiques publié/recalculé échoué : affichage refusé');
  $('audit-status').textContent='12 / 12 contrôles arithmétiques réussis';
  $('loading').hidden=true;$('app').hidden=false;
  for(const item of [tissue,subject,alpha,beta])item.addEventListener(item.tagName==='INPUT'?'input':'change',render);
  $('compare').onclick=compare;
  $('reset').onclick=()=>{tissue.value='GM';subject.value='mean';alpha.value='50';beta.value='50';render();};
  $('export').onclick=exportReceipt;
  render();
 }catch(error){
  $('loading').textContent='Démonstration suspendue : '+error.message+'. Aucune valeur scientifique affichée sans vérification.';
  $('loading').setAttribute('role','alert');
 }
}
start();
