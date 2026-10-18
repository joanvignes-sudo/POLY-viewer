# Reproduction v0.16

Entrées : S13 data.mat durable v0.11 ; APPRENTISSAGE_CHOIX et PERTURBATION_MODELE_CHOIX v0.14 ; FORAGING_CIBLES_INT64 v0.13. Restaurer les chemins work/emotionnel_v11, v13, v14, v16 utilisés explicitement dans les scripts. Python avec numpy et scipy ; les scripts cherchent aussi work/research_dependencies. Spécifications conservées dans outputs lors de la reproduction pour leurs empreintes.

Ordre : participation_v16, stability_v16, checks_v16, licks_v16. Aucun envoi de message par ces scripts. Tous les essais sont conservés dans les prédictions de statut d'issue, à l'exception déclarée des deux issues finies ; les fenêtres temporelles invalides sont exclues du seul diagnostic moteur. Les lexèmes « participation/absence » désignent les issues finies enregistrées, pas un diagnostic de motivation.

La stabilité réévalue tous les départs déjà entraînés sans sélection sur test. La logistique est un modèle descriptif distinct de la simulation libre v0.15. Aucun raccord automatique entre ces deux calculs. Données brutes ignorées par Git : sauvegarder séparément donnees avec les manifestes antérieurs.
