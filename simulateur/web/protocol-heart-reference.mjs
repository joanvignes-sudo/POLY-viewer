const expected=[679,680,681,682,684,685,686,687,688,690,691,692,693,694];
export function validateProtocolReference(c,meta=null){
 if(c?.schema!=='poly.protocol-reference-context.v1'||c.id!=='HASS-BODY:generic-heart-context'||c.relation!=='curated_generic_reference_context'||c.protocol?.group_id!=='HASSANPOUR'||c.protocol?.node_id!=='HASS-BODY'||c.protocol?.doi!=='10.1038/npp.2017.154'||c.protocol?.individual_data_imported!==false)throw Error('Contexte documentaire incompatible.');
 if(c.participant_registration!==false||c.sensor_localization!==false||c.causal_path!==false||c.physiological_time_s!==null||c.individual_anatomy!==false)throw Error('Portée du contexte modifiée.');
 if(c.ontology?.obo_id!=='UBERON:0000948'||c.ontology?.label!=='heart'||c.ontology?.is_obsolete!==false||c.ontology?.iri!=='http://purl.obolibrary.org/obo/UBERON_0000948'||c.ontology?.license!=='CC BY 3.0'||typeof c.ontology?.version_iri!=='string'||!c.ontology.version_iri.startsWith('http://purl.obolibrary.org/obo/uberon/releases/'))throw Error('Terme anatomique non qualifié.');
 const r=c.reference;
 if(r?.source!=='HRA united male v1.10, Visible Human'||r.source_group!=='VH_M_heart'||r.metadata_sha256!=='cf140a39c11163508e91e12b0df9820e6e36ea2f2b50392f62cd9f404fea1573'||!Array.isArray(r.parts)||r.parts.length!==14||r.parts.some((p,i)=>p.node!==expected[i]||typeof p.name!=='string'||!p.name.length))throw Error('Périmètre HRA incompatible.');
 if(meta&&(meta.reference!==r.source||r.parts.some(p=>meta.structures.filter(s=>s.node===p.node&&s.name===p.name&&s.path.includes(r.source_group)).length!==1)))throw Error('Identité source HRA incompatible.');
 if(typeof c.curation!=='string'||!c.curation.length||!Array.isArray(c.limitations)||c.limitations.length!==4)throw Error('Provenance ou limites absentes.');
 return c;
}
export function protocolReferenceAvailable(groupId,nodeId){return groupId==='HASSANPOUR'&&nodeId==='HASS-BODY';}
if(typeof document!=='undefined'&&document.getElementById('reference-status')){
 try{const response=await fetch('protocol-heart-reference.json');if(!response.ok)throw Error('Contrat indisponible');const c=validateProtocolReference(await response.json()),rows=document.getElementById('reference-parts');
 for(const p of c.reference.parts){const tr=document.createElement('tr');for(const value of [p.node,p.name.replace(/^VH_M_/,'').replaceAll('_',' ')]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}rows.append(tr);}
 document.getElementById('ontology-version').textContent=c.ontology.version_iri;
 document.getElementById('reference-status').textContent='Contexte générique contrôlé : un terme d’ontologie et 14 surfaces de référence. Aucune registration du participant.';
 }catch(e){document.getElementById('reference-status').textContent='Lecture refusée : '+e.message;}
}
