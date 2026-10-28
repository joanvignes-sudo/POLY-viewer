# POLY — Interface commune corps historique / régions

28 octobre 2026 — état du premier raccord local. La suite et le bilan à jour sont dans `BODY_REGIONAL_CONVERGENCE_2026-10-28.md`.

## Point de reprise vérifié

- PR #21 ouverte et en brouillon, branche `feat/body-regional-three-lab-20261028`, commit `59d7571ca780f74dcfa9b261b13515f5f49ffb59`.
- PR #16 à #20 relues ; aucune PR plus récente que #21 au contrôle GitHub de cette passe.
- Base `origin/main` observée : `9dff3e31f0f11eb4639f8421957e36dbfc32f663`.
- Nouvelle branche locale : `feat/regional-body-bridge-20261028`.
- Aucune fusion, aucun push, aucune PR créée, aucun déploiement. Blocs générés uniquement dans `work/body-chunks`, hors dépôt.

## Audit et décision

Le corps historique construit une liste de 918 maillages avant de créer ses modules. `organ-inspector.js` indexe les groupes au démarrage, et la recherche, les réseaux, les vues spécialisées et plusieurs états sauvegardés retiennent des objets Mesh. Remplacer cette liste par des blocs évictables immédiatement laisserait des références vers des objets détruits. La sélection historique utilise `name`, `node`, `path`, `bounds`, les comptes géométriques et les offsets originaux. L'adaptateur régional exposait essentiellement les alias `source_name`, `source_node`, `source_path`.

Le rendu historique injecte `rigGLSL` dans ses matériaux et utilise `deformPosition` pour le picking ; le laboratoire utilise des surfaces statiques. Ce lot ne raccorde pas ces déformations. Les indices de source désignent une entrée du catalogue, les nodes une identité du graphe : ne pas les confondre.

## Fait

- `body-source-contract.mjs` construit les métadonnées communes dans les deux parcours. Nom, node, chemin, limites source, index du catalogue, comptes et offsets **du binaire original** sont conservés. Les offsets du bloc servent exclusivement à construire ses buffers.
- `createSourceAccess(getMeshes)` offre `resolve(sourceIndex)` et `search(query, limit=35)` sur les résidents courants. Pour une future intégration, conserver l'index source et résoudre de nouveau après chaque changement de blocs ; ne pas conserver de Mesh au-delà de son éviction.
- Recherche historique extraite dans ce contrat, avec les mêmes alias français et une normalisation commune. La recherche régionale utilise ce même code et précise qu'elle ne couvre que les structures en mémoire.
- Les résultats régionaux sont actualisés à l'installation/éviction. Un bouton ne sélectionne qu'une identité encore résidente.
- Métadonnées historiques compatibles désormais accessibles dans les maillages régionaux ; anciens alias régionaux conservés.
- Tests ajoutés au workflow existant, sans ajouter d'assets générés.

## Testé localement

- Génération des 13 blocs et comparaison octet par octet des 918 structures : PASS ; 30 693 264 octets bruts, sources SHA256 inchangées.
- 48 tests Node : contrat commun, toutes les identités historiques/régionales, recherche, éviction/rechargement, intégrité, concurrence, attribution, mode léger, récupération et catalogue des rattachements.
- 14 tests Python : PASS. Régénération du catalogue des rattachements sans différence.
- Chrome headless / SwiftShader : laboratoire 1440×900 et 390×844 tactile émulé, vraie recherche de structure et sélection, éviction et dispose, annulation des réponses tardives, manifeste absent, gzip altéré, absence de téléchargement du corps entier, perte/restitution de contexte WebGL sans changement des identifiants ou résidents.
- Navigateurs : contrôles existants du corps historique, panneaux anatomiques, mode léger et secours après échec. Recherche « cœur » et ouverture/fermeture de l'inspecteur historique ajoutées à la non-régression.
- `git diff --check` : PASS.

La restauration WebGL vérifie le passage des événements et la conservation de l'état. Elle ne prouve ni la récupération après arrêt brutal du navigateur, ni une qualité visuelle exhaustive après restauration. Les compteurs Three.js ne mesurent pas la mémoire GPU physique.

## Expérimental et restant à faire

1. Faire évoluer l'inspecteur vers un catalogue dynamique et une couverture explicite : une région chargée ne permet pas d'affirmer « ensemble complet du fichier chargé ». Son texte historique serait trompeur si on le réutilisait directement dans le laboratoire.
2. Fermer les vues spécialisées avant éviction, libérer leurs références CPU, reconstruire leurs index au chargement ; prévoir un protocole d'abonnement et désabonnement aux changements de résidents.
3. Raccorder matériaux de déformation et picking déformé au même registre d'identités, puis tester les poses et le retour au repos sans présenter ces déformations comme une validation biomécanique.
4. Qualifier perte de contexte pendant transfert, pendant installation et pendant inspection, et observer la reconstruction des ressources de rendu.
5. Le manifeste permet déjà de retrouver le bloc contenant un `source_index` via `original_indices`. Une sélection unique doit encore charger son bloc entier. Un filtrage des meshes réduirait les allocations de scène, mais ne réduirait pas à lui seul les octets téléchargés/cache du bloc. Une distribution par structure requiert un nouveau découpage vérifié et une approbation de distribution.
6. Mesurer sur téléphone physique mémoire CPU/GPU, latence, fréquence d'images, batterie et température. Aucun résultat physique n'est revendiqué.

Aucune modification de géométrie source, insertion musculaire, latence, causalité ou donnée physiologique ajoutée. Les vérifications informatiques ne constituent pas une validation biologique.

## Rejouer

Depuis la racine du dépôt, avec Node 24 et Python :

```powershell
python simulateur/scripts/build_body_source_chunks.py --output-root ../body-chunks --verify
$env:POLY_CHUNKS_ROOT=(Resolve-Path ../body-chunks).Path
node --test simulateur/tests/*.test.mjs
python -m unittest discover -s simulateur/tests -p 'test_*.py'
```

Pour le navigateur : servir le dépôt localement sur `127.0.0.1:8123`, installer Playwright et Chrome ou Chromium, renseigner `POLY_BROWSER_CHANNEL` puis exécuter les quatre scripts `attachments-browser.cjs`, `body-startup-browser.cjs`, `body-light-browser.cjs`, `body-region-browser.cjs`. Les blocs du dernier sont fournis par interception locale des requêtes ; ne pas les copier dans le site.
