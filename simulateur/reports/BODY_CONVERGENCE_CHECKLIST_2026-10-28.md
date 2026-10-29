# POLY — Convergence et reprise nocturne, 28 octobre 2026

Développement local sur `feat/regional-body-bridge-20261028`. Aucun push, fusion ou déploiement. Les données source restent préservées.

## État actuel — 29 octobre, poursuite après la nuit

La couche osseuse d’avatar (208 objets / 206 concepts) et la carte documentaire 3D sont désormais raccordées, en plus des contrôleurs nerveux, de COGITATE, des travaux retrouvés et de la revue DB indépendante. Horloge documentaire unique ; points limités aux surfaces résidentes qualifiées ; recette osseuse graphique explicitement non validée anatomiquement.

**174 tests Node et 24 tests Python passent.** Dernière passe : neuf suites navigateur ciblées sur les gestes, les reprises et le serveur mis à jour. Les 35 reçus de la passe élargie précédente sont conservés, sans annonce d'une nouvelle exécution collective. Catalogue du squelette récupérable, rendus annulables dans quatre lecteurs, pincement et clavier dans les deux vues statiques. Les échecs d'import classique/références/HRA restent consignés ; cause toujours inconnue. Derniers rapports : `BODY_LIFECYCLE_RECOVERY_2026-10-29.md` et `BODY_STATIC_INPUT_2026-10-29.md`.

La liste initiale dispose de ses raccordements logiciels documentés ci-dessous. La parité exhaustive de toutes les interactions du monolithe reste partielle : la vue globale monolithique des membres/tronc reste distincte du lecteur borné. Les groupes HRA qualifiés, comparaisons, postures et suivi sont maintenant raccordés. Mesures physiques et recalages individuels ne sont pas acquis. État fonctionnel actuel détaillé dans `BODY_FEATURE_PARITY_2026-10-28.md` ; derniers rapports : `BODY_AVATAR_DOCUMENTARY_GRAPH_2026-10-29.md`, `BODY_ACTIVITY_PROPS_IDLE_2026-10-29.md` et `BODY_GROUPS_WORKBENCH_2026-10-29.md`. Les sections de reprises suivantes constituent l’historique chronologique, avec leurs comptes de tests à leur date.

## Les quatre raccordements logiciels annoncés

| Travail | Résultat exécuté et testé |
|---|---|
| Sélection spatiale, cadrage et retour | Toucher/clic sur les triangles visibles ; identité source exacte ; cadrage de la surface inspectée et retour au cadrage précédent ; les glissements/pincements ne sélectionnent pas volontairement une nouvelle pièce |
| Déformations des résidents musculaires/osseux | Mode source distinct du placement illustratif ; recette historique de placement, calibration par proxies et déformations de tronc, membres et os réutilisées ; phase et lecture de marche, repos et restauration des coordonnées source |
| Parcours nerveux dans un repère compatible | Lecture manuelle et courbe de l'étape choisie uniquement avec la pièce chargée et le mode illustratif ; déformation commune aux surfaces et courbes ; retrait/libération au changement de fiche, de mode ou de contexte |
| Accès commun conservant l'existant | `anatomy.html` propose léger, HRA régional, références par pièces et corps historique ; aucune géométrie au chargement de cette page ; liens ajoutés aux parcours concernés |

Les sauvegardes locales reprennent maintenant groupes, focus et phase illustrative après contrôle de source ; aucun maillage ni tracé nerveux n'est rechargé automatiquement à l'ouverture. Les commandes d'anciens groupes deviennent inertes et ne capturent plus les tableaux géométriques des anciennes pièces.

## Liste initiale : état réel

| Priorité | État logiciel | Qualification ou périmètre restant |
|---|---|---|
| Audit rendu/sélection/mémoire | Réalisé et étendu sur les parcours raccordés | Matrice actuelle tenue à jour ; interactions monolithiques restantes explicitement séparées |
| Interface lecteur 13 blocs / fonctions historiques | Adaptateur et parcours régional fonctionnels | Le corps historique demeure un parcours disponible ; son remplacement automatique n'est pas effectué |
| Identités, coordonnées, références | Conservation et contrôles source en place | Aucun recalage individuel entre bibliothèques n'est établi |
| Libération/récupération WebGL | Corps, atlas, références, groupes et courbes testés | Restitution de mémoire physique et comportement du pilote à mesurer sur appareils |
| Recherche, inspection, tactile | Raccordés aux parcours régionaux et par pièces | Étendre les interactions selon les écarts concrets relevés, sans déplacer arbitrairement les modèles indépendants |
| Marche et déformations | Rig historique, sampler et transformations de référence raccordés | Illustration graphique ; aucune validation biomécanique individuelle |
| Une structure / groupe local | HRA et groupes muscle–os vérifiés, budget combiné 4 Mio, maximum 16 pièces | Ajouter d'autres groupes seulement avec dépendances explicites et budget qualifié |
| Performance et limites | Budgets, compteurs et essais serveur documentés | Téléphone physique : CPU/GPU, fréquence d'images, batterie, température |

