# Sources externes et registre de qualification

Consultées le 2026-10-17. Liens de découverte/documentation, pas dépendances installées ni attestations de compatibilité. Versions d'artefacts à épingler en P1-04 avant usage. Aucune donnée externe incorporée dans cette livraison.

Mise à jour de phase 1 : [registre des candidats épinglés](ARTEFACTS_EXTERNES.json), [sources Pulse vérifiées](PULSE_SOURCES.json), [revue des limites et licences](REVUE_PHASE1.md). Les licences du code ne qualifient pas automatiquement les graphes, patients, modèles et images. Les entrées encore non qualifiées sont bloquées pour intégration.

Nouvelle qualification : [références de production, licences de release et préparation du build](QUALIFICATION_REFERENCE_ET_BUILD.md), avec [empreintes des sources consultées](QUALIFICATION_P1_SOURCES.json). Cette mise à jour résout les blocages HRA et ApiNATOMY décrits dans la revue précédente, sans effacer les échecs historiques ni déclarer une validation dynamique.

| Couche | Source primaire consultée | Usage proposé et qualification |
| --- | --- | --- |
| Pulse | [Documentation officielle](https://pulse.kitware.com/_docs.html), [projet](https://pulse.kitware.com/index.html), [tissus](https://pulse.kitware.com/_tissue_methodology.html) | Patient agrégé, avance temporelle, actions et sorties. Le site annonce Apache-2.0 ; vérifier LICENSE/NOTICE et dépendances de la version choisie. Les méthodes exposent leurs sources et limites ; ne pas étendre leur validation à tous les comportements neuronaux. |
| SPARC/SCKAN | [Présentation mainteneurs](https://github.com/SciCrunch/sparc-curation/blob/master/docs/sckan/overview.org) | Graphe de métadonnées, ontologies et connectivité. Licence de chaque release/graphe et de ses sources à qualifier ; celle d'un outil ne couvre pas toutes les données. Aucun délai dynamique déduit d'un trajet. |
| ApiNATOMY | [Dépôt de modèles](https://github.com/open-physiology/apinatomy-models) | Modèles de routes structurales ; séparer modèle publié et travail en cours. Aucun droit uniforme conclu à partir de la seule visibilité du dépôt ; qualifier release et modèle sélectionnés. |
| HRA | [Portail](https://humanatlas.io/), [collection API v2.1](https://cdn.humanatlas.io/hra-kg--staging/collection/hra-api/v2.1/) | Anatomie et identifiants ; cette collection indique CC BY 4.0, sans généralisation automatique à chaque asset. Choisir un objet publié versionné, vérifier licence/attribution, repère et transformation. Le lien staging sert à la documentation, pas de référence de production. |
| OpenSim | [Dépôt officiel](https://github.com/opensim-org/opensim-core) | Mouvement ; code Apache-2.0, composants tiers et modèles ont leurs conditions propres. Sélectionner modèle musculaire et conditions de validité avant couplage. |
| CellML / Physiome | [Projet](https://www.cellml.org/), [FAQ](https://www.cellml.org/getting-started/faq/) | Format de modèles mathématiques et dépôt ; la FAQ précise que le projet ne possède pas le copyright des modèles. Licence, auteur, exposition et révision à vérifier par modèle ; aucun droit déduit du format. |
| BioModels | [EMBL-EBI : ressource et curation](https://www.ebi.ac.uk/training/online/courses/biomodels-quick-tour/what-is-biomodels/) | Modèles quantitatifs sous CC0 selon la présentation de la ressource ; vérifier notice et fichiers de l'objet retenu, conserver citation, paramètres et statut de curation. Curation ≠ validité de tout couplage. |

Fiche requise avant intégration : nom, rôle, URI immuable, release/commit, digest, taille/portion nécessaire, licence code, licence modèle/données, licence images, NOTICE, attribution, contraintes d'accès/redistribution, contexte biologique, validation d'origine et limites. Une licence inconnue bloque la copie/exécution du candidat, pas la documentation de son existence.

Le dépôt POLY inspecté ne déclare pas de licence globale reconnue dans les métadonnées GitHub. Ne pas attribuer une licence générale au canon dans ce chantier.
