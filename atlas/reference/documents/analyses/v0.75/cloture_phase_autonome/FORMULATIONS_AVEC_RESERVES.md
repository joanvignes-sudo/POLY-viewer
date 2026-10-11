# Dossier de huit formulations admissibles — POLY v0.73

Le dossier réunit les six formulations déjà admissibles en v0.65, conservées textuellement avec leurs réserves, et les deux formulations S21 maintenant examinées. Ce sont des faits publiés attribués, des définitions et un calcul descriptif. **Admissible dans ce dossier ne signifie pas intégré au canon.**

Les deux précisions nouvelles portent sur le référentiel pré-infusion du critère de panique et le centrage des signaux de la corrélation au lag zéro. Aucun résultat expérimental, délai physique ou mécanisme supplémentaire n’est revendiqué. Les quatre axes restent ouverts.

Chaque formulation doit être conservée avec sa portée, ses limites et sa provenance. L’intégration, si elle est demandée ensuite, se décide formulation par formulation. Une étiquette de dossier ne permet ni publication automatique ni promotion d’une version entière.

## Les six formulations antérieures — portée inchangée

## PROM-F01 — fait publié attribué

Eshel et al. rapportent des latences moyennes au pic de réponse de 67,6 ms pour la récompense inattendue et 95,4 ms pour la récompense attendue. Ce contraste appartient à une seule étude.

Portée : P02-VTA ; Eshel 2015, une étude souris.

Limites : Règle numérique du pic, incertitudes comparables, calibration physique récompense et mapping des neurones restent incomplets. Les valeurs sont celles des auteurs, pas une validation indépendante de délai physique.

Usage interdit : Ne pas appeler onset, latence dopamine extracellulaire, délai GABA→DA ou latence émotionnelle ; aucune moyenne avec Bakhurin.

Provenance : sources/v0.2/S10_PMC.txt:1285 ; analyses/v0.50 et v0.54–55.

## PROM-F02 — fait publié attribué

Dans l’étude S16, les auteurs rapportent une attaque de panique provoquée par CO₂ chez chacune des trois patientes présentant des lésions amygdaliennes bilatérales, contre trois des douze participantes témoins.

Portée : P03 ; S16, comparaison locale humaine.

Limites : Petit groupe sélectionné ; AM et BG jumelles monozygotes. Critères auteurs : symptômes, désir/comportement de fuite et hausse VAS panique, sens exact du seuil 25 % non résolu. Pas nouvelle inférence ni réplication indépendante POLY.

Usage interdit : Ne pas conclure inutilité universelle de l’amygdale, trajet alternatif identifié, délai CO₂→panique ou six participantes indépendantes depuis les répétitions.

Provenance : collecte/v0.10/S16.source ; analyses/v0.49/v0.62/v0.63.

## PROM-D01 — définition documentaire

Dans S15, le rythme cardiaque est dérivé des intervalles RR successifs. La fidélité des QRS au pacing est une proportion mesurée sur les vingt secondes centrales d’une stimulation de trente secondes ; ce sont deux mesures distinctes d’une latence impulsion→QRS.

Portée : P01 ; S15 ECG sous anesthésie.

Limites : Tolérance du comptage de fidélité et fréquence d’échantillonnage ECG non extraites. Calibration anesthésiée distincte de comportement libre.

Usage interdit : Ne pas convertir 20/30 s en délai ni attribuer un temps cœur→insula.

Provenance : sources/v0.2/S15.txt ; méthodes ECG ; analyses/v0.61.

## PROM-D02 — dénominateurs documentaires

La légende Fig3 de S15 indique cinq souris (trois ChRmine, deux contrôles), soixante sessions au total et 391/228 unités insulaires ChRmine/contrôle. Ces trois niveaux d’observation restent distincts.

Portée : P01 ; S15 Fig3d–h.

Limites : Participation de chaque souris par région et jointure unité→session→souris non fournie dans extraction ; répétitions possibles non résolues.

Usage interdit : Ne pas considérer les 619 unités comme 619 animaux indépendants ni 60 sessions par groupe.

Provenance : sources/v0.2/S15.txt ; Fig3 ; analyses/v0.61.

## PROM-D03 — définition documentaire

S16 examine l’anticipation cutanée dans les dix secondes avant inhalation ; l’anticipation cardiaque utilise des tranches de trois secondes dans la minute avant inhalation.

Portée : P03 ; anticipation S16, HR/SCR séparés.

Limites : Fenêtres analytiques ; seuil numérique de déflexion SCR et disponibilité par essai non extraits.

Usage interdit : Ne pas présenter l’anticipation comme réponse à un CO₂ déjà inhalé ni convertir les fenêtres en latences.

Provenance : collecte/v0.10/S16.source ; Data Analysis ; analyses/v0.62.

## PROM-C01 — calcul descriptif POLY

