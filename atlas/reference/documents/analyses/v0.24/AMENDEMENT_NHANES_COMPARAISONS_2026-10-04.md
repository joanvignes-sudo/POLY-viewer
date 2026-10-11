# Amendement exploratoire NHANES

Ajouté après les descriptifs de la passe, avant le calcul des estimations suivantes. Cette extension n'est pas une analyse confirmatoire préenregistrée.

La lecture indépendante ReadStat a corrigé un défaut de décodage des zéros IBM XPORT par pandas dans cet environnement. Le nombre de réponses DPQ010=0 est contrôlé contre le codebook officiel (3 703). Aucun fichier source n'est modifié.

Estimation des moyennes et de leurs IC approximatifs à 95 % par linéarisation de Taylor pour le plan stratifié avec unités primaires, approximation avec remise. Les contributions des observations hors domaine sont nulles mais toutes les unités du plan MEC positif sont conservées. Variables de plan: SDMVSTRA, SDMVPSU et WTMEC2YR. Les degrés de liberté sont contrôlés dans chaque domaine; aucune strate à PSU unique n'est corrigée arbitrairement.

Sensibilité exploratoire: régression linéaire pondérée des scores neuf items et huit items sans sommeil, selon groupes de sommeil, âge centré (linéaire et quadratique) et sexe enregistré RIAGENDR. Référence: 7–9 heures. Covariance Taylor stratifiée des scores de régression, sans correction supplémentaire de petit échantillon. Les IC ne corrigent pas le biais de non-réponse, la confusion non mesurée ou les choix exploratoires.

Calculs à vérifier indépendamment par formules équivalentes pour les variances des moyennes et invariance à une multiplication commune des poids. La mise en œuvre est locale: réplication avec un logiciel d'enquête validé reste souhaitable avant publication scientifique.

Références officielles: [variance](https://wwwn.cdc.gov/nchs/nhanes/tutorials/varianceestimation.aspx), [conseils logiciels](https://wwwn.cdc.gov/nchs/nhanes/tutorials/softwaretips.aspx), [DPQ](https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/DPQ_L.htm), [SLQ](https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/SLQ_L.htm).
