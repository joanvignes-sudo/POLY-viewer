# POLY — Vues spécialisées raccordées au chargement régional

28 octobre 2026. Suite de la branche locale `feat/regional-body-bridge-20261028`, après `c1133a3`. Base historique préservée : PR #21, commit `59d7571ca780f74dcfa9b261b13515f5f49ffb59`.

## Avancée concrète

Trois composants historiques sont maintenant réutilisés dans le laboratoire régional : l'inspecteur détaillé d'organes, le réseau fonctionnel documentaire de la marche, et le parcours source de l'œil droit. Ils ne supposent plus que tous les maillages présents au démarrage existeront pendant toute la session.

Le résultat complète le travail précédent : catalogue vérifié de 918 identités, plans de blocs sous budget, recherche globale, inspection simple, isolation, chargement des blocs manquants, rig graphique historique, picking déformé, interruption réseau et récupération WebGL. Le corps classique reste disponible et ses contrôles ont été vérifiés.

Aucun changement de source anatomique ou scientifique, aucun nouveau maillage, aucun recalage individuel. Aucun push, aucune PR supplémentaire, aucune fusion et aucun déploiement.

## Fait : inspecteur détaillé historique

`organ-inspector.js` accepte un fournisseur `getMeshes()` et le catalogue complet `records`, tout en conservant l'interface `meshes` utilisée par le corps classique.

- Groupes et pièces sont résolus depuis les maillages actuellement présents.
- La feuille courante est mémorisée par identité source, pas comme objet Mesh.
- Les boutons conservent une clé source et retrouvent la pièce au moment du clic. Leurs callbacks sont construits hors de la portée contenant les tableaux de pièces.
- `sync()` actualise le catalogue, la portée et les pièces lors d'une installation, éviction ou sélection. La disparition du dernier membre ferme l'inspection. Un objet ancien ne peut pas rouvrir une surface absente.
- La hiérarchie anatomique, les noms français, les références documentaires, le retour de caméra et le catalogue des ensembles sont conservés.
- La couverture affiche **présentes / attendues dans le catalogue**, avec les absentes. Elle ne confond plus une région chargée avec la totalité de la référence ni avec la complétude anatomique humaine.
- `dispose()` retire les commandes et ferme la session. Les états de vue régionaux contiennent des indices et valeurs de caméra ; ils ne gardent pas les maillages évincés.

L'inspecteur simplifié antérieur reste utile pour la complétion de blocs et l'isolation. Les deux modes se ferment mutuellement lors d'une ouverture afin d'éviter des masques contradictoires.

## Fait : réseau documentaire historique

`body-functional-bindings.mjs` indexe les correspondances textuelles déjà définies par le registre en **indices source**. Un instantané résout ces indices contre les résidents courants. Les cas « source absente du catalogue », « source déchargée », « surface masquée » et « repère documentaire sans surface » restent distinguables.

`walking-network.js` utilise ces résolutions dynamiques et expose un décompte de couverture. Dans le parcours régional, les segments dont les extrémités anatomiques requises sont absentes ou masquées sont suspendus. Les repères sans maillage ne suffisent pas à afficher seuls une chaîne flottant dans une scène vide. Le compteur régional distingue les schémas affichés des familles activées.

Les positions et courbes proviennent du registre documentaire existant. Ce sont des **repères et relations schématiques** : aucune trajectoire nerveuse ou vasculaire reconstruite, jonction, activation, latence ou activité du sujet n'est ajoutée. Les lacunes et arrêts du registre sont conservés.

Les correspondances ne retiennent plus d'anciens maillages. La fermeture du cache ou de la page détruit les géométries et matériaux des overlays et retire leurs commandes/labels. Les préférences de familles sont conservées sous forme d'identifiants lors d'un rechargement. Le réseau est désactivé par défaut dans le laboratoire ; une inspection spécialisée le masque. Un réseau masqué n'entretient pas une boucle de rendu continue.

Le laboratoire vérifie le SHA256 du registre avant de l'utiliser : `8448312aafdd9e921cea80b04e798cd2a3ce33b8f9ee15ce7b0aaf7be9b0c95b`.

## Fait : consultation source de l'œil droit

`native-eye-context.mjs` retrouve maintenant les surfaces par un fournisseur de résidents et propose une libération explicite. Les identités du contrat d'origine sont conservées :

| Ordre de consultation | Node source | Nom source |
|---|---:|---|
| 1 | 358 | VH_M_cornea_R |
| 2 | 350 | VH_M_lens_R |
| 3 | 336 | VH_M_retina_R |

Le parcours refuse de démarrer si les trois surfaces ne sont pas présentes et visibles, ou si le contexte graphique n'est pas compatible. Les vues corps et cadrée gardent la même identité. Le cadrage régional est calculé depuis les limites source ; il n'ajoute aucune coordonnée anatomique individuelle.

Les occultants sont échantillonnés par les sept rayons de l'outil historique, dans la pose source au repos. Le masque de matériaux ne dure que le rendu et est restauré dans `finally`. Il ne conserve pas de matériaux entre les images. Une déformation animée, une autre inspection, la perte d'une surface ou un changement de contexte ferment le parcours ; les sorties manuelles rétablissent la vue et la sélection antérieures lorsqu'elles existent encore.

