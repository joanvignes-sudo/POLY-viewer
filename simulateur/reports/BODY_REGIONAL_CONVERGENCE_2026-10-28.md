# POLY — Convergence régionale, inspection, mouvement et récupération

28 octobre 2026. Branche locale `feat/regional-body-bridge-20261028`, issue du commit vérifié de la PR #21 : `59d7571ca780f74dcfa9b261b13515f5f49ffb59`. Cette suite inclut le premier raccord `7103e6a`.

## Résultat livré

Le laboratoire régional est devenu un parcours anatomique expérimental utilisable : recherche dans le catalogue complet, chargement du bloc utile, inspection dynamique d'un ensemble, isolation d'une structure, complétion des blocs manquants sous budget, marche graphique de référence, sélection sur surfaces déformées, gestes tactiles et récupération WebGL. Un aperçu local sert les fichiers générés depuis un dossier extérieur au site.

Le corps classique conserve ses fonctionnalités et son rendu historique. Le nouveau parcours ne remplace pas encore les modules spécialisés du corps classique. Aucun push, aucune PR supplémentaire, aucune fusion, aucun déploiement ni distribution publique des blocs.

## État des huit priorités

| Priorité | Réalisé et qualifié ici | Limite conservée |
|---|---|---|
| 1. Audit de l'architecture | Rendu, recherche, sélection, références Mesh, inspecteur, animation et mémoire examinés ; risques de références périmées identifiés | Les réseaux, atlas et vues spécialisées conservent encore leurs index historiques |
| 2. Interface stable | Contrat commun de métadonnées, résolution par index source, plan de blocs d'une sélection et inspecteur fondé sur des identifiants | Pas de bascule générale des anciens modules vers le chargement régional |
| 3. Identités et coordonnées | Comparaison des 918 structures historiques et régionales, offsets originaux distincts des offsets des blocs, rechargement sans changement des sources | Pas de recalage individuel ni nouvelle coordonnée anatomique |
| 4. CPU/GPU et WebGL | dispose géométries/matériaux, retrait des références des jetons et render lists, interruption réseau réelle, perte de contexte pendant lecture/animation, retour de page | Mémoire physique, arrêt brutal du navigateur et tous les ordonnancements possibles non mesurés |
| 5. Recherche, inspection, tactile | Catalogue complet, isolation, groupe dynamique avec couverture, chargement des blocs absents, retour de caméra/visibilité, rotation et pincement | La sélection parcourt encore les triangles sur CPU ; à profiler sur téléphone |
| 6. Animations | Shader et fonction CPU du rig historique, angles OpenSim et boucle graphique existante, pause, phase, retour au repos, picking déformé et tests de non-régression | Ni force, ni activation, ni contact au sol, ni précision biomécanique démontrée |
| 7. Structure/groupe local | Plan minimal des blocs nécessaires, chargement d'une pièce depuis la recherche et complétion d'un groupe sous budget sans éviction de ses blocs épinglés | Une pièce télécharge encore son bloc entier ; isolation visuelle ne signifie pas transfert ou allocation GPU par pièce |
| 8. Mesures et expériences | Export local de diagnostic et observations de tests sauvegardées ; protocole physique ci-dessous | Pas de téléphone physique, mesure GPU, batterie ou température accessible dans cette passe |

## Interfaces et fonctionnement

`body-source-contract.mjs` fournit `sourceMeshData`, `createSourceAccess` et `planSourceBlocks`. L'index source est celui du catalogue de 918 entrées ; il ne doit pas être confondu avec le node anatomique. Conserver l'index entre les actions et résoudre le maillage courant à chaque utilisation.

`body-resident-inspector.mjs` ne conserve aucun Mesh : seulement une portée anatomique et une carte de visibilité indexée par source. Ses décomptes comparent les résidents au catalogue complet vérifié. L'éviction du dernier membre ferme l'inspection. La fermeture restitue la visibilité et la vue ; un maillage nouvellement chargé retrouve une visibilité par défaut. « Toutes les pièces du catalogue de cet ensemble sont chargées » n'établit pas la complétude anatomique humaine.

