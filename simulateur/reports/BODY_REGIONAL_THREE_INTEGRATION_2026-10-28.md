# POLY — Intégration Three.js des blocs anatomiques vérifiés

**État :** laboratoire de rendu expérimental en branche isolée, non fusionné, sans actifs 3D diffusés.  
**Date :** 28 octobre 2026.  
**Dépendances :** PR #17 (récupération), #18 (explorateur léger), #19 (blocs sources), #20 (lecteur à la demande).

## Résultat de ce lot

Le module `simulateur/web/body-region-three.mjs` relie désormais un bloc géométrique **préalablement vérifié** par `body-chunk-reader.mjs` à une scène Three.js :

- positions des sommets, normales et indices sont lus sans modification des valeurs d'origine ;
- chaque maillage garde son **indice source parmi les 918 structures**, son nom, son chemin de provenance, ses décalages dans le fichier binaire originel, ses limites spatiales et son identifiant de bloc ;
- un bloc est installé dans un groupe autonome de la scène, **après** avoir créé ses géométries sans erreur ; en cas de création défaillante, toutes les ressources partielles sont éliminées et le groupe n'est pas ajouté ;
- une structure peut être sélectionnée et mise en évidence par son identifiant original ;
- libérer ou évincer un bloc détache son groupe, appelle `geometry.dispose()` et `material.dispose()` pour **chaque** maille du bloc, et efface une sélection qui pointait vers cette région ;
- les ressources des autres blocs encore conservés restent accessibles.

Un banc d'essai séparé est proposé dans `simulateur/web/body-region-lab.html`. Il affiche **uniquement** les blocs sélectionnés, avec commandes de chargement/libération, budget de données brutes en cache de 4/8/16 Mio, recherche des identifiants chargés, provenance, rotation/zoom et contrôle du nombre de géométries suivi par le moteur graphique.

La page est autonome et **n'est pas liée depuis l'accueil public**. Sans répertoire de blocs candidat, elle affiche son indisponibilité et ne fabrique aucun maillage de remplacement.

## Vérification scientifique

Le lecteur doit disposer d'un manifeste produit par `simulateur/scripts/build_body_source_chunks.py --verify` depuis les deux fichiers de référence d'origine dont les SHA256 sont épinglés. Les blocs utilisés durant les tests sont reconstruits en **dossier temporaire** sur GitHub Actions, et injectés dans le navigateur de test par un serveur de fixtures local, sans être commités ni distribués sur le site.

Les résultats Three.js ne sont **pas** des preuves d'insertion musculaire, d'activité nerveuse, d'identité anatomo-fonctionnelle chez une personne réelle ou de validité clinique. Il s'agit des triangles du référentiel anatomique affichés avec leurs identifiants source.

## Ce que mesure le budget mémoire

`body-chunk-reader.mjs` limite le nombre d'**octets géométriques décompressés conservés** dans son cache. L'intégration Three.js détruit explicitement les ressources du moteur graphique lors du retrait d'un bloc. Les chiffres `renderer.info.memory.geometries` permettent de constater la libération des géométries suivies par Three.js.

**Cette mesure n'est pas un benchmark de mémoire GPU physique.** Le navigateur et le pilote peuvent mettre les ressources en cache ; les copies CPU temporaires, buffers de téléchargement/décompression et mémoire d'autres sous-systèmes ne sont pas comprises dans ce budget. Aucune garantie de pic mémoire inférieur à 4 ou 8 Mio ne peut être déduite de ces contrôles.

## Tests

```sh
python simulateur/scripts/build_body_source_chunks.py --output-root /tmp/poly-regions --verify
POLY_CHUNKS_ROOT=/tmp/poly-regions node --test simulateur/tests/body-region-three.test.mjs
# CI : navigateur Playwright Chromium, en injectant localement les blocs ci-dessus :
POLY_CHUNKS_ROOT=/tmp/poly-regions POLY_BROWSER_CHANNEL=chromium node simulateur/tests/body-region-browser.cjs
```

Tests unitaires avec les vrais blocs : reconnaissance des noms/indices et tableaux de sommets/triangles, respect des décalages source, réponse à une défaillance de construction, élimination de toutes les géométries et matériaux, conservation des identités après éviction/rechargement, refus des gzip altérés.

Parcours navigateur : chargement de deux blocs successifs en budget restreint, apparition du maillage de référence, sélection, coordonnées et provenance ; éviction de la première région, libération des géométries suivies par Three.js après `Tout libérer`, absence de téléchargement du binaire complet, refus du manifeste manquant ou d'un bloc corrompu, et vérification en format desktop et en tactile **émulé**.

Ces tests logiciels ne prouvent ni performances acceptables sur un Android physique ni compatibilité de l'ensemble des fonctions du corps 3D historique.

## Limites et prochaine étape

1. **Pas encore de remplacement du lecteur corporel historique** : ses 918 mailles, réseau de marche, animation, shader de déformation, inspection d'organes et sélections croisées utilisent toujours la construction initiale. Cette séparation évite de casser silencieusement des fonctions existantes.
2. **Distribution des fichiers** : les fragments 3D ne sont pas disponibles sur GitHub Pages. Avant une diffusion, étudier droits d'utilisation et de redistribution, hash du manifeste/version, fréquence de compression et coûts réseau.
3. **Intégration fonctionnelle** : choisir une région depuis le mode léger et ouvrir le vrai maillage, tout en préservant les relations documentaires, la recherche et la sélection. Cela nécessite un protocole de transfert d'identifiants stable, pas une reconstruction de l'anatomie.
4. **Animation** : conserver explicitement la distinction entre mouvement illustratif sur géométries de référence et simulation biomécanique validée. Adapter le shader seulement après qualification des points d'ancrage et effets de déformation.
5. **Concurrence et résilience** : tester réseau instable, annulation d'une demande devenue inutile, changement rapide de régions, contexte WebGL perdu/recréé et gestion fine des buffers en CPU/GPU.
6. **Téléphone physique** : relever durée, octets transférés, consommation de mémoire, FPS, pertes de contexte, batterie/température et capacité de reprise ; sans ces mesures, la performance reste un objectif, pas un résultat démontré.

**Aucune fusion ni publication ne doit avoir lieu sans approbation explicite.**
