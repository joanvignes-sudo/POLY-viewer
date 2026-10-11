# POLY — habiter les chaînes biologiques

Canon de représentation adopté par Joan Vignes le 11 octobre 2026. Les cinq vues sont retenues comme modes complémentaires de POLY. Première référence publique v0.92, issue du dossier documentaire v0.91. Cette maquette utilise des volumes procéduraux schématiques, pas des maillages d’anatomie segmentée. Les parcours, dimensions, courbes et neurones dessinés ne sont pas des mesures. Aucun nouveau résultat scientifique ni modèle de causalité n’est produit par la démonstration.

## Diagnostic

Dans la version courante, l’exploration documentaire en 2D a pris la place centrale. La référence conservée sous « Modèle complet » contient toujours le graphe spatial et le cerveau schématique hérités du viewer v0.22. Le graphe Plotly utilisait notamment des axes relation/branche/niveau abstrait ; la projection cérébrale plaçait des ancrages schématiques. Cela n’équivaut pas à une anatomie 3D mesurée du corps, de ses nerfs et de ses régions.

Une ressource plus ancienne existe aussi : en v0.44, un volume MNI152 et des repères Harvard–Oxford avaient été acquis. La maquette en faisait une projection sagittale, avec placement humain approximatif de certaines préparations entre espèces. On peut réutiliser ces ressources après contrôle de leur portée et de leur licence, mais elles ne suffisent pas à définir les trajets périphériques ou la connectivité cellulaire.

Le besoin structurel est donc de remettre **une scène anatomique humaine persistante** au centre de POLY. Les fiches scientifiques deviennent des dossiers accessibles depuis cette scène. Une région ne doit pas disparaître quand on change de chaîne ; ce sont les parcours et leurs états qui changent.

## Cinq modes canoniques

### Anatomie en brume — ma recommandation pour la vue principale

Une tête humaine et le haut du thorax restent reconnaissables. Peau, tissus mous, os, enveloppes et cerveau ont chacun leur visibilité et leur transparence. Une rotation révèle les rapports entre structures ; un clic centre et agrandit la sélection. Les organes restent sobres, les parcours actifs portent les accents colorés.

L’oreille peut rester visible en fantôme tandis que l’on examine une branche nerveuse ou un relais profond. Pour garantir la lisibilité, ajouter des coupes et l’isolation de structures : la transparence seule produit vite une accumulation confuse. Les épaisseurs de nerfs peuvent être amplifiées à l’écran, avec une indication permanente lorsqu’elles le sont.

Exemple préparé : rotation du buste, opacité peau/chair/os/cortex, sélection de l’oreille, du cerveau, du cœur et d’un repère insulaire. Il faut remplacer les volumes actuels par une anatomie sourcée avant tout usage scientifique spatial.

### Anatomie déployée — comprendre les enveloppes

Les couches s’écartent autour d’un axe commun : peau à gauche, tissus mous à proximité, crâne de l’autre côté, structures centrales au milieu. Des repères de correspondance doivent permettre de suivre la même région à travers ces couches.

Utile pour comprendre « ce qui est devant, derrière, à l’intérieur ». Cette vue doit porter la mention **espacement pédagogique** : les couches déployées ne sont plus à leur position ni à leur distance anatomiques. Le retour à la vue assemblée rétablit le repère spatial. Ce serait un mode ponctuel de la même scène, pas un second atlas contradictoire.

Exemple préparé : enveloppes séparées et orbite libre ; mêmes commandes de sélection et de transparence.

### Voyage dans une chaîne — voir une séquence se dérouler

Une caméra accompagne le maillon actif tout en gardant un repère du corps. Le chemin reste visible derrière elle ; les branches et retours peuvent être explorés. Pause, maillon suivant et retour à la vue globale restent accessibles. Une liste textuelle offre la même navigation que le clic 3D.

Chaque étape distingue au minimum : structure, mesure, événement, délai, population, source et statut du lien. Lorsqu’un délai manque, la lecture est par étapes ou à vitesse pédagogique explicitement annoncée. Un intervalle expérimental ne devient jamais une vitesse de conduction calculée à partir d’une courbe décorative.