Le chargement d'un ensemble calcule les octets de **tous les blocs requis**, refuse un budget insuffisant et épingle les blocs utiles durant la séquence. Une interruption libère les épingles ; l'intégrité reste contrôlée par le lecteur. Une recherche d'une structure absente ne charge que son bloc, pas l'ensemble de son système.

`body-region-motion.mjs` réutilise `rigGLSL` et `deformPosition`. Le transfert reprend les signes articulaires, l'échelle verticale source, le balancement controlatéral des bras et le raccord graphique final de la boucle historique de 1,08 s. La cinématique et le catalogue sont épinglés par SHA256. Le fichier OpenSim appartient à une autre référence que l'atlas : cette visualisation n'est pas une mesure du mouvement du corps HRA. Les normales d'éclairage ne sont pas recalculées selon une déformation biomécanique ; c'est une limite héritée du rig graphique.

La sélection construit au maximum un proxy CPU déformé par structure examinée, le détruit même en cas d'exception et ne réécrit jamais les positions source. Le culling fondé sur des limites statiques est désactivé pour ce rendu déformé. Les dimensions de la cible de rendu ne sont plus réassignées à chaque image si elles n'ont pas changé.

Les évictions détruisent géométries et matériaux, retirent les Mesh des groupes et registres, vident les listes des jetons d'installation et les render lists du renderer. Un ancien jeton ne peut plus détruire une région installée plus récemment sous le même nom. Une exception de consommateur pendant l'installation ne laisse pas de groupe partiellement enregistré.

Les changements de région, le vidage du cache et les pertes de contexte annulent les fetch via AbortController. Les vérifications de révision empêchent toujours une installation tardive, même si un lecteur personnalisé ignore le signal. Une opération WebCrypto/décompression déjà engagée n'est pas interrompue au milieu de son calcul ; son résultat ne sera pas installé après annulation. La borne du cache ne couvre pas l'ensemble des allocations transitoires.

## Tests exécutés

- **58 tests Node : PASS**, incluant la comparaison des 918 identités, le lecteur réel, le budget, les erreurs, l'inspection dynamique, les plans de blocs, le rig, les proxies, un vrai raycast Three.js sur triangle animé et l'annulation des deux lectures réseau.
- **17 tests Python : PASS**, incluant le découpage exact et le serveur local, ses chemins autorisés et son refus des répertoires/manifeste publié.
- **Cinq suites navigateur : PASS** : attachments-browser, body-startup-browser, body-light-browser, body-region-browser, body-regional-features-browser. Bureau et mobile tactile émulé, aucune erreur de page ni compilation shader détectée dans les nouveaux parcours.
- Perte/restauration de contexte avec résidents ; arrêt de l'animation ; perte pendant un vrai transfert avec échec réseau `ERR_ABORTED`, absence d'installation et nouvelle tentative réussie.
- Inspection couvrant plusieurs blocs, complétion de groupe avec épinglage puis libération, retour de caméra, isolation, restauration de visibilité, zoom à deux doigts, export JSON et nettoyage/recréation du renderer lors d'un retour de page simulé.
- Catalogue altéré : interface refusée. Cinématique altérée : marche désactivée et inspection statique encore utilisable. Manifeste absent et bloc corrompu : refus sans maillage.
- Serveur d'aperçu réellement testé **sans interception Playwright** : chargement de `skeletal-000`, 134 structures, 98 801 triangles, 3 740 244 octets bruts en cache ; aucune erreur de page.
- `git diff --check` : PASS. Aucun fichier de données scientifiques ni bloc généré ajouté au dépôt.

La séquence pagehide/pageshow utilise des événements de retour de cache simulés. Ce test ne démontre pas que chaque navigateur mettra réellement cette page en BFCache. Les erreurs de tests et du serveur ont été corrigées avant la validation finale.

## Observations de performance, pas un benchmark téléphone

Chrome headless sous Windows, rendu logiciel SwiftShader, fichiers servis par interception locale des tests. Les valeurs comprennent les coûts de lecture locale, vérification et construction ; elles ne représentent pas un réseau mobile. Le reçu JSON contient le détail de la passe.

