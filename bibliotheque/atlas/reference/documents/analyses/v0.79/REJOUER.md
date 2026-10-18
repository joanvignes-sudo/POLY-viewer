# Rejouer la comparaison

Préconditions : accès exclusif au chantier ; Python avec NumPy, SciPy, h5py et matplotlib. Versions effectives dans VERIFICATION_COMPLETE.json.

```powershell
python analyses/v0.79/test_complet.py --repo .
```

Le paramètre optionnel `--libs` indique un répertoire de bibliothèques locales. Entrées : archive donnees/v0.14/S24_repository_0105f91.zip ; seul brut P5 pour le voisinage ciblé ; deux sources Figure3 de sources/v0.77 ; résultats v0.78 pour la confrontation entre méthodes. Pas de réseau utilisé par le test. Aucun code MATLAB source exécuté. Le test régénère les JSON et quatre PNG du dossier v0.79.

Pour exécuter ultérieurement le script MATLAB, utiliser analyses/v0.78/preparer_donnees.py puis Figure3_TRAVAIL.m. La rectification du focus de tracé ne nécessite aucune modification de ce script : ses plages étaient déjà celles de l'auteur. Les fichiers v0.78 sont conservés, avec l'erratum exposé dans le bilan v0.79.
