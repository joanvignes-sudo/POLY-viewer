# POLY — courants synaptiques rapides, recherche v0.28

## Extraction vérifiée

Richardson et al. (2022) : données originales figure 3 téléchargées ; six moyennes recalculées concordent avec le classeur. Les groupes WT/Kv3.3KO contiennent 21 neurones chacun, contre 22 annoncés dans la légende ; Kv3.1KO contient 17. L'ANOVA du temps de montée diffère aussi : p=0,1918 dans le fichier, 0,1576 dans la légende. Ces écarts restent ouverts. La légende annonce 11/10/8 souris ; le fichier ne relie pas chaque neurone à une souris. Les SD descriptifs sont calculables ; aucun IC supposant les neurones indépendants n'est produit. [Source et fichier original](https://elifesciences.org/articles/75219/figures). Les valeurs détaillées sont dans MOYENNES_VERIFIEES.csv ; les 118 mesures extraites représentent 59 neurones mesurés sur deux grandeurs, pas 118 neurones indépendants. Âge annoncé P21–P25 ; température à vérifier.

## Définitions du socle confirmées

Hestrin et al. (1990) : la plage non-NMDA 4–8 ms est une constante de décroissance, limitée aux synapses CA1 proches du soma et jugées correctement contrôlées en tension. La montée NMDA 8–20 ms et la décroissance 60–150 ms sont deux autres grandeurs. Aucun milieu de plage n'est promu en moyenne expérimentale. [Résumé primaire](https://pubmed.ncbi.nlm.nih.gov/1972190/).

Sabatini et Regehr (1996) : la source éditeur confirme 150 µs entre le début du potentiel d'action présynaptique et le début de réponse, à température physiologique. L'entrée de calcium→fusion, environ 60 µs, est distincte. Q01 garde son intervalle global E08→E11 ; il n'est ni subdivisé ni moyenné avec une décroissance EPSC. L'incertitude et la cohorte du 150 µs restent à extraire. [Résumé éditeur](https://www.nature.com/articles/384170a0).

## Comparaison française à conserver séparément

Boudkkazi, Fronzaroli-Molinieres et Debanne (Marseille, 2011) : enregistrements à 34 °C ; latence du PA somatique→début EPSC, donc avec contribution de conduction. À amplitude EPSC comparable : 4-AP, L5→L5, 1,3 ± 0,3→3,1 ± 0,4 ms (n=6) ; TTX, 1,3 ± 0,1→0,8 ± 0,1 (n=12). Contrastes ponctuels +1,8 et −0,5 ms ; la covariance appariée n'est pas fournie ici, donc pas d'IC reconstruit. Nature des erreurs à confirmer. Ces perturbations ne sont pas des répétitions indépendantes du 150 µs cérébelleux. [Article primaire](https://doi.org/10.1113/jphysiol.2010.199653).

## Progrès et limites

Acquisition de données individuelles EPSC achevée pour cette étude ; comparaison conditionnelle et définitions de Q01/Q03 vérifiées. Aucune méta-analyse achevée. Réacidification : deux nouvelles tentatives API donnent HTTP 500 ; les unités indépendantes et erreurs Granseth restent ouvertes. Les données et provenance sont conservées sans modifier les originaux. Aucune écriture dans le site public. Les quatre axes restent ouverts et aucun rapprochement émotion/conscience n'est entrepris.

Suite autonome : vérifier température/protocole et version du fichier eLife pour les écarts 21/22 et p ; acquérir un second jeu de constantes EPSC compatible, retrouver identifiants animaux si disponibles ; compléter les erreurs de réacidification. Les cinq blocs restent un découpage du travail, pas un compte à rebours garanti : l'acquisition EPSC a avancé, celle des courbes de réacidification reste ouverte.
