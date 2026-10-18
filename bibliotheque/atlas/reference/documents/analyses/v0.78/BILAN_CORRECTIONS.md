# Correction Bang et tests — v0.78, 7 octobre 2026

Branche Git `emotionnel`, dossier S24 / Bang 2020, hors canon. Événements stimulus/choix et échantillons estimés ; intervalle Figure 3C : 61 bins, focus prédéfini bins MATLAB 11–26 (0–1,5 s). Trous visés : correction des intercepts, exclusions/NaN et jointure par horodatage. La spécification est enregistrée avant les calculs dans SPECIFICATION_AVANT_TESTS.json.

## Changements appliqués

La correction publique de Dan Bang au commit `5cddcd20ed1dda2979f277f0434356c8413beae8` est reprise dans Figure3_TRAVAIL.m. Seuls les chemins des données, fonctions et figures sont adaptés à notre copie locale. Les sources originales v0.14 et v0.77 restent conservées. Le préparateur extrait 15 fichiers MAT et six fonctions depuis l’archive locale, vérifie leurs octets et conserve leurs empreintes ; aucun téléchargement supplémentaire. Le dossier runtime est régénérable et exclu de Git.

La version de l’auteur comporte deux indicatrices de participant sans constante globale : P1 a un intercept contraint à zéro. Elle n’est donc pas assimilée à trois intercepts libres. Le contrôle avec constante et deux indicatrices est calculé séparément et ne remplace pas le code de l’auteur. Les trois variantes sont des régressions regroupées, sans effets aléatoires.

## Calculs et résultats

La traduction numérique gaussienne à lien identité compare l’ancien intercept commun, la correction de l’auteur et le contrôle à trois intercepts libres. Les mêmes 757 essais P1–P3 sont utilisés, avec exclusion sur log du temps de réaction à ±3 écarts types d’échantillon et exclusion des bornes de session. P4/P5 ne sont pas ajoutés au groupe. Les paramètres du lissage causal de cinq échantillons sont conservés ; ses quatre premières colonnes nulles sont l’initialisation du code source, jamais une imputation des NaN.

Sur les 122 cellules analyte/bin (DA et 5-HT, 61 bins), aucun changement de classement au seuil ponctuel **p < 0,05 non corrigé** pour C, D et C×D, ni entre ancien et corrigé, ni entre corrigé et contrôle. Le même constat vaut sur les bins 11–26. Il ne signifie pas égalité exacte : ancien→corrigé, l’écart maximal de coefficient C×D vaut 0,001191 pour DA et 0,001217 pour 5-HT ; les écarts de p atteignent respectivement 0,050821 et 0,040325 sur les 61 bins. L’affirmation de résultats inchangés est ainsi soutenue pour le classement testé, sans test d’équivalence ni validation d’inférence populationnelle.

Deux solveurs distincts de moindres carrés concordent à une erreur maximale de 2,33×10⁻¹⁶ pour les coefficients. Le lissage est confronté à une construction indépendante par fenêtres. Les résultats numériques figurent dans REGRESSIONS_PAR_BIN.json et COMPARAISON_VERSIONS.json. Les premières colonnes dégénérées n’ont pas de p exploitable et sont notées null, sans les déclarer non significatives.

Les 30 matrices stimulus/décision × DA/5-HT/pH sont vérifiées pour les NaN. Aucune ligne avec valeur non finie n’est conservée par les règles comportementales. En revanche, des essais exclus ont des valeurs finies : « manquant implique exclu » est compatible avec ces données, mais « manquants égaux à tous les exclus » est faux. Effectifs inclus P1–P5 : 202/206, 298/300, 257/259, 298/300, 263/269. Aucun remplacement des NaN par zéro.

La jointure décrite par la wiki est reconstruite par centre temporel le plus proche. Les identifiants d’essai bruts et comportementaux concordent pour les cinq participants ; l’identité des lignes chimiques demeure une convention de rangement, non prouvée par identifiants propres. La cadence médiane est d’environ 100 ms, sans renseigner l’exactitude de l’horloge. Une exception de couverture est signalée : P5, stimulus essai 199, événement 1800,279660 s, centre le plus proche 1800,148360 s, écart −131,300 ms, au-delà de la demi-cadence médiane. Ce résultat n’est pas une latence biologique.

## Limites et suite

Tests réalisés en Python (NumPy 2.5.3, SciPy 1.18.1, h5py 3.16.0), avec entrées archivées. MATLAB/Octave absents : aucune exécution native MATLAB ni vérification du rendu Figure 3 n’est revendiquée. Figure3_TRAVAIL.m et ses entrées sont préparés pour cette exécution ultérieure ; elle requiert MATLAB et ses fonctions statistiques. Référence méthodologique : [documentation officielle glmfit](https://www.mathworks.com/help/stats/glmfit.html), lien identité par défaut pour la distribution normale, contrôle explicite de la constante.

Les exports bruts ne comportent pas de waveform TTL : la précision sous-milliseconde demeure une déclaration de l’auteur. Les données d’entraînement, poids d’inférence et prétraitements non partagés ne deviennent pas accessibles par téléchargement manuel. La reconstruction indépendante des concentrations chimiques reste ouverte.

Huit formulations admissibles limitées inchangées ; quatre axes toujours ouverts. Aucun nouveau délai biologique, aucune conception, publication ou intégration au canon. NHANES et les contrôles conclus ne sont pas repris ; v0.22 et ses vingt empreintes ainsi que v0.6 sont préservés. Aucun courriel envoyé, aucune demande dupliquée. La proposition DataCite de contacter deux responsables concerne ARRC et reste séparée. Automatisation toujours PAUSED. Suite uniquement sur pièce discriminante ou disponibilité d’un environnement MATLAB, sans combler les lacunes par hypothèse.