## Tests et preuve

- **101 tests Node : PASS ; 21 tests Python : PASS.**
- **11 suites navigateur disposent de résultats réussis** sur les composants actuels. Les neuf suites historiques/HRA sont passées lors de la passe séquentielle ; les deux suites de référence ont été répétées après les dernières modifications de leur parcours.
- Le nouveau parcours d'interactions a réussi trois exécutions consécutives après ajout du diagnostic de disponibilité. Un échec intermédiaire de rechargement a été conservé : voir limite ci-dessous.
- Tests nouveaux : vrais triangles sélectionnés au pointeur/toucher, focus/retour et sauvegarde de focus, phase/restauration source, courbe illustrative compatible, sauvegarde de phase, pause d'animation en page masquée, perte de contexte d'un groupe, données de marche altérées refusées.
- Tests du catalogue : manifeste absent puis reprise, transfert de métadonnées volontairement bloqué puis réellement annulé et relancé sans WebGL.
- Essai du vrai serveur sans interception : biceps et radius, deux surfaces, une courbe, 726 000 octets de blocs source et 76 572 octets de buffers d'affichage des surfaces en mode posture. Le compteur d'affichage des surfaces exclut les petits buffers de la courbe, les métadonnées, les temporaires, les objets et la mémoire GPU physique.

## Limite de démarrage à investiguer

Une exécution consolidée a dépassé 45 secondes en attendant l'affichage du catalogue après un rechargement. La cause n'a pas été établie. Les passages suivants réussis ne prouvent pas sa correction. Le diagnostic du test identifie maintenant l'étape de démarrage et les refus explicites. L'interface permet d'annuler et relancer le catalogue ; cette relance est testée contre un transfert délibérément bloqué. Les reprises nocturnes doivent rechercher une reproduction et la cause, plutôt que masquer le problème par des retries silencieux.

## Travail nocturne autorisé

La fenêtre de relances s’est terminée le **29 octobre 2026 à 08:00 Europe/Paris** ; cette automation a été supprimée. Le travail après cette heure répond aux nouvelles demandes explicites de l’utilisateur. Checkpoint court : `work/POLY_NUIT_REPRISE.json` dans le dossier du chat. À poursuivre sans refaire les opérations closes : diagnostic du délai intermittent, audit des écarts historiques, performances et allocations des groupes les plus lourds permis, interactions/états encore manquants et tests pertinents.

Les mesures sur téléphone physique, les insertions individuelles et les validations expérimentales absentes ne peuvent pas être déclarées acquises par ces tests. La diffusion et la publication exigent toujours l'accord explicite de l'utilisateur.

Une autre passe de la suite de référence a été interrompue alors qu’elle ne produisait plus de résultat. Les attentes des requêtes de test détenues par une fixture sont maintenant bornées à 15 secondes avec diagnostic ; la passe suivante a réussi. Cette interruption ne sert pas de preuve de réussite ni de preuve de correction du démarrage.


## Reprise nocturne 1 — démarrage et CPU

Garde de chargement de 30 secondes avec annulation réelle, diagnostic par étape et relance volontaire ; la cause du délai intermittent historique reste non établie. Huit rechargements bureau/mobile émulé sont passés. Écriture des positions du tronc optimisée avec résultats float32 identiques octet par octet : médiane CPU locale 46.354 → 10.217 ms, soit 4.54× sur cette seule opération. Les normales, le rendu complet et le téléphone ne sont pas mesurés par ce benchmark. 106 tests Node et les trois suites navigateur ciblées passent ; les autres résultats antérieurs ne sont pas déclarés réexécutés. Détails et reproduction dans `BODY_NIGHT_01_2026-10-28.md`.


