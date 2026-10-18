# Reproduction v0.14

Conserver les chemins relatifs work/emotionnel_v11, work/emotionnel_v13 et work/emotionnel_v14 dans un espace de calcul. Restaurer FORAGING_CIBLES_INT64.json et TRANSFERT_CALIBRATION.json depuis v0.13, les données S13 depuis donnees/v0.11 et le snapshot S24 depuis donnees/v0.14. Les scripts déclarent leurs chemins d'entrée ; Python avec numpy, scipy et h5py est nécessaire. Les dépendances scientifiques supplémentaires utilisées ici sont dans work/research_dependencies, sans modification des données sources.

Ordre : learning_models, online_baseline, chem_learning, learning_sensitivity, human_audit, finalize_checks. Ne pas relancer les scripts de correspondance pour reproduire les calculs : DEMANDE_BANG_VERIFIEE est la preuve d'un message déjà envoyé. Les JSON PREPAREE et INVENTAIRE_OSF sont des instantanés antérieurs à l'envoi/téléchargement ; les fichiers VERIFIEE et PROVENANCE_DURABLE constituent l'état final.

Les empreintes couvrent les fichiers de l'archive ; le manifeste ne se couvre pas lui-même. Les ZIP et MAT dans donnees sont ignorés par Git et doivent être sauvegardés séparément avec PROVENANCE_DURABLE_S24. Aucun poids de calibration chimique n'a été inventé. Aucun modèle original hiérarchique n'est annoncé reproduit.
