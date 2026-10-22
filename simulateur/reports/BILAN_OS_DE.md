# POLY — Bilan du lot osseux DE

## Résultat

Les **206 concepts osseux adultes**, représentés par **208 surfaces sources**, sont désormais intégrés à la scène courante de l’avatar. Le bouton **Os · 206** ouvre le squelette seul. Les listes de région et d’os permettent l’inspection, le centrage et le retour au corps. Le coccyx et les six osselets sont sélectionnables. Les trois surfaces du sternum restent un seul concept.

Les animations **manger, marcher et courir** sont conservées, avec leur contrôleur antérieur inchangé. Les autres postures déjà présentes restent disponibles. Le nouveau squelette utilise des transformations rigides de présentation ; aucune force, traction interactive, gravité ou cinématique détaillée nouvelle n’est introduite. Le mouvement complexe est mis de côté conformément à la demande.

## Exactitude et limites

Il s’agit d’une intégration graphique complète de la base adulte, pas d’une validation anatomique complète dans HRA. Zéro recalage et zéro attache nouveaux sont déclarés validés. Le squelette source conserve ses géométries. Pour rapprocher sa pose des bras de celle du personnage, une adaptation rigide sans changement d’échelle est documentée, basée sur des bandes extrêmes des surfaces et les pivots graphiques existants. Ce ne sont pas des repères anatomiques annotés.

Les résidus aux commandes graphiques sont conservés dans ADAPTATION_GRAPHIQUE_BRAS.json ; ils ne sont pas des erreurs anatomiques mesurées. La couche ne démontre pas le contact exact des surfaces articulaires ni l’accord avec chaque tissu des autres atlas. Scapulas, clavicules, côtes, colonne et mandibule ne reçoivent pas de mouvements locaux détaillés. Deux polygones scapulaires restent exclus du rendu, sans modification des originaux. Les quatre trapèzes litigieux restent à qualifier.

## Contrôles exécutés

**1496/1496 contrôles réussis**, sans erreur JavaScript ni erreur HTTP observée sur le parcours final. Vérifications : 206 identités/208 surfaces, géométries et indices, intégrité des positions sources dans les buffers, sélection des douze régions, sternum composite, coccyx, conservation des couches antérieures, rigidité des matrices dans les six postures, marche/course/repas actifs, masquage temporaire des os natifs et restauration de leur visibilité, compatibilité de la revue DC, case système et affichage mobile. Ces tests ne constituent pas une validation anatomique.

Une première exécution signalait à tort une modification non autorisée parce que le contrôle comparait séparateurs Windows et séparateurs Unix. Le contrôle a été corrigé ; les données et modèles antérieurs sont inchangés. Les modifications graphiques ultérieures ont été retestées. Les captures finales sont jointes.

## Fichiers et conservation

Dans l’avatar : ajout de web/avatar-bones.js ; intégration dans web/app.js ; actualisation du lien de version dans web/index.html ; étude dans reports/ETUDE_OS_DE.md. Les versions précédentes de app.js et index.html sont sauvegardées dans avant/. Les contrôleurs rig.js et activities.js, les géométries sources, données osseuses, muscles et nerfs sont conservés.

Le dossier contient ETUDE_OS.md, PROMPT_OS.md, TESTS.json, ETAT_REPRISE.json, l’adaptation graphique, les sauvegardes, captures et fichiers de reproduction. Une copie est conservée dans les outputs du projet d’origine. Rien n’est publié.

## Suite réaliste

L’intégration de représentation est réalisée. Pour augmenter la précision, il reste à choisir des références indépendantes et qualifier les régions, au lieu de déclarer exacts les 206 placements. L’étude estime 33–67 jours-personnes pour une campagne régionale avec accès aux références et à une revue experte ; une région sans cible doit rester explicitement non validée. Aucune acquisition payante n’a été engagée.
