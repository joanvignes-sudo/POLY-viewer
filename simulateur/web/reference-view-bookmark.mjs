export const REFERENCE_BOOKMARK_KEY='poly.reference-view.v1';
export function validateReferenceBookmark(value,sourceHash,keys){
 if(!value||value.schema!==REFERENCE_BOOKMARK_KEY||value.source_raw_sha256!==sourceHash||!keys.includes(value.key))return null;
 if(value.keys!==undefined&&(!Array.isArray(value.keys)||!value.keys.length||value.keys.length>16||value.keys[0]!==value.key||new Set(value.keys).size!==value.keys.length||value.keys.some(key=>!keys.includes(key))))return null;
 if(value.focus_key!==undefined&&!(value.keys??[value.key]).includes(value.focus_key))return null;
 if(value.display!==undefined){const d=value.display,mode=d?.activity??'walk';if(!['source','illustrative'].includes(d?.space)||!['walk','stand','run','sit','lie','eat'].includes(mode)||mode!=='walk'&&d.phase===null||d.phase!==null&&(!Number.isFinite(d.phase)||d.phase<0||(mode==='walk'?d.phase>=1.08:d.phase>6)||['stand','sit','lie'].includes(mode)&&d.phase!==0))return null;}

 const v=value.view;
 if(!v||![v.zoom_ratio,v.azimuth,v.elevation].every(Number.isFinite)||v.zoom_ratio<.2||v.zoom_ratio>40||Math.abs(v.azimuth)>1e6||Math.abs(v.elevation)>1.3)return null;
 return {schema:REFERENCE_BOOKMARK_KEY,source_raw_sha256:sourceHash,key:value.key,...(value.keys?{keys:[...value.keys]}:{}),...(value.focus_key?{focus_key:value.focus_key}:{}),...(value.display?{display:{space:value.display.space,phase:value.display.phase,...(value.display.activity!==undefined?{activity:value.display.activity}:{})}}:{}),view:{zoom_ratio:v.zoom_ratio,azimuth:v.azimuth,elevation:v.elevation}};
}
