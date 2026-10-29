# POLY — Groupes d’occultation et atelier par pièces

29 octobre 2026. Continuation explicite sur la branche locale `feat/regional-body-bridge-20261028`. Aucun push, fusion ou déploiement ; blocs source hors dépôt/site.

## Occultation des groupes HRA

Le groupe cardiaque historique est raccordé au mode corps/contexte de la référence générique HASS-BODY : les 14 identités exactes du contrat vérifié deviennent les cibles du masque. Mode isolé, source manquante ou contexte incompatible : suspension. L’état demandé du masque est restitué à la fermeture. La région source de HASS-BODY reste inconnue ; cette curation ne lui ajoute pas une localisation individuelle.

Un sélecteur propose aussi les surfaces résidentes de la région documentaire courante. Il utilise uniquement les correspondances déjà qualifiées du catalogue (cœur, poumons, peau, yeux, cerveau entier). Les sous-régions cérébrales non qualifiées n’obtiennent aucune cible. Pendant une session cardiaque, les 14 identités du contrat priment et le sélecteur est désactivé pour rendre cette règle explicite.

Le calcul historique à sept rayons et son domaine de repos non déformé sont conservés. Les occultants sont de véritables triangles HRA déjà chargés. Les cibles ne s’atténuent pas elles-mêmes ; les matériaux sont modifiés seulement pendant le rendu synchrone puis restaurés, avec le cache d’identités/générations existant. Aucun chargement de géométrie, mesure de visibilité complète ou recalage individuel n’est ajouté.

La suite navigateur couvre corps/isolement/retour, véritables occultants devant les 14 surfaces, changement de région, région cérébrale non qualifiée, libération et perte de contexte. Les 27 surfaces du chemin pulmonaire résident sont vérifiées contre leur couverture. Une première assertion de test attendait à tort huit surfaces : le délai de cette assertion est conservé dans `work/regional-group-occlusion-browser.log`, mais n’est pas un incident de démarrage ni une correction des données source.

## Comparaisons documentées par pièces

Les deux observations humaines source CRONE_H1987 et CRONE_CONTROLS_H1994 proposent les seules paires de surfaces explicitement citées pour le côté sélectionné : FJ1439/FJ1437 à droite, FJ1439M/FJ1437M à gauche. Aucun antagoniste n’est déduit d’un nom. Relation absente, ambiguë ou mauvais côté : pas de comparaison résolue.

Les groupes restent soumis au planificateur existant : 4 Mio de blocs bruts et 16 pièces affichées au maximum. Les deux paires testées occupent respectivement 1 977 528 et 1 977 744 octets de blocs source. Les autres pièces présentes dans ces blocs ne sont pas affichées. Les champs du protocole restent consultables ; la comparaison graphique n’attribue aucune inhibition, activation, force ou latence à ces surfaces.

Le contexte peut être masqué sans libérer sa mémoire ; la légende distingue désormais contexte osseux et autres surfaces comparées. Les coordonnées source sont conservées. Aucun téléchargement du monolithe de géométrie JSON des membres/tronc ou du corps binaire global.

## Postures et suivi

Le lecteur par pièces utilise désormais les recettes historiques partagées pour repos, course, assis, allongé et geste de repas, en plus de la marche. Les positions/indices source restent intacts ; seul le buffer d’affichage du placement illustratif est déformé. Les courbes consultées utilisent le même rig compatible. Les phases 0–6 secondes de course/repas sont pédagogiques, sans journal, activation ou temps biologique. Les poses statiques ne lancent aucune lecture.

Les reprises locales conservent mode et phase, chargent volontairement les mêmes clés et restent en pause. Les anciens marque-pages sans champ d’activité gardent la sémantique marche. Modes/temps incompatibles sont refusés. Une courbe et une lecture ne sont jamais relancées implicitement.

Le suivi de caméra est facultatif et emploie le centre de présentation réellement déclaré par la référence, corrigé par la recette historique de calibration puis déformé par le même rig. Aucun centre absent n’est inventé. Seuls l’identifiant et trois nombres sont gardés pour le suivi. La caméra reçoit le même déplacement que ce point, en conservant son décalage ; retour de vue, recadrage, changement de source, masquage de la cible ou perte de contexte arrêtent ce suivi. Aucun second animateur.

## Buffers de courbes

Le lecteur met à jour en place les distances des 65 sommets de chaque courbe, plutôt que recréer l’attribut à chaque phase. Accumulation double précision puis stockage float32, comme Three.js. Les 575 courbes originales ont été comparées octet par octet à `THREE.Line.computeLineDistances`. Les positions ne sont pas modifiées par cette écriture. Aucun gain FPS/GPU/téléphone n’en est déduit.

## Diagnostic avant les imports

Les deux pages possèdent maintenant un diagnostic initial indépendant du chargement de leur graphe de modules. Après 30 secondes depuis le bootstrap HTML, il signale que les imports ne sont pas prêts ; un refus de chargement/évaluation est aussi signalé. Un bouton permet un rechargement manuel ; aucune relance automatique.

Si le module devient prêt tardivement, l’interface normale reprend et le bouton disparaît, mais le drapeau de dépassement reste consultable dans `window.__polyModuleStartup()`. Les traces détaillées existantes prennent ensuite le relais. Un import retenu puis libéré et un import refusé sont testés sur chacun des lecteurs avec une horloge virtuelle : ces quatre cas ne mesurent pas une latence réelle. La cause du délai intermittent historique reste inconnue.

## Validation

**165 tests Node : réussite, zéro échec et zéro test ignoré.** Comparaisons source exactes, limites de phases et compatibilité des marque-pages, échantillons de trois sommets des 526 pièces aux poses manuelles, centres historiques déclarés non modifiés, 575 courbes comparées et cibles des groupes sont couverts. Les 23 tests Python déjà validés ne sont pas présentés comme réexécutés pour ces modifications JavaScript/HTML.

Parcours ciblés réussis sur ordinateur et mobile émulé : cœur générique/groupes, navigation et masque HRA, carte documentaire (dont arrêt du rendu au repos), interactions de référence existantes et nouvel atelier par pièces (comparaisons droite/gauche, poses, courbe compatible, reprise, suivi, retour source et perte de contexte). Le diagnostic pré-module dispose des quatre cas de panne/délai contrôlés ci-dessus. Captures de l’atelier ordinateur/mobile inspectées ; champs et sélecteurs mobiles ajustés.

34 suites navigateur disposent de résultats réussis au fil du projet. Cela ne constitue pas une passe consolidée de toutes les suites sur ce commit. Le nouveau code ne modifie pas les fabriques classiques monolithiques de rendu.

## Périmètre conservé

Les écarts ciblés de groupes HRA, poses, comparaisons et suivi sont traités dans le parcours borné. La vue globale de toutes les 526 pièces demeure disponible dans le parcours historique ; elle n’est pas reconstituée en contournant le budget de 4 Mio du lecteur régional. La parité exhaustive de toutes les commandes de cette vue globale n’est pas revendiquée. Cause du démarrage intermittent, appareil physique et validation anatomique restent des limites explicites. Aucun recalage, insertion ou mesure absent n’est inventé.
