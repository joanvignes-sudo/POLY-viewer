# POLY — trois dossiers humains approfondis

Commencer par **SYNTHESE.md**, puis les dossiers 01, 02 et 03.

Ce supplément contient les résultats documentaires, les questions restantes, un plan fixé avant acquisition des séries, deux petits objets numériques Emo-FilM réels avec leurs métadonnées, un inventaire et des contrôles reproductibles. Il ne modifie aucun lecteur existant.

Vérifier le pilote depuis ce dossier : `python scripts/verifier_pilote.py` (Python et NumPy). Le script relit les objets fournis, contrôle leurs empreintes et conventions et compare les résultats gelés, sans accès réseau ni écriture des originaux. Il conserve explicitement la réserve d’origine temporelle.

Vérifier la livraison : `python scripts/verifier_livraison.py` (bibliothèque standard). Les articles, suppléments et scripts auteur complets restent dans le dossier de travail ; leurs empreintes sont consignées et leurs sources reliées. Le code auteur n’est pas redistribué ni exécuté ici. Les données numériques et métadonnées du pilote sont issues de jeux déclarés CC0 dans leurs dataset_description.json.

Les deux objets acquis via S3 ont exactement les tailles et SHA256 des pointeurs Git-annex aux commits indiqués. Les objets S3 eux-mêmes n’étant pas versionnés dans l’URL, cette concordance est indispensable pour les rattacher aux instantanés.

Les faits publiés, nos contrôles de fichiers, nos interprétations et les points ouverts sont distingués. Pas de nouvelle estimation d’effet, aucune validation scientifique nouvelle et aucun nouveau délai biologique. Les figures de l’article et la vidéo supplémentaire Inman n’ont pas fait l’objet d’un examen visuel dans ce supplément.