Exemple préparé : déplacement de caméra et point actif le long d’un parcours conceptuel auriculaire. Les relais de ce parcours ne sont pas validés par la maquette. Dans la version scientifique, les liens insuffisamment établis doivent rester interrompus ou marqués, avec choix explicite de poursuivre une hypothèse.

### Observatoire des échelles — du corps à la microstructure

Deux fenêtres liées : le lieu dans le corps et la structure observée à l’échelle locale. Le passage cerveau → région → coupe → cellule conserve un fil de navigation et affiche le repère, l’échantillon et la résolution à chaque niveau.

Le changement de donneur ou de préparation doit être visible : on ne présente pas une cellule H01 comme un neurone réellement situé dans notre cerveau MNI de référence. Lorsqu’une transformation documentée existe, afficher son origine et son incertitude. Sinon, ouvrir un exemple comparatif explicitement distinct.

Exemple préparé : cerveau d’un côté et neurones schématiques manipulables de l’autre. Une future intégration pourrait remplacer cette vignette par des coupes BigBrain ou un extrait réel H01 chargé à la demande. Aucun jeu H01 n’a été téléchargé dans cette tâche.

### Quatre chaînes — comparer les interactions possibles

Une scène commune et quatre pistes de lecture séparées : oreille/vague, respiration, cœur, perception/expression. Chaque piste peut être masquée. Les territoires partagés, les sorties différentes et les lacunes deviennent inspectables.

Trois niveaux d’interprétation doivent rester séparés : **recouvrement de représentation**, **interaction mesurée**, **effet calculé par un modèle identifié**. Deux parcours passant par une insula dessinée n’établissent ni compétition, ni addition, ni inhibition. Les quatre chronologies ne peuvent être synchronisées biologiquement que si leurs horloges, conditions et variables sont compatibles. Une juxtaposition d’études indépendantes garde ses propres temps.

Exemple préparé : quatre animations simultanées et quatre pistes d’avancement. Leurs 14 secondes de lecture sont un choix pédagogique commun, sans signification biologique. Aucun effet combiné n’est calculé.

## Précision : ce que nous pouvons atteindre

La qualité visuelle d’un maillage, la résolution d’un instrument, l’exactitude du recalage et la validité biologique d’une chaîne sont quatre choses différentes. Agrandir une forme ne crée pas une mesure.

