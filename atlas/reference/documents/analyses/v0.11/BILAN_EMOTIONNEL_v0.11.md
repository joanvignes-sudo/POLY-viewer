# POLY émotionnel v0.11 — bilan des quatre premiers axes

4 octobre 2026. Aucun chantier de conception ajouté. Le socle public v0.22 est intact : les vingt empreintes conservées correspondent encore aux fichiers locaux. Les analyses restent dans le dépôt émotionnel séparé.

## 1. Accès aux données : deux archives récupérées, demandes étendues

Les accès Zenodo initialement refusés ont fonctionné lors de cette passe. Le DOI conceptuel sérotonine 14623230 résout vers la version **14628985** ; respiration 19502572 vers **19502635**. Les archives de 203 999 415 et 56 988 466 octets sont téléchargées et leurs MD5 correspondent aux métadonnées des dépôts. SHA256 et copies durables sont sauvegardés. La carte anatomique MNI de 261 Mo n'a pas été téléchargée : elle n'est pas nécessaire aux contrastes calculés.

Le paquet S13 contient les données et le code de Harkin/Naud, les données Grossman et celles de Li/Luo ; il ne crée pas trois cohortes nouvelles. Le README donne 2017 pour Dryad, alors que les métadonnées du dépôt donnent décembre 2021 et l'article 2022. La comparaison binaire indépendante avec l'archive amont Dryad reste non réalisée : le téléchargement direct retourne 401. Cela ne remet pas en cause l'intégrité de l'archive Zenodo vérifiée, mais laisse cette étape de provenance ouverte.

