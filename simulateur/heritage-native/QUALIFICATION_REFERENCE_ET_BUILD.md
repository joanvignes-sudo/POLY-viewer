# Références anatomiques, connectivité et préparation Pulse

2026-10-17 — phase 1, contrôle documentaire et adaptateurs de référence hors ligne. Aucun moteur physiologique exécuté.

## Résultat concret

Le [dossier de références résolues](ANATOMIE_CONNECTIVITE_QUALIFIEE.json) relie un objet HRA de production et une chaîne ApiNATOMY à leurs identifiants, versions, licences, empreintes et pointeurs exacts. L'[adaptateur de référence](../../tools/organisme_entier/reference_adapter.py) vérifie les octets et résout ces pointeurs sans écrire dans les sources et sans inventer une identité entre objets. La [paire de releases](CONNECTIVITE_RELEASE.json) et la [recette patient/build Pulse](PULSE_PATIENT_BUILD_CANDIDAT.json) complètent la préparation.

## HRA : erreur de raccourci résolue

Le raccourci `lod.humanatlas.io/ref-organ/heart-female/v1.1` a renvoyé 404 lors de l'inspection. Les métadonnées de production sont toutefois accessibles à [cette adresse versionnée](https://cdn.humanatlas.io/digital-objects/ref-organ/heart-female/v1.1/metadata.json). Elles déclarent une distribution [graph.json](https://cdn.humanatlas.io/digital-objects/ref-organ/heart-female/v1.1/graph.json) et une table `crosswalk.csv`, toutes deux récupérées et empreintées. La source staging précédemment trouvée n'est plus utilisée comme preuve de disponibilité de production.

Version : v1.1, cœur féminin provenant du Visible Human Female. Le graphe et les métadonnées déclarent CC BY 4.0. Attribution : Kristen Browne, HuBMAP, 3D Reference Organ for Heart, Female v1.1 ; lien de source et licence conservés. Le DOI déclaré reste conservé comme métadonnée d'origine ; son échec de résolution est inscrit dans l'historique, pas corrigé silencieusement.

L'objet primaire représente UBERON:0000948. Ses dimensions sont en millimètres ; elles ne sont pas des coordonnées. Le graphe contient un placement de l'objet local et un placement vers le repère VHFemale. L'index conserve les identifiants des placements et leurs pointeurs ; aucune transformation vers POLY n'est appliquée. Avant une composition de matrices, il faudra vérifier axes, orientation, ordre des rotations et convention des transformations dans les spécifications natives. Le maillage GLB n'a pas été téléchargé.

## ApiNATOMY et SCKAN : paire publiée

