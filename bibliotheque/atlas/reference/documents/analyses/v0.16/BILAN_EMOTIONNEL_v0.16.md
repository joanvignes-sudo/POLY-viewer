# POLY émotionnel v0.16 — absences de choix et stabilité

4 octobre 2026. Cette passe poursuit les étapes 2–4, sans nouveau chantier de conception. Les acquis antérieurs restent archivés et les vingt fichiers suivis du socle v0.22 sont inchangés. Aucun lien émotion–conscience ajouté.

## Une variable omise dans la simulation est maintenant étudiée

La v0.15 prenait une décision à chaque CSplus, alors que ses calendriers comportaient 1 892 essais sans choix enregistré. La v0.16 analyse séparément la participation enregistrée : un seul côté possède une issue finie ; absence si aucun côté n'en possède ; ambiguïté si les deux en possèdent. Ce marqueur repose sur la structure des données, pas sur une nouvelle mesure d'intention, de motivation ou d'affect. Une absence n'est ni un choix gauche ni une récompense zéro observée.

Douze animaux ; apprentissage sur les mêmes sessions véhicule que v0.14, paramètres figés pour les tests ultérieurs véhicule et agoniste. Trois modèles : constante, dernier état de participation, logistique avec progression et historique des vingt essais précédents. La progression ne dépend pas de la longueur future de session ; aucun choix ni résultat courant/futur n'entre dans ses prédicteurs. La pénalité et les variables sont fixées avant calcul ; standardisation sur apprentissage uniquement. Les douze optimisations convergent.

| Groupe / test | Logistique meilleure que constante | Logistique meilleure que dernier état |
|---|---:|---:|
| DREADDs / véhicule | 5 sur 6 | 4 sur 6 |
| DREADDs / agoniste | 3 sur 6 | 2 sur 6 |
| mCherry / véhicule | 4 sur 6 | 4 sur 6 |
| mCherry / agoniste | 2 sur 6 | 2 sur 6 |

Ces décomptes sont descriptifs par animal ; aucun test de population sur les milliers d'essais. Les pertes et Brier sont conservés par session, puis moyennés à poids égal par session. Un avantage n'est pas déclaré significatif sur la seule présence d'un signe positif.

## Une dérive majeure chez DR06

Le taux d'absence enregistré de DR06 est de **0,30 % à l'apprentissage**, puis **27,29 % en test véhicule** et **32,73 % en test agoniste**. La logistique surestime la participation et fait nettement moins bien que les témoins : gain contre constante de −1,69856 et −2,11878 en log-perte. Le passage d'un état de tâche à un autre limite donc fortement cette prédiction.

Ce résultat n'attribue pas la dérive à un effet pharmacologique : elle est déjà importante dans les sessions véhicule. Des changements de tâche, d'enregistrement, de comportement ou d'état restent des explications concurrentes. Les modèles de choix v0.14 ne portaient que sur les essais avec choix valide ; leur bonne prédiction conditionnelle ne décrit pas toute la session.

Les absences sous agoniste vont de 0,45 % à 32,73 % selon l'animal dans les sessions retenues. Cela interdit de considérer les omissions comme un petit bruit homogène. Le modèle de participation n'est pas branché automatiquement au simulateur libre : ses covariables de récompense enregistrée deviendraient simulées, ce qui demanderait une validation supplémentaire.

## Le marqueur d'absence ne signifie pas absence de mouvement

Le diagnostic porte sur 133 sessions d'apprentissage et de test, soit 43 890 CSplus. Dans les fenêtres valides [CSon ; trialEnd], 2 455 essais n'ont aucune issue finie ; **670 présentent pourtant au moins un léchage enregistré**. À l'inverse, trois essais avec une issue finie n'ont aucun léchage dans cette fenêtre. 977 essais comportent des léchages des deux côtés. Les horloges physiques ne sont pas indépendamment validées ici ; ces comptes ne définissent pas des choix exclusifs.

132 essais ont une fenêtre invalide et trois timestamps de léchage sont non finis. 131 fenêtres invalides concernent le dernier essai exporté ; une autre est interne à une session. Ce motif terminal ne prouve pas une erreur d'acquisition. Ils sont conservés dans les diagnostics, sans être convertis en zéro ni utilisés pour comparer le mouvement dans une fenêtre inventée. La modélisation de participation utilise le statut d'issue finie indépendamment de cette fenêtre et reste inchangée.

Il faut donc lire les sorties de participation comme prédictions du statut enregistré de tâche. Elles ne suffisent pas à mesurer l'engagement moteur, la motivation ou l'émotion. Le mapping des événements de tâche reste un point concret à clarifier.

