# POLY — Liste de convergence au 28 octobre 2026

Le développement reste local et expérimental. Aucun push, merge, déploiement ou remplacement du site public.

| Priorité initiale | État vérifiable | Reste à faire |
|---|---|---|
| Audit architecture/rendu/sélection/mémoire | Réalisé pour les parcours raccordés ; conflit de double instance Three.js corrigé | Étendre l'audit lors de chaque raccordement restant |
| Interface stable lecteur 13 blocs ↔ fonctionnalités historiques | Adaptateur régional, résidents et sessions de matériaux en place | Remplacer progressivement le chemin monolithique du corps historique |
| Identités, noms, coordonnées et références pendant les changements | Préservés et testés ; références HRA, main, CerebrA et membres distinctes | Qualifier les relations entre bibliothèques avant tout affichage présenté comme aligné |
| Libération et récupération WebGL | Testées pour corps, vues raccordées et lecteur de pièces/groupes | Mesurer les effets physiques du pilote sur de vrais appareils |
| Recherche, inspection et tactile | Corps régional, inspecteur, œil, P1, CerebrA, main ; fiches et filtres de membres ; groupes muscle–os | Interactions restantes de l'atelier historique complet et sélection spatiale détaillée des groupes |
| Marche et déformations | Rig/sampler de marche du corps régional raccordé et testé dans les passes précédentes | Toutes les déformations des références musculaires/osseuses et leurs interactions ne sont pas portées |
| Une structure ou groupe local | HRA régional ; lecteur vérifié de 526 pièces ; groupes muscle–os bornés et réutilisation de blocs | Autres groupes justifiés et qualification de leurs dépendances |
| Performance et limites | Compteurs logiciels, budgets, essais navigateur et serveur réels documentés | Téléphone physique : CPU/GPU, fréquence d'images, batterie, température |

## Avancées de la dernière passe

- Affichage simultané d'un muscle et de ses os documentés, dans les coordonnées de la référence source.
- Planification avant téléchargement : maximum 4 Mio de blocs source et 16 pièces ; pas d'installation partielle en cas de corruption.
- Identification et fiches de toutes les pièces chargées ; masquage explicite du contexte ; libération lors du remplacement.
- Sauvegarde et reprise volontaire de groupes, compatible avec les anciennes sauvegardes d'une pièce.
- Lecture nerveuse documentaire à la demande : source vérifiée, étapes et limites terminales ; transfert annulé au changement de fiche.
- Observations humaines spécifiques filtrées par pièce et chemin explicites ; protocoles d'interaction consultables sans les affecter au maillage.
- Régions absentes et côtés non annotés/bilatéraux consultables sans inférence.

## Validation

95 tests Node : PASS. Suite navigateur du lecteur de référence : PASS sur bureau/mobile émulé après dernière modification. Les résultats antérieurs de 21 tests Python et des neuf autres suites navigateur sont conservés ; ces suites ne sont pas présentées comme réexécutées dans cette passe.

Essai supplémentaire sans interception via le serveur réel : biceps droit + radius droit, 726 000 octets de blocs source résidents, 51 048 octets de copies d'affichage, deux géométries, aucune erreur JavaScript. Cela ne mesure ni RAM totale ni mémoire GPU physique.

## Prochains travaux logiciels

1. Porter davantage d'interactions historiques sur les résidents : sélection spatiale des groupes et commandes de focus/retour.
2. Porter les déformations musculaires/osseuses en réutilisant les transformations illustratives existantes, avec qualification de leur portée et de leurs ressources.
3. Étendre le raccordement du pilote nerveux seulement dans des repères compatibles et avec un cycle de vie libérable.
4. Préparer un parcours d'entrée commun, en conservant le corps historique tant que la couverture de non-régression est incomplète.

La distribution des blocs et la publication restent soumises à l'accord explicite de l'utilisateur. Les insertions individuelles, latences, forces, activations et recalages non établis ne sont pas des tâches à remplir avec des valeurs inventées.
