# Session technique Pulse à ensemble fermé

Le module `tools/organisme_entier/pulse_session.py` fournit une session persistante liant une étiquette de run, un UUID, le candidat, les bindings DLL v2, le contexte moteur/patch/données/patient/horloge/DLL et les quatre checkpoints/cinq horizons qualifiés. Il réutilise le contrôleur de restauration et le [lecteur de sorties](PHASE2_SORTIES_POLY.md). Aucun nouveau moteur ni processus de récupération parallèle n'est ajouté.

## Capacités réelles

| Commande/API | Comportement |
| --- | --- |
| create / create() | Crée une racine neuve et un manifeste exclusif synchronisé ; aucune initialisation native, aucun précontrôle complet du runtime annoncé |
| describe / describe() | Lit l'identité, le statut OPEN/CLOSED et les capacités réelles, sous la porte OS |
| restore / restore_known() | Vérifie le manifeste actif et tous les précontrôles v2, puis exécute une seule restauration autorisée dans un processus neuf |
| read / read_committed() | Produit les enveloppes POLY d'une opération engagée, sous le même garde d'activité ; ajoute l'empreinte de session à la provenance |
| open() | Recharge une session existante sans relancer le moteur ni créer un nouvel état ; refuse absence/altération de manifeste |
| close / close() | Publie un reçu de fermeture terminal, lié aux octets du manifeste ; répétition sans réécriture |

Le paramètre tick est celui du checkpoint de départ, horizon-steps le nombre de pas de 0,02 s exécutés depuis cet état. Chaque commande restore redémarre donc du checkpoint nommé : elle n'est pas une continuation du dernier horizon observé. Aucun advance() arbitraire, apply() biologique ou checkpoint() final n'est disponible ; leurs appels API échouent explicitement. Aucune intensité d'exercice n'est appliquée.

Les identifiants utilisateur d'opérations sont transformés en identifiants internes liés à l'UUID de session. Un même ID et les mêmes paramètres rendent le résultat engagé sans relancer Pulse ; d'autres paramètres provoquent un conflit. La fermeture bloque aussi les réponses en cache par la session. La consultation historique reste possible via le lecteur autonome explicitement séparé ; cela ne rouvre pas la session.

## Protocole d'utilisation

Depuis le dépôt, remplacer NEW_SESSION_ROOT par un chemin neuf sous ../p2/o2-experiment, par exemple ../p2/o2-experiment/manual-session-001 :

```text
python tools/organisme_entier/pulse_session.py --runtime-root ../p2 --output-root NEW_SESSION_ROOT create --run-id technical-run-001
python tools/organisme_entier/pulse_session.py --runtime-root ../p2 --output-root NEW_SESSION_ROOT describe
python tools/organisme_entier/pulse_session.py --runtime-root ../p2 --output-root NEW_SESSION_ROOT restore --operation-id baseline-view --tick 1500 --horizon-steps 50
python tools/organisme_entier/pulse_session.py --runtime-root ../p2 --output-root NEW_SESSION_ROOT read --operation-id baseline-view
python tools/organisme_entier/pulse_session.py --runtime-root ../p2 --output-root NEW_SESSION_ROOT close
```

Ce protocole ne déploie rien et écrit seulement dans la racine locale nommée. Une racine existante n'est jamais adoptée par create, même vide ; open exige le manifeste de session. L'état OPEN signifie session disponible, pas patient physiologiquement validé ou moteur déjà initialisé. Les précontrôles natifs complets ont lieu avant chaque exécution/replay, comme auparavant.

## Fermeture, concurrence et interruption

Le garde de manifeste/fermeture s'exécute à l'intérieur de la porte OS du contrôleur, avant publication d'intention, y compris pour un ID déjà engagé. L'ancienne CLI d'exécution et le répartiteur direct refusent une racine portant session.json sans le chemin gardé. Ces protections concernent les API coopérantes ; elles ne sont pas un mécanisme d'accès contre un programme hostile capable de réécrire le workspace.

close ne tue aucun processus : porte occupée = refus COORDINATION_BUSY ; verrou d'opération/restauration ou récupération persistante = refus SESSION_OPERATION_OR_RECOVERY_PENDING. Aucun verrou ancien n'est supprimé pour fermer. Le récupérateur existant reste le seul mécanisme de reprise explicite ; le manifeste n'est pas modifié pendant cette reprise.

Après mort du parent avant engagement, le reçu est interrompu et ses sorties ne deviennent pas lisibles par la session. Après engagement du pointeur, la réponse perdue peut être récupérée comme COMMITTED, sans nouvelle exécution ni nouveau pointeur. Un ancien guard inconnu reste bloquant selon les règles existantes. Un manifeste ou reçu de fermeture tronqué/étranger est conservé et refusé ; aucune réparation automatique. Coupure électrique et panne arbitraire de stockage ne sont pas qualifiées.

## Qualification

Douze tests spécifiques et huit cas de processus réels : création/restauration/lecture/réouverture/replay, refus de l'ancienne entrée, capacités hors périmètre, fermeture terminale, fermeture pendant une autre opération, morts du parent à PREPARED/VALIDATED/POINTER_COMMITTED. Bibliothèque et CLI sont utilisées ; résultat brut et sources exécutées sont conservés. [Résultats structurés](PHASE2_SESSION_RESULTATS.json).

Un premier essai du fixture a tenté de lire l'octet verrouillé Windows pendant la concurrence : PermissionError. Il est conservé, enfant possédé terminé/récupéré sans lancement physiologique. Le fixture corrigé compare les autres fichiers et l'identité/taille du fichier de porte pendant ce verrou ; il ne prétend pas avoir lu l'octet alors inaccessible.

La session n'annonce pas le cycle dynamique général du contrat : pas d'initialisation générale, scheduler couplé, événement biologique, convergence ou rollback général. Les sorties restent SIMULATED et l'échec original du moteur est conservé au seuil initial. Canon, main et PR #1 intacts.
