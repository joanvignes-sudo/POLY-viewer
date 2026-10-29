# POLY — Matrice de convergence du corps historique

Audit initial du 28 octobre 2026, actualisé le 29 octobre après la reprise explicite. Sources examinées : imports et initialisations de `simulateur/web/app.js`, parcours `body-region-lab.mjs`, `reference-region-lab.mjs`, modules cités et tests associés. Cette matrice compare des raccordements logiciels ; elle n'est pas une validation scientifique des modèles ni une qualification complète de toutes les commandes historiques.

| Fonction / module historique | Parcours régional actuel | Écart concret conservé |
|---|---|---|
| `body-source-contract.mjs` | Identités/recherche/résolution par résidents ; source_index HRA conservé | Les autres bibliothèques gardent leurs namespaces distincts |
| `organ-inspector.js` | Inspecteur détaillé raccordé et synchronisé avec les résidents | Un organe incomplet reste déclaré incomplet ; ses absents ne sont pas reconstruits |
| `walking-network.js` | Réseau fonctionnel documentaire et couverture des surfaces résidentes | Les marqueurs documentaires restent distincts des maillages |
| `rig.js`, marche de référence | Rig HRA et sampler ; placement/rig historiques des références ; recettes de postures partagées avec le corps classique | Les postures restent illustratives ; le lecteur de références distinctes ne reçoit pas automatiquement toutes les activités |
| Orientations et cadrages de `app.js` | Six orientations HRA, retour par historique borné, focus sélection | L'historique est celui de la caméra ; il ne restaure pas toute l'application historique |
| `selective-occlusion.js` | Œil natif, sélection, groupe cardiaque exact et régions documentaires qualifiées au repos | Sept rayons sur les seuls résidents visibles ; références distinctes et poses déformées exclues, aucune visibilité complète |
| `native-eye-context.mjs`, `eye-light.js`, P1 | Consultation native, illustration lumineuse et contrat/lecture P1 raccordés | Aucune optique réfractive ou réponse individuelle calculée |
| `brain-atlas.js` | CerebrA vérifié à la demande, libération et générations des matériaux | Référence MNI distincte, sans recalage individuel |
| `hand-muscles-reference.js` | Main à la demande, contrôles indépendants du pilote | Le pilote nerveux complet ne devient pas une dépendance fictive |
| `forearm-motor-reference.js` | Parcours par pièces/groupes : sources, attaches qualifiées, comparaisons explicitement citées, cinq poses manuelles, marche, reprise, courbes et suivi du repère historique | La vue tout-réunir reste monolithique et accessible séparément ; aucun dépassement implicite du budget 4 Mio ni recalage individuel |
| `human-nerves.js` | Vrai contrôleur régional à la demande : 575 courbes, 458 itinéraires, sens/états/lecture et cibles résidentes | Courbes schématiques, pas nerfs segmentés ni localisation individuelle |
| `activities.js`, `day-model.js` | Repos/marche ; course, assis, allongé et geste de repas manuels régionaux par recette commune ; journal déclaré autonome | Mobilier/ustensiles historiques partagés, facultatifs au régional ; le journal autonome ne pilote pas les postures régionales ni les horloges biologiques |
| `chain-bridge.mjs`, `documentary-network.js` | Dossiers génériques : étapes, branches/frontières, lecture/pause/retour, sources, cadrage résident et sauvegarde régionale vérifiée | Carte 2D/3D sur le même moteur et horloge ; points aux limites résidentes qualifiées. Correspondances cérébrales fines non établies ; formats classique/régional distincts |
| `protocol-heart-view.mjs` | Session historique réutilisée pour HASS-BODY : contrat vérifié, 14 surfaces exactes exigées, isolation/contexte/retour régionaux | Région source inconnue conservée ; aucun capteur/participant recalé ; atténuation échantillonnée devant les 14 surfaces du contrat en mode corps, suspension/restauration en mode isolé |
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


Dernière qualification : `BODY_AVATAR_DOCUMENTARY_GRAPH_2026-10-29.md`. 154 tests Node ; deux nouvelles suites navigateur et régressions des manifestes/classique réussies sur ordinateur et mobile émulé. La vue globale exhaustive de l’atelier membres/tronc reste distincte du lecteur borné ; la cause des délais de démarrage reste inconnue.


Accessoires historiques raccordés, construction exacte et destruction testées ; la boucle de rendu documentaire en pause est corrigée, sans attribuer la cause du démarrage. État de validation actuel : 156 tests Node et suites ciblées ordinateur/mobile réussies ; `BODY_ACTIVITY_PROPS_IDLE_2026-10-29.md`.


État actuel après raccordement des groupes HRA et de l’atelier : `BODY_GROUPS_WORKBENCH_2026-10-29.md`. Comparaisons, poses, suivi et cibles groupées qualifiées sont raccordés ; 165 tests Node et parcours ciblés ordinateur/mobile réussis. Le diagnostic couvre maintenant aussi les imports avant le démarrage du module, sans correction de cause intermittente revendiquée.

## Profil global explicite des références — complément du 29 octobre

Le parcours `reference-region-lab.html?scope=whole` permet l'affichage volontaire des 526 références et des 46 blocs sous un budget source de 96 Mio explicitement choisi, sans augmenter le parcours par pièces à 4 Mio / 16 pièces. Les identités, métadonnées et nombres restent ceux des blocs vérifiés ; le mode illustratif n'est pas un recalage humain. Le catalogue ne charge pas automatiquement de géométrie. Sauvegarde globale séparée, refus avant I/O, annulation, corruption, budget réduit et perte de contexte ont des essais navigateur réussis. Parité exhaustive des interactions du monolithe non établie ; téléphone physique non testé. Voir `BODY_REFERENCE_WHOLE_2026-10-29.md`. Un incident de démarrage en test et un refus ponctuel de connexion classique mobile demeurent consignés, cause inconnue.

## Commandes historiques vérifiées séparément — 29 octobre

Une suite sur les contrôles classiques confirme 918 maillages, 10 interrupteurs de systèmes, peau aller/retour, contrôle de vitesse, 11 scénarios et 38 entrées de tissus sur ordinateur et mobile émulé. La chaîne `WALK` affiche son réseau et masque volontairement l'étape suivante ; un dossier documentaire autorise cette étape. Ouvrir le premier tissu peut afficher un groupe (« Œil droit ») plutôt que l'étiquette du ligament. Le corps classique montre 74 os au repos initial et 134 après décocher/recocher la case squelette ; ce différentiel de couche reste à qualifier, pas à corriger arbitrairement.

Le régional propose recherche/systèmes par blocs et occultation d'obstacles résidents, non la transparence ou les interrupteurs globaux des 918 maillages. Vitesse globale de l'avatar, changement des univers classiques, scénario historique et profil global des 526 références ne sont pas des équivalents formels. Détails et preuve : `BODY_STARTUP_PARITY_2026-10-29.md`.
