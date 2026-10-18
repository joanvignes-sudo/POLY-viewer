# Reproduction et statut v0.15

Entrées : fichiers humains durables S24_raw et snapshot S24 depuis donnees/v0.14 ; résultats PERTURBATION_MODELE_CHOIX.json v0.14 ; data.mat S13 v0.11 ; FORAGING_CIBLES_INT64.json v0.13 pour le préfixe du noyau de choix. Restaurer les chemins work/emotionnel_v11, v13, v14 et v15 déclarés dans les scripts. Dépendances Python : numpy, scipy, h5py. La sensibilité appelle le moteur libre avec 1 024 agents et une nouvelle graine, sans réajustement.

Ordre de calcul : timing_human_v15, free_simulation_v15, sensitivity_simulation_v15, checks_v15. Les spécifications dans outputs sont utilisées pour leurs empreintes. checks_v15 conserve l'erreur d'accès Dryad et les diagnostics de domaine ; il ne renvoie aucun email. Les preuves d'envoi demeurent dans les archives antérieures. Les 22 signes stables sont des résultats bruts avant mise en quarantaine de DR13.

Les données MAT/ZIP ignorées par Git sont conservées dans donnees et nécessitent une sauvegarde séparée. Aucun ajustement de temps n'est écrit dans les sources. Aucun poids chimique, code original ou effet pharmacologique n'est annoncé reproduit.
