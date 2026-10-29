# Reprise des catalogues et cycle de vie du rendu

## Changements locaux

Le squelette distinct dispose maintenant d'une reprise explicite du catalogue après annulation, erreur ou délai de 30 secondes. Le manifeste et le catalogue conservent leurs vérifications d'intégrité. Les commandes de géométrie restent indisponibles tant que le catalogue n'est pas reçu ; le bouton de reprise disparaît après réception. Aucun maillage ni contexte WebGL n'est créé par cette reprise. La dernière erreur reste consultable après une reprise réussie, et les options de région ne sont pas dupliquées.

Les quatre vues HRA, références par pièces, squelette et revue DB suivent désormais l'identifiant de leur callback requestAnimationFrame. La page masquée, le départ et la perte de contexte annulent le rendu en attente au lieu de conserver un drapeau booléen et un callback destiné à un moteur détruit. La présence d'un identifiant égal à zéro reste correctement traitée. Le callback vérifie aussi la visibilité avant de rendre. Au retour, la création de géométrie reste une action explicite ; les données documentaires de l'ancien parcours HRA gardent leur propre reprise existante.

Le squelette conserve son catalogue vérifié au retour ; s'il a été interrompu avant réception, le bouton permet de reprendre sans recharger toute la page. Les scènes du squelette et de la revue DB, leurs caméras et leurs états de glissement sont détachés au départ. Les fabriques et protocoles scientifiques sont inchangés.

## Contrôles nouveaux et régressions trouvées

La suite `skeleton-startup-browser.cjs` couvre annulation du manifeste, délai du catalogue, refus réseau et départ pendant les métadonnées, sur ordinateur et mobile émulé. Elle vérifie l'annulation réseau réelle, l'absence de retry automatique, la reprise sans WebGL, la conservation du constat d'erreur et le chargement explicite après retour.

La suite `anatomy-page-return-browser.cjs` instrumente les vrais appels du navigateur : une demande de rendu est mise en attente, puis un événement de départ est déclenché dans la même tâche. Avant correction, un callback restait en attente dans les références, la revue DB et le HRA. Après correction, aucun callback ne subsiste ; les résidents sont libérés et le rechargement explicite rend à nouveau. Les quatre vues sont éprouvées sur deux formats d'écran. Ces événements sont simulés : ils ne démontrent pas l'éligibilité réelle au BFCache d'un navigateur ni un comportement sur téléphone physique.

Une régression introduite pendant le développement a été détectée : l'ajout d'un compteur de frame transitoire au diagnostic HRA stable cassait la comparaison avant/après perte de contexte. Ce champ a été retiré de ce contrat ; le test nouveau observe les callbacks indépendamment.

La passe élargie a aussi révélé une course dans l'ancien test de posture : son compteur Three.js pouvait valoir zéro avant le premier upload graphique, puis 134 après une pose sans création supplémentaire. Le test prend désormais sa référence après le premier rendu effectif. L'assertion d'absence de nouvelles géométries est conservée, sans comparaison arbitraire à zéro et sans convertir le compteur logique en mémoire GPU physique.

## Démarrage historique : échec conservé

Le premier plafond du runner local, 110 secondes, était inférieur aux attentes de 120 secondes du test historique : cette interruption ne permettait pas de conclure sur l'application. Le plafond a été corrigé pour laisser au test le temps d'échouer explicitement.

Une épreuve suivante a bien échoué au démarrage mobile historique : attente de 120 secondes, repli `module-resource`, aucune requête encore en attente et aucune erreur JavaScript remontée par l'événement pageerror. Ce constat ne désigne pas la dépendance fautive et ne prouve pas une cause de serveur. Des traces de requêtes échouées, réponses HTTP en erreur et erreurs console ont été ajoutées à la suite classique pour une future reproduction.

Huit démarrages isolés ont ensuite réussi sur un serveur local dont les journaux sont écrits dans un fichier. Le changement de conditions et les réussites ne prouvent aucune correction de cause. Les reçus et journaux précédents restent archivés dans le dossier de travail ; l'inconnue intermittente reste ouverte.

La passe a aussi rencontré un échec d'import au rechargement de l'atelier par pièces, puis une absence du diagnostic HRA dans une épreuve de catalogue corrompu : le graphe de modules n'avait pas démarré. Ces cas disposent maintenant de journaux réseau/console explicites, au lieu d'une simple attente ou d'une TypeError secondaire. Vingt rechargements bornés du lecteur de références ont ensuite réussi, dix sans interception de requêtes et dix avec interception de passage. Aucun maillage téléchargé par cette sonde. Ces réussites ne reproduisent ni n'expliquent les échecs ; les interruptions de connexion visibles côté serveur ne leur sont pas attribuées comme cause.

## Contrôles automatiques

La configuration CI utilise maintenant le serveur d'aperçu local existant et les trois racines temporaires de blocs, avec une URL explicite commune. Les trois parcours du squelette, sa nouvelle reprise, la revue DB et le test des quatre retours de page sont inscrits dans la suite. Les blocs restent hors dépôt et hors site public. Cette modification de configuration n'est ni un push ni une exécution de GitHub Actions.

Les résultats de la passe locale séquentielle des scripts configurés sont conservés dans `outputs/POLY_BROWSER_MATRIX_20261029.json` du chat. Les reprises après correction conservent les résultats réussis des scripts inchangés et archivent les échecs ; il ne s'agit pas d'une exécution unique et figée de toutes les suites. Le reçu fait foi pour les statuts effectifs. Les 167 tests Node ont réussi après les modifications du rendu ; les tests Python ne sont pas annoncés comme rejoués pour ces changements JavaScript.

Réception finale : **35 scripts navigateur réussis** dans cette passe avec reprises ; **8 cas** de récupération du catalogue du squelette et **8 cas** de départ/retour des quatre vues. Captures du délai et du bouton de reprise inspectées sur ordinateur et mobile émulé. Aucun succès antérieur n'efface les incidents décrits plus haut. La configuration de CI a été éprouvée localement, pas exécutée sur GitHub.

## Périmètre restant

La vue globale des références reste distincte : ses 46 blocs représentent 74 469 464 octets bruts source, avant copies d'affichage et objets graphiques. Elle ne peut être assimilée à une vue exhaustive sous budget de 4 Mio. Le parcours historique est conservé ; cette passe améliore les parcours bornés et leurs reprises, sans ajouter de dépassement implicite.

La cause du démarrage intermittent, la mémoire physique, le téléphone réel et les validations anatomiques/biologiques ne sont pas résolus par cette réception logicielle. Aucun déplacement de source, temps biologique, activation, force, insertion ou recalage individuel ajouté.
