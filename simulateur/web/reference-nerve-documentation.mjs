import {fetchBoundedBytes} from './bounded-fetch.mjs';
import {sha256Bytes,readGzipBounded} from './body-chunk-reader.mjs';
const PACKED_HASH='e575aa71a5b77c3e25ca19f12e1596e89e05364268e6bf06cf5bf6e7c900d2ec';
const RAW_HASH='78e6b2632f39d6f8b0b847ca2e222f18a4d4b6b92060e9405f94183c14fa5ea3';
export async function loadReferenceNerveDocumentation({signal,fetcher=fetch}={}){
 const packed=await fetchBoundedBytes(new URL('../data/human-nerves.json.gz',import.meta.url),{maxBytes:106864,signal,fetcher});signal?.throwIfAborted();
 if(packed.byteLength!==106864||await sha256Bytes(packed)!==PACKED_HASH)throw Error('Nerve source gzip altered');
 const raw=await readGzipBounded(packed,995357);signal?.throwIfAborted();
 if(raw.byteLength!==995357||await sha256Bytes(raw)!==RAW_HASH)throw Error('Nerve source altered');
 const data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));
 if(data.schema!=='poly.human-nerves.v1'||data.routes?.length!==575||data.regional_itineraries?.length!==458)throw Error('Nerve source inventory changed');
 return data;
}
export function resolveReferenceNervePath(data,id){
 const path=data.regional_itineraries?.find(p=>p.id===id);if(!path)return null;
 if(!Array.isArray(path.ids)||!path.ids.length||new Set(path.ids).size!==path.ids.length)throw Error('Invalid documentary nerve itinerary');
 const routes=path.ids.map(id=>data.routes.find(r=>r.id===id));if(routes.some(r=>!r))throw Error('Documentary nerve step missing');
 const sources=new Set([...(path.sources??[]),...routes.flatMap(r=>r.sources??[])]);
 if([...sources].some(id=>!data.sources?.[id]))throw Error('Documentary nerve source missing');
 return {path,routes,sources:[...sources].map(id=>({id,...data.sources[id]}))};
}
export function createReferenceNervePanel(host,item,{load=loadReferenceNerveDocumentation}={}){
 let disposed=false,controller=null,model=null,index=0,generation=0;
 const choices=item.itineraries??(item.itinerary?[{id:item.itinerary,label:item.itinerary}]:[]);
 const section=document.createElement('section'),title=document.createElement('h4'),select=document.createElement('select'),open=document.createElement('button'),output=document.createElement('div');
 title.textContent='Parcours nerveux documentaire';open.type='button';open.textContent='Charger les étapes documentées';
 select.setAttribute('aria-label','Parcours nerveux documentaire de la fiche');
 for(const choice of choices){const option=document.createElement('option');option.value=choice.id;option.textContent=choice.label??choice.id;select.append(option);}
 const notice=document.createElement('p');notice.textContent='Lecture manuelle, sans durée biologique. Les courbes HRA ne sont pas superposées aux coordonnées de cette référence BodyParts3D. Aucun influx, entrée intramusculaire ni contraction n’est calculé.';
 section.append(title,notice,select,open,output);host.append(section);
 function render(){
  output.replaceChildren();const text=value=>{if(value==null)return;const p=document.createElement('p');p.textContent=String(value);output.append(p);};
  text(model.path.name);text('Étape documentaire '+(index+1)+' / '+model.routes.length+' · '+model.path.id);
  const route=model.routes[index];text(route.name);text(route.function);text((model.path.reverse&&route.direction==='mixed'?[...route.landmarks].reverse():route.landmarks).join(' → '));text(route.geometry_provenance);text(route.response_annotation);text(route.variant_warning);
  const junction=(model.path.junctions??[]).find(j=>j.from_route===route.id);if(junction)text(junction.scope);
  text(model.path.limit);
  for(const source of model.sources){text(source.scope);try{const url=new URL(source.url);if(!['https:','http:'].includes(url.protocol))continue;const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener';a.textContent=source.title;output.append(a);}catch{}}
  const previous=document.createElement('button'),next=document.createElement('button');previous.type=next.type='button';previous.textContent='Étape précédente';next.textContent='Étape suivante';previous.disabled=index===0;next.disabled=index===model.routes.length-1;
  const current=generation;previous.onclick=()=>{if(!disposed&&current===generation&&index>0){index--;generation++;render()}};next.onclick=()=>{if(!disposed&&current===generation&&index<model.routes.length-1){index++;generation++;render()}};output.append(previous,next);
 }
 open.onclick=async()=>{
  if(disposed||!choices.length)return;controller?.abort();controller=new AbortController();const current=++generation,id=select.value;output.textContent='Vérification de la source nerveuse…';
  try{const data=await load({signal:controller.signal});if(disposed||current!==generation)return;model=resolveReferenceNervePath(data,id);if(!model)throw Error('Parcours absent de la source vérifiée');index=0;render();}
  catch(error){if(!disposed&&current===generation)output.textContent='Lecture refusée : '+error.message;}
 };
 select.onchange=()=>{generation++;controller?.abort();model=null;output.textContent='Choisir de charger le parcours sélectionné.';};
 if(!choices.length){open.disabled=true;select.hidden=true;output.textContent='Aucun itinéraire explicitement lié à cette pièce.';}
 return {dispose(){if(disposed)return;disposed=true;generation++;controller?.abort();controller=null;model=null;open.onclick=null;select.onchange=null;section.remove();}};
}
