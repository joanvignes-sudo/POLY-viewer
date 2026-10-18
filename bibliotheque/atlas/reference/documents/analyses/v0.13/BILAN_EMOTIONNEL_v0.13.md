# POLY émotionnel v0.13 — étapes 2, 3 et 4 approfondies

4 octobre 2026. Cette passe poursuit l'audit, les comparaisons de modèles et les perturbations avec les données accessibles. Aucun chantier de conception. La baseline publique v0.22 reste séparée. Les spécifications et amendements précèdent les résultats correspondants ; leurs versions et empreintes sont conservées.

## Étape 2 — audit des données

### Première tâche neuronale : reconstruction indépendante

Les 37 unités retenues dans 28 sessions chez quatre animaux ont été contrôlées à partir des exports de spikes. Aucun timestamp exactement partagé entre exports adjacents n'est détecté dans ces unités. Les comptes pré-indice du chargeur correspondent aux comptes construits sur l'union des timestamps exportés : aucun essai divergent. Cette union est un diagnostic, pas une validation physique des horloges ni une justification générale de déduplication.

### Seconde tâche neuronale : contrôle d'un dépassement numérique

L'inventaire de la tâche foraging retrouve **66 unités TT, 34 sessions, quatre animaux**, avec 8 502 CSplus et 338 CSminus ; parmi les CSplus, 14 essais sont sans choix et aucun n'a deux côtés choisis. Les quatre animaux CG sont distincts des quatre BB retenus dans la première tâche. Les unités et essais ne sont pas traités comme des animaux indépendants.

Le chargeur auteur produit 4 186 avertissements de dépassement numérique dans notre environnement. Des types entiers non signés peuvent représenter les temps relatifs négatifs par retour modulo. La reconstruction indépendante convertit les timestamps en int64 avant soustraction et addition. **390 séries relatives par essai diffèrent avant binning**, mais les matrices obtenues dans la fenêtre effectivement analysée sont identiques pour les 66 unités ; aucun compte pré-indice ne change. Cette concordance ne sécurise pas automatiquement les séries relatives pour d'autres usages ou fenêtres. Les fichiers et le chargeur originaux restent conservés.

