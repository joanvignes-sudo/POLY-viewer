# Correction expérimentale de la continuité O2

Le build isolé corrigé réussit les **360 comparaisons de reprise**, au seuil initial `abs(a-b) <= 1e-9 * max(1, abs(a))`. Le témoin en échoue 32. Les trajectoires continues des deux builds sont exactement identiques sur 4 542 points et neuf sorties. L'expérience confirme l'effet de l'omission O2 sur ce profil testé ; elle ne qualifie pas un rollback universel ni une simulation physiologique.

L'[échec original](PHASE2_BUILD_ET_INITIALISATION.md) et tous les résultats intermédiaires restent conservés. Résultat distinct : [PHASE2_O2_RESULTATS.json](PHASE2_O2_RESULTATS.json). Le moteur original n'a pas été remplacé.

## Correctif et revue

Base Pulse 4.4.0 au commit `60c4473912b047500bcbc396eceec7588c48fad4`, dans un worktree détaché et un build séparé sous `work/p2/o2-experiment`. Outils et dépendances épinglés déjà construits réutilisés. Seule la bibliothèque native nécessaire est reconstruite ; Java et Python désactivés dans ce build expérimental, données du témoin lues directement.

Le [patch expérimental](../../tools/pulse_probe/patches/o2-state-experimental.patch) comprend :

- Deux champs supplémentaires du message cardiovasculaire, tags 55 et 56 sans renumérotation : moyenne O2 du cycle précédent et moyenne courante avec somme/compteur. Le premier est `optional`, afin de distinguer absence et zéro explicite.
- Quatre affectations de sauvegarde/chargement des deux états, sans changer les équations ou paramètres du modèle.
- Deux précontrôles fichier/chaîne : refuser un état dépourvu de l'un des champs avant `PBState::Load`, sans inventer d'historique manquant.
- Préserver l'état d'initialisation lors des retours `false` de parsing/précontrôle, qui précèdent le chargement. Une exception au milieu d'un chargement reste hors de cette garantie.

Le correctif d'horodatage Windows antérieur est également appliqué. La revue des fichiers modifiés et les empreintes des équations inchangées figurent dans le [reçu](results/phase2-o2-2026-10-17/build_review_receipt.json). Il s'agit d'une modification locale expérimentale, pas d'une nouvelle release amont. Le hash/version Pulse seul ne distingue pas le moteur corrigé : utiliser aussi l'empreinte du patch et le [profil](PULSE_O2_PROFIL_EXPERIMENTAL.json).

## Comparaison pré-définie

Le [protocole](PHASE2_O2_EXPERIMENT_PROTOCOL.json) fixe quatre sauvegardes à 30,00 ; 30,02 ; 30,40 et 30,82 s. Chacune est rechargée dans le même moteur et dans un moteur frais, puis comparée à la continuation ininterrompue après 0 ; 0,02 ; 1 ; 10 et 60 s.

Les neuf sorties sont le temps, les six sorties initiales, l'O2 artériel moyen et le signal chémorécepteur sur HR. L'analyse indépendante vérifie l'exhaustivité de la matrice, l'horloge, les valeurs finies, les références de la trajectoire et les drapeaux natifs.

| Contrôle | Témoin | Build corrigé |
| --- | --- | --- |
| Comparaisons de reprise | 328/360 au seuil | **360/360 au seuil** |
| Différence entre trajectoires sans reprise | Référence | **0 sur neuf sorties et 4 542 points** |
| Code natif de la matrice | 4, échec attendu | **0** |
| Ancienne sauvegarde sans historique O2 | Acceptée par l'amont | Refusée, état et initialisation préservés |

Ce sont 360 comparaisons scalaires, pas 360 patients ou simulations indépendantes. Les deux chemins sont exécutés dans un même processus ; cela ne qualifie pas une reprise sur un autre processus, OS ou compilateur. Aucun exercice n'est réalisé.

## Refus et présence des données

Une sonde distincte teste l'absence de la moyenne O2, de la valeur précédente, des deux champs, puis la présence d'un zéro explicite. Les quatre cas passent par fichier et chaîne JSON. Pour chaque refus, tous les objets/valeurs de l'état JSON décodé sont exactement identiques avant/après, et `GetInitializationState()` est conservé. L'analyse Python recalcule ces égalités depuis les snapshots complets ; aucun seuil de tolérance n'est appliqué à cette comparaison.

