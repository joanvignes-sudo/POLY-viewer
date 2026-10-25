# POLY — Contrôle indépendant de la jonction sacrum–coccyx

Date : 23 octobre 2026. **Analyse locale non publiée.** Statut : géométrie vérifiée, identité anatomique NON validée.

## Décision opérationnelle

**Conserver les géométries et leurs repères séparés, ne pas recaler automatiquement l'extrémité sacrée, ne déduire ni facette articulaire, ni enthèse, ni articulation physiologique des seuls rapprochements numériques.**

Le principal risque constaté est une **différence possible de périmètre anatomique** entre l'objet BodyParts3D FJ3393 et le découpage sacrum/coccyx de Z-Anatomy. Ne pas l'appeler « preuve que FJ3393 contient le coccyx » tant que les régions n'ont pas été annotées par un spécialiste ou confrontées à une imagerie individualisée.

## 1. Vérification indépendante BodyParts3D 4.3 / Z-Anatomy

Données source : data/sacrum-annotation-meshes-di.json, data/sacrococcygeal-inspection-dk.json et data/sacrum-scope-assessment-di.json.

Mesures en coordonnées normalisées de POLY. FJ3393 est affiché après une similitude commune DG; ce n'est pas un recalage anatomique homologué.

| Contrôle | Résultat |
|---|---:|
| BP43 FJ3393 | 5 293 sommets |
| Z-Anatomy sacrum | 5 832 sommets |
| Z-Anatomy coccyx | 589 sommets |
| Sommets BP sous la limite Y du sacrum Z | 649 / 5 293 |
| Parmi ceux-ci, plus proches du coccyx Z que du sacrum Z | 96,61 % |
| RMS BP vers sacrum Z seul | 0,020718 |
| RMS BP vers union Z sacrum + coccyx | 0,005014 |
| Réduction du RMS sous cette métrique | 75,80 % |
| Statistiques antérieures reproduites numériquement | 5 / 5 |
| Triangles BP traversant le bissecteur géométrique | 47 |

Le seuil vertical est un instrument de comparaison, **pas** une définition anatomique. Sensibilité :

| Décalage du seuil Y | Sommets sous ce seuil | Fraction plus proche du coccyx Z |
|---:|---:|---:|
| -0,010 | 609 | 100,0 % |
| -0,005 | 624 | 100,0 % |
| 0,000 | 649 | 96,6 % |
| +0,005 | 670 | 93,6 % |
| +0,010 | 757 | 82,8 % |

Ce comportement est compatible avec une divergence de segmentation/portée des objets ; il ne qualifie pas une articulation ni une homologie de surfaces.

## 2. Distance entre les surfaces du sacrum et du coccyx Z-Anatomy

**Attention : repère source Z-Anatomy et non POLY normalisé. Les valeurs numériques de ce paragraphe ne doivent pas être comparées directement aux précédentes. Aucun étalonnage clinique en millimètres.**

- Source sacrum : 5 832 sommets, 8 522 polygones d'origine, 11 676 triangles après triangulation.
- Source coccyx : 589 sommets, 1 066 polygones d'origine, 1 166 triangles après triangulation.
- Contrôle qualité : 8 polygones étaient à risque avec la triangulation simplifiée en éventail (2 sacrés, 6 coccygiens).
- Correction : triangulation par suppression d'oreilles (ear clipping), avec contrôle de conservation des aires projetées de chaque polygone.
- Distance minimale **entre surfaces triangulées** : **0,004838458822622411 unité source**.
- Le point le plus proche du coccyx est le sommet 257. Sur le sacrum, la face triangulée 2255 correspond au polygone source 1813, un triangle original.
- Un examen exhaustif par bornes spatiales a limité les calculs à 5 479 paires de triangles candidates, en conservant toutes celles susceptibles d'améliorer la borne initiale.
- Chaque paire candidate a été testée par points-vers-triangles, neuf couples d'arêtes et intersection segment-triangle.
- Aucun minimum arête-arête ni intersection de surfaces n'a abaissé cette borne.
- Trois autocontrôles géométriques ont réussi (triangles parallèles, intersection, symétrie).

Ces résultats portent sur des surfaces polygonales **d'un atlas** : ils n'établissent ni « largeur de l'articulation », ni contenu cartilagineux, ni état de fusion, ni distance clinique réelle.

## 3. Zone de proximité : indicateur pour inspection humaine

Dans le repère POLY normalisé, le voisinage de la paire de sommets Z la plus proche a été exploré par seuils relatifs.

