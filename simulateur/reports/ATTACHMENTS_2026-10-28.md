# POLY v0.141.1 — Tronc, bassin et relations sans géométrie

Base : `ca18dc726ef48b50c9d92fd721ddf3f665ec5955` (PR #9, rattachements v0.140.1 ; entrée principale Cerveau & conscience v0.141.0 conservée). Branche : `feat/trunk-pelvic-attachments`.

## Résultat et périmètre

40 relations régionales ajoutées : 6 pour la ceinture scapulaire, 5 pour le dos, 11 pour l'abdomen/iliacus et 18 pour le bassin/périnée. Elles proviennent de quatre tables anatomiques universitaires relues le 28 octobre 2026, avec localisateurs de lignes nommées, portée et empreintes de provenance. Les 33 synthèses du lot précédent conservent leur date de revue du 25 octobre.

Le catalogue contient désormais **88 relations documentées**, 24 candidates, 4 rejetées et 460 descriptions héritées non vérifiées. Les références candidates et rejetées ne sont pas réécrites : une nouvelle preuve anatomique reste une entrée distincte et traçable. Les 160 URL inventoriées ne sont pas toutes des preuves d'attache.

| Région de présentation | Pièces | Documentées avant | Documentées maintenant |
|---|---:|---:|---:|
| Bras et épaule | 30 | 18 | 18 |
| Avant-bras | 36 | 6 | 6 |
| Main / avant-bras distal | 48 | 20 | 20 |
| Hanche et cuisse | 54 | 18 | 24 |
| Jambe et pied | 68 | 16 | 16 |
| Visage, cou et tronc | 244 | 17 | 57 |
| Contexte HRA | 27 | 2 | 2 |
| **Total** | **507** | **97 (19,1 %)** | **143 (28,2 %)** |

**364 pièces restent sans relation documentée qualifiée.** Les catégories héritent du catalogue de présentation : certains muscles pelviens sont classés sous « tronc », d'autres sous « hanche et cuisse ». Le nombre de pièces n'est pas un nombre de muscles indépendants. Une relation documentée ne signifie pas que toutes les origines, terminaisons et continuités sont couvertes.

## La nomenclature devient consultable sans inventer de surface

Le moteur et l'explorateur distinguent désormais les relations directement documentées pour un terme TA2 des relations consultées via une surface au nom rapproché. La seconde catégorie ne qualifie pas automatiquement le terme ou le muscle entier. Le schéma `/2` ajoute les identifiants des termes sources et les conditions d'application ; le moteur reste capable de lire le schéma `/1`.

60 termes ont une relation documentaire directe. Parmi eux, **7 n'ont aucune surface rapprochée**, pour **10 relations sans géométrie** : erector spinae, groupe multifide, levator ani, pubovaginalis, ischiocavernosus, bulbospongiosus et transverse profond du périnée. Ce sont quatre muscles nommés et trois termes de groupe/contexte, sans décompte d'individus. L'explorateur expose les 880 termes de nomenclature, qui comprennent aussi portions et contexte.

Les descriptions des groupes erector spinae, multifide et levator ani ne sont pas propagées aux sous-muscles. Les descriptions masculine et féminine du bulbospongieux coexistent avec leur condition explicite, sans attribution de sexe ou de variante à l'avatar. Les deux identifiants terminologiques du sphincter anal externe pointent vers une seule relation documentaire partagée et les mêmes deux surfaces ; ils ne créent pas deux muscles indépendants.

## Niveau de preuve et limites

Toutes les nouvelles relations sont **régionales et documentaires**. Les correspondances des noms de surfaces sont conservées comme telles. Les cibles osseuses, fasciales, aponévrotiques, viscérales ou composites n'ont pas de nouvelle segmentation ni de recalage. Les cellules anatomiques des tables sont synthétisées de façon sélective ; aucune table complète n'est reproduite.

- **Zéro coordonnée d'enthèse créée ; zéro insertion 3D ou contrainte dynamique validée.**
- Une relation sans surface ne peut recevoir de qualification spatiale, même hypothétique, dans le moteur.
- L'anatomie périnéale, les variantes, les subdivisions et les continuités restent partielles. La ligne du pubococcygien est une description régionale simplifiée ; elle n'individualise pas ses faisceaux viscéraux.
- Les origines/terminaisons ajoutées ne sont pas exhaustives ; la présence d'une surface ou d'une description ne détermine pas l'anatomie d'un individu.
- Les audits géométriques des 480 maillages sont conservés : 360 ouverts et 120 fermés candidats ; les 27 pièces HRA restent non auditées ici. La fermeture ne valide aucun volume biologique.
- Aucun poids du rig, maillage, atlas, modèle C4, calcul ni animation physiologique n'a été modifié. Le diff de publication permet de vérifier cette préservation ; il ne constitue pas une validation scientifique nouvelle de C4.

## Validation technique

14 tests du moteur et 9 tests Python existants passent. Les nouveaux cas portent sur les identifiants des termes, l'absence de géométrie, la non-propagation aux descendants, les descriptions masculine/féminine, les dates de preuve et la distinction relations directes/relations issues des surfaces.

Contrôles Chrome desktop 1440 × 1000 et mobile tactile émulé 390 × 844 : chargement, filtres, accents et identifiants TA2, résultats vides, vue nomenclature, termes sans surface, variantes, liens directs, côtés, avatar et panneaux corps/main. Une panne du catalogue n'affiche aucune qualification. Les captures sont inspectées visuellement. L'émulation ne remplace pas un test sur appareil physique ou Safari iOS.

Le contrôle GitHub régénère le catalogue sous Linux et vérifie l'absence de différence. Empreintes : gzip exact ; JSON normalisé LF. Les contrôles distants et le déploiement sont à consulter sur la PR et le commit publiés, sans confondre réussite technique et validation anatomique.

## Reproduction et sources

```sh
pip install numpy
python simulateur/scripts/build_attachment_catalogue.py
python -m unittest discover -s simulateur/tests -p 'test_*.py'
node --test simulateur/tests/attachment-engine.test.mjs
npm install --no-save playwright
npx playwright install chromium
python -m http.server 8123 --bind 127.0.0.1
# Autre terminal : POLY_BROWSER_CHANNEL=chromium node simulateur/tests/attachments-browser.cjs
```

Sous PowerShell, définir `$env:POLY_BROWSER_CHANNEL='chromium'` avant la commande Node.

Sources de ce lot : [ceinture scapulaire](https://anatomy.ttuhscep.edu/anatomytables/muscles_upperlimb.html), [dos](https://anatomy.ttuhscep.edu/anatomytables/muscles_back.html), [abdomen](https://anatomy.ttuhscep.edu/anatomytables/muscles_abdomen.html), [bassin et périnée](https://medicine.uams.edu/neuroscience/education/medical-school-courses/human-structure-module/anatomy-tables/muscle-tables/muscles-of-the-pelvis-and-perineum/).

[Lot source](../data/attachment-reviewed-trunk-pelvis.json) · [Catalogue complet](../data/attachment-catalogue.json) · [Explorateur](../web/attachments.html) · [Exemple sans géométrie](../web/attachments.html#term=2417).
