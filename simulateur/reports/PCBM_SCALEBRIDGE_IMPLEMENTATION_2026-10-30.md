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
