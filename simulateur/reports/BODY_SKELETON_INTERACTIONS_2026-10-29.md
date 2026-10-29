# POLY — Sélection et filtres du squelette distinct

29 octobre 2026. Le lecteur skeleton206 permet désormais de filtrer le catalogue par région source et concept osseux, sans téléchargement. Les 208 identités d’objet et les 206 concepts restent distincts. Les deux objets d’un concept ne sont ni fusionnés ni renommés. La présentation des résidents respecte les filtres courants ; un objet non résident reste explicitement à charger.

La sélection au toucher/clic utilise une véritable intersection des triangles d’affichage indexés. Elle restitue l’indice source et le triangle touché, actualise la fiche et conserve le cadrage. Un glissement au-delà de six pixels est une rotation et non une sélection. Le picking est limité aux surfaces présentées, exclut les objets non évalués masqués et ne crée aucune localisation individuelle.

Validation : test de tous les filtres réels, maintien des indices et absence de mutation de source ; suite Node complète 141 réussites, zéro échec. Nouvelle suite navigateur ordinateur/mobile : filtrage avant WebGL, sélection réelle de skeleton206/0 au triangle 1941 dans cette exécution, puis annulation réseau effective (ERR_ABORTED), conservation du précédent bloc et reprise explicite d’un autre bloc. La suite navigateur de base est aussi passée après modification. Les tests navigateur requièrent le serveur local configuré avec les blocs hors dépôt ; le workflow conserve le test unitaire catalogue/lecteur.

Le squelette complet à budget supérieur, le rapprochement avec les 80 surfaces DB et le pilote nerveux restent distincts et non déclarés portés. Les données source, évaluations, licences et transformations ne sont pas modifiées. La cause du délai intermittent de démarrage reste ouverte ; aucune mesure physique ou validation biologique ajoutée.
