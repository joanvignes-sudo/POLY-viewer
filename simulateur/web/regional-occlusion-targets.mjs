// Source identities only. A documentary display region never supplies individual coordinates.
export function regionalOcclusionTargets({mode='selection',selectedIndex,coverage,heart,residentIds=[]}){
 const residents=new Set(residentIds),valid=id=>Number.isInteger(id)&&id>=0&&id<918;
 const unique=ids=>[...new Set(ids.filter(valid))].filter(id=>residents.has(id)).sort((a,b)=>a-b);
 if(heart?.active){const ids=Array.isArray(heart.source_indices)?heart.source_indices:[];return {scope:'generic-heart',source_indices:heart.mode==='body'&&ids.length===14&&new Set(ids).size===14&&ids.every(id=>valid(id)&&residents.has(id))?unique(ids):[]};}
 if(mode==='documentary'){return {scope:'documentary-region',source_indices:coverage?.path&&Array.isArray(coverage.resident)?unique(coverage.resident):[]};}
 return {scope:'selection',source_indices:valid(selectedIndex)&&residents.has(selectedIndex)?[selectedIndex]:[]};
}
