/* POLY lot C — event graph which refuses to promote editorial order to causality.
   No physiological equations, propagation speeds or inferred axons are generated.
*/
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.PolyDocumentaryGraph=api;
})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const EDGE_KINDS=Object.freeze({
   DOCUMENTARY_ORDER:'DOCUMENTARY_ORDER',
   SCIENTIFIC_CAUSAL:'SCIENTIFIC_CAUSAL',
   MEASUREMENT_LINK:'MEASUREMENT_LINK',
   ASSOCIATION:'ASSOCIATION',
   HYPOTHESIS:'HYPOTHESIS'
 });
 const EVENT_KINDS=Object.freeze({
   MECHANISM:'MECHANISM',OBSERVATION:'OBSERVATION',
   REPORT:'REPORT',CONTEXT:'CONTEXT',UNKNOWN:'UNKNOWN'
 });
 function kindOf(e) {
   if(e.stage_class==='contextual_measure'||e.role==='MEASURE')return EVENT_KINDS.OBSERVATION;
   if(e.stage_class==='reported_observation'||e.role==='REPORT')return EVENT_KINDS.REPORT;
   if(e.role==='CONTEXT'||e.role==='CONDITION')return EVENT_KINDS.CONTEXT;
   if(e.role==='MECHANISM')return EVENT_KINDS.MECHANISM;
   return EVENT_KINDS.UNKNOWN;
 }
 function compile(scenario) {
   if(!scenario||scenario.schema!=='poly.adaptive.scenario/1'||!Array.isArray(scenario.events))
     throw new TypeError('Scenario scientifique absent');
   if(scenario.scientific_mode!=='DOCUMENTARY_REPLAY_ONLY'||scenario.timing!=='EDITORIAL_NOT_BIOLOGICAL')
     throw new TypeError('Ce graphe accepte uniquement les scénarios documentaires');
   const ids=new Set(), nodes=[];
   for(const e of scenario.events){
     if(!e||typeof e.id!=='string'||ids.has(e.id))throw new TypeError('Identifiant événement invalide');
     ids.add(e.id);
     if(e.chronology_proven!==false||e.anatomical_continuity_proven!==false||
        e.causal_link_to_next_established!==false||e.observed_biological_time_ms!==null)
       throw new TypeError('Données R6 incompatibles avec graphe documentaire');
     nodes.push(Object.freeze({
       id:e.id,node_id:e.node_id,title:e.title,kind:kindOf(e),
       source_urls:Object.freeze([...e.source_urls]),
       species:e.species,preparation:e.preparation,
       evidence_basis:e.source_urls.length?'REFERENCES_LISTED_NOT_EDGE_PROOF':'NO_DIRECT_REFERENCE_LISTED',
       logical_location:e.location_explanation,
       spatial_status:e.spatial_status,
       route_status:e.route_status,
       registered_anatomical_position:false
     }));
   }
   const edges=[];
   for(let i=0;i<nodes.length-1;i++){
     edges.push(Object.freeze({
       id:'DOC_'+nodes[i].id+'_'+nodes[i+1].id,
       from:nodes[i].id,to:nodes[i+1].id,
       kind:EDGE_KINDS.DOCUMENTARY_ORDER,
       establishes_biological_causation:false,
       validates_neuronal_continuity:false,
       measured_delay_ms:null,
       supported_by_shared_preparation:false,
       confirmed_scientific_link:false
     }));
   }
   const nodeIndex=new Map(nodes.map(x=>[x.id,x]));
   function reviewLink(a,b){
     if(!nodeIndex.has(a)||!nodeIndex.has(b))return {status:'UNKNOWN_NODE',can_claim_causation:false};
     const edge=edges.find(e=>e.from===a&&e.to===b);
     return {
       status:edge?'DOCUMENTARY_ADJACENCY_ONLY':'NO_LINK_IN_DATA',
       can_claim_causation:false,
       can_claim_measured_route:false,
       evidence_needed:['same preparation or validated translation',
         'source establishing the specific inter-event relationship',
         'anatomical/temporal constraints where applicable']
     };
   }
   function trace(a,b,{require='documentary'}={}){
     if(!nodeIndex.has(a)||!nodeIndex.has(b))throw new RangeError('Noeud inconnu');
     const start=nodes.findIndex(x=>x.id===a),end=nodes.findIndex(x=>x.id===b);
     if(require==='causal'||require==='biological'){
       return {status:'NO_CONFIRMED_CAUSAL_PATH',event_ids:[],
         missing:'No inter-interval causal bridges demonstrated by the source dataset.'};
     }
     if(require!=='documentary')throw new RangeError('Mode de trace inconnu');
     if(end<start)return {status:'NO_FORWARD_DOCUMENTARY_ORDER',event_ids:[]};
     return {status:'EDITORIAL_SEQUENCE_NOT_PHYSIOLOGICAL',
       event_ids:nodes.slice(start,end+1).map(x=>x.id),
       quantified_time_ms:null,biological_continuity_proven:false};
   }
   function perturb(parameters){
     if(parameters==null||typeof parameters!=='object'||Array.isArray(parameters))
       throw new TypeError('Conditions non structurées');
     return {
       status:'CONDITION_NOT_MODELED',
       supplied_parameters:Object.keys(parameters).sort(),
       predicted_changes:[],
       inferred_causal_relationships:[],
       reasons:['No validated quantitative solver for this scenario',
                'Input parameters not linked to a controlled biological model',
                'Multiple preparations are not interchangeable']
     };
   }
   function capabilities(){
     return {nodes:nodes.length,editorial_edges:edges.length,
       independently_verified_causal_edges:0,
       source_origin:'R6 mixed preparations',
       predictivity:false,measured_latency_available:false,
       registered_anatomical_route_available:false};
   }
   return Object.freeze({scenario_id:scenario.id,nodes:Object.freeze(nodes),
     edges:Object.freeze(edges),reviewLink,trace,perturb,capabilities});
 }
 return Object.freeze({compile,EDGE_KINDS,EVENT_KINDS});
});
