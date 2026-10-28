# POLY — Chaîne pupillaire humaine : du marqueur aux mesures, sans inventer le circuit individuel

**Audit :** 28 octobre 2026  
**Statut :** démonstrateur documentaire en branche isolée ; aucune publication ni fusion automatique.  
**Livrable :** [Lecteur de la chaîne et des mesures](../web/chaine-pupillaire.html) · [Graphe vérifiable](../data/pupil-reflex-documentary.json) · [Code de calcul](../web/pupil-evidence-core.mjs)

## 1. Ce qui a réellement été créé

La chaîne documentaire comprend 11 étapes (10 relations) : marqueur lumineux expérimental → rétine → nerf optique II → chiasma et tractus optiques → région prétectale → noyaux d'Edinger-Westphal bilatéraux → nerf oculomoteur III → ganglion ciliaire → nerfs ciliaires courts → sphincter irien → diamètre pupillaire enregistré.

- **Source humaine** : PsPM-AOB_UW, Zenodo [10.5281/zenodo.8239465](https://doi.org/10.5281/zenodo.8239465), licence CC BY 4.0. Article : [10.1038/s41598-023-41357-1](https://doi.org/10.1038/s41598-023-41357-1).
- **Références anatomiques** : [NCBI Bookshelf — voie du réflexe pupillaire](https://www.ncbi.nlm.nih.gov/books/NBK553169/) et [OpenStax, A&P, chapitre 16.3](https://openstax.org/books/anatomy-and-physiology-2e/pages/16-3-the-cranial-nerve-exam).
- **Données effectivement analysées dans ce parcours** : sujet public 01, session `sn2`, 49 marqueurs nominaux en lux, 2882 groupes temporels en millimètres, cadence d'acquisition 500 Hz.
- Les 22 participants disposant de fichiers éclairage restent consultables dans le lecteur humain existant ; ce démonstrateur ciblé n'analyse **que le sujet 01**.
- Cette chaîne ne recharge pas, ne modifie pas et ne propage pas de coordonnées ou un état physiologique sur l'avatar.

## 2. Qu'est-ce qu'un lien entre deux étapes ?

Les relations entre les relais nerveux sont des **relations anatomiques tirées de la littérature**. Les liens entre le marqueur nominal et la rétine, et entre le muscle sphincter et la mesure oculométrique sont étiquetés **raccordement individuel non vérifié**.

Cela ne veut pas dire que le réflexe lumineux est une hypothèse fragile : son anatomie est établie. Cela signifie seulement que **les données oculométriques de ce fichier ne contiennent pas l'activité de chaque relais du sujet**. Nous ne pouvons donc pas convertir un trajet connu en une reconstruction événementielle neuronale individuelle.

Chaque relation interne porte `latency_s:null`, `individual_activity_measured:false` et `anatomical_registration_to_subject:false`. L'affichage ne dessine pas de trajet sur le maillage 3D et ne simule pas d'impulsions.

Les niveaux nominaux de lux ne sont pas une courbe de photométrie mesurée instant par instant, ni une mesure de photon incident sur les cellules rétiniennes. La réponse pupillaire peut également dépendre d'autres voies autonomes et du contexte expérimental.

## 3. Fenêtres d'observation : définition opérationnelle

Choisir un événement de temps d'enregistrement `t_e` :

- Fenêtre avant : `[t_e - 1 s, t_e)`.
- Fenêtre après : `[t_e, t_e + 2 s)`.
- N'utiliser que les **groupes de 0,1 s entièrement contenus** dans chaque fenêtre. Les éventuels groupes qui chevauchent les limites sont exclus.
- Le lecteur source fournit pour chaque groupe `n` échantillons attendus et `observed` échantillons effectivement présents, ainsi que leur moyenne si `observed>0`.
- Couverture : `sum(observed) / sum(n)`. Une fenêtre avec moins de **75 %** de couverture renvoie **« données insuffisantes »**, pas une moyenne comblée.
- Moyenne descriptive : `sum(mean_bin * observed_bin) / sum(observed_bin)`, à condition que la couverture soit suffisante.
- Différence `Δ = mean_after - mean_before`, uniquement si les deux fenêtres satisfont le seuil.

**Le seuil de 75 % est une politique de présentation choisie par POLY, et non un seuil publié de validation clinique.** Les fenêtres 1 s/2 s sont des choix descriptifs pour examiner le voisinage temporel d'un marqueur, pas un estimateur physiologique de délai, de durée de synapse ou de causalité. La taille d'un groupe de 0,1 s ne doit jamais être présentée comme la résolution brute d'acquisition de 500 Hz.

Les points de la courbe ne sont pas reliés : aucune interpolation n'est ajoutée entre groupes ayant des mesures. Le compte des échantillons manquants reste visible.

## 4. Inconnues impérativement conservées

| Variable ou raccord | Statut |
| --- | --- |
| Diamètre observé | Mesuré (dérivé de la moyenne binoculaire stricte, mm) |
| Niveaux de lux aux marqueurs | Métadonnée nominale du protocole |
| Photométrie instantanée, spectre, irradiance rétinienne | Inconnus |
| Activité de la rétine, des nerfs II/III, des relais prétectaux | Non mesurée pour cet individu |
| Latence individuelle de chaque connexion | Inconnue |
| Recalage sur les surfaces 3D de l'avatar | Non démontré |
| Horloge commune entre fichier et simulation | Inconnue |
| Distance expérimentale de l'écran | Conflit 590 mm (exports) / 700 mm (article), non résolu |
| Correspondance des fichiers `sn2` aux cinq blocs publiés | Non démontrée |
| Effet causal de chaque événement sur le diamètre enregistré | Non isolé par ce simple contraste avant/après |

Le fichier de référence existant `light-localization.json` préserve ces limites, notamment le conflit de distance et la non-correspondance `sn2`/blocs. Ce nouveau graphe ne les contourne pas.

## 5. Éléments à valider avant toute simulation physiologique

1. Déterminer si la correspondance stimulus/photométrie peut être confirmée à partir des fichiers source, et identifier les conditions de laboratoire.
2. Déterminer si les 49 événements nominaux incluent des transitions/baselines ayant une interprétation distincte des 24 présentations, **sans forcer leur correspondance**.
3. Tester les effets des lacunes, du filtrage des mouvements oculaires, et des fenêtres choisies sur les statistiques descriptives.
4. Si disponible, rechercher un jeu apparié incluant pupille, anatomie et activités/latences des relais ; sinon laisser les délais inconnus.
5. Établir une hypothèse de modèle neuromusculaire ayant un opérateur de prédiction vérifiable **avant** de l'animer comme physiologie sur l'avatar.
6. Comparer prédictions et observations réservées à une validation indépendante ; ne jamais déclarer un mécanisme nécessaire sur la seule base d'une lecture oculométrique.

## 6. Qualité et reproduction

```sh
node --test simulateur/tests/pupil-evidence-core.test.mjs
python -m http.server 8123 --bind 127.0.0.1
# depuis un autre terminal, avec Playwright Chromium installé
POLY_BROWSER_CHANNEL=chromium node simulateur/tests/pupil-evidence-browser.cjs
```

La CI complète des rattachements appelle ces nouveaux contrôles en plus des tests d'interface existants. Le parcours navigateur vérifie l'ouverture depuis la page principale, l'affichage des 11 étapes et des événements humains, l'absence d'interpolation affichée, la consultation des limites, l'export du reçu, le comportement en cas de source indisponible, les erreurs JavaScript et la largeur d'un écran tactile émulé.

**Attention : un test navigateur automatisé n'est pas une validation sur un téléphone physique, et un test des calculs ne valide pas la neurophysiologie.**

**Engagement de publication :** PR en brouillon, sans fusion ni mise en ligne avant examen de la portée par le propriétaire.
