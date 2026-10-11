# POLY — variations appariées, recherche v0.32

Huit comparaisons conservent maintenant deux estimations distinctes : variation calculée depuis les moyennes de groupe et variation relative publiée pour les cellules appariées. Exemple Postlethwaite 2007 : montée 25→35 °C, 0,33→0,28 ms, soit 15,15 % depuis les moyennes ; les auteurs rapportent une réduction moyenne de 23,1 ± 5,5 %. La précision limitée des moyennes et l'agrégation peuvent contribuer à l'écart. La différence n'établit pas une erreur. Les erreurs publiées sont conservées sans conversion, leur type restant à vérifier. [Source primaire](https://pmc.ncbi.nlm.nih.gov/articles/PMC2075387/).

Pour des valeurs initiales positives x_i, finales y_i et r_i=y_i/x_i : moyenne(y)/moyenne(x)=somme(x_i r_i)/somme(x_i), alors que la moyenne des ratios vaut somme(r_i)/n. Le premier ratio pondère donc chaque cellule par sa valeur initiale. Ils ne décrivent pas exactement la même estimation. Les moyennes arrondies ne permettent pas de retrouver les paires ou leur covariance.

Une différence des moyennes appariées est, à arrondi près, égale à la moyenne des différences lorsque les mêmes cellules contribuent aux deux moyennes. Cette propriété ne s'étend pas aux ratios et pourcentages. Les formulations prudentes des passes précédentes n'impliquent pas le contraire.

Les huit lignes sont dans VARIATIONS_SEPAREES.csv. Aucun recalcul de significativité, aucun IC inventé, aucune moyenne interétudes. Âge, unités animales et définition des erreurs restent ouverts. L'accès au texte complet par API Europe PMC a échoué (HTTP 500) et l'éditeur a répondu 403 ; cette vérification utilise le passage primaire indexé précédemment acquis, sans contournement. Les valeurs source restent intactes.

Registre v0.32 et point d'avancement actualisés ; quatre axes ouverts ; socle public non édité, dernier contrôle des 20 empreintes conservé de v0.30. Prochaine étape : retrouver les cellules appariées et leurs métadonnées, ou une autre étude dont ces éléments sont réellement disponibles.
