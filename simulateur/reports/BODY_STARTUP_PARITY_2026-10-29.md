# POLY — Capacité du serveur local et contrôle de parité historique (29 octobre 2026)

## Séparation des constats
- Un échec précédent a signalé `ERR_CONNECTION_REFUSED` sur `enteric-inhibition.js` dans le parcours classique mobile émulé ; un autre a laissé le catalogue de référence inactif jusqu'à l'expiration du délai. Ces deux observations restent archivées, sans cause démontrée.
- Le serveur de qualification `serve_body_region_preview.py` utilisait la file de connexions standard de cinq places de `ThreadingHTTPServer`. Un banc indépendant, sous charge synchronisée de 48 requêtes locales, a mesuré 48 réussites sur 48 dans les deux cas ; médiane 1000,25 ms (file 5) contre 25,63 ms (file 128), maximum 1505,82 contre 43,91 ms. **Ce test ne reproduit pas un refus TCP et ne prouve pas la cause de la panne historique.**
- `PreviewHTTPServer` porte désormais `request_queue_size=128`. Le serveur reste lié à `127.0.0.1`, les règles de publication et les racines de blocs sont inchangées. Un test Python de la capacité de file est ajouté.

## Vérifications
- 25 tests Python de qualification : PASS après modification.
- Cinq suites navigateur sur une **nouvelle instance isolée 8130** : `module-startup-browser`, `reference-region-browser`, `body-startup-browser`, `body-regional-features-browser`, `attachments-browser` : PASS. Les ports utilisateur 8124/8128 ont été préservés. Ce n'est pas une reproduction contrôlée de l'incident initial.
- Nouvelle suite `classic-controls-parity-browser.cjs` : PASS sur ordinateur et mobile émulé après correction de ses hypothèses de scénario et de sélection, sans correction artificielle des données applicatives. Le script est ajouté à la configuration CI.
- Le classique présente 918 structures, dix interrupteurs de systèmes, une commande de peau testée aller/retour, un curseur de vitesse, onze scénarios, 38 entrées de tissu. L'avancement de dossier a été testé après choix d'un scénario documentaire (l'étape « suivante » est délibérément cachée dans le scénario `WALK`).
- Différence observée dans les deux vues : 74 surfaces osseuses visibles au départ puis 134 après décocher/recocher « squelette ». Le code classique réactive effectivement toutes les surfaces du système. Le rôle des 60 initialement masquées demande une analyse de couche et de contexte avant toute modification. Ne pas assimiler cette différence à une validation de recalage.
- L'ouverture de « suspensory ligament of lens R » affiche « Œil droit » dans l'intitulé sélectionné : la navigation peut ouvrir l'ensemble anatomique contenant le tissu, et non reprendre littéralement l'étiquette source. Le test conserve les deux valeurs pour vérification documentaire.

## Parité encore non démontrée
Le masquage global des dix systèmes, la peau du corps entier, la vitesse globale, le déroulement historique des dossiers et le rétablissement de l'univers classique ne sont pas identiques aux commandes régionales qui gèrent des résidents limités et des horloges séparées. L'atelier global de référence de 526 pièces est volontairement distinct (budget brut explicite de 96 Mio) et ne recale pas BodyParts3D avec le HRA.

Une égalité complète des comportements sur toutes les branches est **non vérifiée**. Les fonctions concrètement non identiques restent à comparer cas par cas, plutôt qu'à rebaptiser parité.

## Limites physiques et scientifiques
Aucune mesure sur téléphone Android physique ; ni FPS réel appareil, ni mémoire GPU, batterie ou température. Aucun recalage individuel ni métabolisme neuronal humain n'est calibré à partir de cette qualification logicielle. Pellerin : séparer les flux de lactate des sorties synaptiques, conserver P8/P11/P27/P28 et C6–C11 dans leur cadre expérimental, ne pas rouvrir la réserve Con-2/C3.

## Fichiers de preuve hors dépôt
`work/POLY_SERVER_BACKLOG_DIAG_20261029.json`, `work/POLY_PYTHON_BURST_HARDENING_20261029.log`, `work/POLY_STARTUP_REGRESSIONS_8130_20261029.log`, `work/POLY_CLASSIC_PARITY_BROWSER_20261029.log`. Bilan des quatre points : `outputs/POLY_CONTROLE_QUATRE_POINTS_20261029.md`.

Aucun push, fusion, publication, email ou automatisation.
