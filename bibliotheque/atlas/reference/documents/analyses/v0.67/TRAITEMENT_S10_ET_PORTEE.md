# S10 — paramètres du filtre et portée des pics, v0.67

Calcul mathématique POLY, séparé des résultats animaux. Le noyau publié est (1−exp(−t)) exp(−t/20), t en ms. Sous la convention explicite de support causal positif, son mode est ln(21)=3.044522ms et son centroïde20+20/21=20.952381ms. Les calculs analytiques sont recoupés par grille0,01ms jusqu’à600ms ; à pas entier1ms, le maximum discret se situe à3ms. Ces décimales décrivent une fonction, pas une précision de mesure biologique.

Le paramètre20ms, le mode et le centroïde sont trois objets différents. Le pic d’une convolution dépend de la forme complète du signal, des bins, de la troncature et des bords. Aucun de ces nombres n’est appliqué comme correction fixe aux 67,6/95,4 ms publiés, ni à Bakhurin. Le support exact, normalisation, horodatage des bins et algorithme de recherche du pic utilisé restent non reconstruits.

Le même passage primaire impose au moins cinq présentations du type d’essai pour inclure un neurone dans l’analyse de ce type. C’est une règle de sélection par condition, qui ne permet pas à elle seule d’affecter les trois cellules non conservées de la table43→40 ni de reconstruire toutes les populations par figure. Les fenêtres de comptage 300–1000 ms explorées par les auteurs concernent la réponse intégrée, pas une estimation indépendante de latence au pic.

[Source primaire S10](https://pmc.ncbi.nlm.nih.gov/articles/PMC4567485/), méthodes Data analysis, passage archivé et empreinte joints. Pas de nouvelle analyse biologique ni d’ANOVA répétée.