Le zéro artificiel n'est utilisé que pour vérifier la présence d'un champ optionnel ; cet état n'est pas avancé ni présenté comme patient physiologique. Les anciens checkpoints sont rejetés : leur historique perdu ne peut pas être récupéré depuis le seul fichier. Une migration requiert une source d'historique supplémentaire qualifiée.

## Résultats intermédiaires et limites

Une première sonde témoin s'est interrompue par appel virtuel pur, alors qu'elle allouait un moteur frais inutilisé avant le chemin de reprise en place. La version suivante crée ce moteur seulement pour le chemin qui l'utilise et exécute la matrice complète. La cause du plantage n'est pas établie ; la coexistence arbitraire de moteurs reste non qualifiée. Le dossier interrompu et son journal sont conservés.

Le premier essai corrigé a réussi les 360 comparaisons numériques mais échoué au contrôle de chaîne d'état : la sonde réutilisait les tampons d'une écriture JSON qui ajoute au contenu et comparait aussi l'ordre des clés. Correction de la sonde : vider le tampon et comparer les objets JSON. Les snapshots de la garde ont été revérifiés indépendamment en Python, puis la matrice entièrement répétée. Le résultat négatif intermédiaire reste distinct et archivé ; aucune tolérance numérique modifiée.

Les erreurs de configuration rencontrées sont aussi conservées : chemins longs Git Windows, dépendance `protobuf_SRC`, séparateurs Windows dans l'export CMake et chemin du header généré `pulse_export.h`. Elles ont été corrigées dans la recette de construction, sans équation modifiée.

La validation reste limitée à une patiente synthétique, un outil de compilation, quatre points de sauvegarde et les sorties listées. Pas d'audit exhaustif de tous les états internes, de données cliniques, d'étude de convergence ou de validation scientifique. Les scénarios A/B/C ne sont pas lancés. **40 tests Python passent** pour les contrats/outils ; ils ne remplacent pas les essais natifs.

## Reproduire sans remplacer le témoin

Après la [préparation initiale](PHASE2_BUILD_ET_INITIALISATION.md), utiliser des chemins absolus pour RUNTIME, REPO et GIT. Créer une nouvelle destination ; ne pas écraser une expérience existante :

```text
GIT -c core.longpaths=true -C RUNTIME/src worktree add --detach RUNTIME/o2-experiment/src 60c4473912b047500bcbc396eceec7588c48fad4
GIT -C RUNTIME/o2-experiment/src apply REPO/tools/pulse_probe/patches/windows-localtime.patch REPO/tools/pulse_probe/patches/o2-state-experimental.patch
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME --git GIT configure
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME build
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME control-configure
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME control-build
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME --legacy-checkpoint LEGACY_CHECKPOINT control-run
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME probe-configure
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME probe-build
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME --legacy-checkpoint LEGACY_CHECKPOINT run
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME guard-build
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME --state PATCHED_RUN/checkpoint-1500.json guard-run
python tools/pulse_probe/analyze_o2_matrix.py CONTROL_RUN PATCHED_RUN OUTPUT_JSON --guard GUARD_RUN
```

`control-run` renvoie normalement 4 : poursuivre explicitement l'expérience attendue après conservation de son rapport. `--legacy-checkpoint` désigne un ancien checkpoint existant dans le runtime, dont l'historique O2 est absent. Sans cet argument, la recette utilise le dossier initial conservé `RUNTIME/run-initialization-20261017-130537/checkpoint.json`. Un fichier manquant ou extérieur au runtime est refusé. Les runs sont horodatés et les commandes sont journalisées. Le script ne prépare pas automatiquement le worktree ni n'applique de patch implicite.

## Reprise de l'architecture

Le profil corrigé est un candidat technique isolé. Avant intégration, l'adaptateur doit lier chaque checkpoint à son moteur/patch, son patient, ses données et son horloge via une enveloppe vérifiée ; contrôler cette enveloppe avant tout chargement ; puis qualifier la reprise dans un processus séparé et les erreurs de chargement. Le nom de version Pulse seul est insuffisant.

Une fois ce chemin qualifié, préparer les critères physiologiques et de convergence avant décision sur A. Ne pas convertir le résultat de continuité en preuve biologique ni promouvoir automatiquement ce build dans le produit. Canon, main, PR #1 et déploiement restent préservés.