Quatre nouvelles demandes ont été envoyées et relues dans Gmail : Emerson Harkin (horloges, exclusions, contacts), Brian Dlouhy (sites, fréquence d'échantillonnage, signaux bruts), Sahib Khalsa (interoception/panique), Naoshige Uchida (dopamine/GABA et sérotonine récompense/punition). Avec Deisseroth et Cohen contactés précédemment, le total est **six destinataires**, sans doublon. Les messages décrivent POLY et donnent son URL. Aucune pièce jointe ni acceptation d'accord. Aucun retour reçu au dernier contrôle effectué avant l'envoi Uchida.

## 2. Audit des fichiers : provenance, effectifs et exclusions explicités

**Sérotonine, préparation immobilisée.** Le chargeur fourni conserve 28 sessions, 37 unités chez quatre animaux. Les quatre sessions BB035 sont exclues : champs de récompense/collecte absents ou incompatibles, dont un champ Rewarded avec une casse différente. Elles ne représentent pas une récompense biologiquement nulle. Nous n'avons pas modifié ces conventions.

Les huit colonnes du CSV éditeur sont reproduites à leur précision d'arrondi, y compris les permutations circulaires. L'identité animal/session/unité est maintenant retrouvée pour chaque ligne. La régression de récompense du CSV porte sur la fenêtre stockée entière de 7,5 s selon la convention du code, **pas uniquement sur le baseline**. Le code suppose un pas de 1 ms ; le README ne le confirme pas explicitement. Les délais indice→issue et l'ordre des événements sont audités, mais la calibration indépendante de l'horloge et les latences physiques restent ouvertes.

**Préparation avec mouvement libre.** L'inventaire couvre 1 247 fichiers MAT. Le chargeur auteur produit 80 entrées portant 69 identifiants de cellule distincts, dont deux exports Cell097 identiques pour spikes et entrées de zone récompensée. Les checks de temps finis/non décroissants passent pour les séries centrales chargées. Cinquante-six autres séries de l'archive ont des temps non monotones ; cela ne démontre pas une corruption des séries effectivement retenues. Deux contrôles du parseur sont inopérants ou utilisent des clés différentes ; aucun mismatch de longueur temps/niveaux n'est observé dans notre audit indépendant. Les sélections du notebook sur réponse >1 Hz et PSTH identiques sont conservées comme règles d'auteur, sans transformer les entrées en animaux indépendants. Aucune nouvelle comparaison inférentielle sur ce sous-ensemble n'est annoncée sans établir les identités et règles de regroupement.

**Respiration.** Les six fichiers MAT ne présentent pas de cohérences hors [0,1], de valeurs non finies ou de doublons patient/canal dans un fichier. Le groupe principal contient huit participants, le sommeil six, la ventilation lente/profonde cinq ; l'ensemble des fichiers contient neuf identifiants distincts. Il faut préserver ces intersections, pas annoncer huit personnes pour toutes les comparaisons.

La clé patient/canal éveil–sommeil donne 841 correspondances dont 119 régions différentes. Elle est écartée. La clé participant/coordonnées exactes donne 962 correspondances bijectives et régions concordantes ; elle fournit seulement un contraste exploratoire en attendant la confirmation des paires physiques. Le code/README indiquent 250 Hz pour le sommeil, les Methods décrivent 500 Hz ; la clarification est demandée. Les fichiers contiennent des traces de ceinture, mais aucun signal intracrânien brut.

## 3. Comparaisons de modèles : réussite locale et limites du transfert

Les sept familles du notebook fig4D sont recalculées avec la graine 42, dix répétitions de cinq plis et les réglages auteur. Les drapeaux d'optimisation ne signalent aucun échec dans ce contraste. Les minima globaux ne sont pas certifiés. Le calcul utilise des essais mélangés des mêmes neurones : **ce n'est pas un test sur de nouveaux animaux**.

| Famille fournie | R² de validation moyen |
|---|---:|
| Prospective | 0.7485 |
| SurpriseAdaptation | 0.6418 |
| Value | 0.3411 |
| RewardAdaptation | 0.1574 |
| Surprise | 0.0553 |
| Reward | -0.0054 |
| Null | -0.0081 |

Le modèle prospectif explique mieux la forme temporelle moyenne dans cette comparaison. Cela soutient un modèle descriptif conditionnel dans cette tâche, pas une fonction universelle de la sérotonine ni une mesure d'émotion. [Article S13](https://www.nature.com/articles/s41586-025-08731-7), [code et données versionnés](https://doi.org/10.5281/zenodo.14628985).

Notre autre test prédit les spikes **avant indice**, sur essais ultérieurs, avec cinq blocs chronologiques. M0 contient temps/constante ; MV ajoute le passé de récompenses ; MC contient temps/contacts ; MVC ajoute le passé de récompenses à MC. Les cinq premiers essais, dont l'historique est initialisé synthétiquement, sont exclus. La couverture temporelle exportée des contacts est suffisante dans les 37 unités, sans validation physique indépendante du capteur. MU est un proxy p(1-p), pas la variable latente complète de Grossman.

| Animal | Sessions | Gain M0−MV | Gain MC−MVC |
|---|---:|---:|---:|
| BB025 | 9 | -0.00377 | -0.00148 |
| BB031 | 2 | -0.01678 | -0.00957 |
| BB033 | 11 | -0.00138 | -0.00143 |
| BB036 | 6 | -0.00142 | -0.00151 |

Un gain positif aurait favorisé l'ajout de l'historique. Les moyennes par animal sont négatives dans les quatre cas, y compris après contacts. Nous ne retenons pas cette variante comme couplage prédictif validé. Les unités d'une session sont résumées avant les sessions d'un animal ; aucun p de population n'est calculé sur les unités regroupées. Ce résultat ne contredit pas à lui seul le contraste de forme temporelle précédent, qui vise une autre cible.

Le transfert du modèle prospectif vers un animal totalement absent de l'apprentissage échoue aussi pour les **taux absolus sans recalibration de baseline** :

| Animal test | R² apprentissage | R² test |
|---|---:|---:|
| BB025 | 0.5227 | -7.1438 |
| BB031 | 0.3899 | -0.0717 |
| BB033 | 0.8879 | -4.0737 |
| BB036 | 0.8519 | -109.7579 |

Une initialisation auteur avait abouti à un ajustement plus mauvais que le modèle constant, malgré un drapeau de convergence. La réparation par huit initialisations fixées, sélectionnées sur apprentissage seul, est documentée comme extension après les premiers résultats. Le niveau de base entre animaux et les formes temporelles différentes limitent le transfert ; ce test n'établit pas l'absence du mécanisme biologique.

Les contrôles numériques couvrent 1110 ajustements Poisson, tous sous le seuil de gradient moyen fixé ; les accélérations du filtre reproduisent les cas de référence à moins de 1e-11 et les premiers plis correspondent au pilote. Les versions de l'environnement et les spécifications sont conservées.

## 4. Perturbations : données examinées et portée des éliminations

La matrice séparée couvre cœur–insula, CO₂, isoprotérénol, ventilation, inhibition sérotoninergique et GABA–dopamine. Elle distingue interventions biologiques, lésions chroniques et perturbations de modèle.

L'expérience sérotoninergique distincte compte 158 sessions chez douze animaux, six DREADDs et six témoins. Une session avec probabilités manquantes est écartée ; le contraste exploratoire porte sur 839 transitions de préférence admissibles, avec 127 blocs trop courts exclus. La persistance médiane supplémentaire vers l'ancien côté favorisé est +0,0762 sous agoniste chez DREADDs, +0,0138 chez les témoins. Les nombres de sessions sont inégaux ; les non-choix restent séparés. C'est un contrôle descriptif, pas la réplication du modèle Stan ni une nouvelle preuve statistique causale. [Étude source S22](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825708/).

Pour la respiration, la comparaison des fractions de sites retenus sous ventilation standard/lente-profonde reproduit le p unilatéral 0,03125 de la figure 7E, à partir des indicateurs fournis. Le p bilatéral est 0,0625. La moyenne de cohérence de tous les sites est une cible différente. Le statut brut/déjà corrigé des Pvalues n'est pas documenté dans les exports consultés ; aucune seconde correction n'est imposée. Les contrastes à moyennes par participant n'identifient pas une route neuronale et ne mesurent pas l'affect. [Étude source S18](https://www.nature.com/articles/s41467-026-73828-0).

Les deux patientes de l'expérience isoprotérénol sont déjà présentes dans l'étude CO₂ : ces publications ne fournissent pas deux confirmations indépendantes. Les effectifs par capteur, protocoles d'aveugle, ordres d'intervention et critères de panique restent distincts. Le dossier cœur–insula conserve les cohortes et les anomalies de chiffres publiés, sans fabriquer de valeurs corrigées.

## Ce qui empêche encore de déclarer les quatre axes achevés

| Point ouvert | Dépendance concrète |
|---|---|
| Réanalyse cœur–insula et clarification F/P | Données et réponse Deisseroth |
| Pupille, ports de contacts et exports LC manquants | Réponse Cohen / fichiers de référence |
| Horloges, exclusions et couverture sensorielle sérotonine | Documentation Harkin, calibrations ou fichiers électroniques |
| Indépendance des entrées de la préparation libre | Mapping cellule/animal/session, règles de regroupement et événements de délai/omission |
| Pipeline de cohérence, fréquences et correspondance physique des sites | Documentation Dlouhy et, si admissible, signaux bruts sous accord |
| Couplages temporels sensations–physiologie–panique | Données dé-identifiées et procédure de partage Khalsa |
| Comparaison soustraction/gain dopamine, récompense/punition sérotonine | Données ou orientation Uchida |

Les quatre axes ont donc fortement avancé ; ils ne sont pas déclarés clos. Les effets locaux, modèles et échecs de prédiction sont documentés. Aucun couplage universel n'est validé, aucune conception du viewer n'est lancée, et aucune intervention de Joan n'est nécessaire tant que les conditions d'accès n'ont pas été précisées par les auteurs.
