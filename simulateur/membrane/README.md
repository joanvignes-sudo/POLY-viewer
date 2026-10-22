# POLY — consultation locale intégrée

Ouvrir un terminal dans ce dossier et lancer `python serve.py`, puis ouvrir http://127.0.0.1:27317/web/index.html. Le serveur écoute uniquement sur cet ordinateur. Arrêt avec Ctrl+C. Les fichiers HRA et bibliothèques sont inclus : aucun téléchargement n'est requis pour consulter les trois vues et les cinq traces.

Le panneau quantitatif est une consultation de résultats simulés, pas une commande du corps représenté. Les modèles, espèces, preuves et horloges restent séparés. Lire BILAN.md, ETAT_REPRISE.json et JOURNAL.md pour reprendre. Lire RECHERCHE_SGAMP.md avant toute nouvelle comparaison expérimentale.

Reproduction des traces : `node export_traces.cjs`. Tests de modules : `node --test tests/*.cjs`. Tests navigateur : installer `playwright==1.55.0` dans un environnement Python ou `dependencies/`, puis `python tests/test_browser.py`. Chrome est attendu au chemin Windows indiqué dans ce test ; adapter explicitement ce chemin sur une autre machine. Le serveur des tests est temporaire et lié à 127.0.0.1. Les tests n'utilisent pas d'autres dossiers de travail.

Les sources et licences HRA/Three.js sont conservées dans models/, data/ et web/vendor/. Les preuves du lot E sont incluses comme rapport historique, sans prétendre rejouer sa référence SciPy depuis ce seul paquet. Aucun original Allen privé n'est inclus.
