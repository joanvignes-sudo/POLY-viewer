# POLY emotionnel — spécification du pilote comportemental

4 octobre 2026. Fixée avant l'ajustement sur les choix et récompenses de la session d'audit ZS060. Analyse exploratoire d'une session sélectionnée auparavant par taille minimale ; aucune inférence de population. Pas d'alignement spikes–événements tant que le gate de synchronisation n'est pas satisfait.

Objectif : tester si l'histoire des récompenses améliore la prédiction du choix gauche/droite au-delà de la répétition des choix et de la dérive dans la session. Cela ne mesure ni émotion, ni concentration de noradrénaline, ni RPE neurale.

Règles fixées :

- Conserver l'index des essais originaux. Exclure la cible si absence de réponse, laser ou eau automatique/manuelle. Ne pas reconstruire une réponse absente.
- Vérifier que les indicateurs de récompense correspondent aux listes d'événements de récompense avant de les employer. En cas de discordance non résolue, suspendre l'ajustement.
- Cinq retards d'essais. Les cibles et leurs cinq essais précédents doivent être sans stimulation ni récompense automatique/manuelle. L'absence de réponse dans l'histoire reste une variable explicite.
- M0 : biais, progression normalisée dans la session, cinq choix précédents codés −1/0/+1 et cinq indicateurs d'absence de réponse.
- M1 : M0 + cinq récompenses signées par le côté choisi. Ce sont des variables d'histoire, pas des attentes subjectives.
- Régression logistique avec pénalité L2 fixée à 1 sur les coefficients hors intercept ; aucune recherche d'hyperparamètres.
- Validation progressive : apprentissage sur tous les essais antérieurs ; cinq blocs de test successifs entre 50 % et 100 % de la session. Standardisation calculée uniquement sur les données d'apprentissage. Pas de mélange aléatoire d'essais.
- Mesure principale : perte logarithmique moyenne hors apprentissage. Gain = perte M0 − perte M1. Accuracy secondaire. Publier les cinq blocs, y compris résultats défavorables.
- Contrôle de décalage : 50 translations circulaires de la série de récompenses signées, au-delà de 20 essais ; mêmes splits et mêmes modèles. Ce contrôle conserve une structure sérielle et brise le raccord immédiat, mais reste imparfait dans une tâche non stationnaire. Pas de p-value confirmatoire.
- Minimum : 150 cibles admissibles, deux classes dans l'apprentissage et au moins 10 cibles par bloc. Sinon, livrer seulement l'audit descriptif.

Les fenêtres neuronales et un modèle d'attente/RPE restent hors de ce pilote. Les probabilités exportées n'entrent pas dans l'ajustement : leurs unités et leur rôle subjectif ne seront pas supposés. La précision d'horloge civile et l'identification de projection ne sont pas nécessaires à cette comparaison comportementale au sein d'un fichier.