ApiNATOMY 0.0.4 est épinglé au commit `4bc5b8ef658ffb2f150c0d27e79b0a55ffe9d69e`, confirmé par le tag Git distant. Le [record Zenodo 17127951](https://zenodo.org/records/17127951) déclare CC BY 4.0 pour cette version et indique explicitement sa correspondance avec SCKAN 2025-09-14. Le tag SCKAN est épinglé au commit `3958dd4d3ca679a1187e483a3f1c6bbad334ce10` ; le LICENSE du dépôt NIF à ce tag est CC BY 4.0. Les ontologies importées et les publications citées conservent leurs propres notices.

Le modèle sélectionné est `ard-arm-cardiac`, décrit par son README comme principalement porcin. Auteurs du modèle : Bernard de Bono, Monique Surles-Zeigler, Thomas H Gillespie et Jeffrey Ardell. La chaîne source `ac-sn-med_11`, à `/chains/127`, porte des références d'hébergement vers A73 (ganglion nodose), A69 (medulla) et A72 (NTS), avec des pointeurs résolus dans le même fichier. Les identifiants et libellés originaux, y compris leurs éventuelles erreurs typographiques, sont conservés.

Cela fournit un trajet structurel documenté par le modèle. Cela ne démontre ni activation, ni latence, ni identité avec le sujet souris de C13. La publication PMID:27783854 est une référence déclarée du modèle ; son existence dans le catalogue n'est pas une vérification primaire de chaque segment. Les racines/feuilles du modèle ne sont pas transformées en neurones individuels observés. Aucune géométrie illustrative ni longueur d'affichage n'est traitée comme mesure anatomique.

Les archives SCKAN représentent environ 161 à 621 Mo selon la distribution. Le registre conserve leurs URL, tailles et SHA-256 déclarés par GitHub, avec le statut `REMOTE_DECLARED_NOT_LOCALLY_VERIFIED`. Aucune archive n'a été téléchargée ou chargée ; l'équivalence de la chaîne source avec le graphe compilé reste donc à contrôler au moment d'une intégration SCKAN réelle.

## Pulse : patient proposé et construction préparée

La proposition `POLY-REFERENCE-FEMALE-v0.1` est une configuration synthétique originale : nom et sexe sont explicités, aucune condition ajoutée, bornes du moteur actives. Les autres paramètres restent les valeurs par défaut calculées par le moteur, à capturer après initialisation avec unités et provenance. Aucune valeur physiologique arbitraire n'est présentée comme mesure ; aucun état patient tiers n'est copié. Le choix féminin n'établit aucune identité de sujet avec l'objet HRA.

Le tutoriel `HowTo-CreateAPatient.cpp` justifie l'utilisation de l'API patient avec des valeurs par défaut, mais contient aussi un exemple de condition ARDS. Cette condition ne fait pas partie du candidat POLY. Le schéma Engine.proto confirme le choix exclusif Patient ou PatientFile et l'option DisableBounds ; celle-ci reste fausse.

Le CMakeLists.txt épinglé exige CMake 3.31, alors que le README mentionne encore 3.12. Le contrat retient l'exigence du fichier de construction. Correction lors du build de phase 2 : le README mentionne C++17, mais les lignes 3–4 du CMakeLists.txt imposent C++20, effectivement utilisé. Les fichiers de dépendances déclarent Eigen 5.0.1, Abseil 20260526.0, Protobuf 35.0 par défaut et pybind11 3.0.4 avec l'API Python. Leurs empreintes d'archives déclarées sont consignées ; leur état à la sortie de phase 1 était « non téléchargées/non construites ».

Point pratique : désactiver Java ou Python désactive la génération des données dans le superbuild consulté. Une construction limitée à l'API C++ nécessite donc quand même des données d'exécution générées par une source compatible et épinglée. Ne pas assimiler un exécutable compilé à un environnement physiologique prêt.

Contrôle local en lecture seule : Java présent dans PATH ; CMake, compilateur C++ et javac non trouvés dans PATH lors de ce contrôle. Cela ne prouve pas leur absence de tous les disques. Aucune installation effectuée. Une future construction devra utiliser un environnement dédié, préserver le runtime Codex et consigner binaires, données, licences/NOTICE et valeurs initiales réellement résolues.

## Reproduire les contrôles

Les trois entrées requises sont décrites dans [REFERENCES_VERROUILLEES.json](REFERENCES_VERROUILLEES.json). Les noms locaux attendus sont indiqués par `local_input_filename`. Les copies sources restent dans le cache de travail, sans ajout au dépôt.

```text
python -m unittest discover -s tools/organisme_entier -p "test_*.py" -v
python tools/organisme_entier/qualify_references.py --source-dir SOURCE_CACHE --check
python tools/organisme_entier/check.py
```

Le vérificateur refuse source modifiée, licence non qualifiée, version divergente, identifiant natif incorrect, pointeur absent ou ambigu. La génération vérifie aussi que le graphe HRA est une distribution déclarée par les métadonnées et que chaque hébergement de la chaîne ApiNATOMY se résout dans le même artefact. Les sources ne sont jamais modifiées et les enveloppes produites n'autorisent aucune promotion scientifique ou liaison dynamique.

## Point de sortie

Les références minimales sont maintenant sélectionnées et qualifiées au niveau documentaire. Les blocages restants sont nommés : construction native et données Pulse, initialisation du patient, validation numérique/physiologique, alignements expérimentaux C13, composition des repères anatomiques et comparaison avec le graphe SCKAN compilé. Ces travaux appartiennent aux étapes suivantes ; ils ne sont pas maquillés en succès de phase 1.