| Format de test | nervous-000 : lecture/vérification/installation | nervous-001 : même mesure | Soumission CPU du rendu p50 / p95 |
|---|---|---|---|
| 1440×900 bureau | 133.5 ms | 126.7 ms | 3.4 / 35.4 ms (20 observations) |
| 390×844 tactile émulé | 116.9 ms | 104.3 ms | 2.6 / 32.0 ms (20 observations) |

Ces petits échantillons sont des observations du test, pas une garantie de fluidité ni une comparaison de performance. Le temps de soumission CPU ne mesure ni la durée GPU ni la fréquence d'images soutenue. Les compteurs Three.js et octets du cache ne mesurent pas la mémoire GPU physique. Aucun chiffre de batterie ou température n'est inventé.

## Aperçu local et reproduction

Un serveur est lancé sur `http://127.0.0.1:8124/simulateur/web/body-region-lab.html`. Cliquer « Charger et vérifier ce bloc », rechercher une structure ou choisir le catalogue complet. L'aperçu reste disponible tant que son processus local fonctionne ; il n'est pas publié et n'est pas accessible depuis un téléphone sur le réseau.

Pour le relancer depuis le dépôt, utiliser un dossier de blocs existant (le générateur refuse d'écraser un dossier non vide) :

```powershell
python simulateur/scripts/build_body_source_chunks.py --output-root ../body-chunks --verify
python simulateur/scripts/serve_body_region_preview.py --chunks-root ../body-chunks --port 8124
```

Le serveur est limité à `127.0.0.1`, les blocs restent hors de l'arbre du site. Le navigateur vérifie leur intégrité. Le serveur ne transforme pas un manifeste local en autorisation de distribution publique.

Pour les tests :

```powershell
$env:POLY_CHUNKS_ROOT=(Resolve-Path ../body-chunks).Path
node --test simulateur/tests/*.test.mjs
python -m unittest discover -s simulateur/tests -p 'test_*.py'
```

Les suites navigateur utilisent le serveur HTTP de test sur le port 8123, Playwright et Chrome ou Chromium (`POLY_BROWSER_CHANNEL`). Les blocs sont alors routés par les fixtures locales, comme en CI.

## Restant à qualifier avant remplacement général du corps historique

- Adapter les réseaux fonctionnels et les vues spécialisées qui indexent aujourd'hui la liste complète des Mesh, et leurs états sauvegardés ; comparer leurs comportements lors de cycles d'éviction. Ce raccord n'est pas présenté comme terminé.
- Tester systématiquement la correspondance visuelle GPU/CPU des déformations et de l'éclairage ; aucune validation biomécanique déduite de la compilation shader.
- Mesurer les pics CPU et GPU réels, les copies temporaires et le coût du picking ; le cache borné ne suffit pas à garantir l'absence de dépassement mémoire.
- Une distribution par structure nécessiterait de nouveaux fichiers et empreintes, ou un protocole de plages authentifiées. Le plan actuel optimise le choix des blocs sans prétendre transformer un bloc en accès réseau par organe.
- Téléphone physique : exécuter les mêmes parcours à froid puis après plusieurs minutes ; exporter les reçus, relever les temps de chargement et les images réellement présentées, la mémoire disponible, les pertes de contexte, la consommation et la température avec les outils de mesure de l'appareil. Comparer à conditions et luminosité contrôlées, répéter, conserver les observations manquantes comme inconnues.
- Revue scientifique des libellés et de la portée, puis décision explicite du propriétaire avant toute fusion, exposition réseau ou distribution de blocs.

Les faits contrôlés ici sont informatiques : conservation de sources, comportement des programmes et observations locales de test. Aucune nouvelle donnée neuronale, latence, causalité, insertion musculaire ou validation physiologique n'a été produite.

## Récupérer le travail

Le bundle joint contient les deux commits locaux depuis la PR #21 et nécessite que le dépôt de destination possède son commit de base `59d7571ca780f74dcfa9b261b13515f5f49ffb59`. Il n'embarque pas les blocs générés.

```powershell
git bundle verify CHEMIN/POLY-convergence-20261028.bundle
git fetch CHEMIN/POLY-convergence-20261028.bundle feat/regional-body-bridge-20261028:feat/regional-body-bridge-20261028
```

Cette récupération crée une référence locale ; elle ne fusionne rien et ne publie rien.
