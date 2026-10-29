export const INQUIRY=Object.freeze({
 id:'lactate-nmdar-pilot-v1',
 question:'L’effet du lactate sur la réponse NMDA nécessite-t-il la voie HCAR1–sérine ?',
 preparation:'Pilote : tranches hippocampiques de souris WT, réponse NMDAR-fEPSP ; groupes de la figure 4, Fernández-Moncada et coll. (2024).',
 goal:'Reconstituer le résultat publié comme cas de référence, puis préparer une épreuve indépendante des étapes nécessaires. Le sens du transport cellulaire reste une question distincte.',
 boundary:'Les cultures neuronales de 2026 servent de mécanisme alternatif à examiner, sans transférer leurs paramètres aux tranches de 2024. Les données humaines sang–cerveau et les capteurs de rat restent dans leurs dossiers.',
 mechanisms:[
  {id:'hcar-serine',label:'A · Signalisation HCAR1–sérine',route:'serine',source:'https://www.nature.com/articles/s41467-024-51008-2',citation:'Fernández-Moncada et coll., 2024 · figure 4 et discussion',scope:'Tranches hippocampiques de souris ; réponse synaptique de population.',chain:'Lactate extracellulaire → HCAR1 → voie de synthèse de sérine → disponibilité de D-sérine → réponse NMDA.',finding:'L’étude rapporte des interventions compatibles avec une dépendance à la voie de synthèse de sérine et une action de HCAR1.',unknown:'Le relais moléculaire et la localisation précise de HCAR1 dans cette chaîne restent à préciser. Ce schéma ne démontre pas un transfert astrocyte–neurone.',falsifier:'La nécessité de cette voie serait mise en difficulté si l’effet du lactate persistait malgré une interruption spécifique et vérifiée de la voie, avec une réponse NMDA et une viabilité préservées.'},
  {id:'transport-redox',label:'B · Transport–LDH–redox',route:'redox-nmda',source:'https://physoc.onlinelibrary.wiley.com/doi/full/10.1113/JP288960',citation:'Fiumelli et coll., 2026 · résultats et discussion',scope:'Cultures de neurones corticaux ; courant NMDA cellulaire. Préparation différente du pilote.',chain:'Entrée du lactate → LDH / NADH → régulation intracellulaire → réponse NMDA.',finding:'L’étude rapporte une dépendance au transport et à LDH pour la potentialisation de l’amplitude du courant ; les agonistes HCAR1 ne reproduisent pas cet effet.',unknown:'Ces résultats ne constituent pas une comparaison directe avec les tranches de 2024. Amplitude et décroissance du courant doivent rester des sorties distinctes.',falsifier:'La nécessité de cette voie pour une sortie définie serait mise en difficulté si cette sortie persistait après interruption vérifiée du transport ou de LDH, avec des contrôles de spécificité et de fonctionnement cellulaire.'}
 ],
 challenges:[
  {intervention:'Interrompre HCAR1 / la synthèse de sérine ; tester un secours par D-sérine.',a:'Si A est nécessaire, son interruption doit réduire l’effet ; un secours peut situer une étape en aval.',b:'Une dépendance à A ne suffit pas à exclure une contribution parallèle de B.',controls:'Efficacité et spécificité de l’intervention, réponse basale, coagonistes, viabilité ; distinguer inhibition HCAR1 et PHGDH.'},
  {intervention:'Interrompre le transport / LDH avec une lecture redox indépendante.',a:'Une variation peut aussi venir de l’état métabolique général ; pas de conclusion automatique sur HCAR1.',b:'Si B est nécessaire à la sortie choisie, une interruption vérifiée doit en réduire l’effet.',controls:'pH, lactate intra/extracellulaire, action réelle sur la cible, redox, énergie et réponse NMDA conservée.'},
  {intervention:'Comparer les deux interventions et leur combinaison dans une même préparation.',a:'Une contribution partielle ou un secours peut indiquer des voies convergentes.',b:'Un effet résiduel peut nécessiter un modèle mixte ou une autre voie.',controls:'Plan indépendant, animaux/cultures identifiés, incertitudes, mesures et chronologie compatibles ; aucune addition d’effets supposée.'}
 ],
 conclusion:'Aucune voie sélectionnée par POLY. Les données reçues ne permettent pas de calculer une prédiction quantitative NMDA ni de rejeter un mécanisme.',
 qualification:['Préparation et protocole identifiés par groupe','Interventions horodatées et cibles effectivement contrôlées','Opérateur de mesure et incertitudes qualifiés','Modules reliés à la sortie NMDA et paramètres identifiables','Données indépendantes pour éprouver les prédictions']
});
export const PILOT_SERIES=Object.freeze(['synaptic-lactate','synaptic-serine','synaptic-lactate_serine','synaptic-serine_nct','synaptic-lactate_nct','synaptic-agonist','synaptic-serine_agonist']);
export function evidenceClass(edge){
 if(edge.status==='unknown')return 'unresolved';
 if(edge.status==='hypothesis')return 'hypothesis';
 return edge.kind==='observation'?'published-observation':'reported-mechanism';
}
export const EVIDENCE_LABELS=Object.freeze({'unresolved':'Liaison non qualifiée','hypothesis':'Hypothèse proposée','published-observation':'Mesure publiée · valeurs locales à vérifier','reported-mechanism':'Relation rapportée · dans le contexte cité'});
export function nodeUncertainty(id){return id==='hcar1'?'Localisation de HCAR1 à préciser : sa colonne est un rangement conceptuel, pas une localisation cellulaire établie pour cette chaîne.':null;}
export function pilotEvidence(observations){
 const admitted=new Map();
 for(const s of observations?.series??[]){
  if(!PILOT_SERIES.includes(s.id))continue;
  if(admitted.has(s.id))throw Error('Série pilote dupliquée');
  if(s.source_id!=='fernandez'||s.context!=='mouse_synaptic'||s.unit!=='% de la référence du groupe'||s.edge_id!=='synaptic-observe')throw Error('Préparation pilote incompatible');
  admitted.set(s.id,s);
 }
 const series=PILOT_SERIES.map(id=>{const s=admitted.get(id);return {id,title:s?.title??id,received:Boolean(s),points:s?.samples.length??0,missing:s?.samples.filter(x=>x.value===null).length??0,unit:s?.unit??null};});
 return {schema:'poly.metabolic-inquiry.v1',inquiry_id:INQUIRY.id,series,received:admitted.size,total:PILOT_SERIES.length,ready_for_quantitative_test:false,selected_mechanism:null,independent_validation:false,reason:INQUIRY.conclusion,missing_qualifications:[...INQUIRY.qualification]};
}