## Reprise nocturne 2 — navigation HRA et matrice des écarts

Six orientations, retour de cadrage borné et atténuation graphique volontaire au repos HRA sont raccordés. Les matériaux sont restaurés après chaque rendu ; cache et historique ne gardent pas de ressources de scène. 111 tests Node et sept suites navigateur HRA passent. La matrice `BODY_FEATURE_PARITY_2026-10-28.md` explicite les fonctions encore partielles ou historiques (activités/journal, chaînes génériques, pilotes et ateliers distincts). Le détail et les limites figurent dans `BODY_NIGHT_02_2026-10-28.md`. Aucun progrès de qualification physique ou de résolution de la cause du délai intermittent n’est revendiqué.


## Reprise nocturne 3 — journal déclaré autonome

Le journal 24 h dispose d’un parcours sans maillage, compatible avec la clé et le schéma historiques. Brouillons explicites, copies précédentes avant remplacement, refus des versions concurrentes détectées, imports/exports et conservation des champs inconnus et heures fractionnaires sont testés. Le résumé connu est reconstruit à l’export ; aucun effet biologique ni mouvement d’avatar n’est déduit. Les vérifications de stockage ne constituent pas une transaction entre pages. 121 tests Node et les suites navigateur journal/régional/références passent. Détails et limites dans `BODY_NIGHT_03_2026-10-28.md` ; les autres postures et modèles restent distincts.


## Reprise nocturne 4 — postures historiques communes

Course, assis, allongé et geste de repas sont disponibles manuellement dans le HRA régional. Un évaluateur commun remplace les formules privées du corps classique, avec 28 sorties de référence capturées dans son ancien commit. La fenêtre 0–6 s reste graphique ; aucun lien implicite avec le journal ou une horloge biologique. Picking déformé, cadrage/retour, pause et récupération WebGL sont testés. 124 tests Node et neuf suites navigateur passent. Détails dans `BODY_NIGHT_04_2026-10-29.md` ; le pont générique de chaînes et les autres limites ne sont pas déclarés clos.


## Demande utilisateur — méthode de sélection 3D

La méthode `pick` réutilise un espace de travail par clic. Sur le bloc squelettique comparé : 134 géométries temporaires → 1 ; 1277316 → 42864 octets de buffers de positions alloués, soit 96.64 % de moins. Les 36 sélections comparées restent identiques et le bloc source inchangé. 126 tests Node et quatre suites navigateur disposent de résultats réussis ; un délai de démarrage dans un cas de catalogue corrompu est conservé comme limite non résolue. Détails dans `BODY_PICK_METHOD_2026-10-29.md`. Aucune mesure de RAM totale, GPU ou téléphone physique n'est déduite.


## Reprise nocturne 5 — cohérence des manifestes documentaires

Le pont refuse les champs de contexte source altérés et les progressions positives sur une frontière du moteur. Contrat extrait sans rupture de l’API ; empreintes du contrat et du moteur ajoutées. 129 tests Node et une nouvelle suite navigateur ordinateur/mobile passent. Les anciens manifestes incomplets sont explicitement refusés. Le raccordement régional générique reste ouvert ; détails dans `BODY_NIGHT_05_2026-10-29.md`.


## Dossiers génériques régionaux — 29 octobre

Sélection de dossier/étape, branches/frontières du moteur historique, lecture/pause/retour, sources, cadrage des limites résidentes et reprise régionale vérifiable sont raccordés. Aucune correspondance cérébrale fine, ligne 3D ou horloge biologique n’est inventée. 131 tests Node et quatre suites navigateur pertinentes passent. Le format régional exige les mêmes sources chargées et refuse les changements pendant la vérification. Détails dans `BODY_REGIONAL_DOCUMENTARY_2026-10-29.md`.


## Normales CPU — 29 octobre

Profil séparé effectué : les normales dominent le coût mesuré. Une écriture scalaire des normales d’affichage reproduit les octets Three.js pour les 526 pièces à trois phases (1578 comparaisons), sans modifier positions/indices/source. Sur quatre grandes surfaces : 38.02 → 9.60 ms CPU médian pour les seules normales (3.96× local). 133 tests Node et deux suites navigateur références passent. Aucun gain de fluidité globale ou sur téléphone n’est déduit. Détails dans `BODY_NORMALS_CPU_2026-10-29.md`.


## Contexte cardiaque générique régional — 29 octobre

