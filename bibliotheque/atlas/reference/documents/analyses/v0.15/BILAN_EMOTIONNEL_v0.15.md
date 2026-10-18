# POLY émotionnel v0.15 — temps humains et simulation libre

4 octobre 2026. Poursuite des étapes 2–4 après v0.14. Les quatre premiers axes restent ouverts. Aucun nouveau chantier de conception ; baseline v0.22 inchangée, émotion et conscience toujours séparées.

## Alignement temporel humain

Les identifiants des essais bruts correspondent au comportement pour les cinq patients. La comparaison des temps corrigés révèle toutefois qu'un simple offset ne suffit pas à superposer les deux exports : appris sur la première moitié, il laisse sur la seconde un résidu médian absolu de 13,3–18,3 ms au stimulus, et 14,6–17,5 ms à la réponse reconstruite.

`onsets.dec` n'est pas la réponse : la comparaison pertinente supplémentaire utilise `onsets.dec + data.rt1`. Les délais réponse moins stimulus bruts dépassent les délais ainsi reconstruits d'une médiane de 34,0–36,0 ms selon le patient. Ce constat ne prouve ni une erreur de l'auteur ni un délai biologique : les temps bruts sont déjà corrigés, et leur convention de correction reste à confirmer.

| Patient | Résidu médian stimulus, offset appris (ms) | Résidu médian stimulus, transformation affine apprise (ms) | Écart médian des délais stimulus–réponse (ms) |
|---|---:|---:|---:|
| P1 | 13,340 | 1,180 | 34,000 |
| P2 | 17,257 | 1,239 | 35,986 |
| P3 | 18,300 | 1,234 | 35,838 |
| P4 | 15,009 | 1,264 | 34,991 |
| P5 | 17,704 | 1,216 | 34,991 |

Une transformation affine descriptive, apprise uniquement sur la première moitié, réduit les résidus temporels stimulus sur la seconde. Ses pentes sont autour de 0,99998. Cela indique une différence de convention/échelle temporelle à investiguer ; aucune nouvelle correction n'est appliquée aux données chimiques. Les comparaisons de tous les champs scalaires sont conservées, sans sélection silencieuse du meilleur.

Chaque fichier possède deux intervalles de trace supérieurs à 0,15 seconde. Les fenêtres stimulus [−1 ; +5] contiennent entre 57 et 60 traces dans l'ensemble des patients. Une réponse P3 manque. Aucun intervalle n'est interpolé. La validation d'une horloge physique et la reconstruction chimique restent ouvertes. [Code et exports auteurs](https://github.com/danbang/article-DA-5HT-perceptual-decision), [courants déjà corrigés](https://osf.io/qyv9b/).

## Simulation libre de notre reconstruction

84 calendriers de sessions de test, 12 animaux, 97 inversions admissibles. Les paramètres restent ceux appris sur véhicule en v0.14. Chaque agent tire son propre choix et sa récompense, puis met à jour ses états ; il ne réutilise aucun choix réel futur. Les probabilités du protocole sont divisées par 100 et contrôlées. Les uniformes de choix et récompense sont partagés entre normal et ablation afin de réduire le bruit de comparaison.

Score : proportion de choix de l'ancien meilleur côté pendant les vingt CSplus suivant une inversion, avec vingt essais dans les blocs adjacents. Plus de persistance signifie adaptation plus lente. Les moyennes vont des transitions aux sessions, puis aux animaux ; les agents simulés ne sont pas des animaux expérimentaux supplémentaires.

La première passe utilise 256 agents ; la sensibilité utilise 1 024 agents et une autre graine. Aucun des 22 scores animal×condition calculables ne change de signe avant contrôle des états. Chez DREADDs, l'ablation augmente la persistance pour DR01, mais la diminue pour les autres animaux admissibles : quatre sur cinq calendriers véhicule et cinq sur six calendriers agoniste. Ce motif reste avec 1 024 agents. La reconstruction n'explique donc pas de façon générale un ralentissement après ablation.

Les calendriers véhicule et agoniste sont des entrées différentes. Leur différence n'est pas une intervention pharmacologique simulée ; seuls les algorithmes normal/ablation sont comparés sur un calendrier identique. Nos paramètres ponctuels et l'ablation diffèrent de la procédure publiée. Le résultat ne constitue pas une réfutation de [Grossman et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825708/).

### Limites découvertes dans la simulation

Des états sortent de [0 ; 1] pour DR13 : 68 occurrences agent×essai sur trois sessions dans la première passe, et d'autres sorties dans la sensibilité. Aucun état n'est borné silencieusement. Les sessions affectées sont exclues dans une analyse diagnostique conservée ; les conclusions de groupe impliquant DR13 sont mises en quarantaine. Le signe brut de DR13 ne doit pas être interprété biologiquement. La stabilité des autres signes ne résout pas ce défaut de domaine.

Les calendriers simulés contiennent 1 892 CSplus sans choix réel. Le simulateur prend une décision à chacun de ces essais ; il n'a pas de mécanisme no-go. Sa fidélité au comportement complet est donc limitée. Ajouter un tel mécanisme requerra une spécification et une nouvelle validation, pas un réglage choisi après lecture des résultats.

## Accès au modèle original et correspondance

Le paquet original est toujours annoncé sur la page publique Dryad, mais le lien officiel essayé retourne HTTP 403. Aucun téléchargement original supplémentaire n'est annoncé réussi. Aucun code hiérarchique original n'est retrouvé dans le snapshot local S13 ; cela ne signifie pas qu'il n'existe pas ailleurs. [Page du dataset](https://datadryad.org/dataset/doi:10.5061/dryad.cz8w9gj4s).

La recherche de nouveaux messages reçus contenant POLY depuis le 3 octobre ne retourne aucun résultat. Les sept demandes envoyées restent ouvertes. Aucun message supplémentaire n'est envoyé dans cette passe.

## Ce que cette passe permet d'écarter

Un simple offset temporel n'est pas une validation suffisante des exports humains. Une ablation algorithmique ne garantit pas le ralentissement attendu, même en simulation libre. La stabilité Monte Carlo ne garantit ni le domaine des états ni la fidélité biologique. Les résultats de choix v0.14 restent conservés, mais leur portée causale est désormais davantage limitée.

## Travail restant, dans l'ordre

1. Clarifier les conventions temporelles, la calibration chimique et la version statistique humaine ; garder les matrices actuelles pour analyses rétrospectives seulement.
2. Obtenir la procédure originale de méta-apprentissage, ses paramètres/hyperpriors exacts et son code de simulation ; résoudre les sorties de domaine et les no-go avant de proposer une simulation mécaniste.
3. Poursuivre les données manquantes des premiers axes et les comparaisons au niveau des animaux/patients. Les résultats respiratoires v0.13 et neuronaux v0.14 restent séparés ; aucune théorie émotionnelle universelle n'est validée.

Les spécifications, résultats par patient/session, scripts et contrôles sont conservés dans `analyses_emotionnel_v0.15`. Les vingt fichiers suivis du socle public v0.22 sont à nouveau inchangés. Les bruts durables v0.14 restent conservés séparément de Git.