| Seuil au-dessus du minimum | Sommets coccygiens retenus | Composantes connectées |
|---:|---:|---:|
| +0,001 | 11 | 3 |
| +0,002 | 21 | 1 |
| +0,003 | 25 | 1 |
| +0,005 | 41 | 1 |
| +0,010 | 82 | 3 (80 + 1 + 1) |

Ces composantes sont définies par les arêtes du maillage coccygien. Elles n'identifient pas les cornes ou la facette sans observation anatomique indépendante.

## 4. Informations anatomiques qualifiées

- L'articulation sacro-coccygienne relie le sommet sacré (S5) à la base du coccyx (Co1), avec interposition cartilagineuse/discale ; cf. StatPearls/NCBI et Kenhub.
- Le hiatus sacré, les cornes sacrées, les cornes coccygiennes et les surfaces articulaires sont des **repères différents** : ne pas annoter une corne comme une facette.
- La morphologie des cornes est variable : l'étude de Woon et al. (PMID 24343170) décrit une fusion des cornes chez une partie des spécimens étudiés. Une absence de séparation visible ne constitue donc pas, à elle seule, une erreur de maillage.
- Un atlas de présentation ou un simple nuage de sommets ne garantit ni individualisation fiable des cartilages, ni mobilité, ni identité des pièces.

Références vérifiables :
1. StatPearls, Pelvic Joints : https://www.ncbi.nlm.nih.gov/books/NBK538523/
2. Kenhub, Sacrococcygeal joint : https://www.kenhub.com/en/library/anatomy/sacrococcygeal-joint
3. Woon et al., The anatomy of the sacrococcygeal cornual region and its clinical relevance, PMID 24343170 : https://pubmed.ncbi.nlm.nih.gov/24343170/
4. AnatomyTOOL, vue postérieure et latérale de la jonction : https://anatomytool.org/content/anatomy-standard-drawing-sacrum-and-coccyx-posteriorlateral-view-latin-labels

## 5. Revue anatomique obligatoire avant intégration

Dans **chaque atlas natif**, annoter séparément :
1. Facette inférieure présumée de S5 / sommet du sacrum.
2. Facette supérieure présumée de Co1 / base du coccyx.
3. Corne sacrée de chaque côté, si identifiable.
4. Corne coccygienne de chaque côté, si identifiable.
5. Bord osseux du hiatus sacré, distinct des facettes.

Chaque annotation doit garder : atlas + version + empreinte source, ID sommet/face, coordonnées natives, vue(s) dorsale/latérale, justification anatomique, incertitude, possibilité d'absence ou de fusion, identifiant du réviseur. Toute correspondance inter-atlas reste un **candidat**, jamais une preuve automatiquement validée.

**Statut inchangé** : 0 homologues anatomiques validés, 0 attaches musculaires qualifiées, aucun recalage nouvellement appliqué.

## 6. Fichiers de reprise et traçabilité

Les scripts et diagnostics ont été créés dans :
Origine conservée hors publication

Fichiers principaux :
- poly_sacrum_scope_recheck.py et .json : reproduction indépendante du diagnostic inter-atlas.
- poly_z_joint_patch.py et .json : clusters géométriques contigus.
- poly_polygon_triangulation_qa.py et .json : défauts de triangulation en éventail.
- poly_sacrococcygeal_surface_audit_v2.py et .json : distances sommet-surface corrigées.
- poly_triangle_triangle_distance.py et poly_sacrococcygeal_triangle_triangle_audit.json : distance globale des deux surfaces triangulées.
- poly_atlas_scope_review.png : illustration des zones inter-atlas.
- poly_z_near_contact_review.png : illustration du voisinage des deux maillages Z.

Les quatre JSON DI/DJ/DK antérieurs sont protégés par empreintes SHA256 dans le nouveau rapport de reproduction. La provenance et les licences détaillées restent dans le bilan POLY_RECALAGE_DA_2026-10-22/BILAN_REPRISE.md.

**Aucune publication, aucun changement de maillage, de muscles, de matrice de recalage ou de comportement dans l'avatar.**

## 7. Validation technique de la livraison

- Le registre structuré poly_sacrococcygeal_review_queue.json comprend sept repères à annoter et aucun point placé artificiellement.
- Le script poly_verify_sacrum_chantier.py a réussi **23/23 vérifications** : reproductions numériques, intégrité SHA256 des entrées DI/DJ/DK, qualité de triangulation, résultats de distances, clusters de proximité, compilation Python, absence de validation anatomique et présence du rapport local.
- Le présent document et les scripts restent **locaux**. L'intégration au simulateur est documentaire : **pas de changement du calcul physique, des muscles ou du rendu public**.
