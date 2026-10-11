# POLY émotionnel v0.20 — sensibilité DR11 et calibration

4 octobre 2026. Trois volets : sensibilité à une session compromise, calibration des prédictions gelées, critères de clôture. Aucun résultat principal antérieur remplacé ; aucune nouvelle conception ni lien émotion–conscience.

## DR11 : un petit avantage ne résiste pas au contrôle

Le diagnostic retire seulement la session d'apprentissage `mDR11d20201212`, dont les temps et probabilités ont été signalés en v0.18–v0.19. Les trois autres sessions d'apprentissage et toutes les sessions de test restent identiques. Q statique et reconstruction méta sont refaits avec les mêmes bornes, trois départs et sélection sur vraisemblance d'apprentissage seule ; les six ajustements convergent. La logistique de participation est refaite avec les mêmes variables et pénalité ; elle converge également.

| Choix conditionnels DR11 | Principal véhicule | Diagnostic véhicule | Principal agoniste | Diagnostic agoniste |
|---|---:|---:|---:|---:|
| Q statique | 0,31460 | 0,32464 | 0,24740 | 0,25769 |
| Reconstruction méta | 0,31145 | 0,32737 | 0,24573 | 0,26052 |

Pertes moyennes à poids égal par session ; plus bas est meilleur. Le petit avantage méta sur Q statique dans le principal s'inverse dans les deux conditions diagnostiques. Il ne peut donc pas être présenté comme robuste à cette réserve de provenance.

Pour la participation DR11, la perte de la logistique diminue de 0,24673 à 0,22917 en véhicule, et de 0,17567 à 0,16815 sous agoniste. Le même retrait affecte donc différemment les modèles et les cibles. Cela ne prouve pas que la session causait une erreur de choix : ses horodatages compromis et ses probabilités vides ne démontrent pas à eux seuls que ses labels sont faux.

L'exclusion est décidée après découverte des anomalies : **sensibilité exploratoire**, pas remplacement du principal ni nouvelle confirmation indépendante. On ne choisit pas la variante au meilleur score de test.

## Calibration : ce que signifie une probabilité prédite

Les cinq prédictions gelées v0.17 sont reconstruites sur 84 sessions de test chez douze animaux. Leurs log-pertes et Brier correspondent aux anciens scores à moins de 10⁻¹⁰. Les classes de probabilité sont fixées avant calcul et conservées même vides ; aucun calibrateur n'est entraîné sur test et aucun p de population n'est calculé.

Le biais est la moyenne de `p − participation enregistrée`. Positif : surestimation ; négatif : sous-estimation. Il est d'abord calculé par session, puis moyenné par animal/condition.

Chez DR06, la logistique surestime de **29,70 points** en véhicule et **34,22 points** sous agoniste. L'estimateur sur vingt essais précédents a un biais d'environ **−0,80 point** et **+1,06 point**. L'adaptation réduit donc fortement l'écart moyen dans ce cas, en plus des pertes déjà examinées.

Cependant, chez plusieurs animaux participant presque toujours, l'estimateur roulant sous-estime d'environ cinq points. Le lissage Beta(1,1), la petite fenêtre et la remise à zéro en début de session ont un coût prévisible. Le faible biais global d'une règle ne garantit pas son exactitude dans chaque classe ; les tableaux détaillés restent nécessaires. Ni ces probabilités ni leur calibration ne mesurent une émotion ou une motivation.

## Critères de clôture actualisés

| Gate | État | Ce qui manque pour le fermer |
|---|---|---|
| Conservation et partitions locales | Passé dans le périmètre contrôlé | Sauvegarde externe non vérifiée ; aucune extension automatique à d'autres fichiers |
| Mapping et temps de tâche | Partiel | Conventions et provenance DR11 ; commandes matérielles et journaux de session |
| Prédiction conditionnelle | Évaluée, gains hétérogènes | Robustesse de DR11 limitée ; dérive DR06, coûts des règles roulantes |
| Simulation libre / domaine | Non fermé | DR13 hors domaine ; procédure originale et politique no-go non reproduites |
| Neurochimie humaine | Partiel | Temps physiques et chaîne courants→calibration→matrices |
| Perturbations corporelles et autres dossiers | Partiel | Bruts, mappings et contrôles attendus ; mesures non interchangeables |
| Interprétation émotionnelle | Non validée | Mesures et perturbations appropriées ; aucun raccourci depuis les seuls scores de tâche |

Une case passée concerne le périmètre testé, pas la clôture générale des quatre premières étapes. Les critères temporels, prédictifs et biologiques restent indépendants : une bonne perte ne répare pas un timestamp, et une empreinte correcte ne valide pas un mécanisme.

## Éliminations et suite

Écartés comme acquis : avantage méta DR11 robuste à la réserve de session ; calibrage uniforme d'un modèle gelé ; adaptation roulante sans coût chez des animaux stables. Survivent comme pistes circonscrites : historique récent pour certains changements de participation ; modèles conditionnels de choix dans leurs partitions ; nécessité d'un audit de provenance distinct de la qualité prédictive.

Les priorités restent les mappings DR11/DR06, le modèle original et le domaine DR13, puis les horloges et calibrations humaines et les bruts des dossiers restants. Les demandes auteurs précédentes ne sont pas dupliquées. Aucun nouveau message dans cette passe.

Les résultats, spécification et scripts sont conservés dans `analyses_emotionnel_v0.20`. Les données sources et le socle v0.22 restent inchangés ; les anciennes variantes demeurent disponibles à côté de ce diagnostic.
