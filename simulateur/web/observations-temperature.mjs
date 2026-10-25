export function thermalRows(d,kind,gender,condition){
 if(d?.schema!=='poly.human-thermal-observations.v1'||d.clock!==null||d.n_people!==null||d.model_comparison_received!==false||d.avatar_coupled!==false)throw Error('Portée des observations incompatible');
 const dataset=d.datasets?.[kind];if(!dataset||dataset.unit!=='degC')throw Error('Observable inconnue');
 return dataset.rows.filter(r=>r.gender===gender&&r.condition===condition);
}
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);try{
  const response=await fetch('observations-temperature.json');if(!response.ok)throw Error('Données absentes');const d=await response.json();let page=0;
  function draw(){const rows=thermalRows(d,$('thermal-observable').value,$('thermal-group').value,$('thermal-condition').value),start=page*25;const body=$('thermal-table');body.replaceChildren();
   for(const r of rows.slice(start,start+25)){if(!Number.isInteger(r.source_row)||r.source_row<2||r.value_C!==null&&!Number.isFinite(r.value_C))throw Error('Ligne invalide');const tr=body.insertRow();tr.insertCell().textContent=r.source_row;tr.insertCell().textContent=r.value_C===null?'Manquant':r.value_C.toFixed(4);}
   $('thermal-observed-status').textContent=`${rows.length} lignes agrégées dans cette sélection ; lignes ${rows.length?start+1:0} à ${Math.min(start+25,rows.length)} affichées. Nombre de participants et temps inconnus.`;
   $('thermal-prev').disabled=page===0;$('thermal-next').disabled=start+25>=rows.length;
  }
  for(const id of ['thermal-observable','thermal-group','thermal-condition'])$(id).onchange=()=>{page=0;draw();};$('thermal-prev').onclick=()=>{page--;draw();};$('thermal-next').onclick=()=>{page++;draw();};draw();
 }catch(e){$('thermal-observed-status').textContent='Lecture refusée : '+e.message;}
}
