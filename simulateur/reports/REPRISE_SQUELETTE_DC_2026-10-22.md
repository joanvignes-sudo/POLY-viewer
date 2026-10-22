# POLY — Bilan de lancement du chantier squelette DC

Le plan est établi et une première tranche substantielle est réalisée : **206 concepts osseux adultes inventoriés, 208 objets sources extraits et une revue cohérente du squelette source installée dans l’avatar**. Le sternum compte une fois malgré ses trois objets. Les six objets initialement porteurs d’opérations non évaluées ont maintenant leurs géométries évaluées, conservées séparément des originaux.

**Statut anatomique : aucune registration individuelle sur HRA, articulation ou attache nouvelle n’est déclarée validée.** « Représenté dans l’atlas source » et « validé anatomiquement dans l’avatar » restent deux états distincts. Deux polygones des scapulas sont encore exclus de l’affichage ; les sources originales ne sont pas modifiées.

## Accès et livrables

Dans [POLY local](https://joanvignes-sudo.github.io/POLY-viewer/?v=skeleton-dc), panneau gauche **Chantier · squelette adulte de référence → Voir le squelette source cohérent**. Choisir une région, puis un os. Le squelette source conserve une transformation commune ; il s’affiche debout en pause. Le contexte HRA peut être affiché séparément. Les couches de comparaison DA/DB restent disponibles.

- `PLAN_CHANTIER.md` : périmètre, lots, critères de passage et suite prioritaire.
- `REFERENTIEL_206.json` et `SUIVI_206_OS.csv` : une ligne par os, côtés, objets sources, références antérieures, statuts et limites.
- `sources_extraites/` : 208 géométries brutes et matrices d’objet.
- `geometries_evaluees/` et `EVALUATION_MODIFICATEURS.json` : six évaluations, paramètres et empreintes.
- `AUDIT_GEOMETRIES.json` : contrôles, exclusions de rendu et correspondances entre sources et dérivés.
- `SQUELETTE_SOURCE_AVATAR.json` : géométries d’affichage et transformation commune.
- `TESTS.json`, `AVANT.json` et `MANIFEST_DC.csv` : tests et conservation.

Le dossier est recopié dans `Source originale archivee localement`. Le plan et ce bilan sont aussi conservés dans les rapports de l’avatar.

## Inventaire et première couverture

Le référentiel suit le décompte adulte usuel **80 axial + 126 appendiculaire = 206**, avec variantes et os accessoires hors de cette base. Il ne prétend pas que chaque individu possède exactement ce décompte. Les dents et les sésamoïdes supplémentaires ne sont pas ajoutés artificiellement aux 206.

La réconciliation retrouve **154 concepts déjà référencés** dans les couches historiques, sans garantir leur complétude morphologique : 153 dans les couches principales et l’occipital dans la vue source annexe DA. Elle identifie les **52 concepts auparavant sans référence individuelle retrouvée dans les couches auditées** : 21 autres os du crâne, 6 osselets et 25 os du thorax. Ils disposent désormais d’objets sources nommés et inspectables. L’occipital annexe n’est pas présenté comme une acquisition nouvelle. La correspondance par nom n’est pas une vérification anatomique indépendante.

Les surfaces corticales/spongieuses du bassin sont rattachées à leur os coxal ; les points ou régions d’enthèses du genou ne sont pas recomptés comme os. Les représentations alternatives BP4.0, BP4.3 et Z-Anatomy restent distinctes. L’alias Triquetrum/triquetral est tracé, avec côtés et identifiants historiques conservés.

## Six objets évalués

Une distribution portable de **Blender 4.5.15 LTS**, téléchargée du serveur officiel et vérifiée contre son SHA256 publié, a évalué les piles de modificateurs. Le runtime est conservé dans `work/`, sans installation système. L’original `Startup.blend` garde son empreinte. Le lancement utilise `--background --factory-startup --disable-autoexec` et la lecture désactive les scripts ; le journal confirme que `z-anatomy.py` a été bloqué.

| Objet | Sommets bruts | Sommets évalués | Triangles évalués |
| --- | ---: | ---: | ---: |
| Ethmoid bone | 2108 | 5082 | 10130 |
| Lunate bone.l | 176 | 1046 | 2088 |
| Lunate bone.r | 176 | 1046 | 2088 |
| Pisiform bone.l | 141 | 836 | 1668 |
| Pisiform bone.r | 141 | 836 | 1668 |
| Xiphoid process | 459 | 459 | 913 |

Les six booléens de l’ethmoïde utilisent leurs objets opérandes enregistrés ; les quatre subdivisions des carpes et le Mirror du xiphoïde utilisent leurs paramètres source. L’évaluation respecte les drapeaux et niveaux de visualisation enregistrés, sans augmenter arbitrairement les subdivisions. Les matrices du repère brut sont contrôlées avant l’évaluation, puis les résultats sont transformés dans le repère de présentation.

L’évaluation du Mirror du xiphoïde conserve ici 459 sommets ; ce nombre n’est ni une preuve de symétrie anatomique ni un critère de validation de la forme. Les paramètres et résultats réels sont archivés. Un avertissement du fichier source sur un cycle de dépendance de l’œsophage, hors des objets osseux sélectionnés, est noté séparément ; aucune réparation de cet autre système n’est effectuée.

Le premier passage est conservé dans `premier_passage/` : il documentait les cinq os entièrement en attente, le sternum partiel et les tests initiaux. Après évaluation, **aucune pile de modificateurs identifiée dans ces 208 objets ne reste non évaluée**. Les géométries brutes restent accessibles pour comparaison ; elles ne sont pas écrasées.

## Placement et limites géométriques

Une seule similitude de présentation CU, issue de six centres grossiers déjà documentés, transforme tout le squelette Z-Anatomy. Sa matrice complète, son origine et son empreinte sont conservées. Elle préserve les relations relatives de l’atlas source mais ne recale pas anatomiquement chaque os sur HRA. Les anciennes matrices régionales BP4.3 ne sont pas réutilisées pour déformer ce squelette os par os.

Le rendu utilise les triangles sources ou une triangulation par projection contrôlant l’aire, sans nouveaux sommets. Un polygone de chaque scapula échoue à ce contrôle et reste exclu du rendu uniquement. Les originaux et diagnostics sont conservés ; aucune rustine géométrique n’est considérée anatomiquement correcte par défaut.

Les homologues anatomiques et les poses entre atlas restent à qualifier, notamment là où HRA ne fournit pas de cible indépendante. Ni la cohérence d’un atlas, ni la présence de 206 entrées, ni une petite distance entre des versions apparentées ne valident les surfaces, articulations et attaches.

## Tests et conservation

**1055/1055 contrôles réussis**, sans erreur JavaScript ni HTTP lors du parcours final. Ils couvrent les comptes par région et par concept, les 208 géométries, leurs empreintes, l’application de la matrice à tous les sommets, les côtés, les indices, les évaluations des six objets, le sternum composite, l’ethmoïde évalué, les douze régions, l’affichage PC/mobile, la fermeture avant animation et les six postures antérieures. La comparaison DB reste utilisable.

La géométrie source est chargée uniquement à l’ouverture de la revue. Les étiquettes de réseaux étrangers à l’inspection sont temporairement masquées puis restaurées. Seul `web/app.js` est modifié parmi les fichiers préexistants contrôlés, pour intégrer la revue. Sa version de début DC est sauvegardée. Deux fichiers de données et le module de revue sont ajoutés ; les données et modèles préexistants, les surfaces musculaires, les trajets nerveux et les lots CZ/DA/DB ne sont pas réécrits.

Attribution : **Z-Anatomy / Gauthier Kervyn, Marcin Zielinski · CC BY-SA 4.0**, dérivations BodyParts3D signalées. Les notices BP4.0/BP4.3/HRA restent celles de leurs dossiers, sans changement rétroactif de licence. Les références de cadrage du décompte sont liées dans le plan ; aucune figure de manuel n’est importée.

## Suite du chantier

Les lots 0 à 3 du plan sont réalisés pour cette base de représentation. La prochaine tranche est la **qualification anatomique du crâne et du thorax**, avec choix de cibles indépendantes, annotation de repères homologues et contrôle des assemblages. Puis viennent les membres, le bassin/pieds et la colonne, avant les articulations et attaches musculaires. Les quatre trapèzes restent en quarantaine ; aucune enthèse, innervation ni force n’est inventée.

**Aucune publication.** Tout reste sur ce PC ; publier exige une nouvelle demande explicite.
