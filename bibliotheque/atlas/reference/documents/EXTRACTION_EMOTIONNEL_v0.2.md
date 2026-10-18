# POLY emotionnel — extraction contradictoire v0.2

4 octobre 2026. Travail hors canon, séparé du viewer stable v0.22. Cette passe lit les méthodes et légendes de trois études, vérifie l'erratum VTA, examine les points d'accès aux données et ouvre un échantillon de données LC. Elle n'est pas une réplication des résultats publiés.

## Ce qui change la prospective

Les trois études ne remplissent pas la même case de preuve. Le dossier cardiaque contient une manipulation corporelle et une intervention cérébrale ; le dossier VTA compare des calculs et manipule un circuit ; le dossier LC combine plusieurs modalités principalement observationnelles. Dans POLY, nous les enregistrons donc en branches distinctes. Les mécanismes génériques C02/C04 ne justifient toujours pas la concaténation de ces branches.

## S15 — cœur × contexte

Texte complet, méthodes et légendes lus via [le manuscrit archivé](https://pmc.ncbi.nlm.nih.gov/articles/PMC9995271/). Chez la souris, ChRmine ciblé aux cardiomyocytes permet un pacing intermittent : 900 bpm, impulsions de 10 ms, 500 ms ON / 1 500 ms OFF. La calibration ECG de Fig. 1 est sous anesthésie ; les comportements de Fig. 2 et l'inhibition insulaire de Fig. 4 relèvent d'autres conditions. Les contrôles comprennent lumière sans opsine, rythme proche du basal et eYFP pour l'inhibition. Le temps passé en zone exposée et la recherche d'eau sont des sorties comportementales. Les investigateurs n'étaient pas aveugles au génotype. Les données primaires sont proposées sur demande. L'effet numérique reste non extrait. [Article](https://www.nature.com/articles/s41586-023-05748-8).

**Décision POLY.** Conserver une entrée corporelle manipulée, un contexte, une sortie comportementale et une contribution insulaire circonscrite. Le trajet afférent complet, la médiation exclusive et le vécu restent ouverts. L'ECG de calibration ne devient pas un enregistrement cardiaque continu disponible pour chaque essai comportemental. La récupération à l'arrêt du pacing et la récupération comportementale doivent recevoir des lignes distinctes.

## S10 — VTA : attente et réponse

Le [manuscrit complet](https://pmc.ncbi.nlm.nih.gov/articles/PMC4567485/) décrit 33 souris mâles réparties entre quatre expériences. Fig. 1 compare récompenses avec ou sans indice olfactif ; Fig. 2 excite les neurones GABA ; Fig. 3 les inhibe ; Fig. 4 teste une manipulation bilatérale et le léchage anticipatoire. Les contrôles incluent GFP, activité basale et association lumière–récompense. Les cellules dopaminergiques identifiées optiquement et les cellules putatives des manipulations restent distinguées. La randomisation et l'aveugle sont précisés pour l'expérience comportementale. L'[erratum](https://www.nature.com/articles/nature15718) corrige les axes temporels de Fig. 3b/d : origine au début de l'odeur. Aucun dépôt d'essais bruts n'a été établi dans cette passe.

**Décision POLY.** Retenir une contribution locale au calcul et un contraste soustraction/division. Ne pas convertir un taux de spikes en concentration de dopamine, ni l'anticipation de récompense en plaisir. La correction d'axe est enregistrée avant toute extraction de latence. Les résultats unilatéraux et bilatéraux ne sont pas fusionnés en un seul trajet temporel.

## S14 — LC : localisation, projection et activité

Le [texte éditeur](https://www.nature.com/articles/s41586-026-11026-0) relie morphologies, expression et activité dans des préparations différentes. Fig. 5 examine répondre/ignorer et changer/maintenir un choix ; Fig. 6 confronte activité et erreur de prédiction estimée. Les projections corticales sont identifiées notamment par stimulation antidromique et tests de collision. La photométrie jGCaMP8s dans le cortex prélimbique mesure du calcium axonal, pas directement de la noradrénaline. Les méthodes annoncent randomisation et aveugle. L'activité liée au mouvement est une alternative à contrôler. Les associations avec une variable computationnelle restent distinctes d'une perturbation causale du calcul. Les figures sources sont signalées par l'éditeur.

**Décision POLY.** Scinder C04 prospectivement par population, projection, cible et grandeur mesurée. Une position dorsale ne devient pas une catégorie émotionnelle. La reconstruction anatomique, le transcriptome, les spikes et la photométrie ne reçoivent pas d'identité commune par simple rapprochement documentaire.

## Accès aux données : résultat vérifié

L'[index Allen](https://github.com/AllenNeuralDynamics/locus_coeruleus_norepinephrine_neurons) mène à des capsules d'analyse. Les README d'[électrophysiologie](https://github.com/AllenNeuralDynamics/aind-beh-ephys-analysis) et de [mouvements de langue](https://github.com/AllenNeuralDynamics/LC-ephys-tonguemovements) ont été lus. Le dépôt d'index est repéré au commit `43f7083df17042afc23917edfa59183ef166a972`. Aucun script des auteurs n'a été exécuté.

Les métadonnées du [DANDI 001950](https://dandiarchive.org/dandiset/001950) correspondent à l'étude LC ; sa version `draft`, donc mutable, comptait 385 fichiers lors du relevé. Les noms identifient 299 fichiers combinés comportement + électrophysiologie. Ce dénombrement est une observation de catalogue, pas le nombre d'animaux ou d'unités utilisables.

Un fichier a été choisi par taille minimale pour l'audit de structure, sans regarder un effet biologique :

`sub-ZS060/sub-ZS060_ses-ZS060-2021-03-28-15-27-56_behavior+ecephys.nwb`

Asset : `2f09c799-9f97-4f4e-9fd5-af115f890859` ; 456 537 octets ; SHA-256 `73377fac1718084fca8664356075320b178c33299bd2df31b0a86c9cf7fddce3`.

| Vérification dans le fichier | Observation directe |
|---|---|
| Ouverture | HDF5 lisible, NWB 2.9.0 ; validation NWB formelle non effectuée |
| Sujet | ZS060 |
| Essais | 331 lignes, débuts monotones |
| Unités | 1 ligne ; 4 445 spikes stockés |
| Variables comportementales | choix, indices de récompense, probabilités, go cue, temps d'issue, durée de réponse |
| Léchages | événements gauche/droite disponibles |
| Indicateurs exportés | unité déclarée réelle, SUA, default_qc=true, deux indicateurs d'optotagging=true |
| Incertitudes | latence moyenne d'optotagging manquante ; seuils et provenance des indicateurs à vérifier |
| Temps | plages numériques compatibles avec un recouvrement essais/spikes ; synchronisation non démontrée |

**Anomalie de métadonnées à traiter avant toute fusion.** Le champ `session_start_time` contient minuit et le décalage `−04:56`, tandis que le nom et l'identifiant portent `15:27:56`. Le fichier n'est pas pour autant rejeté comme faux ; on suspend les inférences d'heure civile et les jointures basées sur ce champ. Il faut vérifier la conversion et le repère des timestamps dans le pipeline source.

Les champs contenant « fake_raw » concernent aussi des formes d'onde dérivées dans le schéma. La fiche retenue possède `if_real_unit=true` ; ces champs ne seront pas utilisés comme mesures brutes. Les drapeaux exportés ne remplacent pas la vérification de qualité selon l'analyse visée.

## Communications et élimination : premier registre opératoire

| Branche | Type de preuve disponible | Candidat à éliminer / gap |
|---|---|---|
| EMO-C01 : pacing → rythme | Intervention et calibration | Identité avec les essais comportementaux non présumée |
| EMO-C02 : pacing × contexte → conduite | Intervention, contraste de tâche | Lumière, motricité, effets corporels associés |
| EMO-C03 : inhibition pIC → modulation de conduite sous pacing | Intervention locale | Nécessité universelle et trajet afférent non établis |
| EMO-C04 : manipulation GABA VTA → réponse de spikes | Intervention de circuit | Baseline, identification cellulaire, stimulation comme indice |
| EMO-C05 : manipulation bilatérale → anticipation | Expérience comportementale distincte | Effet moteur et apprentissage à dissocier |
| EMO-C06 : projection LC / contexte → activité | Observation avec identification | Mouvement, histoire de tâche, variables computationnelles |
| EMO-C07 : calcium axonal prélimbique ↔ choix/issue | Observation photométrique | Calcium ≠ concentration de NE ; artefacts et mouvement |

Aucune de ces lignes n'est raccordée au canon ou à une mesure de conscience. Le statut « extraction qualitative documentée » est distinct de « données synchronisées admissibles » et de « réplication quantitative ».

## Priorité suivante

Le LC devient le premier axe **d'analyse de faisabilité sur données publiques**, parce que des essais et spikes peuvent être examinés ensemble. Le cœur × contexte reste le premier axe **causal de la prospective**, mais sa réanalyse attend l'obtention de données primaires. Aucune demande n'a été envoyée aux auteurs.

Le protocole local `PROTOCOLE_ANALYSE_EMOTIONNEL_v0.2.md` fixe le contrôle d'identité, de temps et de qualité, puis les comparaisons nulles. Cette passe n'a produit aucune estimation d'effet, aucun nouveau couplage universel et aucune conclusion sur le vécu.
