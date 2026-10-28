// Documentary pupillary-reflex chain; no physiology, latency or individual anatomy inferred.
// Dataset: Abivardi et al., PsPM-AOB_UW v1.0.0 DOI 10.5281/zenodo.8239465.
// Anat: https://www.ncbi.nlm.nih.gov/books/NBK553169/ ; OpenStax A&P 16.3.
const contract='poly.pupil-evidence-chain.v1',observation='poly.observed-light.v1';
const fail=(message)=>{throw Error(message)};
const ok=(condition,message)=>{if(!condition)fail(message)};
const positive=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const flags=['measured_neural_latencies','individual_retinal_activity','individual_neural_activity','subject_anatomical_registration','causal_identification','world_time_alignment','quantitative_photon_to_retina_conversion','model_diameter_prediction','diagnostic_use'];
export function validatePupilChain(c){
 ok(c?.schema===contract,'Chaîne documentaire inconnue');
 ok(c.status==='documentary_mechanistic_reference_not_individual_reconstruction','Portée physiologique interdite');
 ok(c.experiment?.dataset_doi==='10.5281/zenodo.8239465'&&c.experiment?.subject==='01'&&c.experiment?.session==='sn2','Cohorte de référence différente');
 ok(c.experiment?.measurement_unit==='mm'&&c.experiment?.stimulus_unit==='lux'&&c.experiment?.sample_rate_Hz===500&&c.experiment?.nominal_photometry_per_sample===false,'Unités ou acquisition incompatibles');
 ok(/^[a-f0-9]{64}$/.test(c.experiment?.source_member_sha256||''),'Empreinte absente');
 ok(Array.isArray(c.nodes)&&c.nodes.length===11&&Array.isArray(c.edges)&&c.edges.length===10&&Array.isArray(c.sources)&&c.sources.length>=3,'Graphe documentaire incomplet');
 const nodes=new Set(c.nodes.map(n=>n.id)),sources=new Set(c.sources.map(s=>s.id));
 ok(nodes.size===c.nodes.length&&sources.size===c.sources.length,'Identifiants dupliqués');
 for(const node of c.nodes)ok(typeof node.label==='string'&&node.label.length>2&&typeof node.source_kind==='string','Nœud incomplet');
 for(const edge of c.edges){
  ok(nodes.has(edge.from)&&nodes.has(edge.to),'Relais sans identité');
  ok(['documented_anatomical_pathway','documented_anatomical_pathway_bilateral','cross_level_hypothesis_not_subject_verified'].includes(edge.status),'Relation causalement surqualifiée');
  ok(edge.latency_s===null&&edge.individual_activity_measured===false&&edge.anatomical_registration_to_subject===false,'Inférence de latence ou de localisation interdite');
  ok(Array.isArray(edge.evidence)&&edge.evidence.length>=1&&edge.evidence.every(x=>sources.has(x)),'Référence documentaire manquante');
 }
 for(const key of flags)ok(c.constraints?.[key]===false,'Portée non démontrée : '+key);
 ok(c.constraints?.screen_distance_file_mm===590&&c.constraints?.screen_distance_publication_mm===700&&c.constraints?.screen_distance_discrepancy_resolved===false,'Désaccord expérimental non conservé');
 ok(c.constraints?.session_to_publication_blocks_mapping===null,'Correspondance des sessions supposée');
 ok(c.constraints?.pre_event_s===1&&c.constraints?.post_event_s===2&&c.constraints?.min_coverage_fraction===.75,'Convention de fenêtre non fixée');
 return c;
}
export function validatePupilObserved(d,c){
 validatePupilChain(c);
 ok(d?.schema===observation&&d.subject===c.experiment.subject&&d.session===c.experiment.session&&d.source_doi===c.experiment.dataset_doi&&d.license==='CC BY 4.0','Données non associées au contrat');
 ok(d.source_member_sha256===c.experiment.source_member_sha256&&d.unit==='mm'&&d.sample_rate_Hz===500,'Données ou empreinte incompatibles');
 ok(d.model_prediction===false&&d.interpolation_shown===false&&d.aggregation==='strict binocular mean; display bins min/max/mean over finite values only','Traitement des mesures non autorisé');
 ok(Array.isArray(d.events)&&d.events.length>0&&Array.isArray(d.bins)&&d.bins.length>0,'Séries temporelles absentes');
 let prev=-Infinity;
 const seen=new Set();
 for(const e of d.events){
  ok(Number.isInteger(e.event_index)&&!seen.has(e.event_index)&&positive(e.time_recording_s)&&e.time_recording_s>=prev,'Marqueur événementiel incohérent');
  ok(positive(e.illuminance_nominal_lux)&&e.subject_id===d.subject&&e.session_label===d.session,'Identité ou lux nominal manquant');
  prev=e.time_recording_s;seen.add(e.event_index);
 }
 prev=-Infinity;
 for(const b of d.bins){
  ok(positive(b.t)&&b.t>=prev&&positive(b.end)&&b.end>b.t&&Number.isInteger(b.n)&&b.n>0&&Number.isInteger(b.observed)&&b.observed>=0&&b.observed<=b.n,'Groupe temporel invalide');
  if(b.observed===0)ok(b.mean===null&&b.min===null&&b.max===null,'Lacune interpolée');
  else ok([b.mean,b.min,b.max].every(Number.isFinite)&&b.min<=b.mean&&b.mean<=b.max,'Statistique observée invalide');
  prev=b.end;
 }
 return d;
}
function summarise(bins,start,end,threshold){
 const included=bins.filter(b=>b.t>=start-1e-8&&b.end<=end+1e-8);
 const available=included.reduce((n,b)=>n+b.observed,0),total=included.reduce((n,b)=>n+b.n,0);
 const coverage=total?available/total:0;
 const weighted=included.reduce((n,b)=>n+(b.observed>0?b.mean*b.observed:0),0);
 // Whole prepared bins only; no use of partially overlapping bins.
 return {start_s:start,end_s:end,bins:included.length,observed_samples:available,possible_samples:total,coverage_fraction:coverage,weighted_mean_mm:available>0&&coverage>=threshold?weighted/available:null,sufficient_coverage:available>0&&coverage>=threshold};
}
export function descriptiveEventWindow(data,chain,eventId){
 const d=validatePupilObserved(data,chain),c=chain.constraints;
 ok(Number.isInteger(eventId),'Choisir un marqueur entier');
 const e=d.events.find(x=>x.event_index===eventId);ok(e,'Marqueur absent');
 const t=e.time_recording_s;
 const before=summarise(d.bins,t-c.pre_event_s,t,c.min_coverage_fraction);
 const after=summarise(d.bins,t,t+c.post_event_s,c.min_coverage_fraction);
 const delta=before.sufficient_coverage&&after.sufficient_coverage?after.weighted_mean_mm-before.weighted_mean_mm:null;
 return {schema:'poly.pupil-descriptive-window.v1',subject:d.subject,session:d.session,source_member_sha256:d.source_member_sha256,event:{index:e.event_index,recording_time_s:t,nominal_illuminance_lux:e.illuminance_nominal_lux,marker_name:e.marker_name},before,after,descriptive_delta_mm:delta,meaning:'Difference between sample-count-weighted strict binocular means in two recording-clock windows; not a causal effect or pupillary reflex latency',retinal_input_photometry:null,neural_impulses:null,neural_delay_s:null,avatar_event_time_s:null};
}
export function pupilEvidenceReceipt(d,c,eventId){
 const measure=descriptiveEventWindow(d,c,eventId);
 return {schema:'poly.pupil-mechanism-receipt.v1',source_doi:c.experiment.dataset_doi,source_member_sha256:d.source_member_sha256,publication_doi:c.experiment.publication_doi,anatomical_references:c.sources.filter(x=>x.id==='anatomy1'||x.id==='anatomy2').map(x=>x.url),graph:{id:c.id,version:c.version,documentary_nodes:c.nodes.map(x=>x.id),unlocated_edges:c.edges.length},observation:measure,limitations:{individual_neural_activity:false,individual_anatomical_registration:false,latency_measured:false,clinical_prediction:false,causal_effect_estimated:false,known_screen_distance_discrepancy_mm:[590,700]},origin:'observed_pupil_records_plus_documentary_anatomy_not_same_individual_cellular_measurement'};
}
