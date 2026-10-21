# Registre de propriété et admission atomique des observations

`tools/organisme_entier/observation_registry.py` fournit un registre local au coordinateur, en mémoire. Il admet des trames numériques SIMULATED déjà produites par un adaptateur qualifié ; il ne lance aucun moteur et ne transforme pas une assertion de provenance en preuve indépendante.

## Propriété explicite

Un producteur déclare son identifiant, propriétaire, référence d'entité qualifiée, ports (quantité/unité/espèce/compartiment), définition complète d'horloge et empreintes de provenance attendues. Les réservations de tous ses états sont atomiques : un conflit sur un seul port refuse la déclaration entière. Deux producteurs ne peuvent écrire la même clé, même s'ils utilisent le même libellé de propriétaire.

La clé inclut l'horloge, la référence d'entité avec sa version, la quantité et le compartiment. Le registre n'infère aucune équivalence entre deux versions/namespaces ou individus. Un alias de port sur la même clé est refusé. La réservation reste présente après release : il faut une nouvelle trajectoire qualifiée pour changer de producteur, pas retirer un verrou pour réécrire l'histoire.

## Horloges et trames

Une horloge possède id, origine, unité s, pas, tick/temps d'ancrage et tolérance pré-déclarée. Un même id ne peut avoir deux définitions. Des identifiants différents restent des trajectoires indépendantes ; aucune relation biologique ou synchronisation inter-études n'est déduite de valeurs temporelles proches. Pour ce prototype, une autre unité de temps exige une conversion qualifiée distincte, non implémentée.

Une trame doit contenir tous les ports déclarés, exactement une fois, avec une même heure native et un même tick. Le registre vérifie le contrat d'enveloppe existant, unité/espèce/propriétaire, entité, empreintes de provenance et relation affine tick/temps. ND/null, mesure promue en simulation, temps incohérent ou mélange de trames sont refusés. Aucun zéro de remplacement ni interpolation.

Toute la validation précède la publication. Un mauvais sixième port ne laisse pas cinq états partiellement mis à jour. Une trame plus ancienne est refusée ; une nouvelle observation au même tick est possible si les valeurs et le temps restent identiques, avec sa propre provenance. Des valeurs différentes au même tick sont un conflit. La version attendue du registre permet une écriture optimiste ; deux threads ne peuvent tous deux engager avec la même ancienne version.

Une clé de lot identique avec le même contenu renvoie son reçu historique sans revenir sur les états récents. Une autre charge sous cette clé est refusée. `read_latest_frame(producer_id, expected_tick=...)` retourne une seule trame cohérente d'un producteur ; une heure passée indisponible est refusée, jamais reconstruite. Les lectures restent possibles après release, avec le statut du producteur visible.

## Qualification et limites

Vingt-quatre tests couvrent atomicité, espèces/unités/statuts/ND, horloges, double propriété, limites, lease altéré, rejouabilité, libération, révisions et lecture concurrente cohérente. Le registre ne fait aucune écriture du canon ni des sources.

Les observations réelles de la baseline persistante sont admises via le lecteur de runs fermés : quatre trajectoires, 40 trames/240 enveloppes (y compris lectures répétées), 24 états récents, quatre horloges indépendantes. Dix refus conservent le snapshot octet pour octet au niveau de sa représentation JSON. La libération garde états et réservations ; répétition historique sans rembobinage. Aucun nouveau processus natif pendant cette qualification, sources runtime inchangées. [Rapport](PHASE2_REGISTRE_OBSERVATIONS_RESULTATS.json).

Les empreintes déclarées sont comparées aux enveloppes ; le registre ne rouvre pas lui-même chaque modèle/article/receipt et ne certifie pas la vérité scientifique d'un producteur. La qualification du lecteur et du moteur reste séparée. Réserver une horloge est une déclaration du coordinateur, pas une preuve d'alignement biologique. Les clés/données restent locales à ce registre ; aucun verrou distribué, reprise durable du registre, convertisseur, ordonnanceur d'événements ou couplage physiologique n'est annoncé.

Reproduction :

```text
python -m unittest discover -s tools/organisme_entier -p "test_*.py" -q
python tools/organisme_entier/qualify_observation_registry.py --runtime-root ../p2 --source-root EXISTING_QUALIFIED_LIVE_ROOT
python tools/organisme_entier/check.py
```

Le canon C01–C13 demeure un corpus de preuves avec ses statuts natifs. Son raccord sera une résolution de références qualifiées ; cette admission numérique ne convertit pas ses chaînes en activations simulées.
