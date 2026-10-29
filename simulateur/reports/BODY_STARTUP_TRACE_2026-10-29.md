# POLY — Diagnostic de démarrage régional HRA

29 octobre 2026. Une attente de démarrage a récidivé dans deux suites : 45 s avant utilisation du guide nerf–muscle et 30 s dans le cas final d’annulation de main. Les logs antérieurs restent conservés ; la cause n’est pas établie.

Le laboratoire expose maintenant `__polyRegionLabStartup()` : étape courante, erreur, trace bornée de 32 entrées et temps écoulé. Les étapes distinguent module prêt, requête/lecture du manifeste, requête/corps/décompression/empreinte/analyse du catalogue, scène, renderer et commandes. Le stade est aussi inscrit dans `#loading.dataset.stage`. La durée de démarrage achevé est figée ; elle ne devient pas la durée de vie de la page.

Le test main relève désormais, en cas d’échec, les requêtes en attente, échecs réseau, texte de chargement et trace de démarrage. Cela distingue aussi une absence d’exécution du module (diagnostic absent) d’un blocage après son initialisation. Le délai de son assertion n’a pas été augmenté et aucune relance automatique n’a été ajoutée.

La suite main complète est passée après cet ajout : deux viewports, récupération du contexte privé, retrait/rechargement et annulation effective de transfert. Une nouvelle suite vérifie la succession des étapes pour un démarrage normal et un catalogue volontairement altéré. Le refus reste fermé avant création de scène et signale exactement `catalogue:digest`. Les assertions contrôlent la monotonie et l’étape ; elles n’imposent aucune latence d’ordinateur ou de téléphone.

Ces exécutions réussies ne démontrent pas la correction de la cause intermittente. Il faut conserver la trace d’un nouvel incident réel avant toute attribution causale. Aucun stress répétitif ni changement des contrôles d’intégrité n’a été utilisé pour obtenir un passage.
