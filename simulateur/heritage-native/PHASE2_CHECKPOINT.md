# Enveloppe expérimentale et reprise en processus séparé

Quatre processus natifs indépendants rechargent les quatre sauvegardes O2 qualifiées. **180 comparaisons passent au seuil original**, sur neuf sorties et cinq horizons jusqu'à 60 s. Sept variantes incompatibles sont rejetées par les précontrôles sans lancement natif. Les tests des outils passent, désormais **56 méthodes Python**. Ce résultat reste une qualification technique limitée, sans scénario A/B/C ni validation scientifique.

[Protocole](PHASE2_CHECKPOINT_PROTOCOL.json), [attentes persistées](PHASE2_CHECKPOINT_BINDINGS.json), [rapport exécuté](results/phase2-checkpoint-2026-10-17/report.json). Les résultats de continuité initiaux et le moteur original sont conservés.

## Frontières de l'enveloppe

`checkpoint_envelope.py` n'importe pas le moteur. `create` produit une enveloppe depuis des octets JSON et un contexte fourni ; `validate` compare cette enveloppe à des **attentes externes**, puis retourne les octets exacts vérifiés. Une empreinte simplement déclarée dans l'enveloppe ne constitue pas une autorisation.

| Élément | Contrôle |
| --- | --- |
| Moteur | Profil, commit amont et empreinte du patch O2 |
| Programme | Empreintes du worker natif et de la bibliothèque Pulse |
| Données | Empreinte du manifeste et vérification des 91 actifs déclarés ; résolution des chemins avant lecture |
| Patient initial | Empreinte exacte du patient sérialisé de l'ancre qualifiée |
| Patient courant | Empreinte attendue propre à chaque checkpoint déjà qualifié |
| Configuration | Empreinte exacte ; pas fixe de 0,02 s, pas dynamique refusé |
| Sauvegarde | SHA-256 des octets entiers ; présence et types des deux états O2 |
| Horloge | Identifiant, origine après stabilisation, unité seconde, temps natif et tick demandé explicitement |
| Orchestration | Seulement propriétaire isolé, aucun événement externe en attente/appliqué, aucun reliquat de temps fractionnaire |

JSON ambigu avec clés dupliquées, NaN/Infinity ou débordement flottant est refusé. Les valeurs temporelles non finies, unités incompatibles, ticks fractionnaires et actions externes sont refusés. Cette couche ne prétend pas effectuer un audit complet de chaque champ physiologique d'un état arbitraire.

## Patient initial et état courant

Le patient initial natif sérialisé de l'expérience O2 porte une masse `57.78724266213353 kg`, contre `57.787242662132684 kg` dans le fichier patient résolu du premier essai. Cette différence minime reste explicite ; aucune identité n'est obtenue par arrondi. L'ancre est le checkpoint O2 dont l'empreinte a déjà été consignée dans la qualification précédente.

Le champ de masse du `CurrentPatient` varie aussi entre checkpoints, par exemple `57.810229888448774` puis `57.81670235114818 kg` entre les ticks 1500 et 1501. C'est un constat sur l'état du modèle, sans validation de sa plausibilité biologique. Un premier contrôle renforcé supposait ce bloc immuable et a rejeté le tick 1501 : dossier partiel et échec conservés.

Le contrôle final conserve le patient initial et la configuration comme attentes fixes, et exige une empreinte du patient courant **spécifique à chaque checkpoint**, issue de ses octets préalablement qualifiés par SHA-256. Il ne prend pas cette attente depuis une enveloppe proposée et n'altère aucun patient pour passer le test.

## Exécution native

`checkpoint_worker.cpp` crée un seul moteur par processus, lit l'état depuis son entrée standard, contrôle le temps natif et le pas, puis avance au maximum de 3000 ticks. Il n'ouvre pas à nouveau le fichier de checkpoint après le précontrôle. Chaque processus écrit dans un nouveau dossier. La sonde vérifie neuf sorties aux horizons 0, 1, 50, 500 et 3000 ticks contre la trajectoire continue épinglée.

`qualify_checkpoint.py` mesure le worker construit dans l'environnement contrôlé, vérifie la bibliothèque contre le reçu précédent, et vérifie le patch, les quatre sauvegardes, la référence et les données. Elle contrôle ensuite les sorties natives, le hash de build annoncé et l'absence d'erreurs/fatals dans les journaux. Un délai maximal de 180 s est fixé pour chaque processus de cette sonde.

Cette qualification produit des attentes persistées dans `PHASE2_CHECKPOINT_BINDINGS.json`. **Une future reprise doit comparer le runtime à ces attentes persistées**, sans approuver automatiquement un nouveau binaire observé. L'outil de qualification n'est pas encore le répartiteur général de restauration.

Les refus exécutés concernent le worker, le patient, le patch, les données, le tick, un événement en attente et un reliquat fractionnaire incompatibles. Les tests synthétiques couvrent en plus les changements de bibliothèque/commit, la modification puis re-signature locale d'un patient ou d'une configuration, les unités, les types, les données modifiées et les chemins sortants. Aucune de ces simulations de refus n'est promue en preuve physiologique.

## Reproduire et limites

Depuis le dépôt, après le [build O2 isolé](PHASE2_CORRECTION_O2.md) et conservation du run qualifié `work/p2/o2-experiment/patched-20261017-170301` :

```text
python tools/pulse_probe/o2_experiment.py --runtime-root RUNTIME worker-build
python tools/pulse_probe/qualify_checkpoint.py --runtime-root RUNTIME
python -m unittest discover -s tools/organisme_entier -p "test_*.py" -v
python tools/organisme_entier/check.py
```

Les quatre sauvegardes et la référence doivent correspondre aux empreintes déjà publiées dans le rapport O2 ; aucun remplacement automatique par une nouvelle initialisation. Les sources effectivement exécutées sont copiées et empreintées avec chaque qualification. Une amélioration ultérieure des erreurs de type nul est testée unitairement ; les copies exécutées restent conservées séparément.

Il n'y a ici ni ordonnanceur d'événements, ni prise en charge de reliquats temporels, ni couplage neuronal, ni capacité universelle de rollback. Les empreintes ne sont pas des signatures ; les entrées restent celles d'une expérience locale de confiance. La résolution des chemins et la séparation de processus ne constituent pas une sandbox de sécurité. Les bibliothèques système/du compilateur et tous les comportements d'un checkpoint arbitraire ne sont pas audités par ce lot.

Prochain point : répartiteur de restauration limité aux quatre sauvegardes persistées, vérification des attentes avant lancement, puis tests de délais dépassés, d'erreurs et de conservation du dernier état utilisable. Ne pas annoncer de rollback général tant que cycle adaptateur, journal des événements et horloge du coordinateur ne sont pas qualifiés. Canon, main, PR #1 et déploiement préservés.
