# POLY — Matrice de convergence du corps historique

Audit du 28 octobre 2026, reprise nocturne 2. Sources examinées : imports et initialisations de `simulateur/web/app.js`, parcours `body-region-lab.mjs`, `reference-region-lab.mjs`, modules cités et tests associés. Cette matrice compare des raccordements logiciels ; elle n'est pas une validation scientifique des modèles ni une qualification complète de toutes les commandes historiques.

| Fonction / module historique | Parcours régional actuel | Écart concret conservé |
|---|---|---|
| `body-source-contract.mjs` | Identités/recherche/résolution par résidents ; source_index HRA conservé | Les autres bibliothèques gardent leurs namespaces distincts |
| `organ-inspector.js` | Inspecteur détaillé raccordé et synchronisé avec les résidents | Un organe incomplet reste déclaré incomplet ; ses absents ne sont pas reconstruits |
| `walking-network.js` | Réseau fonctionnel documentaire et couverture des surfaces résidentes | Les marqueurs documentaires restent distincts des maillages |
| `rig.js`, marche de référence | Rig HRA et sampler ; placement/rig historiques des références ; recettes de postures partagées avec le corps classique | Les postures restent illustratives ; le lecteur de références distinctes ne reçoit pas automatiquement toutes les activités |
| Orientations et cadrages de `app.js` | Six orientations HRA, retour par historique borné, focus sélection | L'historique est celui de la caméra ; il ne restaure pas toute l'application historique |
| `selective-occlusion.js` | Œil natif existant ; nouvelle atténuation volontaire d'une sélection HRA au repos | La commande générale ne porte pas encore tous les groupes historiques ; échantillonnage de sept rayons, pas visibilité complète |
| `native-eye-context.mjs`, `eye-light.js`, P1 | Consultation native, illustration lumineuse et contrat/lecture P1 raccordés | Aucune optique réfractive ou réponse individuelle calculée |
| `brain-atlas.js` | CerebrA vérifié à la demande, libération et générations des matériaux | Référence MNI distincte, sans recalage individuel |
| `hand-muscles-reference.js` | Main à la demande, contrôles indépendants du pilote | Le pilote nerveux complet ne devient pas une dépendance fictive |
| `forearm-motor-reference.js` | Parcours alternatif par pièces/groupes, sources, attaches qualifiées, postures et courbes de lecture | Le workbench historique complet et son mode tout-réunir restent monolithiques ; toutes ses interactions ne sont pas reprises |
| `human-nerves.js` | Itinéraires vérifiés liés aux pièces et courbe d'étape dans un repère illustratif compatible | L'ensemble du pilote de 575 routes et ses états globaux n'est pas raccordé au HRA régional |
| `activities.js`, `day-model.js` | Repos/marche ; course, assis, allongé et geste de repas manuels régionaux par recette commune ; journal déclaré autonome | Mobilier/ustensiles restent dans le corps historique ; le journal autonome ne pilote pas les postures régionales ni les horloges biologiques |
| `chain-bridge.mjs`, `documentary-network.js` | P1 spécifique et réseau de marche raccordés ; reprise générique durcie contre les contextes altérés et frontières franchies | Le pont de chaînes générique et ses sauvegardes ne sont pas équivalents au seul P1 ; ne pas les déclarer portés |
| `protocol-heart-view.mjs` | Parcours historique conservé par l'entrée commune | Le protocole cardiaque générique n'est pas raccordé au laboratoire régional |
| `avatar-bones.js`, `skeleton-worksite-206.js`, `registration-da.js` | Ateliers historiques disponibles | Références/proxies et revue de recalage distincts ; aucune fusion avec HRA ni recalage inventé |
| `neuromuscular-guide.js`, `nerve-linked-pilot.js` | Ateliers historiques disponibles | Dépendances détaillées à qualifier avant découplage ; pas de faux pilote pour satisfaire une API |
| `nerve-excitability.js`, `enteric-inhibition.js` | Modèles et protocoles historiques conservés | Leur calcul et leurs horloges ne sont pas déduits du mouvement régional |
| `cogitate-scene.js`, `recovered-work.js` | Accès historique et pages de travaux conservés | Aucune localisation individuelle libre sur le nouvel atlas |
| `body-batch-loader.mjs` / rendu classique | Parcours historique conservé ; lecteur par blocs comme alternative | L'entrée publique classique n'est pas remplacée automatiquement |

## Priorités justifiées pour les reprises suivantes

1. Qualifier le pont générique de chaînes et ses contextes source/horloges avant raccordement. Les postures manuelles et le journal sont désormais disponibles séparément ; aucun pilotage biologique implicite n’est introduit.
2. Identifier les commandes de chaînes génériques réellement utiles au parcours régional, avec contexte et horloge explicitement séparés.
3. Poursuivre les profils CPU (normales/rendu) avec un cas source précis avant toute optimisation ; la mesure des seules positions du tronc est déjà close.
4. Utiliser les traces de démarrage en cas de nouvel incident. La cause du délai historique reste inconnue ; ne pas effacer ce constat.

Les mesures sur téléphone physique et l'autorisation de diffusion/publication restent extérieures à cette matrice logicielle. Aucun modèle, point d'insertion, délai ou recalage absent n'est inventé pour remplir une case.
