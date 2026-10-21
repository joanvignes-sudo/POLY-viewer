# Préparer une transaction de récupération

Mise à jour : la [reprise explicite](PHASE2_TRANSACTION_RESUME.md) est désormais qualifiée aux frontières nommées. Les limites ci-dessous décrivent le lot préparatoire historique ; les anciens guards sans plan lié restent refusés.

Mise à jour : la [persistance explicite et son inspection](PHASE2_TRANSACTION_PREPARE.md) sont désormais qualifiées via commandes séparées. Le module de plan reste en lecture seule et aucun exécuteur de mutation n’est encore disponible.

Le module recovery_transaction.py prépare un manifeste et inspecte ses états intermédiaires en lecture seule. Il n’est pas branché au chemin de restauration et n’exécute aucune mutation. Les guards MUTATION_PENDING et anciens formats restent soumis aux refus existants.

Le [contrat structuré](PHASE2_RECOVERY_TRANSACTION.json) lie bindings, racine, identifiant de transaction, propriétaire/nonce du récupérateur, nom du reçu, octets avant/après, pointeur attendu et octets de chaque verrou. Les blobs conservent les octets hexadécimaux et leur SHA256. La préparation exige un guard LOCKED courant appartenant au processus appelant, un propriétaire d’opération disparu, une phase connue et une décision conforme au pointeur existant. Un résultat engagé est revérifié ; un candidat non engagé ne peut pas être adopté. L’appelant doit tenir la porte OS : le préparateur ne l’acquiert pas lui-même.

L’inspecteur reçoit le digest attendu du plan, puis compare les octets exacts au disque. Il reconnaît seulement les préfixes ordonnés :

| Préfixe | État reconnu |
| --- | --- |
| PREPARED | Reçu avant ; tous les verrous à la source |
| RECEIPT_WRITTEN | Reçu après ; tous les verrous à la source |
| RESTORE_MOVED | Reçu après ; restore.lock déplacé, operation.lock à la source |
| LOCKS_MOVED | Reçu après ; tous les verrous déplacés |

Un verrou doit exister à un seul des deux emplacements avec ses octets prévus. Doublon, absence, changement de pointeur/reçu/verrou, ordre incohérent ou empreinte modifiée entraînent un refus. Un JSON reformatté, même sémantiquement égal, ne remplace pas les octets épinglés. Sans restore.lock initial, son apparition est refusée et l’étape intermédiaire correspondante n’existe pas.

Les [preuves](results/phase2-transaction-plan-2026-10-18/README.md) comptent 17 tests synthétiques ciblés et 110 méthodes dans l’ensemble. Elles ne comprennent aucun nouveau processus Pulse. Des snapshots de fichiers vérifient l’absence de mutation lors de la préparation, de l’inspection et des refus ciblés.

Prochaine intégration : écrire et synchroniser le plan immuable, lier son digest durablement au guard avant mutation, écrire le reçu après de manière atomique, déplacer les verrous sans écraser une destination, écrire/vérifier la preuve de fin puis retirer le guard. Un exécuteur devra reprendre sous la porte OS, revérifier identité/propriété, lien du guard au plan et préconditions de runtime avant toute action. Le résultat de l’inspecteur seul n’autorise aucune mutation.

La reprise après mort du parent pendant ces mutations reste non qualifiée. Elle doit être testée après écriture du reçu, chaque déplacement et preuve de fin. Aucun plan n’est inféré depuis un guard ancien ou MUTATION_PENDING sans lien durable. Stockage/panne électrique, fenêtre enfant avant identité et cycle complet de l’adaptateur restent ouverts. Canon, seuil, échec initial, main et PR #1 préservés ; aucun scénario biologique démarré.
