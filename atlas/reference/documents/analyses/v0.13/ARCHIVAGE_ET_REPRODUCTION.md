# Archive et reproduction v0.13

Les originaux restent dans donnees/v0.11 (deux ZIPs ignorés par Git, copies durables vérifiées par SHA256). Une sauvegarde complète doit inclure ces ZIPs ; un clone Git seul ne contient pas les données. Les sources et notebooks primaires sont archivés dans analyses/v0.11/code_auteur et dans le paquet S13, les documents respiratoires dans analyses/v0.11.

Les scripts conservent leurs chemins de travail d'origine. Pour refaire les calculs, extraire S13 dans work/emotionnel_v11/S13, S18 dans work/emotionnel_v11/S18, restaurer les fichiers d'audit v0.11 et le texte fig4D-model-comparison.cells.txt dans work/emotionnel_v11 ; fournir SciPy dans work/research_dependencies ou adapter explicitement le chemin. Les versions utilisées sont conservées dans l'archive v0.11. Les deux scripts v0.11 dont des fonctions sont réutilisées sont aussi copiés ici.

Ordre : audit_integrity, foraging_inventory, foraging_bins, foraging_models ; transfer ; perturbation ; respiration ; provenance_latents ; extraire le code du notebook figs-S7-S8 dans uncertainty-notebook.cells.txt puis latent_comparison ; statistics_and_controls. Chaque script est suffixed _v13.py. dryad_v13.py enregistre un refus HTTP 403, pas une provenance vérifiée. save_v13.py dépend également des manifests et dossiers locaux conservés et ne sert pas à recalculer un résultat scientifique.

Les spécifications du transfert et du foraging sont figées dans des fichiers distincts dont les SHA256 correspondent aux analyses ; la spécification générale conserve les extensions successives. La calibration n'utilise pas les essais d'évaluation. Les valeurs latentes fournies restent descriptives, sans garantie de paramètres estimés hors futur. Les résultats ne constituent pas une reproduction du modèle Stan ni du pipeline de cohérence brut.

Le manifeste conserve les SHA256 des fichiers archivés. La règle Git locale du répertoire v0.13 préserve leurs octets, notamment les fins de ligne des spécifications.
