# Plan de contrôle documentaire et technique — 17 octobre 2026

Fixé après lecture des publications et métadonnées générales, avant lecture de séries numériques Emo-FilM.

Question : les fichiers permettent-ils une jointure explicite film / sujet / session / modalité et une reconstruction de leur axe temporel ? Aucun test d’effet émotionnel, corrélation cerveau-corps ou sélection de région n’est prévu.

Sélection déterministe : premier film par ordre lexicographique des consensus dérivés, AfterTheRain ; premier sujet IRMf par ordre lexicographique, sub-S01 ; session retrouvée par nom exact du film. Cette sélection est un pilote de format, pas un échantillon représentatif ni un domaine indépendant pour une validation.

Acquérir métadonnées, événements du film, consensus et une série physiologique au maximum ; aucun volume IRM, film ou vidéo de patient. Limite de 30 Mo par série. Figer les commits des deux dépôts dans les URL. Contrôler SHA256 Git-annex lorsque disponible, décompression, nombre de colonnes, valeurs manquantes/non finies, nombre de lignes, fréquence et origine temporelle.

Conventions : t(i) = StartTime + i / SamplingFrequency avec i commençant à zéro. Aucune compensation implicite de 90 secondes, délai de réponse ou délai hémodynamique. Conserver les unités déclarées ; si absentes, afficher non renseignées. Les enregistrements des annotateurs et sujets IRMf ne deviennent jamais les mesures d’une même personne.

Avant le calcul sur série : tester fréquence positive, cas constant, manquants, paramètres temporels ambigus, index hors limites, et première/dernière coordonnée temporelle. Ne pas imputer ni normaliser les données du pilote. Les échecs et contradictions seront conservés.

Sorties : inventaire et diagnostic de structure uniquement. Aucun p, effet biologique, délai neuronal ou validation scientifique ne sera revendiqué. Toute analyse supplémentaire demandera un nouveau plan fixé avant son calcul.
