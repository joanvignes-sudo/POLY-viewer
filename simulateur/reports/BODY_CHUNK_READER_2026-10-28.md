# POLY — Lecture à la demande de blocs anatomiques vérifiés

**Date :** 28 octobre 2026  
**Statut :** module de chargement **expérimental non activé dans le corps public**, empilé sur les PR #17, #18 et #19.

## Résultat du lot

Le module [`body-chunk-reader.mjs`](../web/body-chunk-reader.mjs) peut charger un seul des blocs anatomiques produits par le générateur expérimental, sans ouvrir le binaire unique du corps entier. Il vérifie les empreintes et les identifiants, décompresse de manière bornée, puis permet à un intégrateur WebGL de créer et détruire les ressources de ce bloc.

Il **ne modifie pas** `app.js` pour activer le streaming. Les fichiers géométriques découpés restent générés uniquement dans l'environnement de test ; ils ne sont pas inclus dans le dépôt ou sur le site.

## Entrées et contrôles

1. `MANIFEST.json` doit déclarer `poly.body-source-chunks.v1`, les 918 structures attendues exactement une fois, et les deux empreintes SHA256 du binaire/JSON originaux connus. Il doit déclarer `experimental_not_deployed` et `published:false`.
2. Chaque entrée a un identifiant strict, des chemins relatifs fixes `chunks/<id>.json` et `chunks/<id>.bin.gz`, un comptage, des longueurs et trois empreintes.
3. Le lecteur n'accepte pas une requête arbitraire hors du dossier `chunks/` : la fonction de lecture navigateur ne forme l'URL qu'à partir de ces chemins strictement validés et interdit une autre origine.
4. Les métadonnées et les octets compressés sont vérifiés **avant** décompression ; la taille annoncée des données brutes constitue une borne maximale pendant la décompression progressive.
5. Après décompression, les octets bruts, les 3 types de plages alignées et l'ordre d'identité des structures sont vérifiés. Aucune estimation de coordonnées ni relaxation de provenance n'est autorisée.
6. En cas de corruption : **refus**, aucun modèle anatomique nouveau n'est installé.
7. Le cache conserve les blocs dans un budget d'octets bruts déclaré (8 Mio par défaut), refuse de charger un bloc trop lourd, évince par ancienneté les blocs non épinglés et appelle explicitement un hook de libération. Les blocs « épinglés » ne sont pas retirés silencieusement.

## Distinction importante : l'intégrité n'est pas une preuve biologique

Le SHA256 vérifie la concordance des fichiers avec les empreintes décrites dans le manifeste. **Un manifeste non authentifié et des fichiers forgés pourraient toutefois être mutuellement cohérents.** Ce risque impose de produire et vérifier les chunks par le pipeline source [`build_body_source_chunks.py`](../scripts/build_body_source_chunks.py), à partir des empreintes d'origine épinglées et avec comparaison octet par octet. Un déploiement devrait également épingler/signer le manifeste généré ou le livrer dans une publication versionnée révisée.

Ni le schéma, ni les hashes, ni les tests numériques ne peuvent faire d'un maillage anatomique inter-sujets un cerveau mesuré individuellement ou une preuve d'insertion musculaire.

## Budget mémoire : ce que l'on contrôle réellement

`maxRawBytes` borne **uniquement** les tableaux d'octets décompressés présents dans le cache. Le module n'est pas le moteur Three.js et ne mesure/borne pas :
- les allocations transitoires du décompresseur ou du téléchargement HTTP ;
- les métadonnées JSON, objets du moteur, autres simulations ;
- les copies CPU créées par l'application appelante ;
- la mémoire des buffers ou textures GPU alloués par WebGL.

Un hook `onDispose(installed, chunk)` est appelé lors de la libération du bloc. Pour être utile en 3D, le futur intégrateur devra appeler `geometry.dispose()`, `material.dispose()`, libérer les textures propres au bloc et retirer les objets de la scène. La fonction seule ne peut pas garantir la récupération des octets si d'autres références les conservent.

Les lectures simultanées d'un même bloc sont dédupliquées par une promesse d'attente, dans le périmètre ordinaire du module. Les règles détaillées de gestion de plusieurs chargements concurrents et de pinning devront être revues avant usage intensif.

## Reproduction du contrôle

Le workflow GitHub Actions construit d'abord les chunks source dans `runner.temp` avec `--verify`, puis appelle :

```sh
POLY_CHUNKS_ROOT=/tmp/poly-body-chunks \
  node --test simulateur/tests/body-chunk-reader.test.mjs
```

Les tests sont exécutés sur les **vrais blocs dérivés du vrai modèle**, pas de simples valeurs synthétiques. Ils comparent les empreintes des fichiers, chargent tous les blocs, vérifient l'identité des 918 surfaces et la somme d'octets, testent l'API gzip/WebCrypto, rejettent les corruptions et tentatives d'accès hors manifeste, puis qualifient éviction, conservation et libération de blocs.

Les fichiers de test restent locaux au runner ; aucune sortie binaire n'est uploadée ni placée dans `main`.

## Étape suivante

Pour basculer vers un vrai corps 3D mobile par région, il manque encore :
1. la revue des droits de redistribution et l'acceptation des assets géométriques générés ;
2. la distribution versionnée de ces assets, avec hashes source et manifeste authentifié ;
3. l'intégrateur Three.js pour les créer, sélectionner, retirer et recréer, en gardant les identifiants du modèle et les panneaux associés ;
4. des mesures réelles sur Android (mémoire CPU et GPU, temps de chargement, événements de perte de contexte, nombre de structures/triangles visibles) ;
5. des niveaux de détail anatomiquement défendables pour les quelques maillages qui resteraient trop volumineux ;
6. un protocole de non-régression : recherche, interactions musculaires, gestes tactiles et provenance après changements de régions.

**Ce module apporte le chargement d'une unité indépendante vérifiable ; il ne suffit pas encore à certifier un moteur 3D régional complet.**