| Niveau | Ce qui est réalisable | Réserve essentielle |
|---|---|---|
| Corps, peau, os, organes | Maillages séparés, rotation, coupes, sélection et mesure d’échelle dans une référence donnée. [BodyParts3D/Anatomography](https://lifesciencedb.jp/bp3d/) fournit un point d’entrée pour les pièces anatomiques. | Vérifier version, licence, couverture et transformations avant import. Un corps de référence ne décrit pas les variations de chaque personne. |
| Régions cérébrales | Références MNI, parcellations et cartes probabilistes Julich-Brain ; coordonnées et provenance explicites. [Julich-Brain](https://julich-brain-atlas.de/index.php/atlas). | Une frontière probabiliste n’est pas une limite identique chez tous les individus. Ne pas déplacer une donnée animale dans un cerveau humain sans signalement. |
| Couches corticales | BigBrain : volume humain reconstruit à **20 µm**. Possibilité de coupes et de niveaux de détail. [Source officielle](https://bigbrainproject.org/). | Histologie post mortem ; 20 µm ne signifie pas toutes les synapses ni l’activité du cerveau vivant. Le recalage vers une autre référence ajoute sa propre incertitude. |
| Cellules et synapses | H01 : environ **1 mm³ de cortex humain** en microscopie électronique, accessible dans un navigateur ; la page de diffusion mentionne **183 millions de synapses annotées** et **100 cellules corrigées manuellement**. [Portail H01](https://h01-release.storage.googleapis.com/landing.html). | Échantillon limité, beaucoup de reconstructions automatiques et de fragments ; absence de dynamique vivante et de couverture de tout le cerveau. Ne pas confondre ces chiffres de diffusion avec les décomptes d’une publication ou d’une sous-sélection. |
| Nerfs périphériques et branche auriculaire du vague | Trajet macroscopique documenté, territoires d’innervation et variabilité, avec représentation explicitement schématique pour les fibres non reconstruites. [Étude anatomique Peuker–Filler](https://pubmed.ncbi.nlm.nih.gov/11835542/). | L’oreille ne doit pas être étiquetée globalement « nerf vague ». Le site de stimulation, les autres innervations et les variations anatomiques doivent rester visibles. Aucune spécificité vagale totale ne peut être déduite du seul dessin. |
| Activité temporelle | Rejouer des événements et séries réellement mesurés ; affichage fluide sur l’ordinateur. | « Temps réel » de l’interface n’est pas une mesure en direct d’un cerveau. L’iEEG, les évaluations subjectives et l’IRMf ne partagent ni résolution ni horloge par défaut. |
| Effet de quatre chaînes | Comparaisons documentaires dès maintenant ; simulations locales possibles avec équations, paramètres et validations adaptés. | Un atlas anatomique et un graphe de liens ne suffisent pas à prédire l’effet combiné ni le vécu subjectif. Une telle simulation doit publier son domaine de validité et ses tests. |

La piste siibra est particulièrement proche du besoin : elle relie des références cérébrales et des données à plusieurs échelles. Voir l’[article de méthode de 2026](https://www.nature.com/articles/s41592-026-03159-x) et l’[exemple officiel d’exploration jusqu’aux corps cellulaires](https://ebrains.eu/impact/ebrains-in-use/explorations/explore-cellular-architecture). Ce sont des ressources à évaluer, pas une intégration déjà accomplie dans POLY.

## Un même objet, deux profondeurs de lecture

Le mode d’exploration montre la structure, le parcours, les branches et les changements observés, avec une phrase précise pour chaque étape. Le lecteur peut rester dans l’expérience visuelle sans perdre les distinctions entre observation et hypothèse.

Le dossier scientifique du même objet expose : espèce, échantillon, sujet/session/essai lorsque partageables, manipulation, mesure, instrument, unités, événement de référence, fenêtre temporelle, coordonnées, espace d’atlas, transformation, incertitude, article, données, code, version et exclusions. Une nouveauté est datée et décrite comme ajout ou modification ; elle n’est pas assimilée à une preuve plus forte. Les résultats négatifs et les dépendances inconnues restent consultables.

Le lien entre scientifiques et philosophes tient à cette possibilité de changer de profondeur **sans changer de faits**. La représentation peut rendre une hypothèse imaginable ; elle doit aussi permettre de voir où l’explication s’arrête.

## Direction adoptée et suite structurée

Retenir **Anatomie en brume** comme socle, **Voyage dans une chaîne** pour la lecture et **Quatre chaînes** pour la comparaison. **Anatomie déployée** sert à expliquer les rapports spatiaux ; **Observatoire des échelles** donne accès aux préparations plus fines.

1. **Référence anatomique** : sélectionner un petit ensemble humain cohérent tête/oreille/crâne/cerveau/tronc/nerfs/cœur. Vérifier les licences pièce par pièce. Fixer unités, axes, identifiants anatomiques et provenance. Critère : une structure sélectionnée renvoie au bon objet et au bon repère ; les inconnues sont visibles.
2. **Première chaîne ancrée** : choisir une chaîne humaine déjà documentée, cartographier ses maillons, puis afficher les raccords qui restent conceptuels. Critère : chaque étape et chaque délai renvoient à leur preuve ; aucune trajectoire axonale n’est inventée pour combler un vide.
3. **Lecteur temporel** : vitesse pédagogique ou horloge expérimentale clairement séparées, pause aux lacunes, branches et retours. Critère : une durée manquante ne prend jamais une valeur par défaut présentée comme physiologique.
4. **Comparaison de quatre chaînes** : quatre pistes, conditions et horloges explicites, sélection des zones partagées, liens vers résultats d’interactions lorsqu’ils existent. Critère : toute prédiction affichée dépend d’un modèle nommé et vérifiable.
5. **Microstructure à la demande** : intégrer une petite préparation humaine réelle et son repère, avec changement d’échantillon explicite. Critère : chaque niveau affiche sa résolution et la continuité ou la rupture de son ancrage spatial.

La version v0.92 publie cette direction et les cinq modes interactifs, ainsi qu’une édition publique du dossier documentaire. Les données acquises, les échanges privés et les historiques complets restent conservés localement ; les originaux scientifiques sont reliés à leurs sources publiques. La géométrie anatomique mesurée reste la prochaine étape, sans promotion des illustrations en mesures.
