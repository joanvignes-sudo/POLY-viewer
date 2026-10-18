# Manquants POLY — reprise v0.76, hors canon

La demande de remplir les manquants a conduit à une collecte discriminante : le dépôt des auteurs de Dabney 2020, OSF UX5RG, contient données et code liés aux expériences Eshel. Trois archives ont été récupérées et leurs empreintes correspondent à celles du dépôt. L’archive dérivée de553 Mo n’a pas été téléchargée : les fichiers neuronaux et le code suffisent à l’audit ciblé réalisé ici.

## Pièces maintenant obtenues

- Code MATLAB et Python des analyses associées au dépôt. Cinq fichiers MATLAB pertinents sont conservés dans l’analyse, avec leurs lignes sources.
- Quarante fichiers « Light-ID dopamine » de l’archive nommée « Eshel et al2016 », chacun avec événements et spikes. Les 40 vecteurs de spikes sont distincts. Trente vecteurs exacts événements/types d’essais sont distincts ; ce nombre n’est ni un nombre de souris ni un décompte complet de sessions.
- Nombre de présentations par type dans chaque fichier. Quatorze fichiers ont au moins un type parmi1–14 comptant moins de cinq présentations. Le critère S10 est spécifique au type d’essai : cela ne désigne pas14 neurones à exclure globalement et ne résout pas les trois exclusions de l’étude originale.
- Règle de lissage explicitement lisible dans le chargeur exporté : noyau normalisé échantillonné jusqu’à2,5 fois la constante, appliqué à chaque spike puis seconde convolution centrée. Avec le jeu de paramètres1 ms/20 ms du script appelant, une impulsion synthétique donne un support non nul de −23 à +75 ms relativement à son origine. Deux calculs indépendants concordent à moins de 1e−14. C’est une propriété du code exporté, pas une latence neuronale ni une correction à appliquer aux67,6/95,4 ms.

## Jointures et horloges : ce que l’audit interdit de compléter artificiellement

Le chargeur prend le premier fragment du nom de fichier pour « animalNames ». Or les préfixes observés sont D : 16, L : 3, O : 3, 02 : 3, 03 : 6 et 10 : 9 fichiers ; les préfixes numériques sont compatibles avec des mois dans les noms, sans identifiant animal validé. Ni six souris ni un regroupement arbitraire02/03 ouL/O n’est adopté.

Les 40champs rewardOn ne contiennent aucune valeur finie ; d’autres événements et réponses sont également non renseignés. Un champ absent ou NaN dans un export ne prouve pas absence d’événement ou non-réponse. Le chargeur s’aligne sur odorOn. Le protocole décrit un décalage nominal pour les récompenses attendues, sans fournir ici une calibration physique de la délivrance de liquide.

Eshel 2016 indique qu’une partie des données a été analysée dans Eshel 2015. Cela documente une réutilisation, sans fournir une jointure certifiée des40 fichiers avec les 40neurones de S10. Dabney 2020 annonce six souris variable-magnitude dans la description du protocole, mais cinq dans son paragraphe analytique ; son décompte3/6/9/16/6 diffère des préfixes du chargeur. Ces niveaux sont conservés sans résolution inventée. Pas d’estimation indépendante présumée depuis une nouvelle publication des mêmes traces.

## État des manques

La disponibilité publique d’un export par neurone et d’un code associé est maintenant établie ; le trou « aucun fichier accessible » est partiellement levé pour P02. La règle originale de sélection du pic S10, l’identité des neurones, leurs souris, les trois exclusions et la référence physique demeurent non établies.

Les recherches ciblées P01/P03 n’ont pas identifié de dépôt exactement rattaché aux journaux demandés ; ceci n’est pas une preuve d’absence de dépôt. Les données S15 demeurent sur demande selon le complément déjà archivé. Aucune demande aux auteurs n’est dupliquée.

CSS : les recherches de sources distinctes ne fournissent pas de taux explicitement attribués aux deux vagues 2022 ni les poids/dictionnaires nécessaires à la route v0.72. Les articles présentant des proportions8–10 ou des moyennes conditionnelles ne remplacent pas la moyenne et la variance du même champ. Les notices/formulaires déjà conclus ne sont pas réanalysés.

## Séparation et conservation

Faits : existence et contenu du dépôt, déclarations des publications. Calculs : comptages d’exports/essais et impulsion synthétique. Modèles nouveaux : aucun. Points non résolus : identités, recouvrement exact, divergences de décompte et horloges. Hypothèses : aucune adoptée pour combler un identifiant ou une donnée absente.

Huit formulations admissibles inchangées, quatre axes ouverts ; canon et site public préservés. Aucune nouvelle conception biologique, publication, relance, souscription ou automatisation. La clôture préparatoire v0.75 reste historique ; cette reprise est motivée par les pièces nouvellement découvertes. Aucun nouveau délai biologique n’est annoncé.
