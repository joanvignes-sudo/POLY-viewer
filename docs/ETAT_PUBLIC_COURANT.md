# POLY — état public vérifié au 28 octobre 2026

**Cette page décrit le site principal actuellement déployé**, et non les branches de développement ni une validation scientifique nouvelle.

- **Version de publication :** `v0.141.1`.
- **Lecteur :** https://joanvignes-sudo.github.io/POLY-viewer/
- **Notice de version :** [v0.141.1](../RELEASE_v0.141.1.md).
- **Source structurée contrôlable :** [`docs/ETAT_PUBLIC_COURANT.json`](ETAT_PUBLIC_COURANT.json).

## Ce que l'on peut présenter aujourd'hui

| Domaine | Dans la version publique | Limite à indiquer |
| --- | --- | --- |
| Navigation | Entrée « Cerveau & conscience », liens vers le corps et les recherches | Un visiteur peut encore avoir besoin d'un accompagnement ; aucun test externe d'utilisabilité n'est démontré ici |
| Cerveau | 17 surfaces de l'atlas CerebrA, chargement au clic | Atlas anatomique de référence, pas un cerveau individuel ni une carte d'activité |
| Anatomie musculaire | 507 pièces inventoriées ; 143 disposent d'au moins une région de rattachement documentée | 364 pièces sans relation qualifiée ; **aucune insertion 3D validée** |
| Lactate humain | Module des régressions régionales de Boumezbeur et al. (2010) dans l'atelier | Pas de transfert astrocyte–neurone mesuré, pas de prédiction clinique |
| Corps animé | Parcours documentaires et mouvements illustratifs | Pas de simulation physiologique complète validée |
| Thermique | Documents, observations et résultats précalculés conservés | Pas de moteur thermique en ligne actif revendiqué |

## Développements non publiés (état de l'audit)

- [PR #12](https://github.com/joanvignes-sudo/POLY-viewer/pull/12) : commandes du cerveau 3D plus complètes, encore en brouillon au moment de la vérification ; contrôles automatisés réussis sur la branche.
- [PR #13](https://github.com/joanvignes-sudo/POLY-viewer/pull/13) : démonstrateur Li et al. 2025, aussi en brouillon ; les tests sont réussis, mais **reproduction de statistiques publiées ≠ réajustement des données spectrales**. Le transfert astrocyte–neurone n'est qu'une hypothèse comptable, non une mesure biologique.

La liste est un instantané. Les PR pourront changer d'état sans que cela modifie rétrospectivement cette note.

## Pourquoi les anciens numéros n'ont pas été « corrigés »

Les documents `ETAT_CANONIQUE.json` (v0.136.0) et `PUBLICATION_SCOPE.json` (v0.140.0) sont des instantanés techniques/scientifiques plus anciens. Leur attribuer arbitrairement le numéro de la dernière publication ferait croire que les données internes et les résultats qu'ils décrivent ont été recalculés.

**Principe de versionnage :** une version du site, un état documentaire, un calcul numérique et une validation biologique sont quatre statuts distincts. Leurs numéros n'ont pas à être artificiellement identiques.

## Garde-fou automatique

Le test `simulateur/tests/current-release.test.mjs` valide :

1. La version de cette fiche et celle annoncée en tête du README correspondent à la **plus récente notice `RELEASE_v...` présente**.
2. Les fichiers d'entrée, sources et documents cités existent dans le dépôt.
3. Les 507 pièces se répartissent en 143 qualifiées et 364 non qualifiées ; le nombre d'enthèses 3D validées reste zéro.
4. La fiche identifie les documents historiques sans les « promouvoir ».
5. Les marqueurs de portée clinique et de validation physiologique restent explicitement négatifs.

Ce test vérifie **la cohérence de la documentation**, pas la vérité des données expérimentales ni le rendu graphique sur téléphone.

Exécuter depuis la racine :

```sh
node --test simulateur/tests/current-release.test.mjs
```

## Règle de mise à jour pour la prochaine publication

Lors d'une nouvelle version validée de POLY :

- créer et vérifier la nouvelle notice `RELEASE_vX.Y.Z.md` ;
- mettre à jour la section **État public actuel** du `README.md` ;
- faire évoluer `docs/ETAT_PUBLIC_COURANT.json` avec les faits et limites de cette version ;
- laisser les anciens instantanés intacts et publier de nouveaux dérivés, plutôt que renommer une validation inexistante ;
- laisser la CI contrôler les fichiers avant tout déploiement.

**Une branche non fusionnée ne constitue jamais une fonctionnalité publiée.**