## Stabilité des différents départs d'estimation

Tous les paramètres des trois départs v0.14 ont été réévalués, sans nouvel ajustement et sans sélectionner sur les tests. Quatre comparaisons neuronales de foraging et 24 comparaisons chimiogénétiques animal×condition, soit 28 lignes d'audit.

Dans le foraging neuronal, les quatre signes favorables à la reconstruction méta contre Q statique se conservent entre les départs appariés. Cela complète, sans annuler, la sensibilité défavorable à l'état initial de CG79 en v0.14.

Chez DR12 en test véhicule, le gain varie entre environ +0,00030 et −0,00063 selon le départ. Ce très petit avantage ne peut pas être présenté comme robuste. Les autres 27 lignes ne changent pas de signe dans cet audit, mais cela ne prouve ni identification unique des paramètres ni reproduction bayésienne hiérarchique.

## Bilan des preuves disponibles, par dossier

| Dossier | Ce qui est effectivement disponible | Limite actuelle | Travail nécessaire |
|---|---|---|---|
| LC / comportement / projections | Inventaires et analyses locales v0.3–v0.7 ; candidat comportement choix–récompense | Gain neuronal préalable non démontré dans la famille testée ; identité et horloges restent à compléter | Sources de synchronisation et métadonnées de population/projection |
| Cœur / insula / contexte | Extraction des résultats publiés et cahier de données v0.8 ; demande auteur envoyée ensuite | Pas de réanalyse primaire par essai ni délai complet cœur–insula validé | Événements, trajectoires, ECG, mappings et exclusions |
| Sérotonine / apprentissage / valeur | Données neuronales et chimiogénétiques, comparaisons chronologiques, ablation et simulation exploratoire | Transfert neuronal incomplet ; modèles ponctuels différents de l'original ; no-go et domaine DR13 non résolus | Modèle original, paramètres et contrôle complet de participation |
| Respiration / signaux intracrâniens | Exports traités et contrôles appariés / fenêtres v0.11–v0.13 | Résultats de cohérence et indicateurs non équivalents ; bruts et synchronisation non validés | Signaux bruts, horloges et statut des corrections statistiques |
| Interoception / amygdale / neuromodulation humaine | Textes et extraction ; nouvelle source humaine neurochimique S24 | Cohortes partiellement communes, mesures hétérogènes ; calibration chimique et temps S24 à clarifier | Données individuelles et chaîne d'estimation complète |

Ce tableau organise les dossiers déjà ouverts ; il n'ajoute pas une nouvelle idée de conception et ne redéfinit pas la demande des quatre premières étapes. Les cohortes ne sont pas fusionnées pour créer une population artificielle. Le récapitulatif repose sur les archives locales et garde les réserves de leurs bilans respectifs.

## Élimination et couplages survivants

Écartés comme résultats acquis : décisions présentes à chaque CSplus réel ; participation stable entre sessions ; gain DR12 robuste à tous les départs ; prédiction conditionnelle du côté équivalente à une prédiction de tout le comportement.

Survivent comme pistes circonscrites : historique de tâche pour certaines décisions et participations ; calibration neuronale sur le passé ; contrastes humains rétrospectifs ; liens corps–contexte et respiration–signal circonscrits à leurs protocoles. Aucun de ces liens ne définit automatiquement une émotion.

## Ordre du travail restant

1. Vérifier les métadonnées et changements de sessions de DR06, ainsi que la correspondance entre choix/licks et statut d'issue finie ; conserver la dérive plutôt que l'effacer par une exclusion tardive.
2. Clarifier le modèle original et son domaine avant un couplage participation–simulation ; ne pas borner silencieusement les états de DR13.
3. Compléter la chaîne temporelle et chimique humaine, puis les données primaires encore attendues des autres dossiers. Les sept demandes auteurs déjà envoyées restent pertinentes ; aucun nouvel envoi dans cette passe.
4. Produire les comparaisons finales des premières étapes avec leurs critères de clôture : inventaire traçable, horloges justifiées, concurrents évalués sur données réservées et perturbations distinguées des simulations.

## Conservation

Spécification avant calcul, résultats par animal/session, paramètres, contrôles d'invariance des prédicteurs au changement des événements futurs et exclusion explicite des ambiguïtés conservés dans `analyses_emotionnel_v0.16`. Les scripts ne modifient pas les données sources. Les anciens résultats restent conservés, y compris leurs limites.
