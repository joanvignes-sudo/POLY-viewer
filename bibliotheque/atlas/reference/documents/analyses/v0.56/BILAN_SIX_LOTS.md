# POLY v0.56 — six lots, apprentissage et perturbation VTA

Six lots terminés : dépôt public vérifié; quatre fiches d’intervalle/définition; 156 valeurs d’apprentissage; deux analyses répétées avec correction GG; 180 valeurs d’inhibition; effectifs, valeurs limites et analyse entre groupes contrôlés. Résultats séparés du délai récompense→pic de v0.53.

## Provenance et définition

Le dépôt Figshare 29485934 propose un seul classeur, MD5 identique à l’original Nature déjà acquis. Aucun enregistrement brut séparé n’est listé dans cet enregistrement du dépôt. Les deux figures ont été inspectées pour confirmer secondes et secondes². [Dépôt des auteurs](https://doi.org/10.6084/m9.figshare.29485934).

Les méthodes distinguent mouvements avant/arrière, avec seuils et durées minimales, et CR/UR selon référence au signal ou à la récompense. La durée minimale de 100 ms qualifie l’événement; ce n’est pas automatiquement sa latence. [Article et figures 6 et 10](https://www.nature.com/articles/s41467-025-64132-4).

## Calculs POLY — apprentissage

Deux matrices de 13 étapes × six colonnes animales, soit 156 valeurs, sont extraites avec cellules d’origine. Les identités nommées et nombres d’essais contribuant aux agrégats restent inconnus; l’alignement des colonnes est une hypothèse conditionnelle d’analyse conforme au format répété publié.

| Grandeur | Première étape, label 1 | Dernière étape, label 601 |
|---|---:|---:|
| Latence enregistrée CS→force | 717,91 ms; SEM 122,30 | 214,18 ms; SEM 37,39 |
| Variance de latence | 0,08928 s² | 0,01100 s² |

Contraste dernier−premier choisi par POLY : −503,73 ms, IC95 conditionnel −736,58 à −270,88, six colonnes appariées. Ce contraste descriptif n’est pas un post-hoc publié ni une vitesse d’apprentissage extrapolable. Les 13 étapes sont dépendantes : aucune moyenne entre étapes présentée comme réplication indépendante.

ANOVA répétée latence reproduite : F=4,35030, GG df=2,25155/11,25777, p=0,036491. Variance : F=7,32994, GG df=3,05057/15,25285, p=0,002794. Les valeurs concordent avec les arrondis publiés.

Deux agrégats de latence dépassent 1 s, alors que la récompense est nominalement délivrée 1 s après CS dans le protocole général. Sans détail des essais/sessions et conventions, cette série n’est pas renommée « délai anticipatoire strict avant récompense ». Le critère 0–1 s donné pour une autre analyse prédictive n’est pas transféré ici.

## Calculs POLY — inhibition directe

Fig10j : 20 étapes répétées × neuf colonnes, soit 180 valeurs. Les colonnes concordent avec quatre souris stGtACR2 et cinq contrôles de la légende; Fig10i indique six contrôles, la raison de cette différence n’est pas établie. Pas de cent quatre-vingts animaux.

Moyenne des 20 agrégats par colonne, puis moyenne de groupe : stGtACR2 148,25 ms (SEM 9,13, quatre colonnes), contrôle 975,80 ms (SEM 38,97, cinq colonnes). Ces valeurs résument les latences enregistrées sur cette phase; elles ne fixent pas une latence biologique universelle. Trois valeurs contrôle exactement égales à 2 s restent intactes. Plafonnement, censure ou coïncidence non départagés; aucun modèle de survie ou zéro imputé.

Le composant entre groupes de l’ANOVA mixte, avec sujets imbriqués dans leur groupe, donne F(1,7)=339,49566, concordant avec 339,5 publié. La reproduction vérifie l’arithmétique et la structure supposée, pas la calibration ni les absences de réponse.

## Portée

L’inhibition directe DA et la stimulation GABA de S10 sont des interventions différentes. Ces résultats ne remplissent pas la case GABA→DA, ni cœur→insula, ni une chaîne émotionnelle complète. Pic, onset moteur et variance restent trois grandeurs. Quatre fiches documentent ces distinctions et toutes les réserves.

Suite : conventions onset/confirmation, filtrage force, temps physique du signal, traitement des non-réponses, identités et exclusion contrôle. Aucun pooling, aucune nouvelle conception, pas de rapprochement émotion/conscience, NHANES non répété. Socle v0.22 non édité; quatre axes ouverts.
