# Mesures descriptives v0.4

Critères fixés après l'audit des horloges et avant le calcul des comptes neuronaux. Les quatre sessions v0.3 restent la cohorte, le fichier de développement reste séparé.

Conserver les étiquettes CS PLUS/MINUS du journal brut en ordre, avec contrôle du nombre et de l'affinité d'horloge. Croiser ces étiquettes avec le code de réponse : PLUS avec choix, PLUS sans choix enregistré, MINUS avec/sans choix enregistré. Une absence de choix enregistré n'établit ni désengagement, ni affect.

Construire une table par essai et unité exportée : comptes de spikes dans [−2 s, 0[ et [0, 0,3 s[ par rapport au début d'indice électronique enregistré, puis taux divisés par la durée. La frontière à 0 est exclue du premier et incluse dans le second. Ces fenêtres descriptives se rapprochent de celles de Fig.4g de Su et al. ; aucun test de réplication ni attribution acoustique. Conserver les indicateurs if_real_unit, default_qc et optotag sans transformer ces indicateurs en preuve d'identité cellulaire.

Rapporter effectifs et moyennes par session/unité/indice/réponse. Pas de test neuronal, pas de regroupement des spikes comme observations animales indépendantes, pas de sélection selon l'amplitude, pas d'étiquette émotionnelle. Les premières/dernières fenêtres hors intervalle brut de début/fin d'enregistrement sont signalées et exclues des moyennes.

Réexaminer le pilote comportemental avec la même cible et le même protocole de validation, en séparant deux indicateurs de passé : CS MINUS et CS PLUS sans choix. M0 reçoit ces indicateurs au lieu du seul indicateur de code 2 ; M1 ajoute les récompenses signées comme auparavant. Les résultats v0.3 restent conservés et leur interprétation est corrigée, sans changer leurs chiffres. Ce réexamen est exploratoire.
