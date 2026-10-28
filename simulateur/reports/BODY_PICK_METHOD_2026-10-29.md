# POLY — Amélioration de la méthode de sélection 3D

29 octobre 2026. Demande utilisateur : examiner et améliorer une méthode du projet. Méthode retenue : `pick(raycaster)` dans le lecteur HRA régional. Base locale `66caf49`. Aucun push, merge ou déploiement.

## Changement

La sélection déformée recréait une géométrie, un objet maillage et un buffer de positions pour chacune des surfaces visibles parcourues. Elle utilise maintenant une seule géométrie et un seul maillage de travail par clic, avec un buffer borné par la plus grande surface résidente. Une vue de la longueur exacte de la surface est utilisée à chaque étape ; les bornes sont invalidées avant chaque intersection pour ne pas réutiliser celles d'une autre surface.

Ce travail n'est pas conservé entre clics. La géométrie temporaire est détruite dans un `finally`, y compris si la déformation ou le raycasting échoue. Une scène vide n'alloue rien. Les positions source, normales, indices, identifiants et règles de classement des intersections sont conservés.

## Comparaison exécutée contre la version précédente

Le script reproductible `simulateur/scripts/profile_regional_picking.mjs` charge le même bloc vérifié `skeletal-000` et exécute la méthode réelle du commit `66caf49b8086f8eb04253a8724f85d8097a9000c` puis la nouvelle méthode, en ordre alterné. Les 36 rayons couvrent debout, assis et geste de repas illustratif.

| Mesure par clic sur ce bloc | Avant | Après |
|---|---:|---:|
| Géométries temporaires | 134 | 1 |
| Objets maillage temporaires | 134 | 1 |
| Octets de buffers de positions alloués | 1,277,316 | 42,864 |
| Médiane CPU instrumentée | 31.25 ms | 29.21 ms |

La réduction des octets alloués pour les positions est de **96.64 %** dans ce cas. Les 36 sélections sont identiques et l'empreinte du bloc source reste inchangée. L'amélioration visée est la réduction des objets/buffers temporaires ; le gain CPU mesuré est plus modeste et ces durées ne constituent pas une garantie de vitesse de l'application.

Ces compteurs ne mesurent pas la mémoire totale, le pic de RAM retenue, les petits tableaux par sommet, les allocations internes du moteur, le GPU ou un téléphone physique. Les géométries de travail CPU n'entrent pas dans la scène affichée.

## Vérifications

- **126 tests Node : PASS.** Les nouveaux tests parcourent toutes les tailles de surfaces du bloc, vérifient le seul buffer commun, les longueurs exactes, les bornes remises à zéro, le matériau correspondant, la sélection la plus proche et l'intégrité du bloc. Une déformation en erreur libère la géométrie et garde la sélection précédente ; une scène vide n'alloue pas.
- **Quatre suites navigateur ont des résultats réussis** : postures régionales, corps régional, fonctions régionales et inspecteurs spécialisés. Le toucher d'un triangle réellement déformé reste testé.
- Un passage de la suite des fonctions régionales a expiré dans le test de refus d'un catalogue volontairement corrompu, avant tout appel à `pick`. Cet échec est conservé dans `work/pick-method-body-regional-features-browser.log` et n'est pas attribué sans preuve à l'optimisation.
- Trois vérifications isolées de ce refus ont ensuite réussi, sans requête pendante ni erreur JavaScript ; le reçu est `POLY_CORRUPT_CATALOGUE_PROBE_20261029.json`. Un diagnostic de requêtes/erreurs est ajouté au test si l'attente se reproduit. Le passage ultérieur de la suite et celui des inspecteurs réussissent. **La cause du délai intermittent de démarrage reste inconnue.**

Reproduction locale (nécessite l'historique Git contenant le commit comparé et les blocs générés hors dépôt) :

```powershell
$env:POLY_CHUNKS_ROOT=(Resolve-Path ../body-chunks).Path
node simulateur/scripts/profile_regional_picking.mjs CHEMIN_EXTERIEUR/profile.json
```

Les sources scientifiques et géométriques ne sont pas modifiées ; une comparaison logicielle réussie ne vaut pas validation anatomique ou biomécanique.