Le chargeur foraging inclut les CSminus comme issues zéro dans son historique de récompense. Notre extension chronologique construit explicitement l'historique sur les CSplus précédents avec choix valide. Elle n'est donc pas une reproduction silencieuse de cet historique auteur. La publication décrit 66 neurones identifiés dans cette tâche, mais l'inventaire des champs TT ne fournit pas à lui seul une nouvelle validation de l'identification optogénétique de chaque unité. [Grossman et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825708/), [paquet distribué](https://doi.org/10.5281/zenodo.14628985).

### Provenance et respiration

Le lien public du fichier Dryad a été essayé après découverte sur la page officielle : retour HTTP 403. La comparaison binaire amont reste ouverte ; nous ne l'annonçons pas vérifiée. Les deux archives Zenodo conservées restent vérifiables par SHA256.

Pour anesthésie/ventilation, ordre des canaux, coordonnées et régions sont concordants. Pour ventilation standard/lente-profonde, les canaux et régions concordent ; les coordonnées ne sont pas présentes dans les deux exports. L'identité physique complète des paires reste à confirmer. Le statut brut/déjà corrigé des Pvalues n'est pas inféré à partir des indicateurs.

### Vérification de chiffres publiés

Sept couples F/p exacts ont été extraits de l'article sérotoninergique. Six sont compatibles avec l'arrondi annoncé. Pour F(1,58)=13,7, le texte donne p=0,003 ; la queue F non ajustée vaut environ 0,000479. L'arrondi seul ne suffit pas à expliquer cet écart. Une correction ou convention de rapport différente reste possible : **aucun chiffre publié n'est corrigé**, aucune conclusion biologique n'est annulée sur cette base. Ce point rejoint les clarifications statistiques encore attendues. [Article source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825708/).

### Variables latentes : convention d'alignement retrouvée

Le fichier d'incertitude fourni contient 32 trajectoires finies. Aucune longueur ne correspond directement au nombre brut d'essais : cela ne démontre pas une anomalie. Le notebook retire les catch trials, retire le dernier état latent et suppose une troncature après neuf essais sans léchage anticipatoire. Les 28 sessions utilisées peuvent être alignées comme préfixes selon cette convention ; quinze sont plus courtes que la série entière d'essais hors catch. La règle exacte d'arrêt n'est pas indépendamment reproduite. Le notebook étiquette les valeurs « Expected uncertainty (Z) » : leurs valeurs négatives ne doivent pas être interprétées comme une variance physique négative.

Dans la seconde tâche, les valeurs finies de récompense associées aux choix sont bien binaires (0/1) dans les 34 sessions. Les absences de choix sont conservées séparément, sans inventer une issue observée.

## Étape 3 — comparaisons de modèles

### Transfert entre animaux avec calibration séparée

Les modèles temporels sont entraînés sur trois animaux. Pour le quatrième, les cinq premiers essais de chaque unité sont exclus ; les premiers 20 % des essais restants servent à mesurer un niveau pré-indice, et les derniers 80 % à évaluer. La seule calibration est une correction additive du niveau de base, sans régler les paramètres ni le gain sur l'évaluation. Les autres familles utilisent les mêmes partitions.

| Animal évalué | R² prospectif direct, fenêtre entière | R² après calibration, fenêtre entière | R² après calibration, après indice | Dérive baseline évaluation−calibration, Hz |
|---|---:|---:|---:|---:|
| BB025 | −9,7278 | −1,5715 | −1,4854 | −0,3411 |
| BB031 | −0,1190 | +0,0318 | −0,0122 | −0,2959 |
| BB033 | −3,3840 | −5,7366 | −5,6953 | −0,1580 |
| BB036 | −87,7824 | −16,5290 | −16,3338 | −0,1633 |

Les quatre ajustements prospectifs retenus passent les contrôles d'optimisation et de domination du constant sur apprentissage ; leurs minima globaux ne sont pas certifiés. Les taux corrigés restent non négatifs. La correction améliore trois cas sur quatre mais ne suffit pas à un transfert robuste : trois R² globaux restent négatifs, et les quatre R² après indice sont négatifs. La baseline diminue entre calibration et évaluation dans les quatre animaux. Cette dérive, l'hétérogénéité des réponses et le modèle lui-même restent des explications distinctes ; leur rôle relatif n'est pas identifié par cette seule analyse.

La cible est une moyenne temporelle pondérée par nombre d'essais/unité, pas une prédiction d'émotion ou une preuve d'absence de fonction sérotoninergique. Ces partitions diffèrent de v0.11 : ne pas comparer directement leurs R² comme une variation d'un seul facteur.

### Seconde tâche : prédiction chronologique pré-indice

Quatre modèles Poisson sont comparés sur les comptes de spikes pré-indice : M0 (temps), Mprev (temps + dernier choix/récompense), Mhistory (Mprev + fraction récompensée des cinq CSplus précédents), Mproxy (Mhistory + p(1−p)). Les cinq essais précédents doivent avoir un choix unique ; les essais courants sans choix restent admissibles, pour éviter une sélection par leur issue future. Les CSminus sont exclus de l'historique.

| Animal | Sessions | Gain M0−Mprev | Gain Mprev−Mhistory | Gain Mhistory−Mproxy |
|---|---:|---:|---:|---:|
| CG09 | 3 | −0,00447 | −0,00778 | −0,00072 |
| CG16 | 4 | −0,05417 | +0,00174 | +0,00729 |
| CG75 | 12 | −0,00009 | −0,00127 | −0,01508 |
| CG79 | 15 | −0,00180 | −0,00879 | −0,00540 |

Un gain positif favorise le modèle ajouté. Les moyennes sont calculées unités→sessions→animaux. Sur 66 unités, 24 ont un gain d'historique positif, mais une seule des quatre moyennes par animal est positive. Le modèle avec dernier choix/récompense n'améliore la moyenne d'aucun animal par rapport au temps seul. Aucune règle de prédiction commune n'est retenue avec ces variables et réglages.

Ce résultat complète la première tâche sans fusionner les cohortes. Le proxy p(1−p) n'est **pas** la variable latente d'incertitude du modèle original. La reproduction du modèle hiérarchique Stan reste ouverte : un ajustement Poisson de spikes ne la remplace pas. Les traces de contacts et calibrations physiques restent nécessaires pour traiter d'autres explications sensorielles/motrices.

Les 1 320 ajustements passent le seuil de gradient fixé ; 107 ont nécessité un raffinement de précision Newton sur le même objectif. Le gradient moyen maximal final est inférieur à 1e−8. Les gradients et Hessiennes analytiques sont contrôlés par différences finies, avec erreurs maximales inférieures à 8e−11. Aucun p de population sur les unités n'est calculé.

### Comparaison descriptive des variables latentes fournies

La stratification auteur de l'incertitude fournie selon les six niveaux d'historique de récompense est reproduite sur 28 sessions. La corrélation avec la moyenne de récompense est négative dans 27 sessions, celle avec p(1−p) positive dans 24. Les médianes des r² sur ces six moyennes stratifiées valent respectivement 0,7839 et 0,1032. Ces r² ne sont pas des R² de validation temporelle et ne sont pas calculés sur des essais indépendants.

Cette comparaison précise pourquoi le proxy de variance et la sortie du modèle ne sont pas interchangeables. Elle ne départage pas à elle seule leurs mécanismes : les sorties sont dérivées du même comportement, l'alignement utilise une convention d'auteur et l'absence d'estimation sur les données futures n'est pas garantie. Les paramètres/postérieurs et les règles d'arrêt restent nécessaires pour une réanalyse prédictive valide. [Code et données utilisés](https://doi.org/10.5281/zenodo.14628985).

## Étape 4 — perturbations et robustesse

### Sérotonine : mêmes inversions, comparaison avant/après

La passe v0.12 changeait aussi les événements admissibles selon la longueur de fenêtre. Cette extension fixe **165 inversions**, avec au moins vingt CSplus de chaque côté du changement. Les trois fenêtres utilisent donc les mêmes événements. Les fenêtres sans choix restent dans les proportions sur tous les essais ; leur proportion conditionnelle est non estimable.

Voici les médianes par groupe de la différence agoniste−véhicule du changement après−avant, pour la fraction vers l'ancien côté parmi tous les essais :

| Fenêtre | DREADDs | Témoins mCherry |
|---|---:|---:|
| 5 essais | +0,1307 | −0,1133 |
| 10 essais | +0,0799 | +0,0618 |
| 20 essais | −0,0146 | +0,1118 |

Ces signes et amplitudes restent sensibles à la fenêtre, même avec événements communs et niveau initial pris en compte. Six animaux par groupe ; pas de test sur les transitions comme unités indépendantes. La sélection de blocs longs réduit fortement la couverture et ne produit pas un effet causal ajusté. Le signal descriptif ne devient pas un couplage robuste. Il ne réfute pas la comparaison originale de constantes d'apprentissage, qui repose sur d'autres mesures et un modèle hiérarchique.

### Respiration : sensibilité à chaque participant et au type de test

Pour ventilation lente/profonde versus standard, la fraction de sites retenus augmente chez les cinq participants. En retirant chaque personne, toutes les différences restantes sont positives et les médianes vont de +0,1416 à +0,2747. La direction de cet indicateur résiste donc à ce contrôle. Le p bilatéral passe de 0,0625 à 0,125 avec quatre participants : la perte de seuil ne signifie pas disparition de l'effet descriptif. Il s'agit des indicateurs fournis, sans reproduction du traitement intracrânien brut.

La cohérence moyenne de tous les sites est une autre cible : deux participants augmentent, trois diminuent ; sa médiane change de signe selon la personne retirée. Aucune augmentation générale de cette moyenne n'est retenue. Anesthésie automatique versus ventilation présente également une hétérogénéité : moyenne de cohérence positive chez six sur huit, fraction de sites retenus positive chez quatre sur huit. Les exclusions individuelles restent des diagnostics, jamais une sélection favorable.

Le script fourni calcule un test non apparié sur huit moyennes éveillées et six moyennes de sommeil. Le calcul numérique donne p≈0,0426, mais **six participants appartiennent aux deux ensembles**, en contradiction avec l'indépendance des échantillons qu'exige ce test. La comparaison appariée des six personnes communes donne p=0,4375 et médiane sommeil−éveil −0,0469. Elle ne force pas des sites identiques ; elle ne remplace donc pas non plus une analyse appariée complète des signaux. La comparaison par coordonnées de v0.11 reste distincte. Le script présente aussi une condition de contrôle qui consulte dataAw avec le masque dataVS ; dans ces exports elle n'empêche pas le calcul, mais elle n'est pas une validation des données ventilées. [Code fourni](https://github.com/rakib05/NeuralBreathing), [publication](https://pmc.ncbi.nlm.nih.gov/articles/PMC13388959/).

### Cœur, CO₂, isoprotérénol et GABA–dopamine

Leurs données nécessaires aux réanalyses temporelles ne sont pas dans les archives disponibles. Les contrôles, cohortes, chevauchements de participantes, effets concomitants et limites de causalité restent documentés dans la matrice v0.11. Aucune latence, médiation ni comparaison soustraction/gain nouvelle n'est inventée à partir de figures agrégées. Les demandes aux auteurs restent la dépendance concrète.

## Ce qui reste ouvert

- Horloges physiques, couverture des capteurs, identité optogénétique et mapping de la préparation libre.
- Fichiers LC/pupille manquants et clarification des ports.
- Données cœur–insula et clarification des chiffres statistiques.
- Signaux intracrâniens bruts, fréquence sommeil, dérivation des indicateurs et identité physique des sites.
- Traces interoceptives et physiologiques synchronisées, conditions de partage.
- Données dopamine/GABA et sérotonine récompense/punition demandées à Uchida.
- Code/paramètres/postérieurs du modèle d'apprentissage original, puis reproduction hiérarchique et comparaison temporelle correctement séparée.

Les étapes 2–4 sont approfondies, pas déclarées closes. Aucun couplage universel n'est validé. Les effets locaux décrits par les publications, les modèles et nos échecs prédictifs restent séparés. La v0.22 demeure stable et aucun mélange émotion/conscience n'est introduit.
