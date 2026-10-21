# Protocole technique préalable : moteur de baseline persistant

Pré-déclaré le 18 octobre avant construction/exécution de ce nouveau worker, dans la prolongation technique jusqu'à 12 h 36 UTC. Le périmètre reste les quatre checkpoints corrigés et les cinq horizons déjà qualifiés ; aucune nouvelle action biologique, patient, équation, phase 3–5 ou scénario A/B/C.

But : garder un même moteur natif vivant entre lecture et avancement, au lieu de restaurer un processus à chaque horizon. Source/build/binaire séparés du worker historique ; versions, empreintes et dépendances explicitement épinglées avant qualification. Le moteur, données et correctif O2 existants restent inchangés.

## Commandes natives bornées

- READY avant toute entrée d'état : permet identité durable et contrôle des DLL avant stdin.
- RESTORE : une seule fois, octets d'un des quatre états vérifiés par le parent, longueur bornée, temps natif attendu et pas 0,02 s vérifiés.
- READ : neuf valeurs natives finies, aucune évolution de temps.
- ADVANCE : horizon absolu depuis le checkpoint initial parmi 0/1/50/500/3000, jamais en arrière ni au-delà de 3000 ; pas de reliquat fractionnaire.
- CLOSE : destruction du moteur et sortie propre. EOF sans CLOSE est un abandon, sans promotion de résultat final.

Aucun ProcessAction, changement de configuration/dt, fichier d'état arbitraire ou export de checkpoint final. Maximum de commandes borné. Protocole d'entrée/sortie distinct des logs ; erreurs natives terminales pour ce processus.

## Critères avant exécution

Pour chacune des quatre ancres, une seule restauration puis lectures et avancements successifs vers 0/1/50/500/3000. Comparer les neuf sorties aux attentes persistées du [jeu de références existant](PHASE2_CHECKPOINT_BINDINGS.json), au seuil inchangé `abs(actual-reference) <= 1e-9*max(1,abs(reference))`. Le temps natif est conservé et doit aussi s'aligner à 1e-8 s du tick attendu. READ répété conserve valeurs/temps. Les commandes en arrière/hors liste et capacités apply/checkpoint restent refusées sans progression.

Le parent épingle binaire/source/protocole, bibliothèque, contexte d'état d'origine et manifest des trois DLL du nouveau worker. Les profils historiques v1/v2, exécutables, états et résultats restent intacts. Le contexte du checkpoint d'origine est distingué du contexte d'exécution du nouveau worker ; aucune substitution d'identité silencieuse.

Les sorties vérifiées peuvent recevoir des enveloppes SIMULATED avec provenance de commande et horloge de trajectoire propre. Elles sont des observations d'une baseline, pas des checkpoints restaurables ou preuves biologiques. Pas de rollback général ni reprise implicite d'un moteur après mort du parent.

## Refus et limites à qualifier

Commande invalide/ID réutilisé autrement, incapacité native, EOF précoce, timeout et mort de parent : enfant direct possédé terminé/récolté lorsqu'un parent vivant peut agir, preuve et dernière observation conservées ; état inconnu refusé. Aucune terminaison par PID récupéré. Une erreur d'avancement rend le moteur jetable plutôt que d'en présumer l'intégrité.

Un processus neuf est exigé après échec ; aucun processus orphelin ou fichier partiel n'est adopté. Les cas de panne arbitraire du stockage, chargements tardifs et modules OS conservent leurs limites existantes. La présence du protocole n'est pas un résultat PASS : les rapports suivants distingueront construction, tests et qualification réelle.
