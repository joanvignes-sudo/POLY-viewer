# POLY — Réception du profil global de références (29 octobre 2026)

## Périmètre et conservation
La branche locale `feat/regional-body-bridge-20261028` prolonge le commit `7586d7e`. Les six modifications suivies et quatre fichiers nouveaux de la passation étaient déjà présents avant cette réception : aucune restauration du patch WIP, aucun remplacement du dépôt, aucun push ou déploiement.

L'entrée `anatomy.html` distingue le lecteur local `reference-region-lab.html` et le profil global volontaire `reference-region-lab.html?scope=whole`. Le catalogue n'initialise pas WebGL ni les surfaces. Le lecteur local conserve 4 Mio bruts et 16 pièces. Le profil global affiche initialement 4 Mio et n'accepte les 526 pièces / 46 blocs / 74 469 464 octets bruts qu'après sélection explicite de 96 Mio. Les copies d'affichage, temporaires, métadonnées et ressources GPU ne sont pas comprises dans cette limite.

Le profil global est une réunion graphique des sources vérifiées, pas un recalage anatomique individuel. Coordonnées, identités, sources et empreintes restent inchangées. La scène précédente est conservée lors des refus avant transfert, annulations et corruptions ; une réduction du budget sous la résidence courante libère cette sélection. Les marque-pages `poly.reference-whole-view.v1` sont séparés des marque-pages locaux et une reprise globale exige de nouveau le budget explicite.

## Vérifications de cette reprise
- Suite Node complète avec `POLY_CHUNKS_ROOT`, `POLY_REFERENCE_CHUNKS_ROOT` et `POLY_SKELETON_CHUNKS_ROOT` : **178/178 réussis**, aucun échec. Log hors dépôt : `work/POLY_NODE_FULL_REPRISE_20261029.log`.
- Python `unittest discover` : **24/24 réussis**, aucun échec. Log : `work/POLY_PYTHON_FULL_REPRISE_20261029.log`.
- Sept suites navigateur lancées sur le serveur local 8128 : **cinq réussies**, à savoir `reference-interactions`, `reference-workbench`, `reference-startup`, `reference-whole`, `body-light`. Log : `work/POLY_BROWSER_REPRISE_20261029.log`.
- Le profil global navigateur confirme, sur ordinateur, 526 maillages / 46 blocs, refus sans I/O, conservation après annulation et corruption, modes source et illustratif, sauvegarde isolée, reprise sous budget, perte de contexte et absence de téléchargement du monolithe. Le profil local demeure borné sur mobile émulé. Reçu antérieur : `outputs/POLY_REFERENCE_WHOLE_RESULTS_20261029.json`.
- La suite `reference-region-browser` a échoué sur une attente du catalogue dans le scénario de bloc corrompu (page cachée à 30 s) ; `attachments-browser` a échoué sur le classique mobile, avec `net::ERR_CONNECTION_REFUSED` pour `enteric-inhibition.js` au port 8128. Ce sont des **échecs conservés**, non des validations. Le serveur a répondu 200 avant puis après l'incident ; la cause intermittente n'est pas établie.
- Le scénario d'échec de `reference-region-browser` possède désormais une capture supplémentaire des diagnostics de module/références sur une prochaine reproduction. L'amélioration de diagnostic n'est pas une correction de la cause.

## Points restant ouverts
1. Diagnostiquer la cause réelle des défauts intermittents d'import, de catalogue et des refus ponctuels de connexion ; capturer le contexte HTTP, console, trace de module et charge serveur, sans retry silencieux ni attribution infondée.
2. Ne pas déclarer de parité exhaustive avec toutes les commandes du monolithe classique : les vues et fonctionnalités historiques non testées demeurent à comparer par cas concret.
3. Mesurer la mémoire totale, le GPU, la fluidité, la batterie et la température sur un téléphone physique ; seule l'émulation navigateur est disponible.
4. Conserver ouverts les recalages individuels, insertions et mesures biologiques non démontrées ; le travail lactate/Pellerin demeure un chantier scientifique séparé.
5. Aucune fusion, publication, livraison sur site public ou transfert des blocs candidats n'est autorisé sans accord.

Ce bilan distingue la réception informatique du profil global des limites expérimentales et des régressions historiques encore intermittentes.

## Réépreuve après l'incident

La suite `reference-region-browser.cjs` a été réexécutée après l'ajout de la capture de diagnostic et s'est terminée avec code 0. Log `work/POLY_REFERENCE_REGION_RETRY_DIAGNOSTIC_20261029.log`. Ce succès ultérieur ne démontre pas la disparition du premier délai ni la réparation du refus de connexion observé sur le classique mobile.
