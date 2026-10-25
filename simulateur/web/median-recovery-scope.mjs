export function medianRecoveryScope(data){
 if(data?.id!=='median_recovery_human'||data.species!=='Homo sapiens'||data.n_subjects!==6||!Array.isArray(data.phases)||data.phases.length!==4)throw Error('Protocole humain du médian incompatible');
 if(data.phase_durations_ms!==null||data.threshold_values!==null||data.temperature_C!==null)throw Error('Données quantitatives nouvelles : requalification nécessaire');
 return {
  source:'https://pubmed.ncbi.nlm.nih.gov/8813274/',doi:'10.1093/brain/119.4.1099',access:'abstract verified; full methods and data licence not qualified',
  scope:'Human post-stimulus excitability recovery; not a resting membrane model',
  responses:[{id:'sensory',label:'Réponse sensitive composée (CSAP)',direction:'antidromique'},{id:'motor',label:'Réponse musculaire composée (CMAP)',direction:'orthodromique'}],
  target_response_percent:[30,50,70],target_definition:'Amplitude de réponse visée, en pourcentage du maximum ; pas un pourcentage de courant de stimulation.',
  measured_quantity:'Variation du seuil de stimulation pour maintenir une amplitude de réponse donnée après un stimulus conditionnant supramaximal.',
  quantitative_recovery_available:false,rest_model_available:false,avatar_coupled:false,
  unknowns:['Courbes individuelles et seuils numériques non importés','Durées propres à chaque phase non importées','Température du protocole non qualifiée','Licence réutilisable des données non qualifiée'],
  reading_clock:'3 secondes d’affichage par étape ; aucune correspondance avec les millisecondes physiologiques.'
 };
}