L’étape HASS-BODY propose la curation HRA existante, sans modifier sa région source inconnue. Contrat vérifié, exigence des 14 identités résidentes exactes, isolation/contexte/retour et fermetures de cycle de vie sont raccordés, sans nouvelle géométrie ni observation individuelle. 135 tests Node et la nouvelle suite navigateur ordinateur/mobile passent. Détails dans `BODY_REGIONAL_GENERIC_HEART_2026-10-29.md`.


## Guide nerf–muscle régional — 29 octobre

Le guide qualitatif historique est raccordé à la véritable référence de main, à la demande, avec source vérifiée, trois conditions conservées, horloge pédagogique indépendante et cycle de vie explicite. Aucun faux pilote nerveux ni emplacement de jonction ajouté. 136 tests Node, nouvelle suite navigateur ordinateur/mobile et parcours classique passent. Un nouvel échec d’attente au démarrage est conservé comme limite, malgré une exécution isolée réussie. Détails dans `BODY_REGIONAL_NEUROMUSCULAR_2026-10-29.md`.


## Démarrage HRA — diagnostic sans clôture de cause

Trace des étapes et diagnostic des requêtes en attente ajoutés après deux nouveaux délais. Suite main complète et cas démarrage normal/catalogue altéré passent ; aucune cause intermittente déclarée corrigée. Détails dans `BODY_STARTUP_TRACE_2026-10-29.md`.


## Squelette distinct — blocs exacts

208 objets / 206 concepts conservés dans quatre blocs bornés, métadonnées et registre intégral inchangés. Vérification indépendante Python/JavaScript réussie sur toutes les valeurs ; deux nouveaux tests Python passent. Le lecteur et le rendu restent à raccorder. Détails dans `BODY_SKELETON_CHUNKS_2026-10-29.md`.


## Lecteur du squelette distinct

Lecteur borné et annulable `skeleton206` validé sur les 208 objets réels, toutes valeurs et métadonnées conservées. Refus des corruptions, mutations et plages chevauchantes ; 140 tests Node passent. Le rendu reste à raccorder. Détails dans `BODY_SKELETON_READER_2026-10-29.md`.


## Squelette source — vue par blocs

Page indépendante raccordée à l’entrée commune, catalogue sans WebGL et chargement explicite borné ; objet seul ou résidents du bloc, provenance et libération CPU/GPU. Navigateur ordinateur/mobile et 23 tests Python passent. Pas de squelette complet ni recalage individuel annoncé. Détails dans `BODY_SKELETON_VIEW_2026-10-29.md`.


## Squelette distinct — filtres et picking

Filtres région/concept sans téléchargement, identités d’objet inchangées et picking réel des triangles sont raccordés. 141 tests Node et deux suites navigateur ordinateur/mobile passent ; annulation réseau et reprise explicite vérifiées. Détails dans `BODY_SKELETON_INTERACTIONS_2026-10-29.md`.


## Squelette source complet — budget explicite

Les 208 objets / 206 concepts peuvent être chargés explicitement avec un budget de 16 Mio ; refus préalable sans transfert à 4 Mio. Installation après vérification de tous les blocs, conservation de la scène après corruption et libération lors de réduction de budget testées. 143 tests Node et suites navigateur ordinateur/mobile passent. Détails dans `BODY_SKELETON_WHOLE_2026-10-29.md`.


## Pilotes médian/ulnaire — accès documentaire indépendant

Lecture sans WebGL des deux itinéraires réels, branches et frontière terminale ; sources vérifiées, délais inconnus et mesures humaines séparées. 146 tests Node et suite navigateur ordinateur/mobile passent. Le pilote 3D global reste historique, sans faux adaptateur. Détails dans `BODY_NERVE_PILOT_DOCUMENTATION_2026-10-29.md`.


## Clôture de la fenêtre nocturne

Bilan dans `BODY_NIGHT_FINAL_2026-10-29.md` : 146 tests Node, 23 Python et résultats réussis de 24 suites navigateur au fil des reprises. Liste de convergence encore partielle ; contrôleur nerveux global, revue DB et ateliers spécialisés restent distincts. Cause du délai intermittent inconnue. Aucun nouveau chantier après 08:00 Europe/Paris ; sauvegarde locale et bilan final conservés.


## Reprise explicite — revue DB indépendante

