# POLY — Plan de chantier pour couvrir tous les os

## Périmètre et règle de comptage

Référentiel adulte usuel de **206 os : 80 axiaux et 126 appendiculaires**. Les variantes, os accessoires, os suturaux et sésamoïdes supplémentaires sont suivis hors de cette base ; ce total n’est pas présenté comme invariant individuel. Les dents sont exclues. Le sacrum, le coccyx, chaque os coxal et le sternum comptent chacun une fois malgré leurs subdivisions. Le sternum source comporte trois objets, sans devenir trois os dans les compteurs.

Références anatomiques de cadrage : [divisions du squelette, OpenStax](https://openstax.org/books/anatomy-and-physiology-2e/pages/7-1-divisions-of-the-skeletal-system), [crâne, OpenStax](https://openstax.org/books/anatomy-and-physiology-2e/pages/7-2-the-skull), [membre inférieur, OpenStax](https://openstax.org/books/anatomy-and-physiology-2e/pages/8-4-bones-of-the-lower-limb). La liste locale est un référentiel de concepts et de correspondances ; les figures et textes de ces ouvrages ne sont pas importés dans POLY.

| Secteur | Os attendus |
| --- | ---: |
| Crâne : voûte/base et face | 22 |
| Osselets des oreilles | 6 |
| Hyoïde | 1 |
| Colonne, sacrum et coccyx | 26 |
| Côtes et sternum | 25 |
| Ceinture scapulaire | 4 |
| Bras et avant-bras | 6 |
| Mains | 54 |
| Ceinture pelvienne | 2 |
| Cuisses et jambes, patellas incluses | 8 |
| Pieds | 52 |
| **Total** | **206** |

## État de départ vérifié

Les différentes couches antérieures référencent **154 concepts osseux** après dédoublonnage, sans garantir leur complétude morphologique. Les **52 concepts sans référence individuelle retrouvée** sont 21 os du crâne, les 6 osselets et les 25 os du thorax. Les 79 sources traitées dans DB constituent un lot technique à l’intérieur de cet ensemble, pas un nouveau total du squelette. Les couches principales en référencent 153 ; l’occipital déjà présent dans la vue source annexe DA porte le total audité à 154. Il n’est donc pas présenté comme une acquisition nouvelle.

Les fragments cortical/spongieux du bassin HRA sont rattachés à leurs os coxaux ; les points et régions d’enthèses du genou ne sont pas recomptés comme os. L’alias de nomenclature Triquetrum/triquetral est documenté explicitement, avec côtés et identifiants historiques conservés.

## Lots et critères de passage

| Lot | Travail concret | Critère de sortie | État au lancement DC |
| --- | --- | --- | --- |
| 0 — Référentiel | Une ligne par os, côté, variantes, sources concurrentes et références déjà présentes | 206 identifiants uniques, total axial/appendiculaire vérifié, aucun morceau recompté | Réalisé |
| 1 — Sources et géométrie brute | Identifier et extraire les objets du même atlas, contrôler matrices et empreintes, examiner les opérations non évaluées et la triangulation | Chaque concept a ses sources et ses limites ; aucune opération ignorée silencieusement | 208 objets extraits ; 6 piles de modificateurs évaluées et archivées |
| 2 — Squelette source cohérent | Rendre les régions du même atlas dans leur disposition relative, sélectionner chaque os et distinguer pièces sources/variants | Un transform global explicite ; compteurs par concepts ; maillages non finaux masqués par défaut | Revue locale des 206 concepts installée, sternum en trois composants |
| 3 — Modèles manquants ou non finaux | Évaluer les modificateurs avec leurs dépendances ; qualifier des alternatives si nécessaire | Objet évalué traçable, original conservé, comparaison avant/après, aucune fusion ou symétrie inventée | Réalisé pour les six objets identifiés dans DC |
| 4 — Correspondances par région | Définir une cible anatomique et annoter des repères homologues indépendants ; contrôler les côtés et les poses | Dossier de repères, matrice reproductible, erreurs et incertitudes, revue anatomique explicite | À réaliser ; les ajustements DA/DB/CU restent exploratoires |
| 5 — Articulations | Examiner surfaces, congruence, position et incertitude des centres/axes | Validation séparée pour chaque articulation concernée, avec sources et limites | À réaliser |
| 6 — Muscles, tendons, ligaments | Reprendre les attaches CW/CX/CY et autres sur les os qualifiés | Deux repères natifs et correspondance documentée ; aucune enthèse inférée par proximité | À réaliser ; trapèzes maintenus en quarantaine |
| 7 — Livraison contrôlée | Tests de conservation, sélection, affichage, doublons et postures ; journal et manifeste | Compteurs exacts, données préservées, statuts lisibles ; publication uniquement sur nouvelle demande | Chaque lot local produit ses tests et son bilan |

Ces étapes ont des statuts séparés : « source identifiée », « géométrie disponible », « affichage inspectable », « placement graphique », « registration anatomique validée », « articulation validée », « attache validée ». Un succès d’affichage ou une faible distance entre versions d’un atlas ne fait pas passer automatiquement à l’étape suivante.

## Lot réalisé : six piles de modificateurs sources

Les six objets initialement non finaux ont été évalués avec une distribution portable de Blender vérifiée par l’empreinte officielle. Le lancement utilise `--factory-startup --disable-autoexec` ; le journal confirme que le script incorporé Z-Anatomy a été bloqué. L’original Blender garde la même empreinte après lecture. Les objets dépendants des opérations booléennes ont été conservés dans le graphe d’évaluation.

- Ethmoïde : les six opérations booléennes ont été évaluées selon leurs paramètres source ; 2 108 sommets bruts deviennent 5 082 sommets évalués.
- Lunatums gauche/droit : 176 sommets bruts deviennent 1 046 par côté après subdivision source.
- Pisiformes gauche/droit : 141 sommets bruts deviennent 836 par côté après subdivision source.
- Processus xiphoïde : le Mirror source a été évalué avec son axe et sa fusion enregistrés, sans symétrie ajoutée par POLY ; 459 sommets évalués. Le nombre de sommets ne constitue pas à lui seul un contrôle de forme.

Il s’agit d’une évaluation du graphe de visualisation et des niveaux de subdivision enregistrés, pas d’une validation anatomique ni d’un rendu à des niveaux de subdivision arbitrairement augmentés. Paramètres, dépendances, versions, empreintes et contrôles du repère brut/évalué sont dans `EVALUATION_MODIFICATEURS.json`. Les six objets évalués sont désormais utilisés dans la revue ; leurs versions brutes restent archivées.

Les **206 concepts osseux sont représentables**, via 208 objets. Deux polygones des scapulas restent exclus du rendu après échec de triangulation conservant l’aire ; aucune surface de réparation n’est inventée. Le passage initial, avec ses cinq os et son sternum partiellement en attente, est conservé dans `premier_passage/`.

Le prochain lot prioritaire est désormais la qualification anatomique du crâne et du thorax : définir les cibles indépendantes manquantes, annoter les repères homologues et séparer la validation de la forme source de celle du placement dans l’avatar.

## Ordre de la qualification anatomique

1. **Crâne, osselets, hyoïde, côtes et sternum** : traiter les lacunes historiques de représentation et définir les cibles indépendantes manquantes. Vérifier les petites pièces et les assemblages avant de parler de couverture anatomique.
2. **Ceinture scapulaire, bras, avant-bras, mains** : contrôler la différence de pose entre atlas. Les correspondances BP4.3/BP4.0 des mains sont apparentées et ne constituent pas une validation indépendante sur HRA.
3. **Bassin et membres inférieurs, puis pieds** : distinguer os coxaux et leurs fragments, contrôler hanche/genou/cheville et les 26 os par pied.
4. **Colonne, sacrum et coccyx** : reprendre les ajustements exploratoires existants avec des repères homologues et vérifier les transitions entre régions ; les ajustements séparés ne garantissent pas les congruences articulaires.

Pour chaque région, choisir la représentation principale et documenter les alternatives pour éviter l’empilement de doublons. Les cibles anatomiques absentes de HRA doivent être acquises et qualifiées ; aucune cible fictive n’est créée pour faire monter le compteur.

## Limites et conservation

La nouvelle vue utilise une seule transformation de présentation CU, déjà documentée à six centres grossiers, commune à tout le squelette Z-Anatomy. Elle conserve sa cohérence source mais **ne valide aucune registration anatomique individuelle sur HRA**. Les maillages d’atlas peuvent eux-mêmes comporter des limites de représentation.

Les originaux Blender sont lus comme données ; aucun script incorporé n’est exécuté. Identifiants locaux, noms d’objet, empreintes, matrices, polygones originaux, exclusions de rendu et opérations non évaluées sont conservés. Attribution : Z-Anatomy / Gauthier Kervyn, Marcin Zielinski, CC BY-SA 4.0, dérivations BodyParts3D signalées. Les sources BP/HRA existantes et leurs notices restent distinctes.

Le registre `REFERENTIEL_206.json` et le tableau `SUIVI_206_OS.csv` sont le support de reprise os par os. Aucun os, tendon ou trajet nerveux existant n’est supprimé. Aucun modèle physiologique ou attache n’est créé à partir du simple placement. **Travail local ; aucune publication autorisée par ce chantier.**
