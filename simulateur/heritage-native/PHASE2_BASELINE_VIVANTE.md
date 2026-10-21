# Baseline native persistante et observations vérifiées

Le nouveau worker garde un même moteur Pulse entre les commandes : restauration d'une des quatre ancres connues, lectures et avancements successifs vers les cinq horizons déjà qualifiés, puis fermeture. Ce résultat est un jalon d'intégration technique P2-01 ; aucun événement biologique ou scénario A/B/C n'est appliqué.

Le [protocole préalable](PHASE2_BASELINE_VIVANTE_PROTOCOLE.md) fixe le périmètre et les comparaisons. Le [profil épinglé](PULSE_BASELINE_LIVE_BINDINGS.json) distingue le contexte du checkpoint DLL v2 d'origine du nouveau worker d'exécution, et lie dix sources Python du contrôleur. Les [résultats](PHASE2_BASELINE_VIVANTE_RESULTATS.json) sont la qualification séparée du profil ; le libellé PENDING dans le profil figé conserve son statut au moment de la construction, sans réécriture rétroactive. L'utilisation ordinaire exige le résultat PASS correspondant exactement au profil, binaire et rapport ; aucun nouvel artefact observé n'est automatiquement approuvé.

## Ce qui fonctionne

`PinnedLiveBaseline` propose `describe()`, `start()`, `read(command_id)`, `advance_to_known_horizon(command_id, horizon)`, `close()` et `abort()`. `start()` restaure un checkpoint ; il ne crée pas de patient nouveau. L'horizon est absolu depuis l'ancre de départ, parmi 0/1/50/500/3000 pas de 0,02 s. L'heure native flottante est conservée, le tick est un index distinct.

Une même identité Windows PID/heure de création demeure présente pendant tous les avancements de la trajectoire. Les six ports POLY sont produits après contrôle des neuf sorties natives contre les références persistées, au seuil original 1e-9. Les lectures répétées conservent exactement valeurs et temps. Une même clé de commande retourne son observation historique en cache sans relancer de commande et sans rembobiner le temps ; une réutilisation différente est refusée.

Le worker se construit dans live-build, séparément de probe-build et des moteurs original/corrigé existants. Aucun ancien exécutable, checkpoint ou résultat n'est remplacé. Les 81 archives réellement liées ont les mêmes empreintes que l'audit précédent ; trois DLL sont vérifiées sur disque puis observées avant stdin. Le manifest d'exécution possède son propre identifiant, sans se faire passer pour le profil DLL v2 historique. L'audit d'imports/lien est une preuve technique, pas une approbation de redistribution.

## Transport, refus et durée de vie

Protocole binaire pour les octets d'état, lignes ASCII bornées pour les commandes/réponses, logs séparés. ADVANCE émet un ACK avant calcul ; le parent le persiste avant d'attendre les valeurs. Longueur d'état, nombre de commandes, horizons et délais I/O sont bornés. Un timeout après ACK conserve la dernière observation vérifiée ; il ne produit pas de faux rollback.

La porte OS est gardée pendant toute la vie du moteur. Un verrou local refuse les commandes concurrentes dans un même processus Python. Une commande invalide ou un retour en arrière sont rejetés avant envoi ; une réponse native fausse/illisible, un timeout ou une altération de manifeste rendent ce moteur terminal et jetable. Le parent termine et récolte uniquement son enfant direct possédé, jamais un PID récupéré.

La fermeture explicite détruit le moteur, vérifie sa sortie et son reçu natif, puis publie CLOSED avec empreinte du résultat. Elle est idempotente. La disparition du parent ferme stdin ; le worker finit son calcul borné puis sort sur EOF sans publier une fermeture réussie. Aucun run abandonné, fichier partiel ou état final n'est adopté ; un nouveau run exige une racine neuve. Une annulation avant start ne crée ni ne modifie de racine.

## Lecture après fermeture

`read_closed(runtime, root)` et l'option CLI `--read-closed` reconstruisent les observations d'un run CLOSED, sans lancer de moteur. Ils vérifient profil approuvé, snapshot d'exécution, contexte initial, DLL, résultat natif de fermeture, CSV, ordre des commandes, valeurs de référence et chaîne des empreintes des reçus jusqu'à la dernière observation. Tous les fichiers capturés sont relus pour vérifier leur stabilité. Une session active/échouée/abandonnée ou une preuve altérée est refusée, sans réparation automatique.

Chaque enveloppe porte SIMULATED, human, pulse.whole_body, unité native explicite, horloge propre à la trajectoire, contexte d'état initial, worker d'exécution distinct, profil/manifest/module et reçu de commande. Une observation exportée n'est jamais présentée comme un checkpoint restaurable.

## Reproduire

Depuis le dépôt, avec le runtime local conservé et une racine neuve sous o2-experiment :

```text
python tools/organisme_entier/pulse_live_baseline.py --runtime-root ../p2 --output-root NEW_LIVE_ROOT --tick 1500
python tools/organisme_entier/pulse_live_baseline.py --runtime-root ../p2 --output-root NEW_LIVE_ROOT --read-closed
python tools/pulse_probe/qualify_live_baseline.py --runtime-root ../p2
python -m unittest discover -s tools/organisme_entier -p "test_*.py" -q
```

La qualification est un outil explicite séparé, avec qualification_mode=True dans ses fixtures ; la CLI ordinaire n'expose pas ce contournement du prérequis de qualification. Le chemin binaire/runner reste imposé. L'API en contexte `with PinnedLiveBaseline(...) as live:` ferme proprement ou abandonne son enfant lors d'une exception.

## Résultats et limites

Quatre trajectoires natives, une identité de processus par trajectoire, 180 comparaisons aux références et 180 lectures répétées exactement identiques ; 120 enveloppes de base, export fermé identique aux dix commandes de chaque trajectoire (les lectures répétées sont des observations au même temps, pas de nouvelles preuves biologiques). Cinq cas réels : timeout après ACK, abandon explicite, concurrence de threads, mort de parent au repos et pendant un avancement acquitté. Les enfants sortent ou sont récoltés, sans adoption d'une commande inachevée.

Premier essai conservé : blocage de cadrage car Windows transformait les fins de ligne en entrée texte. L'état original fait 2 635 653 octets et contient 129 989 séquences CRLF ; le canal est passé en mode binaire, sans changer cet état. L'essai a été interrompu par la session d'exécution possédée ; absence ultérieure de l'identité enfant vérifiée, aucune observation adoptée et aucune réussite native annoncée. Source/profil initiaux et reçu INTENT sont conservés. Les répétitions suivantes correspondent aux évolutions du protocole ACK, des gardes de qualification, des liens de sources et de l'export fermé ; leurs preuves restent locales.

Limites inchangées : physiologie agrégée, patient de référence expérimental, quatre ancres/cinq horizons, pas de ProcessAction, de patient arbitraire, de nouvel état restaurable, de couplage neuronal/anatomique, de convergence physiologique ou de rollback général. Modules OS approuvés par chemin, chargements tardifs et pannes arbitraires de stockage ne sont pas qualifiés. L'échec initial du moteur original reste FAIL ; aucun seuil scientifique n'est assoupli, canon/main/PR #1 préservés.
