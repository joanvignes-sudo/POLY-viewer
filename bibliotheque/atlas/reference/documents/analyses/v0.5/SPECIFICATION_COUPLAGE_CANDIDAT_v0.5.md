# Couplage candidat v0.5 — activité préalable et choix enregistré

Spécification fixée avant l'ajustement. 4 octobre 2026. Exploration locale, sans preuve affective ni causale.

Cible : présence d'un choix gauche/droite après un indice CS PLUS ; ne pas utiliser CS MINUS comme absence de réponse comparable. Les quatre sessions restent inventoriées ; une session sans les deux classes est déclarée non estimable, sans substitution d'une autre session.

Covariables M0 : intercept, progression de session, cinq choix signés passés, cinq récompenses signées passées, cinq indicateurs CS MINUS passés et cinq indicateurs CS PLUS sans choix passés. M1 ajoute les taux de spikes des unités enregistrées simultanément dans [−2 s, 0[ avant l'indice. Les unités d'une session sont des colonnes, pas des animaux indépendants. Leur ordre et les flags exportés sont conservés.

Ne retenir que les cibles PLUS à partir du sixième essai, sans intervention laser/automatique dans la cible et les cinq antécédents, avec fenêtre couverte par la durée brute. Aucun spike après l'indice n'est un prédicteur de cette cible. Temps et variables standardisés avec le seul apprentissage. Régression logistique, pénalité L2=1 hors intercept, sans optimisation du réglage.

Cinq blocs de test successifs sur la seconde moitié des essais originaux, apprentissage sur tous les essais antérieurs. Conditions : ≥150 cibles admissibles par session ; deux classes dans chaque apprentissage ; ≥10 cibles par bloc. Test primaire descriptif : différence de perte logarithmique M0−M1. Exactitude secondaire, à interpréter en tenant compte de la forte proportion de choix.

Contrôle descriptif : décaler circulairement ensemble les colonnes neuronales à 50 offsets distincts de plus de 20 cibles (graine 20261004). Garder leurs relations interunités. Réajuster M1 sans changer les covariables comportementales. La fraction des gains décalés au moins égaux au gain observé n'est pas une valeur p confirmatoire ; la non-stationnarité et la sélection de deux sessions limitent l'interprétation.

Un gain positif serait seulement compatible avec une information prédictive locale, sous les covariables observées. Le mouvement, le léchage spontané, l'état d'éveil et les historiques plus longs ne sont pas contrôlés ici. Aucun contraste de groupe, aucune conclusion générale sur LC-NE, aucune inférence d'émotion ou de conscience.
