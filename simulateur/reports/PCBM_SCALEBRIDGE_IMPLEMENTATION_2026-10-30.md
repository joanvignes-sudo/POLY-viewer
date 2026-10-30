# PCBM — Implémentation du premier moteur de transition

Date : 30 octobre 2026. Branche expérimentale non fusionnée ; site public inchangé.

## Fonctionnement livré
- Contrat PCBM indépendant de Three.js : neuf représentations, huit passages qualifiés et huit sources documentaires.
- Classification stricte : spatial, structurel, documentaire. Aucun lien spatial fictif inscrit.
- Recherche d'itinéraires orientés sans création de relations implicites.
- Affichage mobile et ordinateur, sources, repères, échelles indicatives, données non montées, export du reçu documentaire.
- Gestion des erreurs qui refuse tout registre incompatible, doublon, repère invalidé ou saut spatial injustifié.
- Le laboratoire est accessible par /simulateur/web/pcbm-lab.html dans une version de travail servie localement. Il n'est pas relié au menu public.

## Vérités et limites à conserver
1. Corps HRA : catalogue 918 structures, coordonnées d'affichage. Le mode léger affiche des repères et boîtes, pas la géométrie réelle.
2. CerebrA : 17 surfaces cérébrales, coordonnées MNI152NLin2009cSym en mm. Le rendu sur le corps HRA est graphique, non individuellement recalé.
3. Vague SPARC f002 : la progression SSV est normalisée, sans unité. Le dossier source local n'est pas monté dans ce laboratoire ni assimilé à des millimètres.
4. MicroCT : le spécimen de l'étude consultée ne doit pas être automatiquement considéré identique à SPARC f002.
5. Fascicules : fusion et divergence ne permettent pas de prouver le trajet d'axones humains individuels.
6. Molécules : le réseau métabolique possède des positions abstraites, issues de contextes expérimentaux distincts. Aucun chemin synapse-vague-lactate individualisé n'est établi.
7. Les grandeurs 10^n m affichées par l'interface sont des ordres de grandeur pédagogiques et non des données mesurées.
8. Les liens structurels disent seulement qu'un objet anatomique appartient conceptuellement à un ensemble. Ils ne créent aucune continuité spatiale.
9. Les liens documentaires sont des transitions de lecture et ne constituent ni mesure de temps biologique ni simulation physiologique.
10. Les fichiers d'un atlas, licence ou manifeste non intégrés restent signalés comme non montés.

## Contrats
- Une transition spatiale exige : représentation source et destination partageant un spécimen identifié, transformation 4x4 mesurée, repères source/destination correspondants, méthode, erreur bornée, unité d'erreur, preuves et statut de validation indépendante.
- Une transition structurelle exige une relation d'inclusion documentée, sans matrice ni zoom métrique imposé.
- Une transition documentaire conserve ses limites, mentionne l'absence de recalage et laisse la cible indisponible lorsqu'elle n'est pas montée.
- Les identifiants scientifiques et les sources historiques ne sont pas écrasés par PCBM.

## Tests
- Node : typage, provenance, cohérence des repères, sécurité des liens, déduplication, planification, historique, reçu, interdiction des faux recalages et faux délais.
- Playwright : parcours ordinateur et mobile émulé, source indisponible affichée, absence de débordement, état initial, refus d'un registre corrompu.
- GitHub Actions : workflow PCBM séparé. L'intégration générale du corps et les performances du Samsung A14 réel ne sont pas couvertes par ces tests.

## Prochaines validations avant intégration publique
- Revoir les relations de la couche vagale avec données primaires, versions, licences, représentations bilatérales et distances validées.
- Qualifier et comparer les transformations d'atlas par repères homologues et erreur mesurée ; conserver les échecs.
- Préparer un adaptateur en lecture seule pour la base SQLite multi-échelles existante, sans la promouvoir comme canon.
- Raccorder à l'interface principale seulement après validation, avec tests complets et revue des licences.
- Profiler réseau, GPU, CPU, mémoire et température sur téléphone physique, avec échantillonnage reproductible.

