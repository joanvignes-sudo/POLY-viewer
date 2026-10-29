# POLY — Matrice de convergence du corps historique

Audit initial du 28 octobre 2026, actualisé le 29 octobre après la reprise explicite. Sources examinées : imports et initialisations de `simulateur/web/app.js`, parcours `body-region-lab.mjs`, `reference-region-lab.mjs`, modules cités et tests associés. Cette matrice compare des raccordements logiciels ; elle n'est pas une validation scientifique des modèles ni une qualification complète de toutes les commandes historiques.

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
| `human-nerves.js` | Vrai contrôleur régional à la demande : 575 courbes, 458 itinéraires, sens/états/lecture et cibles résidentes | Courbes schématiques, pas nerfs segmentés ni localisation individuelle |
| `activities.js`, `day-model.js` | Repos/marche ; course, assis, allongé et geste de repas manuels régionaux par recette commune ; journal déclaré autonome | Mobilier/ustensiles restent dans le corps historique ; le journal autonome ne pilote pas les postures régionales ni les horloges biologiques |
| `chain-bridge.mjs`, `documentary-network.js` | Dossiers génériques : étapes, branches/frontières, lecture/pause/retour, sources, cadrage résident et sauvegarde régionale vérifiée | Carte 2D/3D sur le même moteur et horloge ; points aux limites résidentes qualifiées. Correspondances cérébrales fines non établies ; formats classique/régional distincts |
| `protocol-heart-view.mjs` | Session historique réutilisée pour HASS-BODY : contrat vérifié, 14 surfaces exactes exigées, isolation/contexte/retour régionaux | Région source inconnue conservée ; aucun capteur/participant recalé ; contexte limité aux résidents, sans atténuation générale des occultants |
| `avatar-bones.js`, `skeleton-worksite-206.js`, `registration-da.js` | Couche graphique régionale 208 objets / 206 concepts et poses historiques ; squelette source complet ou par blocs ; revue DB indépendante des 80 surfaces | Recette graphique des bras non validée anatomiquement ; placements DB enregistrés seulement, cibles HRA absentes non reconstruites ; aucune fusion entre atlas |
| `neuromuscular-guide.js`, `nerve-linked-pilot.js` | Guide de main réel et vrais pilotes médian/ulnaire raccordés ; source, frontière et cycle de vie conservés | Aucun point d’entrée, jonction ou contraction calculé |
| `nerve-excitability.js`, `enteric-inhibition.js` | Modules historiques raccordés au vrai contrôleur régional, phases et protocoles conservés | Horloges pédagogiques, pas délais biologiques ni effets de l’avatar |
| `cogitate-scene.js`, `recovered-work.js` | Fabriques régionales à la demande : figures locales vérifiées, quatre étapes, 78 dossiers/544 intervalles et véritable atlas CerebrA | Aucune localisation individuelle ; dossiers complets, préparations et horloges séparés |
| `body-batch-loader.mjs` / rendu classique | Parcours historique conservé ; lecteur par blocs comme alternative | L'entrée publique classique n'est pas remplacée automatiquement |

## Priorités justifiées pour les reprises suivantes

1. Dossiers génériques raccordés avec moteur historique, limites résidentes et reprises vérifiées. Qualifier séparément les vues spécialisées restantes.
2. Conserver les sous-régions non qualifiées sans point 3D ; les lignes documentaires raccordées ne deviennent pas des trajets anatomiques mesurés.
3. Poursuivre les profils CPU (normales/rendu) avec un cas source précis avant toute optimisation ; la mesure des seules positions du tronc est déjà close.
4. Utiliser les traces de démarrage en cas de nouvel incident. La cause du délai historique reste inconnue ; ne pas effacer ce constat.

Les mesures sur téléphone physique et l'autorisation de diffusion/publication restent extérieures à cette matrice logicielle. Aucun modèle, point d'insertion, délai ou recalage absent n'est inventé pour remplir une case.

Le squelette Z-Anatomy 206 dispose désormais d’un lecteur indépendant par blocs, filtres région/concept et picking source. Le chargement complet et les 80 surfaces de revue DB disposent de pages distinctes ; aucune fusion/recalage individuel.

Le chargement complet du squelette Z-Anatomy est désormais disponible sous budget brut explicite de 16 Mio (208 objets, 206 concepts). La revue DB, ses rapprochements et les recalages individuels ne sont pas assimilés à cette référence source.

Les pilotes médian/ulnaire disposent d’une lecture documentaire indépendante sans WebGL et sans temps biologique. Leur contrôleur 3D global est aussi raccordé à la demande au régional, avec ses marqueurs documentaires historiques et sans validation individuelle.

Reprise explicite du 29 octobre : le contrôleur nerveux 3D global et ses deux protocoles sont désormais raccordés ; les mentions antérieures de limite historique décrivent l’état des reprises précédentes. La revue DB dispose aussi d’un accès indépendant aux deux placements enregistrés, sans reconstruction de cibles HRA absentes.


Dernière qualification : `BODY_AVATAR_DOCUMENTARY_GRAPH_2026-10-29.md`. 154 tests Node ; deux nouvelles suites navigateur et régressions des manifestes/classique réussies sur ordinateur et mobile émulé. Les interactions exhaustives de l’atelier membres/tronc, accessoires et extension des groupes d’occultation restent distinctes ; la cause des délais de démarrage reste inconnue.
