# POLY — réacidification, recherche v0.26

## Résultat

Une moyenne commune des durées n'est pas justifiée. La température, la stimulation, le capteur et la grandeur ajustée changent. Sept conditions originales sont extraites automatiquement, sans compter deux fois 200 AP à 20 Hz. Les 20 empreintes du socle public v0.22 sont identiques.

## Mesures et contrastes

**Röther et al. 2014**, cultures hippocampiques de rat, température ambiante non chiffrée, synapto-pHluorin et alternance pH 7,5/5,5 : les tableaux 1–2 donnent τ ± SEM et n. À 20 Hz : 50 AP 23,32 ± 2,56 s (6), 100 AP 13,19 ± 1,84 (6), 200 AP 10,81 ± 1,12 (11), 400 AP 9,31 ± 0,51 (5). Pour 200 AP : 10 Hz 8,98 ± 2,03 (5), 40 Hz 12,28 ± 1,83 (5), 80 Hz 17,91 ± 3,04 (5). Les contrastes ponctuels sont −14,01 s entre 50 et 400 AP et +8,93 s entre 10 et 80 Hz. Ne pas traiter les boutons comme des expériences indépendantes ni inventer la covariance entre conditions. Source : [article et tableaux originaux](https://doi.org/10.1371/journal.pone.0102723).

**Granseth et Lagnado 2008** : sypHy, piégeage acide après 80 AP à 40 Hz, τ 5,65 ± 0,66 s à 25 °C (n=91) contre 1,03 ± 0,34 à 35 °C (n=56). Rapport des constantes 5,4854 et différence −4,62 s, descriptifs ; le Q10 de vitesse est environ 5,5. Le type précis d'erreur et les unités indépendantes doivent être reconfirmés dans les méthodes avant pondération. Source : [article primaire](https://pmc.ncbi.nlm.nih.gov/articles/PMC2655433/).

**Atluri et Ryan 2006** : le piégeage acide rapporte généralement 4–5 s. Cette plage n'est pas une moyenne à transformer arbitrairement en 4,5 s. Source : [notice primaire](https://pubmed.ncbi.nlm.nih.gov/16495458/).

**Balaji et al. 2008** : environ 2,3 s à 36 °C, données non montrées ; aucune variance ou taille de cohorte utilisable ici. Valeur contextuelle, exclue d'une pondération. Source : [article primaire](https://pmc.ncbi.nlm.nih.gov/articles/PMC2671224/).

**Egashira, Takase et Takamori 2015**, cultures hippocampiques de souris : mOrange2 permet d'estimer le pH luminal dans une plage plus acide ; τ est environ 15 s. La décroissance de fluorescence pHluorin et celle du pH ne sont pas des grandeurs interchangeables. Le chargement du glutamate, également proche de 15 s dans une autre étude, reste une opération distincte. Source : [article primaire japonais](https://doi.org/10.1523/JNEUROSCI.4160-14.2015).

## Intégration dans la méthode POLY

Inventaire : capteurs, pompe V-ATPase, buffers, populations vésiculaires, préparations. Communications : endocytose, entrée de protons, gradient, transport du neurotransmetteur restent séparés. États : surface, intérieur alcalin, intérieur acidifié. Perturbations : température, fréquence/nombre de stimulations, capteur et alternance externe de pH. Élimination : exclure valeurs empruntées, constantes fixées et décroissances composites de l'ensemble des répétitions indépendantes. Couplages survivants : dépendances quantitatives conditionnelles à tester. Hypothèses : sensibilité instrumentale et interaction protocole/kinétique peuvent expliquer une partie des écarts ; aucune explication unique démontrée.

## Limites et suite

L'API de texte intégral Europe PMC a renvoyé HTTP 500 pour quatre articles ; ces échecs sont conservés. Le XML éditeur PLOS a été acquis et contrôlé. Les autres résultats proviennent des pages primaires indexées, avec réserves explicites. Pas de nouvelle conception, pas de conclusion sur la conscience, pas de méta-analyse achevée. Prochaine passe : vérifier les unités indépendantes et erreurs de Granseth, récupérer les courbes/calibrations Egashira, puis auditer séparément les courants synaptiques rapides.
