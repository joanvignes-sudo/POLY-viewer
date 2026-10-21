# Garde native séparée du contrôleur numérique historique

`GuardedLiveBaseline` compose le contrôleur PinnedLiveBaseline dans une sous-racine baseline et traite ses pertes de manifeste/E/S avant envoi comme des échecs terminaux. Le contrôleur, son profil, le worker, la bibliothèque Pulse, les quatre états et le seuil restent inchangés. Cette garde possède son [profil distinct](PULSE_LIFECYCLE_GUARD_BINDINGS.json), sa [qualification](PHASE2_GARDE_NATIVE_RESULTATS.json) et son [protocole préalable](PHASE2_GARDE_NATIVE_PROTOCOLE.md).

Le profil conserve son libellé de candidat épinglé ; c’est le résultat séparé, lié par empreinte au rapport, qui autorise l’usage ordinaire. Le mode de qualification de la garde ne contourne jamais la qualification numérique d’origine. La CLI ne fournit aucun contournement.

## Garanties et provenance

Manifeste/profil de garde persistés avant le lancement du moteur, porte OS tenue pendant la session, refus des commandes concurrentes. Un argument/horizon indisponible conserve la session saine. Une perte du manifeste de garde, du manifeste interne ou une écriture d’intention impossible avant envoi récolte le seul enfant exact possédé et conserve le dernier reçu vérifié ; aucun faux rollback ou zéro de remplacement.

Les sorties gardent le profil numérique `execution_profile_sha256`, le worker, l’état initial, la valeur, l’unité, l’espèce et l’horloge natives. Deux champs de provenance supplémentaires identifient le profil et le manifeste de cycle de vie : ils ne se font pas passer pour une nouvelle version de Pulse. La garde ferme le moteur, vérifie son export puis lie l’état et les preuves natifs dans son propre marqueur final.

`read_closed_guarded` vérifie les preuves de garde et les preuves numériques d’origine, puis reconstruit les enveloppes exactement, sans processus natif. Il ne relance pas de run ACTIVE/FAILED, n’adopte pas un orphelin et n’utilise pas de PID récupéré pour terminer un processus. Le contrôle de stockage reste limité aux octets, portes coopérantes et frontières testées ; un échec de persistance de diagnostic est signalé en mémoire, pas assimilé à une garantie contre panne disque.

## Résultats

Qualification finale guard-qualification-20261018-104354 : quatre trajectoires, 180 comparaisons numériques au seuil original et 180 lectures répétées identiques, provenance de garde distincte, dix observations/enveloppes live et relecture fermée identiques par trajectoire. Fermeture idempotente et refus sains sans modification des preuves.

Six cas réels : perte du manifeste garde, perte du manifeste numérique, écriture d’intention bloquée par un répertoire de test, timeout natif après ACK, abandon explicite et véritable mort du parent. Les trois premiers cas n’envoient aucune commande supplémentaire et conservent le dernier reçu ; les enfants sont récoltés ou sortent sur EOF, les runs abandonnés restent refusés. Trois refus supplémentaires : qualification ordinaire absente, racine étrangère, état fermé altéré. Treize tests spécifiques, suite totale 275. CLI ordinaire et relecture après approbation vérifiées.

Le premier prototype qualifié à 10:42 est conservé localement avec sa source/profil ; la version finale ajoute les métadonnées de fermeture/export nécessaires à une composition ultérieure. Aucun ancien rapport/profil numérique n’est réécrit ou requalifié rétroactivement.

## Usage

```text
python tools/organisme_entier/guarded_live_baseline.py --runtime-root ../p2 --output-root NEW_GUARD_ROOT --tick 1500
python tools/organisme_entier/guarded_live_baseline.py --runtime-root ../p2 --output-root CLOSED_GUARD_ROOT --read-closed
```

Les racines sont neuves sous o2-experiment ; horizons absolus 0/1/50/500/3000 au pas 0,02 s. L’API en contexte ferme ou abandonne proprement. Aucun événement, nouvelle sauvegarde restaurable, patient arbitraire, conversion/alignement, anatomie ou scénario A/B/C. Le [raccord explicite à la façade/registre/portable](PHASE2_COMPOSITION_GARDEE.md) est maintenant qualifié séparément ; --guarded le sélectionne sans changer le défaut historique ou réécrire les anciennes preuves.
