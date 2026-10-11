# POLY émotionnel v0.14 — comparaisons, perturbation et données humaines

4 octobre 2026. Cette passe approfondit les étapes 2, 3 et 4. Les quatre premiers axes restent prioritaires, sans nouvelle conception du viewer ni assimilation de l'émotion à la conscience. Les acquis v0.13 restent conservés. Les spécifications précèdent leurs calculs ; une sensibilité supplémentaire est déclarée après les premiers résultats et avant ses propres calculs.

## Résultats qui changent le bilan

La reconstruction de méta-apprentissage prédit mieux les choix futurs que Q statique chez les quatre animaux, mais ce gain est petit chez certains et sensible à l'état initial. Elle dépasse le témoin « choix précédent » chez trois animaux sur quatre. Cela soutient une piste d'apprentissage conditionnelle, pas une mesure des émotions ni une médiation neuronale démontrée.

L'amélioration de la calibration neuronale par le passé ne rend pas le transfert robuste : le modèle prospectif dépasse son témoin constant chez deux animaux sur quatre. L'ablation simulée de méta-apprentissage ne prédit mieux les choix sous agoniste chez aucun des six animaux DREADDs. Ce résultat limite notre reconstruction et ne réfute pas l'estimation originale, différente.

Une nouvelle source humaine est désormais conservée : 30 matrices neurochimiques et cinq exports de courants bruts, 586 581 300 octets vérifiés par SHA256 et MD5. Le dépôt auteur est fixé au commit `0105f91e14364a9849b87e6d1013529ef0dec54e` ; 217 fichiers téléchargés sont contrôlés par empreinte Git et SHA256. [Dépôt auteur](https://github.com/danbang/article-DA-5HT-perceptual-decision), [courants OSF](https://osf.io/qyv9b/), [publication](https://pmc.ncbi.nlm.nih.gov/articles/PMC7736619/).

## Étape 2 — audit humain

Les cinq patients fournissent 1 334 essais. Les 30 matrices ont les mêmes nombres de lignes que leurs exports comportementaux ; 61 échantillons par essai aligné au stimulus, 81 à la décision. Chaque matrice stimulus contient une ligne entière non finie, chaque matrice décision deux. Après les exclusions comportementales de l'auteur, aucune ligne retenue n'est affectée. Aucun score manquant n'est imputé.

Les courants bruts contiennent cinq champs : courants, centres temporels des traces, débuts de stimulus, débuts de réponse et identifiants d'essais. Les identifiants correspondent exactement au comportement dans les cinq fichiers. Tous les échantillons de courant sont finis ; les temps des traces et stimuli sont strictement croissants. L'intervalle médian est 0,1 dans les unités exportées, avec quelques intervalles plus longs, jusqu'à 0,420. Une réponse P3 n'a pas de timestamp. Ces constats établissent une cohérence interne, pas la validation indépendante d'une horloge physique. Les matrices chimiques ne portent toujours pas leurs propres identifiants d'essais.

Le code utilise une normalisation sur la totalité de chaque fenêtre d'essai. Même un score pris tôt utilise donc indirectement des échantillons ultérieurs par son écart type. Nos scores sont rétrospectifs ; ils ne valident pas un signal utilisable en temps réel. La conversion des courants en concentrations, son entraînement in vitro et ses poids ne sont pas reproduits. Les cinq fichiers publics bruts ne contiennent pas ces poids.

La tâche manipule une difficulté perceptive et une règle de décision, sans mesure directe d'émotion. Quatre enregistrements sont dans le caudé, un dans le putamen. Les signaux DA/5HT sont estimés à partir d'électrochimie ; les matrices seules ne démontrent ni sélectivité indépendante ni calibration absolue.

Le script public de statistiques Figure3 prépare des colonnes d'intercepts par patient, puis ne les passe pas à l'appel étudié. La version exacte correspondant au modèle décrit dans l'article reste à clarifier ; aucune conclusion publiée n'est annulée. Une septième demande, adressée à Dan Bang, a été envoyée et sa présence dans les messages envoyés vérifiée. Elle donne notre URL publique et demande le mapping, les détails de calibration et la version statistique. L'envoi est vérifié, pas la réception effective ni une réponse.

## Étape 3 — modèles prédictifs

### Choix : sessions futures entièrement réservées

34 sessions, quatre animaux. Les premières 70 % des sessions par animal servent à estimer les paramètres ; les autres évaluent les modèles. Les états sont mis à jour seulement après observation des choix et récompenses passés. CSplus avec choix valide ; CSminus et absences de choix ne sont pas inventés comme décisions. Les témoins constant et choix précédent sont estimés uniquement sur l'apprentissage. Les pertes sont moyennées à poids égal par session ; plus bas est meilleur.

| Animal | Constant | Choix précédent | Q statique | Méta-apprentissage |
|---|---:|---:|---:|---:|
| CG09 | 0,63833 | 0,15051 | 0,15536 | 0,15258 |
| CG16 | 0,67648 | 0,32038 | 0,30673 | 0,29274 |
| CG75 | 0,74535 | 0,48112 | 0,44809 | 0,43097 |
| CG79 | 0,69760 | 0,45015 | 0,35007 | 0,34567 |

Les 24 optimisations convergent. La sensibilité à une incertitude initiale de 0 ou 1 conserve le gain sur Q statique pour trois animaux dans les deux variantes et pour CG79 seulement avec 0. Avec 1, CG79 devient moins bon de 0,00342. Les variantes ne sont pas sélectionnées sur le test. La reconstruction est une estimation ponctuelle individuelle avec conventions explicites, pas une reproduction hiérarchique bayésienne Stan.

### Neurones : calibration causale

37 unités, 28 sessions, quatre animaux distincts du foraging. Les paramètres populationnels v0.13 restent gelés. Une baseline mobile utilise au plus les 20 essais précédents, sans l'essai courant ni futur, puis une projection empêche les prédictions négatives. L'évaluation porte sur les 80 % finaux de chaque unité ; les premiers 20 % servent à la calibration initiale.

La baseline mobile améliore la prédiction des comptes pré-indice chez les quatre animaux. Pour la réponse post-indice, elle n'améliore pas tous les animaux : BB031 a une erreur absolue plus grande. Le gain du modèle prospectif contre sa baseline constante correspondante vaut +0,03132, +0,16279, −0,08759 et −0,05217 Hz² pour BB025, BB031, BB033 et BB036. Deux gains positifs, deux négatifs : pas de transfert neuronal universel validé.

### Humain : fenêtres fixées et chronologie

Score stimulus 0–0,8 seconde moins baseline −0,5–0 ; lissage causal sur cinq échantillons. Le contraste forte moins faible cohérence pour 5HT est négatif chez P1–P4 et positif chez P5. Cette différence descriptive, quatre caudés contre un putamen, ne suffit pas à établir une loi régionale.

Les évaluations chronologiques de scores rétrospectifs comparent temps seul, temps avec cohérence, puis distance et interaction. La cohérence améliore le score 5HT chez deux patients sur cinq, DA chez un sur cinq. L'ajout distance/interaction n'améliore le score 5HT chez aucun. Les seuils RT et la standardisation des prédicteurs sont appris sur le passé uniquement. Les essais, patients et sites ne sont pas amalgamés ; aucun p de population n'est calculé.

## Étape 4 — perturbation du modèle

Douze animaux, six DREADDs et six mCherry. Paramètres appris sur les premières 60 % des sessions véhicule par animal ; tests sur les sessions véhicule ultérieures et les sessions agoniste strictement postérieures à la dernière session d'apprentissage. Les anciennes sessions agoniste sont explicitement exclues du test chronologique. 72 optimisations convergent.

L'ablation fixe l'incertitude à zéro et le taux négatif à sa médiane d'apprentissage véhicule, les autres paramètres restent gelés. Elle est évaluée conditionnellement aux événements réellement observés, sans agent libre ni ajustement sous traitement. Chez les six DREADDs sous agoniste, l'ablation augmente la perte ; la médiane du gain normal moins ablation est −0,03249. Chez les six mCherry, elle améliore deux animaux et dégrade quatre, médiane −0,01332. Cette construction ne reproduit donc pas une amélioration spécifique attendue sous manipulation. Les résultats corporels et respiratoires v0.13 restent descriptifs et séparés.

## Éliminations et couplages survivants

Écartés comme acquis : transfert neuronal universel, robustesse complète à l'état initial, ablation conditionnelle reproduisant la manipulation, signal humain précoce en temps réel, assimilation des tâches à une émotion, effets chimiques absolus déduits des Z-scores.

Survivent comme pistes limitées : apprentissage historique des choix ; calibration neuronale par les essais passés ; contrastes humains liés à la tâche et dépendants du patient/site ; liens corps–signal respiratoire déjà décrits, sans causalité émotionnelle établie. Ces pistes restent concurrentes des effets d'habitude, de dérive, de préparation clinique et de traitement des données.

## Ce qui reste nécessaire

1. Confirmer la chaîne courants → calibration → concentrations → matrices, la correspondance temporelle et la version statistique avec les auteurs ; ne pas refaire une conversion arbitraire sans poids.
2. Reproduire l'estimation hiérarchique originale et une simulation libre avant de confronter réellement l'ablation à l'intervention ; contrôler les conventions et les sensibilités.
3. Obtenir les bruts et mappings encore manquants pour LC/pupille, perturbations corporelles/insula, interoception et GABA–DA ; les six demandes antérieures restent ouvertes.
4. Achever les comparaisons entre les quatre premiers axes au niveau des animaux/patients, avec mesures communes seulement quand justifiées. Ne pas traiter ces nouvelles analyses comme la clôture de ces axes.

## Conservation et contrôles

Les résultats détaillés, scripts, spécifications, empreintes et preuves d'envoi sont dans `analyses_emotionnel_v0.14`. Contrôles : 96 convergences, chronologie des sessions, invariance des prédictions au changement des événements futurs, accord de la perte avec sa formule probabiliste et baseline v0.22 inchangée sur 20 fichiers suivis. L'archive durable inclut séparément les données brutes ; une sauvegarde du seul historique Git ne les emporte pas.
