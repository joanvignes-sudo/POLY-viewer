# POLY v0.89 — les preuves humaines au premier plan

11 octobre 2026.

## Ce qui est livré

L’atlas s’ouvre sur les données humaines. Un filtre distingue Humain, Animal, Population/questionnaires, Multi-préparations, Préparation cellulaire et Non précisé. Les preuves portent leur périmètre. Les catégories s’appuient sur les contextes explicites du registre : elles ne constituent pas une certification de toutes les sources historiques.

Le bilan ciblé couvre cinq dossiers expérimentaux : CO₂ (S16), isoprotérénol (S21), respiration intracrânienne (S18), neurochimie striatale pendant une tâche (S24) et cycle cardiaque avec détection de visages (H03). Huit fiches distinguent protocoles, sous-groupes, accès et limites. BG/AM partagées entre S16/S21 sont reliées ; les témoins S21 ne sont pas additionnés sans correspondance. Les cinq conditions S18 sont des sous-ensembles d’une cohorte de neuf personnes.

28 fiches humaines nouvelles conservent passages, lignes et empreintes. Deux vues de mesure sont ajoutées : respiration/iEEG → cohérence et cycle cardiaque → visages masqués → détection/jugement. L’ensemble atteint 43 parcours, dont 15 explicitement humains, 276 maillons et 203 raccords documentaires. Les vues ne sont pas un décompte de découvertes indépendantes. Six paramètres instrumentaux ou temporels supplémentaires portent le total à 38 ; aucun ne devient une latence biologique par sa simple présence.

## Une étude humaine et des données effectivement acquises

Ozturk, McFadyen et Azevedo, 2025, « Cardiac Signals Facilitate the Breakthrough to Awareness of Emotional Stimuli », DOI [10.1111/psyp.70168](https://doi.org/10.1111/psyp.70168). Article primaire intégral XML et texte archivés ; tableau et script auteur acquis depuis [OSF f6btp](https://osf.io/f6btp/).

L’article décrit 60 personnes analysées. Le tableau contient 9 600 lignes, 60 codes, 160 essais chacun, quatre conditions de 40 essais par personne, avec clés personne × essai uniques. Le filtre T_error < 1 du script conserve 9 435 lignes ; son filtre supplémentaire rt > 0 conserve 8 505 lignes. Ce contrôle porte sur le contenu et les filtres, pas sur une reproduction des modèles mixtes.

Écarts conservés : 165 essais T_error=1 dans le dépôt contre 207 annoncés dans l’article ; correspondance entre RT manquants et essais sans appui à préciser ; note de modification de phase diastolique après un pilote ; confiance observée de 0 à 5 alors que l’échelle décrite va de 0 à 6. Cette dernière absence de modalité ne prouve pas une erreur. Aucune correction de données ni exclusion supplémentaire n’a été supposée.

Les résultats sur le temps de détection sont attribués aux auteurs. Les résultats non significatifs sur exactitude, confiance, sensibilité et biais sont conservés. Identifier un visage de peur ne mesure pas une peur ressentie. L’étude ne comporte pas d’enregistrement cérébral et ne démontre pas la voie cœur–insula du dossier souris.

## Corpus et ressources

L’inventaire conserve 249 entrées. La recherche couvre 218 documents : rapports, textes primaires et script d’analyse restent distincts. Le repérage lexical des mentions humain/animal/questionnaires facilite la navigation ; il ne permet pas à lui seul de compter des études ou des cohortes.

31 références internationales antérieures sont rendues accessibles depuis l’accueil humain, avec état de la collecte et nature des fichiers. Les empreintes de leurs 91 fichiers acquis ont été vérifiées localement. CASE et KEmoCon comportent à ce stade de la documentation ou des métadonnées ; une notice de dépôt n’est pas présentée comme des signaux disponibles dans POLY. Deux préparations expérimentales restent à identifier avant leur attribution à l’humain. Les enquêtes de population et cartes spatiales restent séparées des expériences individuelles.

Deux pistes complémentaires ont été repérées : Zelano 2016, DOI 10.1523/JNEUROSCI.2586-16.2016 ; Garfinkel 2014, DOI 10.1523/JNEUROSCI.3507-13.2014. Leur acquisition locale intégrale n’a pas abouti dans cette passe. Elles ne sont pas comptées comme nouvelles études acquises ni transformées en parcours validés.

## Suite organisée

1. Résoudre le périmètre article–dépôt H03 et les notes du pilote avant de reproduire les modèles.
2. Compléter les sources humaines ciblées sur respiration nasale et phase cardiaque.
3. Retrouver les jointures personnes/visites/essais/capteurs CO₂–isoprotérénol.
4. Examiner une ressource affect/physiologie réutilisable avec ses horloges, questionnaires et droits d’accès.
5. Reprendre le volet population/questionnaires selon une question précise, des items définis et des pondérations vérifiées. Aucune nouvelle estimation populationnelle n’est annoncée ici.

Les dossiers animaux ouverts restent dans la file de recherche. Les références historiques et la baseline publique v0.22 sont conservées. Le dépouillement intégral et les quatre axes scientifiques ne sont pas déclarés terminés.

Registres : REGISTRE_HUMAIN_v0.89.json ; EXTRACTIONS_HUMAINES_v0.89.json ; AUDIT_DONNEES_H03.json ; RESSOURCES_HUMAINES_ET_POPULATION_v0.89.json ; PLAN_ET_COUVERTURE_v0.89.json. Validation et sauvegarde : VERIFICATION_v0.89.json, MANIFESTE.json et SAUVEGARDE.json.