La moyenne arithmétique des six valeurs « peak_DA_firing » exportées en Fig9i est 110,26 ms. Les six lignes correspondent à six souris selon la légende ; leurs identifiants ne figurent pas dans la feuille.

Portée : P02-VTA ; Bakhurin Fig9i, six lignes source.

Limites : Descriptif du fichier source, pas constante physiologique. Pic de population par souris distinct du résumé par neurone S10 ; algorithme et calibration physique incomplets. SEM/IC antérieurs restent conditionnels, non promus ici en incertitude populationnelle validée.

Usage interdit : Aucune causalité depuis ordre des pics ; aucune moyenne avec S10 ni résolution submilliseconde depuis décimales.

Provenance : sources/v0.52/BAKHURIN2025_SOURCE_DATA.xlsx ; Fig9i D3:D8 ; analyses/v0.53/v0.65.

## Deux formulations S21 examinées en v0.73

## PROM-F03 — observation publiée attribuée, admissible à portée limitée

Dans la première expérience de S21, les auteurs rapportent une attaque de panique après le bolus de 4 μg d’isoprotérénol chez BG, mais pas chez AM ; quatre des quinze participantes témoins répondent au critère de panique. AM et BG sont les mêmes jumelles étudiées dans S16.

Portée et critère : observation locale de deux patientes sous une autre intervention. Les scores sont évalués deux minutes après chaque infusion. Le critère est une augmentation d’au moins cinq points sur l’échelle 0–10, par rapport au score avant l’infusion, dans au moins quatre symptômes de panique. Les deux minutes sont le moment d’évaluation, pas une latence de panique.

Limites : ordre fixe 0,1 μg → saline → 4 μg, simple aveugle ; témoins issus d’un autre jeu utilisant le même protocole et plus jeunes en moyenne. L’absence de panique chez AM ne signifie pas absence d’anxiété, de palpitations ou de réponse physiologique. AM et BG ne deviennent pas deux participantes nouvelles par rapport à S16.

Usages exclus : taux combiné S16/S21, onset ou délai physique, généralisation populationnelle, nécessité universelle ou rôle exclusif d’une région. Aucune réplication indépendante POLY n’est revendiquée.

Provenance : collecte/v0.10/S21_FULL.txt, lignes246/250/252/258/316 ; grillev0.65, critère2. Les réserves sont attachées à l’énoncé ; le seul fait local peut être retenu, les extensions restent différées.

## PROM-D04 — définition documentaire attribuée, admissible à portée limitée

Dans la deuxième expérience de S21, les auteurs définissent l’exactitude interoceptive pour chaque dose au moyen de corrélations croisées au lag zéro entre les évaluations continues au dial et les variations instantanées du rythme cardiaque, chacun de ces deux signaux étant centré sur sa moyenne, pendant les deux minutes suivant l’administration nominale du bolus.

Portée : description de la méthode publiée. Le lag zéro est choisi pour comparer les deux signaux dans cette fenêtre. Il ne signifie ni corrélation nulle ni délai de propagation nul, et ne prouve pas une simultanéité physiologique.

Limites : l’horloge physique du bolus et la règle précise d’onset du dial ne sont pas établies ici. Le code exact, sa normalisation et le traitement des signaux ne sont pas répliqués. Les seize témoins de cette expérience ne sont pas additionnés aux quinze de la première comme personnes indépendantes.

Usages exclus : onset, vitesse de transmission, sens causal ou mécanisme déduit de cette corrélation. Les deux minutes demeurent une fenêtre de protocole.

Provenance : collecte/v0.10/S21_FULL.txt, lignes269/287 ; grillev0.65, critère1. La définition attribuée est admissible ; son interprétation en délai biologique reste interdite.

## Annexes et dépendances

Les annexes de qualité ONS, de traitement mathématique S10 et de comparaisons nationales demeurent distinctes de ces huit formulations. Elles ne deviennent pas huit nouvelles preuves mécanistiques.

Les dossiersv0.71/v0.72 documentent les notices et seize correspondances de fichiers CSS. Deux taux enquête2022 restent inconnus ; codes d’item, poids numériques et accès pour une nouvelle estimation ne sont pas fournis. Aucune estimation n’est effectuée ici.

Les manques biologiques restent calibrations physiques, traces et mappings individuels/essais. Ils bloquent les interprétations étendues correspondantes, sans empêcher les observations publiées strictement attribuées. Les critères de regroupement interétudes restent inchangés ; aucune moyenne des pics VTA n’est ajoutée.

Les contrôles NHANES, ANOVA, formulaires et baseline publique clos ne sont pas refaits. Aucun nouveau message aux auteurs. La reprise horaire demeure désactivée ; cette passe répond à la demande manuelle « continuons ». Ni canon, publication, nouvelle conception ni rapprochement émotion/conscience.
