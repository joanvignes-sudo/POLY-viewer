# POLY — Accessoires historiques et arrêt du rendu au repos

29 octobre 2026. La construction des accessoires a été extraite du vrai module `activities.js` vers `activity-props.mjs`, partagé par classique et régional. Aucun modèle anatomique ni donnée biologique ajouté.

## Accessoires

Chaise, table, tapis, assiette, éléments graphiques de repas et cuillère : 22 objets, avec les géométries, matériaux et transformations de la version `99f2667`. L’empreinte SHA-256 de leur description géométrique complète est `8f17de2090247fa11f07e1890c37f3b69a6480478d7fcec3ba286c4d2cd2a53f`, comparée par le test à la construction extraite de cette version historique.

L’option régionale est explicite et initialement désactivée. Les objets suivent les états des postures manuelles, avec le poignet renvoyé par la véritable recette du geste de repas. Il n’y a ni nouvelle horloge ni dépendance au journal déclaré. Le contexte spécialisé et le mode os seuls les masquent ; retrait et perte de contexte détruisent chacun des 22 couples géométrie/matériau, une fois. Aucun appui, contact, ingestion ou effet biologique n’est calculé. Les coordonnées fixes restent celles de la présentation historique.

## Repos du rendu documentaire

La revue du raccordement précédent a identifié une boucle : `updateStats → navigationUI → documentary.refresh → onContextChange → scheduleRender`. Elle pouvait entretenir le rendu après ouverture des dossiers, y compris en pause. Le callback demande désormais une image seulement lorsque le moteur ou son état de lecture change. Les changements explicites de caméra, sources et options conservent leur propre demande de rendu.

La suite carte 3D laisse passer quatre rappels d’animation de stabilisation, puis vérifie sur les huit suivants qu’aucune nouvelle image du lecteur n’a été rendue à l’arrêt. Ce contrôle passe sur ordinateur et mobile émulé ; il ne mesure ni fréquence utile, autonomie, température ou téléphone physique. La lecture documentaire active continue à demander ses images depuis son unique horloge.

## Validation

156 tests Node passent sans échec ni test ignoré. Les nouveaux tests comparent les octets et transformations des accessoires, leurs états, le vrai poignet et les 22 destructions de chaque type. Les tests historiques de posture restent inchangés et passent.

Les suites navigateur régionales os/accessoires, carte documentaire (dont repos réel), manifestes/reprises et classique combiné passent sur ordinateur et mobile émulé. COGITATE, dossiers retrouvés, os, carte et accessoires restent accessibles dans le parcours classique testé. Les 23 tests Python précédemment validés ne sont pas présentés comme réexécutés pour ce changement JavaScript.

Le défaut de boucle de rendu ci-dessus est identifié et corrigé ; il ne constitue pas une explication démontrée des délais intermittents de démarrage. Ces délais restent ouverts et leurs échecs sont conservés. Les interactions exhaustives du monolithe membres/tronc, les autres groupes d’occultation et la qualification physique demeurent des écarts explicites. Aucun push, déploiement ou publication.
