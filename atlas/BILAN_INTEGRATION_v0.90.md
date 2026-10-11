# POLY — intégration v0.90

## Ce qui est intégré

La bibliothèque « Les données » rassemble **1638 fichiers**, soit 1564 contenus distincts par empreinte : 172 tableaux/questionnaires, 58 fichiers de matrices/signaux, 637 registres/résultats, 15 archives, 222 scripts et 534 documents. Les doublons de contenu restent associés à leurs origines ; ce ne sont pas des études indépendantes.

Racines couvertes : donnees/, sources/, analyses/, fichiers scientifiques json/md/csv/tsv/txt/ris à la racine du dépôt et pièces humaines v0.89, plus les nouvelles pièces primaires. Copies générées atlas/reference/construction et dépendances package/__pycache__/.git exclues. Le catalogue couvre les fichiers présents lors de la construction ; les versions ultérieures sont hors de cet instantané.

1620 fichiers sont inclus dans le paquet, dédupliqués par empreinte. 18 originaux de plus de 8 Mio restent dans leur emplacement durable du projet et sont téléchargeables via la version locale http://127.0.0.1:8880/index.html. Le serveur limite l’accès aux identifiants du catalogue et vérifie l’empreinte avant téléchargement. Hors connexion, leur structure et leur provenance restent consultables.

Chaque tableau CSV est lu avec sa délimitation ; une première ligne entièrement numérique reste une donnée, ce qui conserve les matrices PET sans en-tête. Toutes les feuilles des classeurs XLSX/XLS sont inspectées en lecture seule. Les trois tables SAS NHANES exposent variables, lignes et SEQN ; le SPSS Afrobarometer expose dictionnaire, modalités et aperçu. MAT/NWB exposent variables, dimensions et types, ZIP expose ses membres. Les fichiers complets restent accessibles. Les scripts ne sont pas exécutés ; les archives ne sont pas extraites automatiquement.

Les aperçus sont limités aux premières lignes ; les effectifs statistiques ne se déduisent pas de leur nombre. 95 fichiers spécialisés ou documents binaires sont référencés sans décodage supplémentaire du contenu (liste dans COUVERTURE_INTEGRATION_v0.90.json). Aucun échec du lecteur sur les formats pris en charge : 0.

## Nouvel apport humain

Sato et al., *Neural network dynamics associated with facial and subjective emotional responses*, DOI 10.1038/s42003-025-09361-5, publié le 14 décembre 2025, volume 9/article 91 (2026). Article primaire et supplément numérique acquis. Le tableau contient les mêmes **33 personnes** dans les trois feuilles : caractéristiques, valence et AU12 ; films de 156/150/196 secondes, soit 502 secondes et 16 566 cellules par mesure. Identifiants, clés film×seconde, valeurs binaires AU12 et valeurs manquantes contrôlés.

IRMf et vidéo pendant les films ; valence recueillie **après** la séance par rappel indicé. Une neuvième fiche de protocole humain, neuf nouvelles fiches primaires et une nouvelle vue de mesure rendent ces distinctions visibles. Les modèles GLM/ICA/DCM ne sont pas reproduits ; la direction proposée par DCM dépend du modèle et ne démontre pas une causalité expérimentale. Les cartes NeuroVault sont référencées, pas acquises dans cette passe.

L’atlas compte maintenant 44 vues de parcours, dont 16 explicitement humaines ; 281 maillons et 209 raccords. 90 fiches primaires ciblées, plus les 6 fiches S22 historiques ; 455 documents consultables dans la recherche. Aucun total global de personnes entre études n’est supposé.

## Questionnaires et périmètres

NHANES, ONS, INSEE, Afrobarometer, Nouvelle-Zélande et WHR disposent d’accès directs depuis l’accueil humain. Dictionnaires et matrice de comparabilité des passes antérieures sont intégrés. Périodes de référence, poids, ruptures, unités et incertitudes restent propres aux sources. Aucun nouveau score international commun ni nouvel effet n’est calculé.

FR_VALUE a été identifié comme **souris**, sur README auteur conservé avec empreinte et passage exact. Ses groupes pré/post ne sont pas additionnés en cohortes indépendantes. Le DOI absent du README (XXXX) n’est pas inventé.

## Ce qui reste ouvert

Le catalogue local est complet dans ses racines annoncées ; le dépouillement scientifique intégral et la réplication de tous les modèles ne sont pas revendiqués. CASE : archive brute 4,55 Go non acquise. KEmoCon : accès restreint. S18 : signaux bruts sous accord. S24 : calibration et jointure TTL physique manquantes. H03 : écart 165/207 erreurs de déclenchement conservé. H01/H02 : acquisition intégrale non aboutie. Ces limites n’empêchent pas de consulter les données déjà disponibles ; elles ne sont pas comblées par des valeurs inventées.

Le socle public v0.22 reste inchangé. VERIFICATION_v0.90.json décrit les contrôles, MANIFESTE.json les empreintes du paquet et SAUVEGARDE.json le commit local après sauvegarde.
