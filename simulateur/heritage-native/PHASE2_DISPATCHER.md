# Restauration fermée et dernier succès utilisable

Le répartiteur expérimental consomme les [attentes persistées](PHASE2_CHECKPOINT_BINDINGS.json), sans approuver automatiquement un binaire ou une sauvegarde nouvellement observé. **Quatre processus Pulse et 180 comparaisons passent** au seuil initial. Un essai supplémentaire de la commande directe passe neuf comparaisons à horizon zéro. **68 tests Python passent.**

[Protocole](PHASE2_DISPATCHER_PROTOCOL.json), [résultat machine](PHASE2_DISPATCHER_RESULTATS.json), [preuves exécutées](results/phase2-dispatcher-2026-10-18/report.json). Le moteur témoin et son échec initial sont conservés. Aucun exercice, validation scientifique ou déploiement effectué.

## Ce qui est implémenté

`RestoreDispatcher` est un contrôleur de restauration pour l'ensemble fermé des ticks 1500, 1501, 1520 et 1541, et les horizons 0, 1, 50, 500 ou 3000 ticks. Un état inconnu ou modifié est refusé, même si son enveloppe a été recalculée. Le contrôle compare ensuite patient, configuration, horloge et orchestration aux attentes externes, et vérifie les empreintes du worker, de la bibliothèque, du manifeste et des actifs déclarés.

Le rapport de qualification lui-même est maintenant épinglé par SHA-256 dans les attentes. Les références numériques ne peuvent donc pas changer silencieusement. Les données restent des simulations ; les repères et rapports déclarés MEASURED ou scientifiquement validés sont refusés.

Un dossier de travail possède un verrou exclusif. Une restauration concurrente ou un verrou déjà présent entraîne `RESTORE_BUSY`. Le jeton de propriété est revérifié avant engagement ; si le verrou est remplacé pendant l'essai, l'opération refuse l'engagement et préserve le nouveau verrou. Aucun verrou ancien n'est supprimé automatiquement dans cette version.

Chaque candidat s'exécute dans un nouveau processus, alimenté par les octets vérifiés via stdin. Les colonnes, horizons, valeurs finies, temps, neuf sorties, identité de build, statut SIMULATED et journaux sont contrôlés. Le seuil reste `abs(a-b) <= 1e-9 * max(1, abs(a))` ; toute sortie absente, incorrecte ou hors seuil refuse le candidat.

## Engagement du repère

Le parent n'héberge aucun moteur Pulse vivant. Il ne remplace `last_good.json` qu'après validation complète, via écriture temporaire puis remplacement atomique dans le même dossier. Le repère conserve l'empreinte des attentes, du checkpoint, du rapport d'essai et son identité. Le rapport référencé est vérifié lors d'une nouvelle lecture du repère.

Deux temps restent distincts :

- `restorable_checkpoint_tick` désigne le checkpoint d'entrée dont les octets sont qualifiés et peuvent être rechargés.
- `verified_observed_end_tick` désigne la fin de trajectoire observée dans le candidat. **Aucun checkpoint de fin n'est exporté par ce worker.** Ce second temps ne constitue donc pas une nouvelle sauvegarde restaurable.

Un refus avant lancement ne crée aucun candidat natif. Un échec d'enfant conserve ses journaux et son rapport, sans changer les octets du repère précédent. Après réouverture du contrôleur, le repère est relu depuis disque, sans adoption d'un cache en mémoire ou d'un fichier étranger.

## Vérifications exécutées

| Contrôle | Résultat |
| --- | --- |
| Quatre sauvegardes, neuf sorties, cinq horizons | 180 comparaisons natives réussies |
| Commande directe, tick 1500, horizon zéro | Neuf comparaisons natives réussies |
| Tick inconnu, état modifié, contexte worker incorrect | Refus avant lancement |
| Enfant Python synthétique, sortie 37 | Refus, repère inchangé |
| Enfant Python synthétique, sortie 0 sans sorties | Refus, repère inchangé |
| Enfant Python synthétique, délai dépassé | Refus, repère inchangé ; enfant direct terminé et récupéré |
| Réouverture du contrôleur | Même dernier succès vérifié depuis disque |

Les injections d'échec utilisent explicitement des processus Python synthétiques, sans modifier Pulse ni prétendre simuler une pathologie. Le timeout est de trois secondes dans l'injection exécutée ; la commande normale accepte un délai explicite positif, au maximum 180 s. La récupération de l'enfant direct expiré a été vérifiée sous Windows. Cela ne qualifie pas l'arrêt d'un arbre arbitraire de sous-processus, et ne constitue pas une sandbox.

Les tests couvrent aussi sorties numériques incorrectes, identités/empreintes altérées, verrou occupé/remplacé, référence modifiée, rapport du dernier succès corrompu et promotion abusive en MEASURED. Les sources de la qualification principale finale sont conservées avec leurs empreintes. La matrice complète a été répétée après les derniers contrôles de propriété/statut et de provenance ; les rapports distinguent commandes demandées et réellement exécutées pour les injections synthétiques. Le premier run reste conservé séparément ; le chemin CLI a également été exécuté.

## Utilisation expérimentale

Depuis le dépôt, après la [qualification des checkpoints](PHASE2_CHECKPOINT.md), avec chemins adaptés :

```text
python tools/pulse_probe/restore_dispatcher.py --runtime-root RUNTIME --output-root RUNTIME/o2-experiment/my-dispatcher --state RUNTIME/o2-experiment/patched-20261017-170301/checkpoint-1500.json --tick 1500 --horizon-steps 3000
python tools/pulse_probe/qualify_dispatcher.py --runtime-root RUNTIME
python -m unittest discover -s tools/organisme_entier -p "test_*.py" -v
python tools/organisme_entier/check.py
```

Le dossier de sortie doit rester dans l'expérience isolée. La commande ne propose ni worker alternatif, ni remplacement d'empreintes, ni migration d'état. Un refus retourne 4 avec son code d'erreur ; les rapports des candidats échoués restent sur disque. Les fichiers d'entrée doivent correspondre aux empreintes préalablement qualifiées et conservées.

## Limites et reprise

Ce répartiteur ne constitue pas le cycle complet de l'adaptateur, un ordonnanceur d'événements ni une garantie de rollback général. Il n'accepte aucune nouvelle sauvegarde hors de l'ensemble fermé, n'exporte pas d'état de fin et ne traite aucun événement externe. Les empreintes supposent des attentes locales de confiance, sans signature cryptographique d'autorisation.

L'interruption du parent, la récupération des verrous anciens, les engagements interrompus et l'idempotence des demandes restent à qualifier. Prochaine étape : journal durable des opérations de restauration, politique de reprise après interruption et tests de répétition, avant toute extension de périmètre. Canon, main, PR #1 et déploiement préservés ; relais borné au 18 octobre à 08:00 Europe/Paris.
