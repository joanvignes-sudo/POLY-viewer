// Inspection of current residents. State contains source IDs and booleans, never Mesh objects.
export function createResidentInspector({records,getMeshes}) {
  let scope=null,saved=null;
  const matches=(r,s=scope)=>s&&(s.kind==='structure'?r.source_index===s.id:r.path.includes(s.id));
  function close(){
    if(saved)for(const m of getMeshes())m.visible=saved.get(m.userData.source_index)??true;
    scope=null;saved=null;
  }
  function refresh(){
    if(!scope)return;
    const meshes=getMeshes();
    if(!meshes.some(m=>matches(m.userData))){close();return;}
    for(const m of meshes)m.visible=Boolean(matches(m.userData));
  }
  function open(index,{single=false,group=null}={}){
    const r=records.find(r=>r.source_index===index);
    if(!r||!getMeshes().some(m=>m.userData.source_index===index))return false;
    const id=group??r.path[2]??r.name;
    if(!single&&!r.path.includes(id))return false;
    if(!saved)saved=new Map(getMeshes().map(m=>[m.userData.source_index,m.visible!==false]));
    scope=single?{kind:'structure',id:index}:{kind:'group',id};refresh();return true;
  }
  function info(){
    const expected=scope?records.filter(r=>matches(r)):[];
    const resident=new Set(getMeshes().map(m=>m.userData.source_index));
    return {scope:scope?{...scope}:null,expected:expected.length,
      resident:expected.filter(r=>resident.has(r.source_index)).map(r=>r.source_index),
      missing:expected.filter(r=>!resident.has(r.source_index)).map(r=>r.source_index)};
  }
  return {open,close,refresh,info};
}
