# Dossier de clôture préparatoire — POLY v0.70

Le dossier réunit **six formulations admissibles du lot 1** et **deux formulations proposées du lot 2**, avec leurs limites. Les statuts restent distincts ; aucune intégration au canon ni publication n’est effectuée. Le lot porte sur des observations attribuées, des définitions et un calcul descriptif.

La documentation nationale est placée en annexe contextuelle. Les mécanismes complets, latences physiques et estimations interétudes attendent les manques décisifs indiqués dans la matrice jointe. Les quatre axes initiaux restent ouverts.

## Ordre prévu

1. Examiner les six formulations déjà admissibles, en gardant leurs réserves attachées.
2. Examiner séparément les deux propositions S21, sans additionner les mêmes patientes entre protocoles.
3. Conserver les annexes de qualité/méthode et les questionnaires comme appui documentaire.
4. Reprendre un résultat mécanistique seulement lorsqu’un complément permet de trancher le manque précis.

La préparation de ce lot peut être clôturée avec les sources actuelles. L’achèvement des mécanismes dépend des données/calibrations/mappings encore requis ; aucune date d’obtention n’est présumée. Les règles des pics, les filtres et les fenêtres ne deviennent pas des délais par reformulation.

## Lot1 — six formulations admissibles avec réserves

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

## Lot2 — deux propositions à examiner séparément

## P03 : observation publiée attribuée

Dans le premier protocole de S21, les auteurs rapportent une attaque de panique après le bolus de 4 μg d’isoprotérénol chez BG, mais pas chez AM ; quatre des quinze participantes témoins répondent au critère de panique. AM et BG sont les mêmes jumelles étudiées dans S16.

Portée : observation de deux patientes répétées sous une autre intervention. Critère S21 : augmentation d’au moins cinq points sur l’échelle 0–10 dans au moins quatre symptômes, évalués deux minutes après l’infusion. Limites : ordre fixe, simple aveugle, témoins issus d’un autre jeu de même protocole et plus jeunes en moyenne. Pas d’estimation de délai, de taux combiné S16/S21 ni de nécessité universelle d’une région. Ne pas assimiler non-panique à absence d’anxiété ou de réponse physiologique.

Provenance : collecte/v0.10/S21_FULL.txt, lignes 246, 250, 252, 258, 316 ; détails et vérifications dans analyses/v0.67.

## P03 : définition documentaire

Dans S21, la mesure d’exactitude interoceptive est une corrélation au lag zéro entre les variations du rythme cardiaque et les évaluations continues au dial, sur les deux minutes suivant l’administration nominale du bolus. Le lag zéro est fixé par la définition de la mesure.

Portée : méthode de l’expérience 2 ; ni délai de propagation nul ni preuve de simultanéité physiologique. L’horloge physique du bolus et la règle précise d’onset du dial restent non établies. Les seize témoins de cette expérience ne sont pas additionnés aux quinze de l’expérience 1 comme personnes indépendantes.

Provenance : collecte/v0.10/S21_FULL.txt, lignes 269 et 287.


## Annexes conservées

Anomalie de somme ONS 2016–17 (v0.63/v0.65) et calcul du noyau S10 (v0.67) restent annexes de qualité/traitement, sans portée biologique étendue. Le suivi CSS de cette passe clôt l’identification des 16 versions, avec contexte et dates conservés. Le plan historique, les pondérations et l’incertitude par vague restent distincts de ce contrôle de formulaire.


## Actualisation documentaire v0.71

Le lot de six formulations admissibles et deux proposées ci-dessus est inchangé. L’annexe nationale nouvelle est BILAN_METHODES_HISTORIQUES.md : douze notices rattachées à seize vagues, quatorze taux enquête attribués, deux inconnus2022, incohérence EN/FR conservée, poids/bootstrap décrits sans paramètres obtenus. Les divergences de dates et l’annulation de la vague d’hiver2023 sont sourcées séparément. Ni les mécanismes ni l’invariance ne sont déclarés acquis. La matrice de dépendances courante est celle de v0.71.


## État préparatoire v0.72 et reprise conditionnelle

Le lot de six formulations admissibles et deux proposées reste inchangé. Les seize terrains CSS sont reliés aux fichiers individuels RTRA ; les noms de fichiers ne sont pas les trimestres calendaires. Les deux fichiers ménages sont séparés. Le guide permet une route moyenne/SE/IC sous conditions de variable/codes/poidsbootstrap/accès, détaillée dans ROUTE_ESTIMATION_COMPATIBLE.json ; aucun calcul ou accèscompte n’a été effectué.

Les taux T1/T2 2022 et les manques biologiques demeurent ouverts. Les conditions concrètes de reprise sont dans CONDITIONS_REPRISE.json. La reprise horaire a été désactivée conformément à la consigne de Joan : le prochain progrès pertinent dépend d’une pièce discriminante nouvelle ou d’un accès adapté. Ce statut n’est pas une clôture scientifique. Aucun canon, publication, nouvelle conception ou rapprochement émotion/conscience.