## Complément de vérification primaire
La version candidate référence explicitement la documentation officielle SPARC SSV, l'étude humaine microCT et histologie de Thompson et coll. (PMID 41788551, DOI 10.3389/fnins.2026.1731234), et l'étude de distances de branches indexée PubMed PMID 42595102. Ces travaux restent des références distinctes : ils ne valident pas le passage spatial entre SPARC f002 et les autres spécimens. Les licences de réutilisation des actifs bruts restent à contrôler.

## Version 0.2 — Passage entre échelles et couverture de la connaissance

- Audit numérique sans données inventées : `pcbm-registration.mjs` valide le format des matrices affines 4×4, l'absence de singularité et les repères millimétriques ; il exige une série de repères de validation réservés, non coplanaires et distincts du jeu d'ajustement par leur empreinte SHA-256. Il vérifie l'erreur RMS, l'écart maximal et la borne d'erreur déclarée. Une attestation de revue humaine est obligatoire pour qu'un nouveau lien spatial puisse passer la validation de schéma.
- La composition de transformations auditées calcule une borne d'erreur conservative sur la norme infinie. Une concordance mathématique, même exacte, n'est **pas** une preuve de validité anatomique ; le logiciel ne garantit ni authenticité ni indépendance réelles des données fournies. Les exemples unitaires sont entièrement synthétiques, hors registre utilisateur.
- L'export de parcours refuse une suite d'étapes dont les liens ne correspondent pas exactement au registre validé.
- `pcbm-coverage.mjs` consulte en lecture seule le fichier canonique `simulateur/data/inventaire-multiechelle.json` (état inspecté : 16 familles, 100 sujets). Toutes les entrées sont des candidats documentaires sans preuves directement rattachées, sans paramètres calculables et sans recalage. Elles ne sont pas converties en nœuds causaux ou géométries 3D.
- L'interface PCBM ajoute une exploration filtrable par famille et par recherche ; les critères manquants sont consultables à la demande. Le chargement est volontaire, limité en taille, et peut échouer sans interrompre le parcours principal. Le navigateur limite le DOM aux trente premières entrées après filtrage.
- Vérification CI du commit `9624d521804a2596ee244a0ba535c8f2b0d6d138` : 24 tests Node réussis, suite Playwright bureau et tactile émulé réussie, y compris consultation des 100 sujets et refus d'un registre PCBM corrompu. Exécution : https://github.com/joanvignes-sudo/POLY-viewer/actions/runs/41042294086.

**Toujours en dehors du périmètre validé** : recalage des atlas de spécimens différents, acquisition/alignement du microCT vers SPARC f002, validation indépendante de données anatomiques, intégration de mesures moléculaires à l'individu, suivi temporel physiologique, performances sur Samsung A14 physique. Le site public reste inchangé ; cette PR demeure brouillon.


## PCBM v0.6 — Lacunes C1 droit et coordonnées SSV

La collecte horaire existante a livré un rapport C1R (`POLY_VAGUE_RUN10_C1R_CROSSWALK_20261030.json`) encore absent du dépôt. PCBM conserve en zone non validée : dimensions primaire 806×1256×4042 ; dérivé 403×628×2021, 18 µm déclarés ; 55 points dans les limites, 54 centres non nuls, 55 voisinages non nuls ; 824 contours XML, 103 995 points, 42 des 54 repères évaluables dans un contour candidat. Ces chiffres sont **transcrits du résultat d'automatisation** et non revérifiés sur les volumes bruts dans PCBM. Aucune transformation spatiale XML→LPS ni C1R→SSV n'est déclarée validée.

Sous l'hypothèse **non établie** d'un origine XML nulle et de coupes espacées de 9 unités, 2021 coupes couvriraient 18 180 unités, alors qu'une coordonnée −32 436 est mentionnée (rapport d'amplitude 1,784). Cela requiert de vérifier l'origine, l'axe, l'unité et les conventions avant de recaler. Le diagnostic PCBM n'attribue pas d'origine ou de transformation par défaut.

L'import SSV v0.5 lit uniquement un petit JSON local de repères f002 gauche/droit sur l'axe normalisé 0–1, sans téléversement, sans conversion en mm ni intégration de faux points biologiques. Le modèle `pcbm-ssv-template.json` reste volontairement vide. Les contrôles sont testés sur données **synthétiques**. Un manifeste f002 réel nécessite l'extraction contrôlée des fichiers du run et de leurs SHA256 avant revue.
