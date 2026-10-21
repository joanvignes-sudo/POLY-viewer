/* POLY environment plugins: capability declaration, fail-closed composition. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PolyEnvironmentRegistry = api;
})(typeof window === 'undefined' ? globalThis : window, function() {
  'use strict';

  const KINDS=Object.freeze(['anatomical','experimental','solver','presentation']);
  function registry() {
    const adapters=new Map();
    function register(spec) {
      if (!spec || typeof spec.id!=='string' || !spec.id ||
          !KINDS.includes(spec.kind) || !Array.isArray(spec.capabilities) ||
          typeof spec.version!=='string' || !spec.version ||
          !['ready','unavailable'].includes(spec.status))
        throw new TypeError('Contrat adaptateur invalide.');
      if(adapters.has(spec.id)) throw new Error('Identifiant déjà enregistré : '+spec.id);
      const item=Object.freeze({
        id:spec.id,kind:spec.kind,version:spec.version,status:spec.status,
        capabilities:Object.freeze([...spec.capabilities]),
        supported_species:Object.freeze([...(spec.supported_species||[])]),
        coordinate_frame:spec.coordinate_frame||null,
        coordinate_units:spec.coordinate_units||null,
        evidence_scope:spec.evidence_scope||'none',
        license_status:spec.license_status||'unverified'
      });
      adapters.set(item.id,item);
      return item;
    }
    function get(id) {return adapters.get(id)||null;}
    function resolve(kind,needs=[],species=null) {
      if(!KINDS.includes(kind))throw new RangeError('Catégorie inconnue.');
      return [...adapters.values()].filter(a=>a.kind===kind).map(a=>{
        const reasons=[];
        if(a.status!=='ready')reasons.push('ADAPTER_NOT_AVAILABLE');
        if(needs.some(c=>!a.capabilities.includes(c)))reasons.push('CAPABILITY_NOT_SUPPORTED');
        if(species && !a.supported_species.includes(species))reasons.push('SPECIES_NOT_CONFIRMED');
        return {id:a.id,allowed:reasons.length===0,reasons};
      });
    }
    function describe() {return [...adapters.values()].map(x=>({...x,capabilities:[...x.capabilities],supported_species:[...x.supported_species]}));}
    return Object.freeze({register,get,resolve,describe});
  }
  function defaults(){
    const r=registry();
    r.register({id:'human_conceptual_map',kind:'anatomical',version:'1',status:'ready',
      capabilities:['compartments','conceptual_anchors'],supported_species:['human','mixed'],
      coordinate_frame:'illustrative_screen',coordinate_units:'none',evidence_scope:'unregistered_schematic',
      license_status:'original_schematic'});
    r.register({id:'human_atlas_3d',kind:'anatomical',version:'future',status:'unavailable',
      capabilities:['anatomical_mesh'],supported_species:['human'],
      coordinate_frame:null,coordinate_units:null,evidence_scope:'not_imported'});
    r.register({id:'thermal_documentary_context',kind:'experimental',version:'1',status:'ready',
      capabilities:['named_context'],supported_species:['mixed'],
      evidence_scope:'preparations_are_separate'});
    r.register({id:'editorial_stepper',kind:'solver',version:'1',status:'ready',
      capabilities:['documentary_step'],supported_species:['mixed'],
      evidence_scope:'not_a_physiological_simulation'});
    r.register({id:'physiological_solver',kind:'solver',version:'future',status:'unavailable',
      capabilities:['predictive_physiology'],supported_species:['human'],evidence_scope:'no_validated_parameters'});
    r.register({id:'hra_reference_3d',kind:'anatomical',version:'2.5',status:'ready',
      capabilities:['anatomical_mesh','ontology_terms','reference_only'],supported_species:['human'],
      coordinate_frame:'separate_HRA_male_reference_models',coordinate_units:'source_gltf_not_registered',
      evidence_scope:'ontology_reference_not_anatomical_registration',license_status:'CC_BY_4_0'});
    r.register({id:'hra_atlas',kind:'presentation',version:'1',status:'ready',
      capabilities:['webgl','anatomical_mesh'],supported_species:['human','mixed'],
      coordinate_frame:'per_model_view_transform_only',coordinate_units:'not_physical',
      evidence_scope:'exploratory_reference'});
    r.register({id:'body_schematic',kind:'presentation',version:'1',status:'ready',
      capabilities:['svg','conceptual_anchors'],supported_species:['mixed','human'],
      coordinate_frame:'illustrative_screen',coordinate_units:'none'});
    r.register({id:'evidence_graph',kind:'presentation',version:'1',status:'ready',
      capabilities:['html','evidence_urls'],supported_species:['mixed','human']});
    return r;
  }
  return Object.freeze({registry,defaults,KINDS});
});