80 surfaces de revue accessibles séparément : source vérifiée, deux placements enregistrés, filtres, comparaisons de mains et libération. Pas de cible HRA reconstruite ni registration validée. 148 tests Node et suites navigateur ordinateur/mobile DB/squelette passent. Détails dans `BODY_DB_REVIEW_2026-10-29.md`.


## Contrôleurs nerveux historiques régionaux

575 courbes, 458 itinéraires, vrais pilotes médian/ulnaire, excitabilité du médian et inhibition entérique raccordés à la demande, avec sources vérifiées, vrais inspecteur/rig et destruction explicite. 148 tests Node, suites navigateur régionales ordinateur/mobile et régression classique réussis. Un premier délai classique reste consigné, cause inconnue. Détails dans `BODY_REGIONAL_NERVES_2026-10-29.md`.


## COGITATE et travaux retrouvés régionaux

Vraies fabriques réutilisées avec sources/figures vérifiées, quatre étapes COGITATE et catalogue de 78 dossiers/544 intervalles. Dépendance CerebrA réelle, horloge pédagogique, preuves et nettoyage préservés. 152 tests Node, suites régionales et test classique combiné passent. Détails dans `BODY_DOCUMENTARY_WORKSPACES_2026-10-29.md`.


## Os d’avatar et carte documentaire régionale

208 objets vérifiés, recette graphique historique et poses compatibles, chargement budgété, rendu/restauration et destruction. Carte 2D/3D et fiches sur le même moteur : repères résidents qualifiés, frontières conservées, buffers de ligne stables et libération. 154 tests Node ; suites ciblées ordinateur/mobile et classique passent après vérification isolée. Délais précédents conservés sans correction de cause revendiquée. Détails dans `BODY_AVATAR_DOCUMENTARY_GRAPH_2026-10-29.md`.


## Accessoires partagés et repos réel du rendu

22 objets graphiques historiques réutilisés, option explicite sans horloge ni lien biologique ; empreinte géométrique inchangée et destruction unique testées. Boucle de demande d’images découverte dans le callback documentaire corrigée, arrêt réel vérifié au repos. 156 tests Node et parcours ciblés ordinateur/mobile passent. Détails dans `BODY_ACTIVITY_PROPS_IDLE_2026-10-29.md` ; cette correction ne prouve pas la résolution des délais de démarrage.


## Groupes HRA et atelier par pièces

Les 14 surfaces cardiaques et les régions documentaires HRA qualifiées sont raccordées au masque échantillonné. Comparaisons source droite/gauche, poses manuelles, reprise explicite et suivi du repère de présentation historique complètent l’atelier par pièces sous 4 Mio. Buffers des courbes conservés en place ; diagnostic de module absent ou tardif sans retry automatique. 165 tests Node et suites ciblées passent ; les inconnues physiques, la cause intermittente et la vue globale monolithique restent distinctes. Voir `BODY_GROUPS_WORKBENCH_2026-10-29.md`.

## Annulation pendant les digests

Deux défauts reproduits et corrigés dans les lecteurs HRA/références : une annulation pendant SHA256 arrête maintenant toute continuation après le digest, y compris avant le retour du bloc. Six frontières couvertes sur les véritables sources ; 167 tests Node et parcours navigateur ciblés passent. Aucun changement des données source ; aucune correction de cause du délai intermittent revendiquée. Voir `BODY_DIGEST_CANCELLATION_2026-10-29.md`.

## Reprise des catalogues et des pages

Catalogue du squelette : annulation, délai, erreur réseau et départ avant réception disposent d'une reprise explicite sans WebGL. Rendu des quatre vues HRA/références/squelette/DB : callback annulé avant destruction et en page masquée, puis rendu possible après rechargement volontaire. Deux suites navigateur nouvelles et configuration CI étendue. Les erreurs de chargement de modules restent une limite ; traces enrichies, sans retry automatique. Voir `BODY_LIFECYCLE_RECOVERY_2026-10-29.md` et les reçus locaux de la passe.

## Gestes des vues statiques et transferts interrompus

Squelette et revue DB : pincement sans rotation, clavier et annulation complète du geste ; sélection multiple accidentelle reproduite puis corrigée sur un triangle source. Journal des copies interrompues avec chemin et exception, sans supposer une cause. 174 tests Node, 24 Python et neuf suites navigateur ciblées passent. Les données source et les anciens reçus restent intacts. Voir `BODY_STATIC_INPUT_2026-10-29.md`.
