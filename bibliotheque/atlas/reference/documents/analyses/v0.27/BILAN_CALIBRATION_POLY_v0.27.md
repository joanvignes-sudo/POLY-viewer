# POLY — calibration des capteurs, recherche v0.27

## Avancée vérifiable

La différence fluorescence/pH est désormais documentée par des paramètres de calibration et illustrée par un calcul reproductible, explicitement classé comme modèle. Aucune moyenne interétudes n'est ajoutée.

## Faits publiés

Egashira, Takase et Takamori (2015), figure 1A : sypHy pKa 7,09 ± 0,02, coefficient de Hill 1,35 ± 0,02 ; six expériences, 38 boutons. Syp–mOrange2 : pKa 6,54 ± 0,05, Hill 0,99 ± 0,02 ; cinq expériences, 64 boutons. Les expériences et les boutons sont deux niveaux distincts. Les erreurs sont transcrites telles que publiées ; leur nature doit être reconfirmée avant pondération. Les auteurs normalisent la calibration à pH 8,6, puis convertissent la fluorescence en pH ; au début du piégeage acide, pH 6,67 ± 0,05, vers un repos à 5,64 ± 0,03. Ce début suit une période d'internalisation : ce n'est pas automatiquement l'instant de scission d'une vésicule. Leur constante de pH est approximativement 15 s. [Article primaire, figure 1 et estimation du pH](https://pmc.ncbi.nlm.nih.gov/articles/PMC6605559/).

## Modèle, séparé des mesures

Hypothèse illustrative : pH(t)=5,64+(6,67−5,64)exp(−t/15). Réponse instrumentale idéale : F=1/[1+10^(Hill×(pKa−pH))]. Les offsets et gains sont éliminés par normalisation entre début et asymptote. Ce modèle n'est ni une numérisation des courbes publiées, ni une estimation d'une nouvelle constante biologique. Le temps où la fluorescence normalisée atteint 1/e est calculé par dichotomie, sans ajustement exponentiel. Une réponse non exponentielle n'a pas automatiquement un τ unique.

- sypHy : temps de fluorescence à 1/e **6.0758 s**, pour le même τ de pH supposé **15 s**.
- syp-mOrange2 : temps de fluorescence à 1/e **11.0775 s**, pour le même τ de pH supposé **15 s**.

## Conséquence pour les comparaisons

Un écart entre temps de signaux peut apparaître avec une trajectoire de pH strictement identique. Cela illustre un mécanisme possible, sans expliquer à lui seul les différences entre laboratoires. Il faut conserver pKa, Hill, calibration, température, espèce, stimulation, origine du temps et définition de l'ajustement avant toute moyenne. Aucun IC du modèle : les erreurs et covariances des paramètres n'ont pas été propagées. Le calcul ne démontre pas un rôle limitant de la pompe dans toutes les préparations.

## État et suite

Les résultats NHANES déjà répliqués restent acquis, sans répétition. Le socle public n'a pas été écrit durant cette passe ; le contrôle de ses 20 empreintes de v0.26 reste le dernier contrôle. Les quatre axes restent ouverts, aucune nouvelle conception ni fusion émotion/conscience. Accès direct éditeur : 403 ; page PMC directe : contrôle navigateur. La calibration a été vérifiée dans le texte primaire indexé, sans contourner ces contrôles. Restent à acquérir : courbes expérimentales, incertitudes du τ de pH, covariance de calibration et unités indépendantes des constantes Granseth ; audit séparé des courants synaptiques rapides.
