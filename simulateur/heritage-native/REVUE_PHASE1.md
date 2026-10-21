# Phase 1 — revue des interfaces et des raccords

2026-10-17. Examen statique des sources et des métadonnées ; aucun moteur exécuté.

Complément ultérieur : la [qualification des références et du build](QUALIFICATION_REFERENCE_ET_BUILD.md) résout la disponibilité HRA de production et la licence de release ApiNATOMY, puis fournit un adaptateur de référence hors ligne. Les constats ci-dessous décrivent le premier lot et restent conservés comme historique ; l'état courant est dans ETAT.json.

## Pulse : candidat concret

[Descripteur machine](PULSE_ADAPTER_CANDIDAT.json), [sources épinglées et empreintes](PULSE_SOURCES.json).

Version 4.4.0 confirmée dans CMakeLists.txt au commit `60c4473912b047500bcbc396eceec7588c48fad4`, également indiqué par la documentation générée le 29 septembre. La lecture de ce commit est reproductible ; HEAD du dépôt a déjà une autre valeur, raison de ne pas utiliser une branche mouvante. Les empreintes portent sur chaque fichier consulté, pas sur un binaire construit.

L'entrée retenue pour A est SEExercise.Intensity, fraction de l'effort maximal du patient dans [0,1]. Le schéma ne propose ici ni vitesse, ni puissance mécanique, ni MET. Une intensité nulle est valide et inactive selon IsActive du modèle d'action ; son effet de retrait effectif sera testé avec le moteur en phase 2. Le tutoriel à 0.06 fournit un exemple d'appel, pas une calibration pour POLY.

Six sorties candidates sont vérifiées dans les déclarations natives : HeartRate (1/min), MeanArterialPressure (mmHg), RespirationRate (1/min), TotalPulmonaryVentilation (L/min), CoreTemperature (degC), TotalMetabolicRate (W). Le futur adaptateur doit appeler les getters avec leurs unités natives, tester disponibilité et finitude et tracer la conversion éventuelle du nom d'unité (`degC` vers le type natif C). L'existence d'un getter ne prouve pas qu'une valeur est disponible pour chaque patient/run.

Propriété des variables : Pulse conserve seul les sorties physiologiques et ses régulations autonomes. Le contrôleur de scénario possède l'entrée d'exercice ; POLY conserve les preuves et correspondances. Aucun port de remplacement neuronal du baroréflexe n'est déclaré.

## Choix d'interface et pièges confirmés

Interface candidate : C++ PhysiologyEngine. ProcessAction et AdvanceModelTime renvoient bool dans le header épinglé. Le descripteur exige leur contrôle et la lecture de GetSimulationTime(s) après l'avance ; une durée demandée n'est pas un temps atteint démontré. GetTimeStep(s) doit être lu, pas supposé.

La documentation web de l'interface comporte encore des signatures d'avance de type void ; le header épinglé prévaut pour ce candidat. Dans l'enveloppe Python épinglée, process_action appelle process_actions sans retour ; process_actions n'expose pas l'accusé natif pour une liste non vide. Une absence d'exception ne permet donc pas d'affirmer que l'action a été acceptée.

Le wrapper Python accumule les fractions de pas dans _spare_time_s ; pull_data renvoie une liste mise en cache dont le premier élément est le temps, puis les résultats dans l'ordre des requêtes. Un checkpoint d'état moteur ne sérialise pas à lui seul ce reliquat du wrapper ni le journal du coordinateur. L'architecture ne promet donc pas de rollback complet avant un test explicite de toute la pile.

L'accès concurrent aux états/actions pendant une avance est exclu. Les appels doivent être sérialisés au niveau de l'adaptateur. Les sorties ou erreurs sont consignées avant d'autoriser la suite du scénario. Aucune gestion d'événement ou horloge de co-simulation n'est implémentée dans ce lot.

## Test B : schéma de brûlure clarifié

Le schéma épinglé contient ThermalBurnData avec une liste Wounds. Chaque plaie décrit Compartment, un seul mode SurfaceAreaFraction **ou** SurfaceArea et Severity. Les valeurs TotalBodySurfaceArea et TotalWeightedSeverity sont indiquées comme sorties calculées par le moteur : elles ne seront pas des paramètres utilisateur du contrat. L'étendue fractionnaire se rapporte à la surface corporelle totale dans le schéma. La prise en charge effective, les limites par compartiment et la validation du moteur restent à vérifier avant B ; aucun adaptateur de brûlure actif dans ce lot.

## C13 : qualification documentaire terminée pour l'artefact épinglé

[Audit par groupe](C13_QUALIFICATION.json) reproductible via `qualify_c13.py --c13 PATH --check`. Il conserve les identifiants d'étude, espèces et références d'origine, indexés sans recopier les mesures.

Les 10 groupes totalisent toujours 80 nœuds et 92 liens. Leurs références de dossier peuvent décrire plusieurs études ou préparations ; studyId n'est pas un identifiant natif d'expérience. Les qualifications automatiques du lecteur ne sont pas une validation scientifique. Les lacunes d'identité et d'horloge déjà signalées restent ouvertes. Aucun raccord C01–C12/C13 exact, transfert souris→humain ou latence inter-études n'est introduit.

Premier mapping anatomique proposé : P01-HEART vers la classe UBERON:0000948 (heart), en tant que candidat locatedIn. Le terme et la version d'ontologie annoncée par OLS ont été vérifiés. Il s'agit d'un lien à une classe anatomique, sans coordonnées, sans identité de sujet et sans raccord dynamique. Sa revue scientifique demeure à faire.

## Qualification des dépendances

[Registre machine](ARTEFACTS_EXTERNES.json) et [mappings candidats](MAPPINGS_CANDIDATS.json).

Pulse et OpenSim : licence du code vérifiée aux commits consultés ; build, dépendances et modèle/patient à qualifier séparément. SCKAN : documentation et licence MIT du dépôt de curation épinglées ; cela ne qualifie pas une release du graphe ni toutes ses sources. ApiNATOMY : dépôt épinglé, modèle et licence encore à sélectionner.

HRA : l'URI de production testée pour heart-female v1.1 renvoie 404, tandis que la page staging décrit un graphe avec licence CC BY 4.0. Ce résultat ne justifie pas l'utilisation d'un asset de production ; candidat bloqué et tentative consignée. CellML : exemple Hodgkin-Huxley épinglé (axone de calmar), licence d'artefact non établie dans cet examen ; aucun module neuronal humain retenu. BioModels : README du modèle MAPK BIOMD0000000010 épinglé, déclaration CC0 relevée ; c'est un exemple de métadonnées, pas une sélection biologique pour POLY.

Les échecs de résolution et licences inconnues sont conservés dans le registre. Aucun code tiers, modèle, atlas ou jeu de données n'est ajouté au dépôt ; seuls les liens, identifiants et empreintes utiles sont suivis.

## Sortie de lot et reprise

P1-02 terminé comme contrat candidat statiquement vérifié. P1-03 terminé comme audit des métadonnées désignées ; récupération des identités/horloges natives reste ouverte. P1-04 partiel : versions des sources candidates et premier mapping fournis ; graphes/modèles/repères et licences d'artefacts non qualifiés ne sont pas déclarés prêts.

La suite utile en phase 1 consiste à résoudre une référence HRA de production, choisir une release SCKAN/ApiNATOMY avec licence et trajet précis, puis fixer le patient Pulse et ses conditions d'utilisation. Une phase 2 nécessitera une décision de périmètre distincte conformément à la demande initiale ; ce lot n'installe et n'exécute aucun moteur.
