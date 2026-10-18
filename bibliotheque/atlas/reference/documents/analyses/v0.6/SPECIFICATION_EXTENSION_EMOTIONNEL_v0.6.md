# Extension v0.6 — sélection et contrôles de mouvement

Spécification fixée avant sélection des huit sessions supplémentaires et examen de leurs résultats. 4 octobre 2026.

Pour chacun des quatre animaux Hopkins de la liste des auteurs, garder les sessions behavior=1 et pass_ephys=1 triées par session_id. Choisir les rangs floor(0,25×(n−1)) et floor(0,75×(n−1)), indices à partir de zéro. Les quatre sessions médianes v0.3 sont conservées comme développement ; les huit supplémentaires constituent une extension temporelle chez les mêmes animaux, sans nouveaux animaux. Aucune substitution selon le résultat, la présence d'absences, ou les effets neuronaux. Catalogue DANDI instantané conservé ; fichier >8 Mo ou absent signalé sans remplacement.

Audit des horloges : mêmes critères v0.4 et mêmes fichiers bruts. Vérifier aussi trial_type exporté contre les étiquettes CS PLUS/MINUS du journal ASC. Ne pas reconstituer un contraste de réponses en mélangeant les indices.

Léchages : tester si chaque événement NWB de gauche/droite retrouve une transition montante du port 3 dans Events.nev, bit 8 pour gauche et bit 2 pour droite (correspondance candidate établie sur le fichier de développement). Seuil d'arrondi ≤0,51 ms pour chaque événement ; comparer les événements NWB aux bruts, sans exiger l'inverse car le nettoyage peut retirer des contacts. Conserver le taux d'appariement ; ne pas considérer les licks comme mesure de tous les mouvements. En cas d'échec ne pas utiliser ces covariables.

Pupille : inventorier timestamps, échantillons finis et unités. Consulter le code exact du packaging pour l'alignement et le traitement des faibles confiances. Ne pas introduire la pupille dans le modèle avant un contrôle indépendant de l'alignement vidéo et de la confiance. Un diamètre en pixels n'est pas directement une mesure d'affect ou de concentration noradrénergique.

Évaluer le pilote choix gauche/droite v0.4 avec types d'indices séparés sur chaque session auditée, protocole inchangé. Évaluer le contraste présence de choix après PLUS avec M0 histoire/temps et M1 histoire/temps+spikes avant l'indice comme v0.5. Ajouter une comparaison fixée ici : ML=M0+contacts de léchage gauche et droite dans [−2 s,0[ ; MLN=ML+spikes dans la même fenêtre. Interventions laser/automatiques et cinq antécédents exclus ; données simultanées par session, sans compter les unités comme animaux. Conditions de classes/effectifs et blocs v0.5 inchangées. Rapporter les gains de MLN sur ML, y compris négatifs et non estimables. Ce sont des prédictions observationnelles exploratoires, sans test causal ni attribution émotionnelle.

Mesures de contrôle ajoutées avant analyse : distribution des absences par bloc et benchmark à intercept seul appris sur le passé. Pas d'optimisation de pénalité ni adaptation au nombre d'absences. Regroupement descriptif par animal seulement ; répétitions temporelles ne sont pas indépendantes et ne constituent pas une validation populationnelle.
