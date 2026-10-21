# Timeouts réels du worker DLL v2

Le [protocole préalable](PHASE2_DLL_V2_TIMEOUT_PROTOCOL.json), les [résultats](PHASE2_DLL_V2_TIMEOUT_RESULTATS.json) et les [preuves](results/phase2-dll-v2-timeout-2026-10-18/README.md) couvrent deux délais avec le vrai worker épinglé, sans runner injecté.

Le premier essai à 0,1 s produit CHILD_TIMEOUT après vérification des DLL, avant engine.log et toute sortie native : ce n’est pas un test de calcul physiologique engagé. Le second protocole exige explicitement une progression à une seconde, budget choisi entre les durées antérieures de restauration seule (~0,438 s) et d’horizon 3000 (~5,1 s). Il produit CHILD_TIMEOUT avec engine.log et sorties aux horizons 0/1/50, avant la fin 3000. Aucun seuil numérique n’est changé et les deux essais sont conservés.

Dans chaque run, un succès est engagé avant le timeout. L’enfant direct est terminé/récolté par son Popen et son identité n’est plus vivante. Le pointeur reste inchangé octet par octet ; l’opération est FAILED/CHILD_TIMEOUT, sa répétition sous le même ID est refusée sans nouvelle tentative ; une nouvelle opération explicite réussit. Deux succès/neuf comparaisons chacun, soit 18 par run. Les sorties interrompues ne sont jamais promues ou adoptées. DLL_READY_TIMEOUT n’aurait pas été accepté comme CHILD_TIMEOUT natif.

Les deux manifestes d’artefacts sont vérifiés. Les vérifications finales reproduisent exactement l’inventaire depuis les sources épinglées/C13 original, valident le dossier et passent les 141 méthodes Python. Ce sont des tests techniques bornés sur cet hôte ; aucune validation physiologique, garantie de panne électrique ou rollback général n’est annoncée.

Le périmètre technique autorisé est maintenant clos. Lire la [synthèse et la décision de reprise](BILAN_TECHNIQUE_P2_01.md) avant tout nouveau scénario ou intégration. Canon, moteur original/échec, main et PR #1 préservés ; aucun déploiement.
