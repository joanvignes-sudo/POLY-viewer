# POLY v0.60 — définitions et portée des résultats négatifs

Passe poursuivie sur trois objets : mesure et identité des cellules (v0.59), latence motrice pendant apprentissage (v0.60), faits/modèles/controverses. Les nouvelles quantités sont liées à P02-VTA; l’audit des filtres traite aussi P01-insula. Aucune chaîne émotionnelle globale construite.

## Mesure et sélection

Six fiches distinguent PSTH, dérivée de force, détection moteur, courbes de consommation, lag de corrélation et enregistrement insulaire. Une largeur de filtre ou un critère de durée n’est pas une latence. Aucune correction fixe de pic appliquée. Les critères optiques sont conservés séparément des stimuli naturels. 985 latences d’identification ont été référencées (98 Tagged, 887 Untagged); 97 valeurs de similarité des ondes ne sont pas jointes automatiquement aux 98 latences. Les cases manquantes ont une raison. [Méthodes principales](https://www.nature.com/articles/s41467-025-64132-4), [supplément p.2](https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fs41467-025-64132-4/MediaObjects/41467_2025_64132_MOESM1_ESM.pdf).

## Nouvelle extraction et contrôle — Fig10c

234 valeurs numériques : 39 étapes répétées, trois colonnes ChR2 et trois contrôles, six souris selon légende. Elles mesurent la latence enregistrée au mouvement avant, pas la décharge neuronale ni la dopamine extracellulaire. Le signal auditif et la stimulation optique ont leurs repères propres; la calibration physique n’est pas reconstruite depuis le dessin de tâche.

Le label d’étape 220 est absent entre 200 et 240; aucune ligne imputée. Les degrés de liberté publiés 38/152 concordent avec 39 étapes disponibles. Cette concordance ne donne pas la raison du manque et ne le déclare pas volontaire. 52 valeurs sont exactement 2 s (30 ChR2, 22 contrôles). Signification de cette borne non établie : plafonnement, censure ou valeurs mesurées ne sont pas départagés. Aucune transformation en zéro, aucune moyenne de temps de survie.

| Composant de l’ANOVA mixte | POLY depuis export | Publication | État |
|---|---:|---:|---|
| Groupe, df1/df2=1/4 | F=0,114004; p=0,752607 | F=0,1; p>0,05 | arrondi concordant |
| Étape, df=38/152 | F=5,793874; p=2,35×10⁻¹⁵ | F=5,80; p<0,0001 | proche, pas égal à deux décimales |
| Interaction, df=38/152 | F=0,901935; p=0,635150 | F=0,9; p>0,05 | arrondi concordant |

L’écart de F pour étape vaut 0,006126. L’export contient des valeurs à deux décimales; une précision interne différente est possible, mais non démontrée. La valeur publiée reste inchangée et aucun résultat de concordance exacte n’est inventé. [Article, Fig10c](https://www.nature.com/articles/s41467-025-64132-4).

## Estimations exploratoires POLY

Chaque colonne est moyennée sur les étapes d’une phase, puis comparée au niveau des trois colonnes par groupe. Poids égal des étapes, pas pondération par nombre d’essais bruts inconnu. IC95 Welch conditionnels, descriptifs et non ajustés pour les trois résumés; pas des post-hoc auteurs ni tests d’équivalence.

| Phase | ChR2, moyenne enregistrée | Contrôle | Différence ChR2−contrôle | IC95 conditionnel de différence |
|---|---:|---:|---:|---:|
| 19 étapes, stimulation seule | 1,700 s | 1,587 s | +113,51 ms | −461,64 à +688,66 ms |
| 20 étapes, stimulation + récompense | 0,858 s | 0,906 s | −48,33 ms | −247,28 à +150,61 ms |
| Ensemble 39 étapes | 1,268 s | 1,238 s | +30,51 ms | −287,86 à +348,88 ms |

Ces IC dépendent de l’identité supposée des colonnes et des valeurs enregistrées, dont le traitement des bornes demeure inconnu. Ils n’incorporent pas l’incertitude de calibration. Ils ne prouvent pas l’absence d’effet et ne représentent pas une moyenne entre études.

## Faits, modèles, controverses

Quatre fiches séparent identité/répétition des cellules, sortie choisie pour mesurer l’apprentissage, sens de CR/UR et débat RPE/gain adaptatif. Le dossier d’évaluation contient critiques et réponses; sa numérotation historique de figures ne remplace pas la numérotation finale. La réponse des auteurs précise le rôle du signal dopaminergique phasique qu’ils contestent, sans exclure tout apprentissage après appariement à une activation dopaminergique. [Dossier d’évaluation, pp3 et 35–46](https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fs41467-025-64132-4/MediaObjects/41467_2025_64132_MOESM7_ESM.pdf).

POLY conserve les observations locales et les modèles concurrents; aucune élimination universelle n’est déclarée. L’absence de différence significative dans une tâche ne démontre ni équivalence ni inutilité biologique. Un seuil d’équivalence, une sortie définie et un traitement des non-réponses seraient nécessaires pour une conclusion plus forte; ils ne sont pas inventés ici.

## Suite et conservation

Priorités restantes : métadonnées du bloc absent, convention des valeurs à 2 s, mapping par animal et neurone, définition/horloges physiques onset et pic. Les demandes antérieures ne sont pas dupliquées. Sources PDF originales et extractions archivées, recherche hors canon, socle v0.22 non édité et vingt empreintes conservées dans le registre. NHANES déjà répliqué non relancé. Quatre axes restent ouverts; aucune nouvelle conception ni rapprochement émotion/conscience.