L'ordre est une navigation anatomique. `physiological_time_s` reste nul et `study_participant_mapping` reste faux. Un identifiant HRA déclaré dans un protocole humain ne suffit toujours pas à établir une correspondance individuelle : le refus `U-ANATOMIE` est conservé et testé. Le libellé régional ne prétend pas suspendre une couche Z-Anatomy qui n'est pas montée dans cette page.

## Testé sur l'état final

- **60 tests Node : PASS**. Contrats, 918 identités, intégrité, cache, déformations, picking, annulation réseau, correspondances fonctionnelles dynamiques et limites de la consultation oculaire.
- **17 tests Python : PASS**. Générateur source et serveur d'aperçu local, avec restrictions de chemins.
- **Six suites navigateur : PASS**, exécutées séquentiellement sur le code stabilisé : `attachments-browser.cjs`, `body-startup-browser.cjs`, `body-light-browser.cjs`, `body-region-browser.cjs`, `body-regional-features-browser.cjs`, `body-regional-specialists-browser.cjs`.
- Bureau 1440×900/1000 et mobile 390×844 tactile émulé sous Chrome/SwiftShader. Les contrôles du corps classique couvrent maintenant aussi les trois étapes de l'œil et le retour de vue.
- Tests régionaux : cœur et poumons chargés séparément, disponibilité des liens mise à jour, inspection détaillée et hiérarchie, couverture d'un œil réparti sur deux blocs, fermeture après éviction, ancien bouton inoffensif, retour après rechargement, préférences de réseau et libération des géométries suivies par Three.js.
- Le parcours oculaire sélectionne successivement les trois identités exactes ; les vues corps/cadrée ne changent pas l'identité. Le retour restaure la sélection et la caméra ; le vidage du cache ferme la session et ne laisse pas de masque de matériaux.
- Aucune erreur de page dans les parcours qualifiés. `git diff --check` : PASS.

Les premières exécutions réalisées pendant l'évolution des fichiers ou en concurrence ont rencontré des délais d'initialisation. Elles ne servent pas de preuve de validation. La passe finale ci-dessus est séquentielle et utilise les sources stabilisées. Cela ne qualifie pas une exécution sous pression mémoire ou avec plusieurs scènes lourdes simultanées.

Les résultats de la nouvelle suite sont sauvegardés dans `POLY_SPECIALIST_BROWSER_RESULTS.json`. Les compteurs de géométries et tests de résolution ne prouvent pas une mesure physique de mémoire GPU ni une récupération garantie du navigateur après un arrêt brutal.

## Aperçu local

Recharger `http://127.0.0.1:8124/simulateur/web/body-region-lab.html` pour prendre les nouveaux modules. L'aperçu reste limité à la machine locale.

1. Charger un bloc ou rechercher une pièce dans le catalogue complet.
2. Utiliser « Inspecteur détaillé du corps classique » ou le catalogue des ensembles pour la hiérarchie et les références.
3. Activer les chaînes documentaires pour consulter les relations dont les surfaces requises sont présentes.
4. Pour le parcours de l'œil droit, charger les blocs contenant les trois surfaces natives ci-dessus, revenir au repos et hors inspection, puis ouvrir le parcours source.

Les fichiers générés restent dans `work/body-chunks`, hors du dépôt et du site. Le serveur local n'en fait aucune copie dans le projet. Pour le relancer depuis le dépôt :

```powershell
python simulateur/scripts/serve_body_region_preview.py --chunks-root ../body-chunks --port 8124
```

Les tests se rejouent avec le même `POLY_CHUNKS_ROOT`, Node 24, Python et Playwright. La nouvelle suite est ajoutée au workflow de qualification existant ; cela ne signifie pas qu'un run GitHub Actions a été exécuté, puisque rien n'a été envoyé sur GitHub.

## Expérimental et restant à faire

- Le laboratoire reste un parcours expérimental distinct. Il réutilise désormais trois composants du corps classique, mais ne remplace pas l'application historique entière.
- Restent notamment les atlas cérébraux spécialisés, l'illustration optique distincte `eye-light`, les références de main/avant-bras, le squelette Z-Anatomy et les ponts vers les protocoles individuels. Leurs références, matériaux et états doivent être traités avec la même discipline, sans créer de correspondance scientifique manquante.
- Les courbes fonctionnelles restent schématiques et le rig reste une déformation graphique. Les tests ne valident ni insertions, ni biomécanique, ni physiologie.
- Le transfert d'une pièce nécessite encore le téléchargement et le cache de son bloc entier. L'isolation n'est pas présentée comme une optimisation réseau par structure.
- Profilage nécessaire sur téléphone physique : allocation CPU/GPU, coût des raycasts et occultants, images effectivement présentées, batterie et température. Aucun résultat matériel n'est inventé. Une réduction de compteurs logiciels ne suffit pas à conclure sur ces mesures.
- La bascule générale, toute exposition réseau et toute distribution publique restent soumises à l'accord explicite du propriétaire.

## Conservation du travail

Le bundle `POLY-convergence-vues-20261028.bundle` contient tous les commits locaux de reprise depuis la PR #21, sans blocs générés. Le dépôt de destination doit posséder le commit de base `59d7571ca780f74dcfa9b261b13515f5f49ffb59`.

```powershell
git bundle verify CHEMIN/POLY-convergence-vues-20261028.bundle
git fetch CHEMIN/POLY-convergence-vues-20261028.bundle feat/regional-body-bridge-20261028:feat/regional-body-bridge-20261028
```

Ces commandes ne fusionnent ni ne publient le travail.
