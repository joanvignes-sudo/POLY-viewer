# Rejouer les tests

Depuis la racine du chantier, avec Python et NumPy/SciPy/h5py :

```powershell
python analyses/v0.78/preparer_donnees.py
python analyses/v0.78/test_bang_v078.py --repo .
```

Le préparateur utilise uniquement l’archive locale donnees/v0.14/S24_repository_0105f91.zip. L’audit lit aussi les cinq fichiers donnees/v0.14/S24_raw/P*_rawData.mat déjà archivés. Le paramètre optionnel `--libs` accepte un répertoire contenant les bibliothèques ; versions de la passe dans VERIFICATION_NUMERIQUE.json. Aucune acquisition réseau. Les sorties JSON sont régénérées ; ne lancer cette opération qu’avec un accès exclusif au chantier.

Dans un environnement MATLAB disposant des fonctions statistiques, ouvrir Figure3_TRAVAIL.m après la préparation. Le script utilise des chemins absolus dérivés de sa propre localisation et écrit les figures dans runtime/Figures. L’exécution native n’a pas été réalisée dans cette passe. Ne pas attribuer au fichier auteur le contrôle alternatif à trois intercepts libres : ce dernier reste dans l’audit Python et ses sorties.
