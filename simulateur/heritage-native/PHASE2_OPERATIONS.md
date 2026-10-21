# Opérations de restauration : identifiants et interruptions

Le journal expérimental permet de relire une opération déjà engagée sans relancer Pulse. Cette qualification technique reste limitée aux quatre checkpoints épinglés ; elle ne valide aucune physiologie.

Un identifiant est lié aux empreintes des bindings, du checkpoint et de son enveloppe, au tick, à l’horizon et au délai maximal. Réutiliser cet identifiant avec une autre requête est refusé. Une opération échouée ou interrompue demande un nouvel identifiant pour une nouvelle tentative. Relire un succès ancien ne déplace jamais le dernier succès global.

Les reçus sont écrits avant lancement et aux frontières du protocole, avec flush/fsync puis remplacement atomique. Ces garanties concernent les interruptions de processus testées ; elles ne constituent pas une qualification des pannes électriques ou du stockage.

| Frontière | Décision de récupération |
| --- | --- |
| PREPARED, avant enfant | Interrompue ; aucun candidat adopté |
| VALIDATED, avant engagement | Interrompue ; candidat validé conservé sans adoption |
| POINTER_COMMITTED | Réponse retrouvée depuis le pointeur déjà engagé ; aucun moteur lancé |
| Propriétaire vivant | Refus ; ses verrous restent en place |
| CHILD_IN_FLIGHT, issue inconnue | Refus conservateur ; aucune adoption |

Le propriétaire est identifié par PID et heure de création Windows. Identité inconnue ou vivante : refus. Les verrous attribuables à un propriétaire disparu sont déplacés en quarantaine, avec conservation de leurs octets. Aucun déverrouillage forcé n’est proposé. Le fixture CHILD_IN_FLIGHT s’arrête au marqueur précédant le lancement effectif ; il ne qualifie pas la mort du parent pendant un calcul Pulse vivant.

La qualification comprend huit cas réussis, quatre processus natifs et 54 comparaisons de sorties. Deux appels de la commande finale donnent une seule tentative native supplémentaire et neuf comparaisons ; le second appel relit le résultat. Les 80 méthodes de test Python passent. Voir les [résultats structurés](PHASE2_OPERATIONS_RESULTATS.json), le [protocole](PHASE2_OPERATIONS_PROTOCOL.json) et les [preuves](results/phase2-operations-2026-10-18/README.md).

L’entrée `tools/pulse_probe/restore_operations.py` accepte les arguments de restauration du répartiteur avec `--operation-id`, ou `--recover` avec les racines de runtime et de sortie. Les conflits donnent IDEMPOTENCY_CONFLICT ; les opérations échouées/interrompues ne sont pas réexécutées ; une issue enfant inconnue donne RECOVERY_INFLIGHT_UNQUALIFIED. Les reçus locaux reposent sur un stockage de confiance et des empreintes, sans signature authentifiant leur auteur.

Ne pas mélanger l’accès direct au répartiteur et ce journal sur une même racine. La coordination générale récupération/exécution, la disparition entre acquisition du verrou et écriture de l’intention, les erreurs de quarantaine, les pannes de stockage et électriques ne sont pas qualifiées. Une preuve insuffisante bloque la récupération. Aucun checkpoint final n’est exporté et aucun rollback général n’est annoncé.

Prochain jalon : suivre l’identité et la durée de vie de l’enfant natif avant remise de stdin, qualifier une mort réelle du parent avec enfant vivant, puis coordonner récupération et exécution. Les scénarios A/B/C et phases 3–5 restent hors du lot. Le canon, les seuils, l’échec initial et les équations restent préservés.
