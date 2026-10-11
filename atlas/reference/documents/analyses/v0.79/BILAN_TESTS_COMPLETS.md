# Comparaison complète des calculs Figure 3 — v0.79

7 octobre 2026 ; branche Git `emotionnel`, S24 / Bang 2020, hors canon. Déclencheur : demande de tester complètement et comparer après la correction publique de Figure3.m. Sources figées : ancienne archive `0105f91e14364a9849b87e6d1013529ef0dec54e`, correction auteur `5cddcd20ed1dda2979f277f0434356c8413beae8`, données locales v0.14. Événement de référence : stimulus ; trous visés : couverture des blocs Figure3A/3C, covariance et p, stabilité du codage des intercepts et attribution de la fenêtre affichée. Spécification enregistrée avant les calculs.

## Résultat principal

La comparaison ne trouve **aucun changement de classement au seuil ponctuel p < 0,05 non corrigé** entre les trois versions du groupe P1–P3, pour les cinq covariables A, RT, C, D et C×D, sur tous les bins exploitables et sur la plage affichée de Figure3C. Les coefficients, erreurs types et probabilités changent néanmoins : l'absence de changement de classement ne prouve ni égalité des résultats numériques, ni équivalence statistique, ni réplication populationnelle.

| Comparaison sur Figure3C, 0–4 s, effet C×D | Écart maximal de coefficient | Écart maximal de p | Classement p < 0,05 modifié |
|---|---:|---:|---:|
| DA, ancienne → correction auteur | 0,001191 | 0,050821 | aucun bin |
| 5-HT, ancienne → correction auteur | 0,001217 | 0,040325 | aucun bin |
| DA, correction auteur → trois intercepts libres | 0,001664 | 0,060184 | aucun bin |
| 5-HT, correction auteur → trois intercepts libres | 0,001681 | 0,078604 | aucun bin |

Les comparaisons des autres covariables, de chaque erreur type et des 61 bins sont dans COMPARAISON_COMPLETE.json. Les chiffres n'ont pas l'unité d'une concentration chimique absolue.

## Couverture réalisée

Figure3A : 732 comparaisons de cohérence faible/forte (DA et 5-HT, cinq participants séparés et groupe P1–P3, 61 bins). Moyennes et erreurs types des essais, test t bilatéral à variance commune conformément à la source. Les blocs d'analyse ancienne/corrigée de Figure3A sont textuellement identiques ; les calculs n'ont donc pas été présentés comme deux expériences indépendantes.

Figure3C : 610 régressions individuelles, puis 366 régressions de groupe (122 cellules × trois modèles). Les cinq participants sont examinés individuellement ; seul P1–P3 forme le groupe, soit 757 essais. Les blocs individuels sont identiques entre anciennes et nouvelles sources. Les deux variantes supplémentaires du groupe sont comparées sur les mêmes essais, sans ajouter P4/P5.

Les règles comportementales et les paramètres du lissage sont conservés. La nouvelle construction utilise des fenêtres vectorisées ; aucune valeur manquante n'est imputée. Les quatre premières colonnes sont nulles par initialisation de la source : p y est non exploitable, représenté par null. Chaque courbe comporte donc 57 bins avec p finite et non 61 tests non dégénérés.

