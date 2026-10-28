// Strictly lightweight 2D locator built from the source atlas *metadata*, not source triangles.
// Bounding rectangles and dots are orientation/extent aids, not reconstructed anatomy.
export const GROUPS=Object.freeze({
 skeletal:'Squelette',muscular:'Muscles',nervous:'Système nerveux',
 circulatory:'Cœur et vaisseaux',respiratory:'Poumons et voies aériennes',
 digestive:'Système digestif',urinary:'Appareil urinaire',
 integumentary:'Peau',lymphatic:'Système lymphatique',male_reproductive:'Reproduction'
});
const check=(ok,msg)=>{if(!ok)throw Error(msg)};
export const simplify=s=>String(s).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('œ','oe');
export function validateBodyMetadata(meta){
 check(meta&&Array.isArray(meta.structures)&&meta.structures.length>100&&meta.structures.length<2000,'Inventaire anatomique indisponible ou hors portée');
 for(let i=0;i<meta.structures.length;i++){
  const s=meta.structures[i];
  check(typeof s.name==='string'&&s.name.length>0&&Array.isArray(s.path)&&s.path.every(x=>typeof x==='string')&&Array.isArray(s.bounds)&&s.bounds.length===2,'Identité ou volume anatomique absent : '+i);
  for(const b of s.bounds)check(Array.isArray(b)&&b.length===3&&b.every(Number.isFinite),'Bornes géométriques non finies : '+i);
  check(s.bounds[0].every((x,k)=>x<=s.bounds[1][k]),'Bornes inversées : '+i);
 }
 return meta;
}
export function atlasSystem(s){
 const path=s.path.join(' ');
 return Object.keys(GROUPS).find(k=>path.includes('VH_M_'+k+'_system'))||'nervous';
}
export function makeLiteCatalogue(meta){
 validateBodyMetadata(meta);
 const records=meta.structures.map((s,index)=>({
  index,
  name:s.name,
  path:[...s.path],
  system:atlasSystem(s),
  bounds:s.bounds.map(x=>[...x]),
  source_node:s.node??null,
  search:simplify([s.name,...s.path].join(' '))
 }));
 const global=[[Infinity,Infinity,Infinity],[-Infinity,-Infinity,-Infinity]];
 for(const r of records)for(let k=0;k<3;k++){global[0][k]=Math.min(global[0][k],r.bounds[0][k]);global[1][k]=Math.max(global[1][k],r.bounds[1][k]);}
 check(global.every(row=>row.every(Number.isFinite)),'Limites globales absentes');
 check(global[1].every((v,i)=>v>global[0][i]),'Étendue globale nulle');
 return {schema:'poly.body-metadata-locator.v1',scope:'anatomical_reference_bounding_boxes_only',records,bounds:global,source:'models/body-display.json',source_geometry_loaded:false,validated_attachments:false,measured_individual_positions:false};
}
export function filterLite(catalog,{system='skeletal',query=''}={}){
 const q=simplify(query.trim());
 check(system==='all'||Object.hasOwn(GROUPS,system),'Système inconnu');
 return catalog.records.filter(x=>(system==='all'||x.system===system)&&(!q||x.search.includes(q)));
}
export function projectLiteBox(item,global,view='front',width=600,height=680,pad=30){
 check(view==='front'||view==='side','Vue indisponible');
 const a=view==='front'?0:2,b=1,lo=global[0],hi=global[1];
 const spanX=hi[a]-lo[a],spanY=hi[b]-lo[b];
 check(spanX>0&&spanY>0,'Étendue projetée nulle');
 const scale=Math.min((width-pad*2)/spanX,(height-pad*2)/spanY);
 const offsetX=(width-spanX*scale)/2,offsetY=(height-spanY*scale)/2;
 const X=x=>offsetX+(x-lo[a])*scale;
 const Y=y=>height-offsetY-(y-lo[b])*scale;
 const [l,h]=item.bounds;
 return {x:X(l[a]),y:Y(h[b]),width:Math.max(0,(h[a]-l[a])*scale),height:Math.max(0,(h[b]-l[b])*scale),centerX:(X(l[a])+X(h[a]))/2,centerY:(Y(l[b])+Y(h[b]))/2};
}
