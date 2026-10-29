# POLY — Dossiers documentaires génériques dans le lecteur régional

29 octobre 2026, développement local. Les contrôles historiques du moteur documentaire sont réutilisés sans horloge biologique ni acquisition de nouvelle source.

## Fonctionnement raccordé

Le laboratoire HRA propose une ouverture explicite des dossiers. Aucun dossier ni bloc supplémentaire n’est chargé avant cette action. Sélection des dossiers et étapes source, sources primaires, choix des relations, bifurcations, lecture/pause, consultation au-delà d’une frontière explicitement non animée et retour sont disponibles. Le moteur `documentary-engine.js` reste celui du corps historique ; les identités et les données ne sont pas recopiées dans un modèle inventé.

Le cadrage utilise l’union des limites des seules surfaces résidentes dont le chemin source correspond exactement à `VH_M_heart`, `VH_M_lungs`, `VH_M_skin`, `VH_M_eyes` ou `Allen_brain`. La couverture annonce les surfaces attendues, résidentes et manquantes. Les références cérébrales fines (amygdale, insula, striatum, préfrontal) n’obtiennent pas une correspondance HRA supposée. Le cadrage ne crée ni marqueur anatomique ni trajet 3D et ne mesure aucun individu.

La même étape et sa progression sont conservées lors du cadrage et du retour. Le mouvement illustratif est mis au repos lors d’un cadrage, d’un export ou d’une reprise ; les dossiers gardent une horloge graphique indépendante de la marche et du journal. La lecture documentaire se suspend lors du masquage de la page et de la perte WebGL, sans redémarrage automatique. Le retrait des blocs actualise la couverture et ne retient pas leurs Mesh ou matériaux.

## Reprises et cycle de vie

Un format régional distinct `poly.regional-documentary-manifest.v1` conserve le contrat documentaire commun, le cadrage et son retour, les deux empreintes de source HRA et les indices résidents exacts. Les six ressources de provenance comprennent le moteur, le contrat, les modules régionaux et les dossiers. La reprise vérifie à nouveau le contexte après les lectures asynchrones ; un changement d’étape, de cadrage ou de résidents provoque un refus. Elle exige le chargement explicite des mêmes sources et ne télécharge aucun bloc automatiquement. Le format classique n’est pas silencieusement traduit.

Les lectures ont une limite de taille et un délai de 30 s, sont annulables et ne se relancent pas automatiquement. Les requêtes et lectures graphiques sont arrêtées au masquage, à la perte de contexte et à la sortie. Les URL d’export sont révoquées. Le retour depuis le cache de navigation recrée le panneau sans reprise implicite.

## Vérifications

- 131 tests Node réussis ; bornes issues des sources réelles, refus des régions inconnues, identités résidentes, empreintes, caméra et contrat canonique.
- Suite régionale documentaire réussie sur ordinateur et émulation mobile : chargement explicite, absence de géométrie supplémentaire, limites réelles/cadrage/retour, export téléchargé et reprise, refus des altérations, frontières et retour du moteur, horloges séparées, suspension au masquage et à la perte WebGL, refus d’une reprise pendant un changement de contexte et après libération.
- Suites existantes `documentary-manifest-browser`, `body-regional-posture-browser` et `body-region-browser` réussies.
- Capture mobile inspectée visuellement : commandes lisibles, aucune largeur dépassante. L’émulation ne mesure pas un téléphone physique.
- Premier essai de la nouvelle suite interrompu par une assertion visant le mauvais objet de diagnostic (`motion`), corrigée vers le diagnostic historique approprié ; aucune erreur de page observée dans les exécutions validées.

## Limites et suite

La carte et les lignes 3D historiques ne sont pas automatiquement superposées au HRA : les liens restent documentaires. Le protocole cardiaque générique, les pilotes nerveux complets et les autres ateliers distincts restent à qualifier séparément. La cause du délai intermittent de démarrage demeure inconnue. Aucune publication, mesure biologique ou précision individuelle n’est déduite de ces tests.
