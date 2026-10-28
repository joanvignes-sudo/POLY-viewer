# POLY — Corps : voie légère et construction 3D par lots

**Date :** 28 octobre 2026  
**Statut :** modification candidate **non fusionnée**, construite sur la branche de récupération mobile [PR #17](https://github.com/joanvignes-sudo/POLY-viewer/pull/17). Ni l'anatomie ni les données scientifiques ne sont modifiées.

## Résultat concret

POLY possède désormais deux chemins complémentaires :

| Parcours | Ce qui est chargé | Ce qui n'est pas chargé | Usage |
|---|---|---|---|
| `body-light.html` | Inventaire de référence et volumes englobants (métadonnées compressées) | Fichier de triangles, Three.js, moteur WebGL, animation globale | Chercher, filtrer et situer approximativement une structure, sur téléphone même modeste |
| `index.html` (corps 3D complet) | Inventaire, binaire géométrique et composants 3D historiques | Rien n'est omis de l'inventaire | Explorer le vrai maillage de référence et les fonctionnalités 3D existantes |

Les deux parcours utilisent les références déjà distribuées de POLY. Le mode léger ne crée ni nouvelle anatomie, ni coordonnées biologiques individuelles, ni insertion musculaire.

## Coûts de ressources connus à partir du dépôt

| Ressource | Fichier compressé dans le dépôt | Taille décompressée annoncée dans le chargeur |
|---|---:|---:|
| `body-display.json.gz` | **93 354 octets** | **427 196 octets** |
| `body-display.bin.gz` | **18 838 810 octets** | **30 693 264 octets** |

La ressource compressée géométrique est plus de 200 fois plus lourde que le manifeste compressé. Ceci est une comparaison de fichiers, **pas** une mesure de mémoire GPU/heap, de temps réseau ni de FPS. Le mode léger charge uniquement le manifeste ; son fonctionnement se passe de la bibliothèque 3D et des buffers géométriques.

## Ce qui a été créé et comment l'interpréter

- `body-light-core.mjs` : qualification des 918 structures du manifeste réel (noms, arbres source et bornes finies), catégorisation par système, recherche accentuée, calcul de projections 2D de leurs volumes englobants.
- `body-light.html` + `body-light.css` + `body-light.mjs` : interface mobile, liste accessible au clavier, recherche par nom ou référence, projections de face/profil, source et limites pour chaque repère. Le mode sélectionné n'utilise pas la décompression du gros binaire.
- Les points sur la projection représentent **les centres des volumes englobants**. Le rectangle met en évidence l'étendue de la structure, **pas** ses contours. Le terme « repère » est affiché systématiquement.
- Les liens sont ajoutés à l'accueil, au cerveau léger, aux commandes du corps complet et au panneau de récupération de la PR #17.
- `body-batch-loader.mjs` et adaptation de `app.js` : les géométries du corps complet sont instanciées dans l'ordre d'origine par lots bornés en temps CPU (~7 ms de travail JS par lot, hors structure individuelle), avec progression textuelle et passage de contrôle à la boucle navigateur. **Le binaire complet est encore téléchargé avant ces lots.**
- Si la création des géométries échoue, le garde issu de la PR #17 reçoit un événement explicite ; la récupération mène au mode léger.

## Traçabilité scientifique conservée

1. Noms et identifiants du manifeste source inchangés.
2. Les coordonnées viennent des bornes de la scène de référence ; les unités du corps humain individuel, les mouvements physiologiques et le recalage anatomique inter-atlas ne sont **pas** déduits.
3. La recherche ne transforme jamais l'absence de résultat dans cet atlas en absence anatomique réelle.
4. Aucune relation candidat muscle/os n'est élevée au rang d'insertion validée.
5. Les vues de face/profil sont uniquement des projections géométriques de boîtes 3D, jamais une image de tissu humain.
6. Si les métadonnées sont absentes ou invalides, le mode léger refuse la projection, plutôt qu'inventer des structures.

## Vérifications

```sh
node --test simulateur/tests/body-light.test.mjs
node --test simulateur/tests/body-startup-guard.test.mjs
python -m http.server 8123 --bind 127.0.0.1
# autre terminal, avec Playwright Chromium :
POLY_BROWSER_CHANNEL=chromium node simulateur/tests/body-light-browser.cjs
POLY_BROWSER_CHANNEL=chromium node simulateur/tests/body-startup-browser.cjs
```

Les tests Node lisent directement le `body-display.json.gz` **réel** du dépôt, valident les 918 entrées et leurs volumes, les filtres, les projections, le refus des métadonnées défectueuses et l'ordonnancement des lots CPU. Les tests navigateur vérifient desktop et tactile émulé : navigation, inventaire complet, sélection, profil/face, fichier source compressé chargé, **absence de requête au binaire géométrique**, aucune erreur JS ni débordement horizontal, et refus si les métadonnées ne sont pas accessibles.

La CI de la branche exécute aussi les contrôles de récupération de la PR #17 (panne volontaire du fichier binaire lourd).

**Ne pas déclarer cette livraison comme validation sur Samsung A14 réel.**

## Limites restant ouvertes

- Le corps complet continue de demander le binaire décompressé de 30,7 Mo ; la création des geometries est fractionnée dans le temps mais **pas** physiquement chargée depuis un flux réseau par région.
- Le coût du rendu GPU et l'ensemble des géométries 3D restent importants : le travail de lots évite surtout des longs blocages JavaScript, et le mode léger permet d'éviter la 3D.
- Les fonctions avancées de sélection/animation ne sont pas transposées dans le mode léger ; elles demeurent dans le corps 3D existant.
- Aucun test sur Android physique et aucune mesure instrumentée des pics de mémoire ne sont effectués ici.
- Le mode léger n'est pas un niveau de détail géométrique : c'est un **index spatial de référence**, pas une surface simplifiée.
- L'étape de transformation en vrai chargement progressif **par système anatomique**, avec des ressources atomiques, les hachages sources et l'évacuation GPU, nécessite un pipeline de découpage et de qualification spécifique ; elle reste à faire.

## Prochain chantier de la liste

Construire à partir des mêmes maillages d'origine un manifeste des systèmes et de **blocs géométriques indépendants**, en conservant identité, empreinte, unité et correspondances. Qualifier pour chaque bloc : octets compressés et décompressés, nombre de sommets, limites de mémoire, provenance, sélection et suppression propre. Ensuite seulement activer la vraie demande par région et le retrait des buffers inutilisés.

**Règle : la navigation légère doit rester utilisable quand le corps complet ne l'est pas.**
