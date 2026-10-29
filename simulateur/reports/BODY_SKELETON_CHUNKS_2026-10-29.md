# POLY — Blocs exacts du squelette source distinct

29 octobre 2026, reprise horaire. Le squelette Z-Anatomy demeure séparé des 80 surfaces de comparaison DB et du HRA.

Un constructeur local lit les deux archives existantes après contrôle de leurs empreintes compressées et brutes. Il produit quatre blocs de géométrie de moins de 4 Mio chacun : 12813792 octets bruts au total. Les 208 objets restent distincts des 206 concepts osseux. Les positions sont écrites en float64 et les indices en uint32, sans transformation, quantification ni réordonnancement.

Le catalogue de 538874 octets bruts conserve toutes les métadonnées non géométriques et le registre intégral : objets source, empreintes originales, évaluation et piles de modificateurs, polygones exclus, limites, transformation source, licences et indicateurs de recalage. Chaque entrée porte son indice et pointeur JSON source. Le namespace `skeleton206` évite toute confusion avec les pièces BP3D ou les indices HRA.

Le constructeur refuse un dossier non vide et les objets dépassant le budget. Tous les fichiers générés restent dans `work/skeleton-chunks`, hors dépôt et hors site. Aucun téléchargement ni changement des sources. Le workflow prévoit construction temporaire et vérification ; aucune CI distante déclenchée.

Validation : vérification Python de tous les octets numériques, puis vérification indépendante JavaScript de chaque nombre float64 (y compris signe du zéro), indice et identité des 208 objets. Métadonnées et registre comparés intégralement aux archives originales. Deux tests Python supplémentaires passent pour les budgets invalides, conservation des métadonnées et stockage numérique. Cette avancée ne raccorde pas encore le squelette au lecteur régional : lecteur borné, rendu, commandes et cycle de vie sont à implémenter lors de la reprise suivante. Aucun recalage anatomique individuel ni attache validée n’est ajouté. La cause du délai intermittent de démarrage reste ouverte.
