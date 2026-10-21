# Reprise explicite d’une transaction publiée

La commande restore_operations.py --resume-recovery-transaction ID, avec les racines de runtime et de sortie, reprend uniquement un plan TRANSACTION_PREPARED déjà publié. Le recover historique ne crée ni ne reprend automatiquement ces transactions. Ancien format ou MUTATION_PENDING sans plan lié restent refusés.

Sous la porte OS, la reprise vérifie octets et contenu du plan, bindings, racine, identifiant, propriétaire/nonce et préfixe cohérent. Un autre préparateur encore vivant est refusé. Le processus propriétaire peut reprendre sa propre préparation ; un autre processus attend sa disparition prouvée. Un résultat COMMITTED est revalidé contre les sorties de référence ; un résultat non engagé reste INTERRUPTED. Aucun worker n’est lancé et aucun pointeur n’est écrit.

L’exécuteur écrit atomiquement les octets après du reçu puis déplace restore.lock, si prévu, et operation.lock sans écraser les destinations. Il inspecte à nouveau le préfixe entre étapes. Une preuve completion.json, liée aux empreintes du plan et au nonce, est publiée et vérifiée avant archivage du guard original. Une exception laisse ce guard bloquant. Les fichiers temporaires préparatoires éventuels ne sont pas des preuves d’engagement.

Après fin, la même commande relit guard archivé, plan, reçu, verrous, pointeur et preuve de fin sans mutation. Cette idempotence est qualifiée avant qu’une opération ultérieure change le contexte. Si ce contexte a changé, le refus conserve le dernier succès ; aucune relecture ne rembobine le pointeur.

Le [protocole préalable](PHASE2_TRANSACTION_RESUME_PROTOCOL.json), les [résultats](PHASE2_TRANSACTION_RESUME_RESULTATS.json) et les [preuves](results/phase2-transaction-resume-2026-10-18/README.md) couvrent six arrêts réels os._exit(86) :

| Branche | Arrêts après mutation achevée |
| --- | --- |
| Non engagée | Reçu écrit ; restore.lock déplacé ; operation.lock déplacé ; preuve de fin publiée ; guard archivé |
| Déjà engagée | operation.lock déplacé |

Les six workers initiaux passent 54 comparaisons de sorties. Aucun nouveau worker pendant reprise ; pointeur conservé octet par octet ; guards et verrous originaux archivés inchangés ; seconde reprise sans mutation. Les 127 tests Python passent, avec refus de sources modifiées, doublon de guard, plan/pointeur/preuve altérés, identifiant invalide et autre préparateur réellement vivant. Le manifeste des 112 artefacts du run complet est vérifié.

La qualification porte sur ces frontières de mutations achevées, sur cet hôte Windows et des clients coopérants. Elle ne couvre pas toute défaillance de système de fichiers, panne électrique, contexte hostile, ancien guard sans transaction ou fenêtre enfant avant identité. Aucun rollback général ou cycle complet de l’adaptateur n’est annoncé. Prochaine étape : matrice de refus CLI et audit de conformité des capacités P2-01. Canon, seuil, échec initial, main et PR #1 inchangés ; aucun scénario biologique démarré.
