# POLY — Étude et intégration du squelette de référence

Lot DE, 22 octobre 2026. Tout reste local. L’idée de mouvement complexe, de traction à la souris, de forces musculaires et de gravité simulée est mise de côté. Les activités existantes manger, marcher et courir sont conservées ; aucune nouvelle mécanique physiologique n’est revendiquée.

## 1. Objectif et définition de « tous les os »

Le résultat visé maintenant est un squelette adulte de référence complet, accessible directement dans l’avatar, avec ses noms, côtés, sources et limites. Trois niveaux doivent rester séparés : un os inventorié ; une surface identifiable affichée dans le personnage ; une localisation anatomique qualifiée contre une référence indépendante. Terminer l’affichage ne termine pas automatiquement le troisième niveau.

La convention comprend 206 os : 80 axiaux et 126 appendiculaires. Elle décrit une base adulte usuelle, pas tous les individus à tous les âges. Les variantes, os suturaux/accessoires et sésamoïdes supplémentaires restent des extensions ; les dents sont suivies séparément. Le sternum compte un seul os malgré ses trois surfaces sources, chaque os coxal compte une unité, et sacrum/coccyx suivent la convention adulte. Les patellas et pisiformes sont bien inclus dans leurs régions respectives.

Référence de cadrage : [OpenStax, divisions du squelette](https://openstax.org/books/anatomy-and-physiology-2e/pages/7-1-divisions-of-the-skeletal-system). Les 206 entrées locales ne doivent pas être remplacées par un décompte de fichiers ou de morceaux de surface.

## 2. État avant et différence apportée

Le lot DC avait extrait 208 objets permettant de représenter les 206 concepts. Six piles de modificateurs avaient été évaluées ; deux polygones scapulaires restent exclus du rendu, avec les originaux conservés. Ce squelette n’était visible que dans une revue source debout et en pause, séparée de l’avatar courant.

DE réutilise ces mêmes géométries et leur transformation commune, sans nouvelle fusion de sujets et sans changement de licence. Une adaptation rigide de la pose des bras et avant-bras rapproche ces segments des commandes graphiques préexistantes de l’avatar, sans changement d’échelle. Les repères sources sont des centres de bandes extrêmes des surfaces, pas des repères anatomiques annotés ; les matrices et écarts résiduels sont enregistrés dans `ADAPTATION_GRAPHIQUE_BRAS.json`. Il ajoute une couche dans la scène normale du personnage, activée par défaut. Le bouton « Os · 206 » donne accès au squelette seul ; le panneau permet de choisir région et os, puis de revenir au corps. Une sélection à la souris fournit le nom et le statut. Les références osseuses précédentes sont temporairement masquées pendant le rendu de cette couche, pour éviter les doublons ; elles restent disponibles dans leurs outils d’inspection.

Les os suivent les animations existantes par transformations rigides de présentation, par segment. Leur géométrie ne se plie pas comme un tissu mou. Les pivots et trajectoires proviennent de l’animation illustrative déjà présente ; ils ne deviennent pas des axes anatomiques validés. Les écarts entre le squelette source et les autres atlas restent possibles, particulièrement près des articulations et pendant le repas.

Ce lot termine donc **l’intégration graphique de la base adulte de 206 os**. Il ne termine pas la qualification de tous leurs placements internes, des articulations ou des attaches.

## 3. Couverture par région

| Région | Os | Question prioritaire de qualification |
| --- | ---: | --- |
| Crâne, voûte et base | 8 | Sutures, cavités, orientation et correspondance avec la tête de l’avatar |
| Face | 14 | Orbites, fosses, maxillaire/mandibule et rapports dentaires |
| Osselets | 6 | Position dans chaque oreille ; faible taille, référence indépendante nécessaire |
| Hyoïde | 1 | Rapport au cou et absence de liaison osseuse directe rigide au crâne |
| Colonne, sacrum et coccyx | 26 | Niveaux, courbures, continuité, variabilité du coccyx |
| Côtes et sternum | 25 | Numérotation, côtés, assemblage thoracique et cartilages distincts |
| Ceinture scapulaire | 4 | Clavicules/scapulas ; différences de pose entre sources |
| Bras et avant-bras | 6 | Extrémités articulaires, pronosupination et latéralité |
| Mains | 54 | Carpes, métacarpes, phalanges, axes locaux et petites dimensions |
| Bassin | 2 | Os coxaux adultes composites, symphyse et correspondance au sacrum |
| Cuisses et jambes | 8 | Fémur, patella, tibia et fibula ; rapports du genou |
| Pieds | 52 | Tarses, métatarses, phalanges et appuis de référence |
| **Total** | **206** | Couverture de représentation ; précision individuelle à qualifier |

Les osselets existent mais ne sont pas nécessairement perceptibles en vue générale. Il faut les isoler et centrer la caméra. La même distinction vaut pour des os cachés par d’autres structures : invisibilité par occlusion ne signifie pas absence de surface.

## 4. Paysage des ressources et choix de source

| Ressource | Utilité pour les os | Limites pour POLY |
| --- | --- | --- |
| [Z-Anatomy, dépôt des modèles](https://github.com/Z-Anatomy/Models-of-human-anatomy) | Ensemble source cohérent, noms et surfaces déjà extraits localement | Sources et dérivations à conserver ; correspondance à l’avatar HRA non prouvée par la seule cohérence de l’ensemble |
| [BodyParts3D, archive officielle](https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html) | Concepts anatomiques, représentations et modèle masculin adulte ; comparaison avec les lots BP locaux | Versions et niveaux de réduction différents ; ne pas assimiler un objet BP4.0 à un objet BP4.3 ou à un objet Z-Anatomy |
| [HRA, bibliothèque 3D](https://humanatlas.io/3d-reference-library) | Contexte de l’avatar et références régionales quand disponibles | Références issues de sources différentes ; ne pas supposer une segmentation indépendante pour chacun des 206 os |
| [3D Slicer, segmentation](https://slicer.readthedocs.io/en/latest/user_guide/image_segmentation.html) | Préparation, contrôle et recalage sur imagerie adaptée | L’outil ne fournit pas de lui-même une vérité osseuse complète pour notre avatar |
| [TotalSegmentator](https://github.com/wasserth/TotalSegmentator) | Piste de segmentation sur images pour des structures couvertes par une tâche donnée | Classes et licences propres aux modèles ; aucune promesse d’obtenir les 206 os individuels, notamment les petites structures |
| [Mimics Medical, dossier FDA K183105](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K183105) | Exemple industriel de logiciel de segmentation ayant des indications médicales définies | Produit commercial ; son autorisation ne certifie pas les os sources de POLY ni leur recalage |

Pour l’affichage, privilégier une base cohérente plutôt qu’un patchwork d’os déplacés individuellement entre atlas. Pour la qualification, utiliser des références réellement indépendantes là où elles existent. Deux dérivés d’une même source qui se superposent ne constituent pas deux observations indépendantes.

### Licences : conserver les notices de chaque acquisition

Le [fichier de licence Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy/blob/master/License.txt) est la référence à conserver pour les dérivés concernés ; le lot local porte l’attribution Z-Anatomy / Gauthier Kervyn, Marcin Zielinski, CC BY-SA 4.0, avec dérivations BodyParts3D signalées.

Point documentaire à surveiller : la page officielle d’archive BodyParts3D consultée aujourd’hui demande une attribution CC Attribution 4.0, alors que certaines acquisitions historiques portent d’autres notices. Cette page ne suffit pas à changer rétroactivement les licences enregistrées dans les lots BP4.0/BP4.3. Conserver la notice livrée avec chaque actif et identifier sa version avant toute redistribution. Aucune nouvelle attribution globale n’est imposée aux ressources anciennes par DE.

Ouverture du code, qualité d’un atlas et autorisation d’un dispositif médical sont des questions distinctes. Aucune certification anatomique de POLY n’est revendiquée.

## 5. Architecture minimale et animations conservées

Le socle demeure une liste canonique de 206 identités. Chaque objet conserve son nom source, son empreinte, sa géométrie, sa région, son côté et son statut. Le sternum reste composite. L’affichage courant est un dérivé réversible, pas un remplacement des originaux.

Le mouvement se limite à réutiliser le contrôleur existant : marche issue d’une trajectoire OpenSim adaptée graphiquement ; course et repas illustratifs. Les os sont affectés explicitement à tronc, bras, avant-bras/main, cuisse, jambe ou pied. Pour ces activités, ce découpage est une simplification d’affichage, pas un modèle complet des articulations. Scapulas, clavicules, côtes, colonne et mandibule ne reçoivent pas une cinématique détaillée nouvelle.

Cette simplicité évite d’engager le chantier de traction, de gravité, de muscles actifs et de tissus déformables. Elle ne permet pas d’affirmer que les surfaces articulaires restent exactement en contact ou que chaque os suit exactement les tissus HRA. Ces questions doivent être mesurées avant toute revendication plus forte.

## 6. Ce qui reste à faire pour une précision osseuse qualifiée

1. Définir, par région, la question d’usage et les références réellement disponibles. Une vue pédagogique et une mesure clinique n’ont pas le même besoin.
2. Annoter des repères homologues avec protocole, opérateur, résolution et incertitude. Séparer repères d’ajustement et repères de contrôle.
3. Tester une transformation régionale seulement si elle est justifiée. Mesurer les distorsions, les discontinuités et les effets sur les structures voisines ; conserver la solution source commune pour comparaison.
4. Examiner les formes et interfaces : sutures, surfaces articulaires, niveaux vertébraux, numéros des côtes, orientation des petites pièces, rapport du coccyx au sacrum.
5. Évaluer le placement avec des données indépendantes. Publier dans le dossier les distributions d’erreurs, les régions sans cible et les désaccords, au lieu de masquer les absences sous une moyenne globale.
6. Relier ensuite les données utiles : articulations nommées, régions d’attache documentées, passages nerveux et vasculaires sourcés. Ne jamais créer une enthèse ou une connexion par proximité de maillages.

Le coccyx est affichable et sélectionnable. Sa qualification doit examiner forme, nombre de segments représentés, orientation, source et adaptation au sacrum de référence. Son existence dans le catalogue ne résout pas ces points. Les quatre trapèzes restent hors du chantier osseux courant et ne sont pas déclarés résolus.

## 7. Temps et moyens : le chantier des os seulement

Estimations personnelles d’ingénierie, non devis. Un jour-personne correspond ici à environ sept heures effectives ; les attentes de données et d’avis peuvent allonger le calendrier. Ces charges ne comprennent pas une reconstruction clinique individuelle ni la simulation complexe abandonnée.

| Lot restant ou réalisé | Charge indicative | Résultat attendu |
| --- | --- | --- |
| Intégration graphique de sources déjà extraites — DE | Réalisée dans cette session ; pas de durée future promise | 206 concepts sur le personnage, inspection et animations simples |
| Revue de présentation détaillée et corrections justifiées | 3–7 jours-personnes | Parcours régional, petits os visibles, anomalies de rendu documentées |
| Choix de références et protocole de qualification | 3–6 jours-personnes | Cibles et repères indépendants ; critères fixés avant ajustement |
| Crâne, face, osselets et thorax | 8–16 jours-personnes | Contrôle régional et dossiers de limites |
| Colonne, sacrum, coccyx et bassin | 6–12 jours-personnes | Niveaux, courbures et assemblages contrôlés |
| Membres, mains et pieds | 8–16 jours-personnes | Côtés, formes et repères articulaires contrôlés |
| Revue indépendante et consolidation | 5–10 jours-personnes | Écarts résiduels et bilan de couverture mesurée |

Le reste représente **33–67 jours-personnes**, soit environ 7–14 semaines à temps plein pour la charge de travail, plutôt 2–4 mois calendaires avec accès rapide à un expert et aux références. Ce n’est pas une garantie de validation des 206 os : sans cible indépendante pour une région, le résultat honnête reste « représentation disponible, localisation non validée ». Avec acquisition de nouvelles images ou disponibilité limitée des experts, le calendrier est à réestimer.

Pour un atlas pédagogique conservant clairement ses limites, la revue graphique peut suffire au jalon d’usage immédiat. Pour un référentiel de localisation extrêmement précise, l’avis anatomique et les données de mesure constituent l’essentiel du travail restant ; une IA plus puissante ne remplace pas ces observations.

Budget : le travail local déjà exécuté ne déclenche aucun achat. Pour externaliser, demander un devis sur les jours et livrables ci-dessus, séparant développement, annotation et expertise. À titre purement arithmétique, 33–67 jours à un coût hypothétique de 500–900 €/jour représentent 16 500–60 300 €, hors imagerie et frais externes ; ce ne sont pas des tarifs vérifiés ni une dépense nécessaire pour poursuivre l’affichage actuel.

## 8. Contrôles et critères de réception

Contrôles techniques prévus pour DE : inventaire 206/208, géométries finies et indices valides, régions, sternum composite, coccyx sélectionnable, conservation des sources, absence de déformation des os, matrices rigides pour les poses, maintien des activités manger/marcher/courir, bascule entre corps et squelette, case du système osseux, anciennes revues accessibles, affichage PC/mobile et erreurs de chargement.

Les résultats réellement exécutés sont dans `TESTS.json` et le bilan de reprise. La rigidité numérique des transformations ne prouve pas la justesse de leurs pivots. Les captures vérifient le rendu observé, pas la précision médicale.

Critère de fin graphique : les 206 identités disposent de surfaces accessibles dans l’avatar, sans doublons visibles de la couche précédente dans cette vue ; les trois animations continuent. Critère de fin anatomique : chaque région possède des références et mesures indépendantes adaptées à son usage. Ces deux fins restent distinctes.

## 9. Décision retenue pour cette reprise

Mettre à disposition tous les os de la base adulte sur le personnage, conserver les activités existantes et leur statut illustratif, puis poursuivre la précision anatomique par lots de preuves. Ne pas introduire de nouveau moteur dynamique, de traction interactive ou de paramètres musculaires. Tout reste sur ce PC ; aucune publication sans nouvelle demande explicite.
