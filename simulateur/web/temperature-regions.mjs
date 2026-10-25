export function validateRegions(d){
 if(d?.schema!=='poly.thermal-rest-regions.v1'||d.avatar_coupled!==false||d.experimental_validation!==false||d.coordinate_mapping!==null||d.time?.world_time_s!==null||d.time?.elapsed_s!==0||d.temperature_unit!=='degC'||!Array.isArray(d.compartments)||d.compartments.length!==85)throw Error('Contrat régional incompatible');
 const ids=new Set(),indices=new Set();let weight=0,mean=0,skin=0;
 for(const r of d.compartments){
  if(typeof r.id!=='string'||ids.has(r.id)||!Number.isInteger(r.index)||r.index<0||r.index>=85||indices.has(r.index)||!Number.isFinite(r.temperature_C)||!Number.isFinite(r.skin_mean_weight)||r.skin_mean_weight<0||r.geometry_registration!==null)throw Error('Compartiment incohérent');
  const expected=r.index===0?'JOS3:CB':`JOS3:${r.region}:${r.layer}`;if(r.id!==expected)throw Error('Identité incohérente');
  if(r.layer==='skin'){skin++;weight+=r.skin_mean_weight;mean+=r.temperature_C*r.skin_mean_weight;}else if(r.skin_mean_weight!==0)throw Error('Poids cutané appliqué à une autre couche');
  ids.add(r.id);indices.add(r.index);
 }
 if(skin!==17||Math.abs(weight-1)>1e-12||!Number.isFinite(d.skin_mean_C)||Math.abs(mean-d.skin_mean_C)>1e-10||d.compartments.find(r=>r.index===0)?.temperature_C!==d.central_blood_C)throw Error('Agrégation thermique incohérente');return d;
}
if(typeof document!=='undefined'){
 const host=document.querySelector('#thermal-regions');
 if(host)try{
  const response=await fetch('temperature-regions.json');if(!response.ok)throw Error('Données indisponibles');const d=validateRegions(await response.json());
  const intro=document.createElement('p');intro.textContent='État initial T4 : 85 compartiments de modèle, temps global inconnu. Aucune coordonnée HRA attribuée. Les poids cutanés sont ceux du code, pas des surfaces mesurées sur cet avatar.';host.append(intro);
  const label=document.createElement('label');label.textContent='Couche du modèle ';const select=document.createElement('select');select.id='thermal-region-layer';for(const layer of ['skin','central_blood','core','artery','vein','sfvein','muscle','fat','all']){const o=document.createElement('option');o.value=layer;o.textContent=layer==='all'?'Toutes les couches':layer;select.append(o);}label.append(select);host.append(label);
  const count=document.createElement('p');count.id='thermal-region-count';count.setAttribute('role','status');host.append(count);
  const scroll=document.createElement('div');scroll.className='scroll';const table=document.createElement('table');table.innerHTML='<thead><tr><th>Identité de source</th><th>Index</th><th>Température du modèle</th><th>Poids dans la moyenne cutanée</th></tr></thead>';const body=document.createElement('tbody');table.append(body);scroll.append(table);host.append(scroll);
  function draw(){body.replaceChildren();const rows=d.compartments.filter(r=>select.value==='all'||r.layer===select.value);for(const r of rows){const tr=body.insertRow();for(const value of [r.id,r.index,r.temperature_C.toFixed(4)+' °C',r.layer==='skin'?(100*r.skin_mean_weight).toFixed(3)+' %':'—'])tr.insertCell().textContent=value;}count.textContent=`${rows.length} ${rows.length===1?'compartiment affiché':'compartiments affichés'} · moyenne cutanée reconstruite : ${d.skin_mean_C.toFixed(6)} °C`;}
  select.onchange=draw;draw();const p=document.createElement('p');p.style.overflowWrap='anywhere';p.textContent='Empreinte de l’état initial : '+d.initial_state_sha256;host.append(p);
 }catch(e){host.textContent='Lecture régionale indisponible : '+e.message;}
}