Figure3A, 5-HT, groupe : 370 essais de cohérence faible et 387 forte. Les bins 15–20 (0,4–0,9 s sur l'axe nominal du code) satisfont p < 0,05 non corrigé. Ce sont des points d'une courbe lissée, pas une nouvelle estimation d'onset ni de latence biologique. P4 et P5 ne montrent aucun bin au-dessous du seuil dans la fenêtre affichée 0–1,5 s ; ceci ne les classe pas comme « non-répondeurs » et ne prouve pas une absence d'effet.

## Vérification indépendante

La nouvelle estimation des coefficients et de la covariance utilise la décomposition QR et l'inverse triangulaire, distinctes des moindres carrés SVD et pseudo-inverse de l'audit v0.78. Les probabilités sont confrontées entre distribution de Student et beta incomplète ; les tests t sont confrontés entre formule explicite et routine indépendante de bibliothèque. Tolérance absolue fixée à 10⁻¹⁰.

| Vérification | Erreur maximale |
|---|---:|
| Coefficients groupe QR versus v0.78 | 2,16×10⁻¹⁶ |
| Erreurs types groupe QR versus v0.78 | 5,56×10⁻¹⁷ |
| p groupe versus v0.78 | 1,74×10⁻¹¹ |
| p beta incomplète versus Student | 4,67×10⁻¹¹ |
| p du test t, formule versus bibliothèque | 2,23×10⁻¹⁶ |
| Résidus des équations normales | 1,25×10⁻¹³ |

Les 1 126 assertions enregistrées passent. Elles comprennent notamment les états de finitude, le rang des matrices et les tolérances ; ce nombre ne représente pas 1 126 confirmations scientifiques indépendantes. Les rangs des trois modèles de groupe sont respectivement 6, 7 et 8.

Le contrôle à trois intercepts libres est également recalculé sous trois codages : référence P2, référence P3 et trois indicatrices sans constante. Ces 366 régressions de recodage conservent les cinq coefficients communs, leurs erreurs types et les prédictions à moins de 4,45×10⁻¹⁶. Ce test confirme l'équivalence des codages du modèle complet. La correction auteur reste différente : deux indicatrices sans constante imposent un intercept nul à P1. Aucun changement silencieux n'a été fait au fichier auteur.

Références de la traduction : [glmfit, MathWorks](https://www.mathworks.com/help/stats/glmfit.html) et [ttest2, MathWorks](https://www.mathworks.com/help/stats/ttest2.html). Il s'agit d'une vérification des calculs et de la traduction, pas d'une exécution de ces fonctions MATLAB.

## Rectification du bilan v0.78

L'audit v0.78 attribuait à la Figure3C la fenêtre MATLAB 11–26, soit 0–1,5 s. Cette plage appartient à Figure3A. **Figure3C affiche les bins 11–51, soit 0–4 s.** Les 61 bins avaient tous été calculés en v0.78 : aucune cellule supplémentaire n'était nécessaire pour ses coefficients, mais le focus et sa description étaient mal attribués. La comparaison correcte est désormais fournie. Les fichiers historiques v0.78 sont conservés ; leurs passages sur la fenêtre de tracé sont supersédés par ce bilan.

## Alignement P5 et figures

Le voisinage du seul événement anomal examiné confirme un espacement de **339,160 ms** entre les centres 1800,148360 et 1800,487520 s. Le stimulus P5, essai 199, à 1800,279660 s tombe dans cet intervalle ; son centre le plus proche est distant de 131,300 ms. Cet essai est conservé par les règles comportementales. Le signal exporté permet une régression, mais ce voisinage ne doit pas être traité comme une couverture temporelle ordinaire à demi-cadence. P5 est exclu du groupe P1–P3 par le périmètre de l'analyse, pas par une nouvelle règle créée pour cette anomalie. Aucune concentration n'est reconstruite et aucune latence biologique n'en est déduite.

Les figures Python suivantes sont produites et examinées visuellement : Figure3A 5-HT avec ses quatre panneaux ; Figure3C DA et 5-HT selon les axes de la source ; superposition des trois modèles de groupe. Courbes, légendes, axes, moyennes ± SEM et marqueurs de p sont lisibles. La légende de Figure3A est placée sous les panneaux pour ne pas masquer les données. Ce sont des reconstructions numériques, sans identité pixel revendiquée avec la publication ou MATLAB. L'archive v0.14 ne contient pas d'images Figure3 de référence.

## Limite de clôture et état du chantier

**Tous les blocs statistiques présents dans Figure3.m sont couverts par la traduction numérique. L'exécution native MATLAB et son rendu ne sont pas vérifiés.** MATLAB et Octave sont absents de cet environnement ; aucune licence, connexion ou installation globale n'a été modifiée. La copie native et ses entrées préparées v0.78 restent disponibles. Il ne s'agit pas d'une réplication de toutes les figures de l'article, ni d'une reconstruction des prédictions chimiques à partir des courants. Entraînement/poids/prétraitements restent non disponibles, et les waveforms TTL absentes des exports.

Huit formulations admissibles limitées inchangées, quatre axes ouverts. Hors canon, aucune publication, conception biologique ou association émotion/conscience. v0.22 et ses vingt empreintes ainsi que v0.6 sont préservés ; NHANES et les contrôles déjà clos ne sont pas repris. Aucun nouveau courriel, téléchargement de données ou contact DataCite. Automatisation PAUSED inchangée. Registre courant v0.79 ; provenance et résultats durables sauvegardés dans Git.
