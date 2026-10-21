# Phase 2 — Pulse construit et première initialisation exécutée

2026-10-17. Résultat : **construction et initialisation réussies ; critère strict de continuité d'état encore en échec**. Toutes les valeurs de ce dossier sont des sorties **SIMULATED**, sans validation physiologique par POLY.

[Résultat machine](PHASE2_RESULTATS.json), [reçu de construction](PHASE2_BUILD_RECEIPT.json), [outils portables épinglés](PHASE2_TOOLCHAIN.json), [protocole initial](PHASE2_PROTOCOLE.json), [résultats conservés](results/phase2-init-2026-10-17/README.md).

## Ce qui a réellement été exécuté

Pulse 4.4.0 au commit `60c4473912b047500bcbc396eceec7588c48fad4` a été compilé localement avec LLVM-MinGW, CMake 3.31.10 et Ninja, en Release et C++20. Le JDK portable permet la génération des données. Tous les outils, sources, binaires et données sont confinés au dossier `work/p2`, à côté du checkout POLY ; aucune installation globale ou modification du runtime Codex.

Les archives des quatre outils portables ont été vérifiées par SHA-256 contre les digests de leurs releases. Les licences/NOTICE livrées avec les outils et dépendances restent conservées localement ; leurs empreintes et celles des 22 JAR Java sont dans le reçu. Cela documente ce build local et ne prétend pas constituer un audit juridique exhaustif de toute redistribution future.

L'option Protobuf 21.12 proposée par l'amont échoue ici à la configuration parce que le superbuild référence une cible absl non créée. Cet essai est conservé ; le build réussi utilise le défaut Protobuf 35.0. La compilation non modifiée échoue ensuite sur `localtime_r` avec Windows/LLVM-MinGW. Le seul correctif appliqué à la source Pulse sélectionne `localtime_s` sur `_WIN32` dans le fichier d'information de construction. [Correctif](../../tools/pulse_probe/patches/windows-localtime.patch), original et empreinte modifiée sont documentés. Aucune équation, régulation ou donnée physiologique amont n'est modifiée. Le binaire est identifié comme **commit amont + ce correctif**, pas comme un build amont intact.

Les API C++ et Java sont construites ; l'API Python est désactivée. La génération automatique Pulse_GEN_DATA est désactivée, puis le générateur Java amont DataSetReader est appelé explicitement dans le dossier d'installation isolé. Il produit les 91 JSON nécessaires (substances, patients de référence, environnement, nutrition, ECG, stabilisation). Les requêtes de validation supplémentaires générées par Python et les grandes archives de baselines V&V ne sont pas produites/téléchargées. Le manifeste des données et l'empreinte du workbook amont sont conservés.

## Patiente de référence et baseline

Le programme POLY crée `POLY-REFERENCE-FEMALE-v0.1` par l'API native : sexe Female, aucune condition ajoutée et contrôles de bornes actifs. Les autres valeurs sont résolues par le moteur et enregistrées sans les présenter comme mesures humaines. Exemples de défauts obtenus : âge 44 ans, taille 163 cm, poids environ 57,787 kg, fréquence cardiaque de référence 72/min.

Le journal amont annonce la stabilisation après 281,36 secondes simulées d'initialisation, puis le temps du run revient à zéro. Cela décrit la procédure du moteur, sans validation indépendante par POLY. Le programme enregistre ensuite 31 échantillons à une seconde demandée d'intervalle, six sorties finies et un pas natif de 0,02 seconde. Le dernier temps lu est 29,99999999999945 s. Aucune ligne native ERROR/FATAL dans ce run. Le patient résolu, l'état initial et le checkpoint sont sauvegardés et empreintés.

## Résultat de continuité : échec conservé

Le protocole fixé avant exécution compare une continuation en mémoire de 10 secondes à une continuation de 10 secondes après rechargement du checkpoint. Critère : `abs(a-b) <= 1e-9 * max(1,abs(a))`, sur le temps et les six sorties.

Le temps et cinq sorties sont identiques à la précision double rapportée. La fréquence cardiaque est :

| Chemin | Résultat à environ 40 s |
| --- | ---: |
| Continuation en mémoire | 71,98900029141691/min |
| Rechargement puis continuation | 71,98899873611899/min |
| Écart absolu | 0,000001555297927779975/min |
| Tolérance pré-déclarée | 0,00000007198900029141692/min |

L'écart est petit mais **échoue au critère déclaré**. Le programme natif renvoie 4 et l'analyse indépendante produit `FAIL_ENGINE_STATE_CONTINUITY`. La tolérance n'a pas été relâchée après observation et aucun changement de modèle n'a été tenté pour faire passer ce test.

## Diagnostic supplémentaire, explicitement post hoc

Après cet échec, un [protocole distinct](PHASE2_REPLAY_DIAGNOSTIC_PROTOCOL.json) a été fixé et exécuté : deux moteurs frais chargent exactement le même checkpoint, puis avancent de 10 secondes. Leurs temps et six sorties sont identiques à la précision rapportée. Ce résultat montre la reproductibilité de ces deux chemins rechargés, sans effacer la différence entre continuation en mémoire et rechargement. À ce stade initial, la cause n'était pas établie. Le [diagnostic ultérieur](PHASE2_DIAGNOSTIC_ETAT.md) identifie deux omissions de sérialisation et leur chronologie compatible ; l'essai causal correctif reste à faire.

## Reproduire dans un dossier isolé

Depuis la racine du dépôt, avec Python 3.10+ et Git accessibles ; adapter RUNTIME et GIT_EXE. La préparation télécharge les outils épinglés et le checkout Pulse, puis applique uniquement le correctif déclaré. Les dossiers sources modifiés autrement sont refusés.

```text
python tools/pulse_probe/prepare_runtime.py --runtime-root RUNTIME --git GIT_EXE
python tools/pulse_probe/native_build.py --runtime-root RUNTIME --git GIT_EXE configure
python tools/pulse_probe/native_build.py --runtime-root RUNTIME build
python tools/pulse_probe/native_build.py --runtime-root RUNTIME data
python tools/pulse_probe/native_build.py --runtime-root RUNTIME probe-configure
python tools/pulse_probe/native_build.py --runtime-root RUNTIME probe-build
python tools/pulse_probe/native_build.py --runtime-root RUNTIME probe-run
python tools/pulse_probe/analyze.py RUN_OUTPUT_DIRECTORY
```

`data` régénère et nettoie les seuls dossiers générés de l'installation isolée, après contrôle de leurs chemins résolus. Chaque run utilise un nouveau dossier horodaté. Un rapport en échec conserve un code de sortie non nul. Les 33 tests Python actuels utilisent des fixtures synthétiques et vérifient aussi qu'un échec numérique cohérent produit un rapport d'échec. Ils ne remplacent pas le test natif ci-dessus.

## Reprise

Build, données et initialisation sont acquis pour cet environnement et ce patient. La condition de continuité reste ouverte : caractériser la différence de sauvegarde/rechargement, identifier un éventuel état interne non reconstruit à l'identique, puis définir la stratégie de rollback. Pas de correction d'équation ni de modification rétroactive de tolérance pour masquer l'écart.

Le scénario A repos→exercice n'a pas été lancé ; B et C ne sont pas engagés. Une étude de convergence du solveur et la validation physiologique demeurent distinctes de l'initialisation et de la répétition technique. Canon, main et PR #1 sont préservés ; aucun déploiement.
