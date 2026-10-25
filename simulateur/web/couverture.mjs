export function validateFirstDelivery(recipe,items){
 const expected=['standing-rest','chain-context','human-experiment','interval','two-scales','protocols','statistics','reproduction'];
 if(!recipe||recipe.schema!=='poly.first-delivery-recipe.v1'||recipe.complete!==false||!Array.isArray(recipe.criteria)||recipe.criteria.length!==8||typeof recipe.basis!=='string'||!recipe.basis.length||!/^\d{4}-\d{2}-\d{2}$/.test(recipe.reviewed))throw Error('Recette de première livraison invalide');
 const ids=new Set(),known=new Set(items.map(i=>i.id));
 for(const c of recipe.criteria){
  if(!expected.includes(c.id)||ids.has(c.id)||!['à recevoir','partiel','documentaire reçu'].includes(c.status)||!['title','evidence','remaining'].every(k=>typeof c[k]==='string'&&c[k].length)||!Array.isArray(c.items)||!c.items.length||c.items.some(id=>!known.has(id))||!Array.isArray(c.links)||!c.links.length||c.links.some(l=>!l||typeof l.label!=='string'||!l.label.length||typeof l.href!=='string'||!/^[-a-z0-9]+\.html(?:#[-a-z0-9]+)?$/.test(l.href)))throw Error('Critère de livraison incohérent');
  if(c.status==='documentaire reçu'&&c.id!=='protocols')throw Error('Réception documentaire hors périmètre');
  ids.add(c.id);
 }
 if(!recipe.next_connection||!['title','reason','gate','success'].every(k=>typeof recipe.next_connection[k]==='string'&&recipe.next_connection[k].length))throw Error('Prochain raccord non défini');
 return recipe;
}
export function validateCoverage(d){
 if(!d||d.schema!=='poly.coverage.v1'||d.complete!==false||!Array.isArray(d.items)||!d.items.length||!Array.isArray(d.markers))throw Error('État de couverture invalide');
 const ids=new Set();for(const m of d.markers){if(!m||!/^U-[A-Z]+$/.test(m.id)||ids.has(m.id)||m.status!=='open'||!['question','impact','resolution','branch'].every(k=>typeof m[k]==='string'&&m[k].length))throw Error('Repère invalide');ids.add(m.id);}
 const items=new Set();for(const i of d.items){if(!i||!/^[-a-z]+$/.test(i.id)||items.has(i.id)||!['partiel','à poursuivre','documentaire'].includes(i.status)||!['title','evidence','next'].every(k=>typeof i[k]==='string'&&i[k].length)||!Array.isArray(i.uncertainties)||!i.uncertainties.length||i.uncertainties.some(x=>!ids.has(x)))throw Error('Exigence incohérente');items.add(i.id);}
 for(const m of d.markers)if(!items.has(m.branch)||!d.items.some(i=>i.uncertainties.includes(m.id)))throw Error('Repère orphelin');
 if(d.first_delivery)validateFirstDelivery(d.first_delivery,d.items);
 const e=d.emdr;if(!e||e.model_effects!==false||e.raw_data_imported!==false||e.source!=='https://pmc.ncbi.nlm.nih.gov/articles/PMC3458957/'||!Array.isArray(e.stages)||e.stages.length!==5||!['title','participants','comparison','observations','limits','license'].every(k=>typeof e[k]==='string'&&e[k].length)||!e.stages.every(x=>typeof x==='string'&&x.length))throw Error('Dossier documentaire invalide');return d;
}
export function selectItems(d,status='all'){return d.items.filter(x=>status==='all'||x.status===status);}
if(typeof document!=='undefined'){
 const status=document.querySelector('#status');const node=(tag,text,parent)=>{const e=document.createElement(tag);if(text)e.textContent=text;parent?.append(e);return e;};
 try{
 const r=await fetch('couverture.json');if(!r.ok)throw Error('État indisponible');const d=validateCoverage(await r.json()),list=document.querySelector('#items'),filter=document.querySelector('#filter');
 if(d.first_delivery){
  const recipe=d.first_delivery,host=document.querySelector('#delivery-criteria');
  document.querySelector('#delivery-status').textContent=`Revue du ${recipe.reviewed} · première livraison non reçue · réception documentaire limitée aux dossiers émotions/EMDR.`;
  for(const c of recipe.criteria){const a=node('article',null,host);a.id='recipe-'+c.id;node('h3',c.title,a);node('p',c.status,a).className='tag';node('p',c.evidence,a);node('p','Reste à recevoir : '+c.remaining,a);const links=node('p',null,a);for(const link of c.links){const el=node('a',link.label,links);el.href=link.href;node('span',' · ',links);}}
  const next=document.querySelector('#delivery-next'),n=recipe.next_connection;node('h3','Prochain raccord : '+n.title,next);for(const k of ['reason','gate','success'])node('p',n[k],next);
 }
 function draw(){list.replaceChildren();const visible=selectItems(d,filter.value);for(const i of visible){const a=node('article',null,list);node('h2',i.title,a);node('p',i.status,a).className='tag';node('p',i.evidence,a);node('p','Prochaine étape : '+i.next,a);for(const id of i.uncertainties){const link=node('a',id+' ',a);link.href='#'+id;}}status.textContent=`${visible.length} exigence${visible.length>1?'s':''} affichée${visible.length>1?'s':''} · ${d.markers.length} repères ouverts · première livraison non achevée`;}
 filter.addEventListener('change',draw);draw();
 for(const m of d.markers){const a=node('article',null,document.querySelector('#markers'));a.id=m.id;node('h2',m.id+' · '+m.question,a);node('p',m.impact,a);node('p','Pour lever ce repère : '+m.resolution,a);}
 const e=d.emdr,p=document.querySelector('#emdr-content');node('h3',e.title,p);node('p',e.participants+'. '+e.comparison,p);node('p',e.observations,p);const ol=node('ol',null,p);for(const stage of e.stages)node('li',stage,ol);node('p',e.limits,p);const source=node('a','Article primaire · DOI '+e.doi,p);source.href=e.source;node('p',e.license,p);
 const button=document.querySelector('#export');button.disabled=false;button.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download='POLY-couverture-'+d.updated+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 }catch(e){status.textContent='Lecture impossible : '+e.message;}
}
