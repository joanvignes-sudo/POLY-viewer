# POLY v0.140.1 — Rattachements progressifs du corps entier

Base examinée : `7fa3f8a7bc15a973147d017d9e41954dcefea1a7` (main, v0.140.0, incluant v0.139.2). Travail sur `feat/whole-body-attachments`.

## Livré

Un moteur générique de relations documentaires, un catalogue reproductible, un navigateur filtrable avec graphe logique et audit par surface, et des panneaux de qualification dans les explorateurs corps/main. Accès : `simulateur/web/attachments.html`. Tous les fichiers sources restent inchangés ; aucun point d'enthèse n'a été fabriqué et aucun poids du rig n'est modifié.

Le terme « rattachement » désigne ici une relation dans le catalogue. Il ne signifie pas qu'un tendon est segmenté ou qu'une contrainte physique relie effectivement deux maillages. Les trajectoires, contraintes, volumes et déformations biologiques restent à valider.

## Couverture exacte

| Périmètre de présentation | Pièces | Avec au moins une région documentée |
|---|---:|---:|
| Corps : bras / épaule | 30 | 18 |
| Corps : avant-bras | 36 | 6 |
| Main / avant-bras distal | 48 | 20 |
| Hanche / cuisse | 54 | 18 |
| Jambe / pied | 68 | 16 |
| Visage / cou / tronc | 244 | 17 |
| Pièces de contexte HRA | 27 | 2 |
| **Total** | **507** | **97 (19,1 %)** |

Ces catégories héritent du catalogue de présentation et ne sont pas des frontières anatomiques précises. Les 480 surfaces de référence et 27 pièces natives peuvent représenter groupes, portions, chefs ou tissus contextuels : elles ne comptent pas 507 muscles indépendants. **410 pièces n'ont pas de relation documentée qualifiée** dans le nouveau catalogue. Une région documentée ne garantit pas que toutes les origines, insertions ou continuités du muscle sont connues.

La nomenclature comporte 880 termes, dont 271 muscles nommés ; 94 de ces termes n'ont pas de surface directement rapprochée dans le catalogue. Les descendants éventuels ne sont pas promus en muscles entiers. Les 159 URL distinctes présentes dans les huit entrées musculaires sont inventoriées avec leurs occurrences : une URL inventoriée ne constitue pas une preuve d'attache.

## Qualification et provenance

- **48 relations documentaires régionales** : 33 synthèses sélectives de tables universitaires relues, quatre cas du coude v0.139.2, cinq autres relations historiques qualifiées et six observations humaines de la main conservées. Une relation peut concerner plusieurs surfaces ou chefs, sans assigner d'empreinte individuelle.
- **24 relations candidates** restent à vérifier ; **quatre références rejetées** restent rejetées. La table de recherche prévaut sur les étiquettes historiques trop optimistes. Les doublons anciens du coude ne sont pas recomptés.
- **460 descriptions héritées non vérifiées** sont consultables, mais ne sont jamais qualifiées à partir d'une URL d'innervation ou d'un simple voisinage géométrique.
- Les cibles distinguent os, tendon, aponévrose, fascia, ligament, cartilage, peau, organe, région composite et cible non résolue. Un intermédiaire tendineux peut être déclaré explicitement. Les cibles sans identifiant de maillage restent conceptuelles ; les identifiants osseux des candidats ne constituent pas un recalage.
- La qualification documentaire, la confiance, la preuve, la provenance et la qualification géométrique sont des champs séparés. Chaque relation conserve fichier source, empreinte SHA256, localisateur et limites de sa preuve.
- Le moteur reconnaît les points hypothétiques, géométries estimées et insertions validées. Aucun de ces états n'est créé automatiquement par proximité. Les coordonnées non localisées sont nulles. Un futur état spatial exige deux points, unités, référentiels et transformation ; la validation exige en plus repères/patch, revue indépendante et erreur hors échantillon inférieure au seuil déclaré. Ce contrat informatique ne remplace pas une revue anatomique.

**Bilan spatial : zéro point hypothétique ajouté, zéro insertion 3D validée, zéro contrainte dynamique validée.** Le placement de présentation reste estimé, même en présence d'une description régionale solide.

## Géométrie

Les 480 surfaces de référence sont auditées : **360 ont des arêtes ouvertes**, **120 sont des candidats topologiquement fermés**, aucune n'a d'arête partagée par plus de deux triangles dans cet audit. Les comptes portent sur les indices des maillages, sans soudure implicite des sommets. Les 27 pièces natives ne sont pas décodées par cet audit et portent explicitement `not_audited`.

L'audit conserve triangles, sommets, bords, non-manifold et encombrement AABB en unités source. Une fermeture candidate ne démontre ni orientation correcte, ni absence d'auto-intersection, ni segmentation volumique valide. Aucun volume biologique ou rapport volumique tissulaire n'est annoncé. L'audit dynamique existant du coude n'est pas étendu artificiellement aux autres muscles.

## Vérification technique

- Neuf tests du nouveau moteur : identités, clés étrangères, empreintes, provenance, rejet de preuves absentes, absence de promotion automatique, contrat des coordonnées, validation indépendante, filtres et doublons.
- Neuf tests Python existants : qualifications du coude, mouvement illustratif et ajustement d'affichage, sans échec ni test ignoré.
- Chrome 155 : desktop 1440 × 1000 et émulation mobile tactile 390 × 844. Chargement du catalogue, filtres documenté/rejeté/texte/vide, côtés gauche/droit, avatar complet et panneaux corps/main. Aucune erreur JavaScript de page. Le registre indisponible échoue explicitement sans afficher de qualification. Contrôle visuel des captures desktop/mobile ; pas de débordement horizontal du catalogue.
- Les modèles C4, atlas, géométries sources et calculs sont conservés par absence de modification de leurs fichiers. Ce contrôle de préservation et les tests existants ne constituent pas une nouvelle validation scientifique des modèles C4.
- Workflow GitHub ajouté pour les tests et la reproductibilité, puis les essais Chromium desktop/mobile. L'émulation mobile ne remplace pas un essai sur appareil physique ni sur Safari iOS.

## Reproduction

```sh
pip install numpy
python simulateur/scripts/build_attachment_catalogue.py
python -m unittest discover -s simulateur/tests -p 'test_*.py'
node --test simulateur/tests/attachment-engine.test.mjs
npm install --no-save playwright
npx playwright install chromium
python -m http.server 8123 --bind 127.0.0.1
# Dans un autre terminal :
POLY_BROWSER_CHANNEL=chromium node simulateur/tests/attachments-browser.cjs
```

Sous PowerShell : `$env:POLY_BROWSER_CHANNEL='chromium'` puis la commande Node. Les archives gzip sont hachées octet pour octet ; les JSON UTF-8 sont hachés après normalisation CRLF vers LF pour permettre la reproduction Windows/Linux. Les empreintes des objets géométriques sources sont conservées séparément. Le générateur ne fait aucune requête réseau.

## Prochains lots anatomiques

Le bassin/périnée, les muscles viscéraux et la majorité du tronc restent des lacunes prioritaires. Ensuite : compléter origines et terminaisons des bras et mains, distinguer les variantes, identifier les tendons et aponévroses dans les sources, annoter leurs limites dans les référentiels natifs, puis seulement envisager un recalage évalué indépendamment. Le catalogue rend ces lacunes visibles ; il ne déclare pas le corps entier anatomiquement rattaché.
