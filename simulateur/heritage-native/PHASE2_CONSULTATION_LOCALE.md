# Consultation locale des preuves fermées

Cette qualification initiale concerne les paquets historiques T7. Le [livrable courant gardé](PHASE2_CONSULTATION_GARDEE.md) utilise un registre distinct et sa propre qualification, sans réécrire ces preuves.

Le lecteur autonome permet de consulter les quatre trajectoires réelles déjà qualifiées : ancres natives 1500, 1501, 1520 et 1541, cinq instants enregistrés, six sorties agrégées. Changer d’instant sélectionne une observation archivée ; aucun calcul physiologique, interpolation, événement ou accès réseau n’est déclenché. Le panneau Source conserve l’enveloppe exacte, le statut SIMULATED, l’horloge, l’entité native et les empreintes de provenance.

Les 86 relations de recherche et leurs 74/8/4 statuts restent documentaires, avec les références du registre stable et du C13 distinct. Les portées d’origine, notamment préparation isolée et espèce, sont visibles ; elles ne deviennent pas des paramètres humains. HRA/SCKAN/ApiNATOMY restent non raccordés. Les liens vers le plan vivant et l’état machine ouvrent GitHub uniquement à la demande de l’utilisateur.

## Production et vérification

Depuis le dépôt, utiliser Python avec `tools/organisme_entier/build_evidence_view.py --output CHEMIN_ABSOLU.html`, et éventuellement `--c13-original CHEMIN_C13_ORIGINAL`. Le générateur vérifie les quatre paquets approuvés contre leur registre d’empreintes, la qualification du canon et son inventaire. Il produit un HTML autonome et son reçu `.build.json`. Sans C13 local, les résumés supplémentaires C13 ne sont pas résolus ; aucune identité ou portée de remplacement n’est inventée.

Une destination préexistante est refusée. `--replace-generated` exige un reçu de génération correspondant aux octets actuels : un fichier modifié ou étranger n’est pas écrasé. Les délimiteurs HTML des données sont encodés sans changer les octets du paquet après décodage JSON. Le HTML généré reste un livrable local dans outputs, pas une seconde copie des quatre paquets dans Git.

Le navigateur contrôle SHA-256 avant affichage. Le registre attendu intégré sert à détecter une altération du paquet ; il n’authentifie pas à lui seul l’ensemble du HTML. Pour une vérification indépendante, comparer le reçu de génération/registre épinglé obtenu séparément et utiliser le [vérificateur portable](PHASE2_PREUVES_PORTABLES.md). Le PASS de consultation ne requalifie ni le moteur actuel ni le modèle scientifique.

## Qualification

[Résultats structurés](PHASE2_CONSULTATION_LOCALE_RESULTATS.json), [rapport navigateur](results/phase2-local-view-2026-10-18/report.json) et [reçu HTML](results/phase2-local-view-2026-10-18/build.json).

- 120 valeurs affichées comparées exactement aux quatre paquets, provenance complète comparée, téléchargement JSON identique par SHA-256.
- Sélections rapides : une vérification asynchrone antérieure ne remplace pas la dernière trajectoire choisie ; sélection au clavier contrôlée.
- Largeurs 320, 375, 768, 1024 et 1440 px sans débordement ; modes clair/sombre inspectés ; provenance complète ouverte sur téléphone 320 px, cibles tactiles d’au moins 44 px.
- Trois refus : empreinte corrompue, portée scientifique interdite même après re-hash de test, SHA-256 indisponible. Anciennes valeurs/références/provenance et téléchargement sont retirés ; revenir à un paquet sain fonctionne.
- Zéro requête HTTP(S), erreur console/page ou processus Pulse lancé par ce lot. Politique de contenu sans connexion distante.
- Six tests Python du générateur : intégrité des données, refus des destinations étrangères, fichier généré modifié, remplacement explicite, marqueur ambigu et échappement des délimiteurs.

L’essai initial Playwright a rencontré l’absence du navigateur fourni par défaut ; aucun téléchargement/installation effectué. Qualification finale avec Chrome déjà installé, dans un profil temporaire indépendant. Une première assertion de test lisait le texte d’un panneau volontairement replié ; corrigée pour comparer son contenu enregistré, sans modifier les données. Essais antérieurs et logs conservés dans le workspace.

Ce livrable ne représente pas un corps anatomique validé, une simulation neuronale détaillée ou les scénarios A/B/C. Les valeurs arrondies facilitent la lecture ; leur représentation numérique exacte reste dans l’enveloppe et le paquet téléchargeable.
