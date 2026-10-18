# POLY émotionnel v0.18 — audit du domaine et des archives

4 octobre 2026. Audit poursuivi sans nouvelle conception, sans assimilation émotion–conscience et sans réécriture des anciennes analyses. Les premières étapes restent ouvertes.

## DR13 : la sortie de domaine est expliquée dans notre reconstruction

Les neuf calendriers DR13 sont rejoués à l'identique pour la première simulation et sa sensibilité : mêmes paramètres, probabilités, graines et nombres d'agents. Les 18 résultats reproduisent exactement les comptes antérieurs : **68 occurrences agent×essai** dans la première passe et **896 dans la sensibilité**. Ces comptes dépendent du nombre d'agents et ne sont pas deux effectifs biologiques comparables.

Les sorties concernent Q gauche/droite ; aucune sortie d'epsilon n'est détectée dans ce replay. Les minima observés sont environ −0,07163 à gauche et −0,09442 à droite. Aucun état n'est borné, remplacé ni exclu pendant le diagnostic.

Le mécanisme numérique est précis. Après récompense zéro, notre équation donne :

`Q_suivant = Q_actuel × [1 − taux_négatif_mis_à_jour × (1 − epsilon_actuel)]`.

Lors de chacune des premières sorties, Q choisi était positif, epsilon dans [0 ; 1], et le coefficient effectif négatif dépassait 1. L'identité est vérifiée à moins de 10⁻¹². Par exemple, dans la première passe, une trajectoire de la session 2021-09-12 a Q≈1, epsilon≈0,04863 et un coefficient effectif≈1,03367 ; la mise à jour donne Q≈−0,03367. Il s'agit d'un dépassement du domaine prévu, pas seulement d'un arrondi autour de zéro.

Les paramètres initiaux bornés ne garantissent donc pas le domaine de tous les états dans notre reconstruction. Le taux négatif dynamique peut dépasser 1 ; l'atténuation par epsilon ne l'empêche pas toujours. Le diagnostic ne prouve pas que le code original utilise exactement ces conventions, ni que la publication est réfutée.

**Décision d'audit :** DR13 reste en quarantaine pour les interprétations de simulation. Aucun plafonnement tardif n'est ajouté pour sauver les résultats. Une variante bornée serait un autre modèle, à spécifier et valider séparément ; elle n'est pas introduite ici.

## Probabilités et événements : localisation exacte du manque

133 sessions, 43 890 CSplus. Les CSon des CSplus sont finis dans les 133 sessions et strictement croissants dans 132 ; la session DR11 `mDR11d20201212` échoue au contrôle d'ordre. Elle reste visible dans le diagnostic et ne doit pas servir à établir une latence physique sans clarification. Aucun nouveau type d'essai inconnu, aucune issue finie hors {0 ; 1}, aucun essai avec deux côtés à issue finie n'est détecté.

Dans la session d'apprentissage DR11 `mDR11d20201212`, **dix essais** ont les deux probabilités vides, soit vingt champs vides. Indices CSplus, base zéro : 8, 13, 53, 86, 118, 148, 164, 166, 308, 350. Neuf de ces essais ont une issue enregistrée ; un n'en a pas. Les manques ne forment donc pas simplement un préfixe à supprimer ou une série d'absences de choix.

Aucune probabilité n'est interpolée. Les analyses conditionnelles des choix/participation n'utilisent pas ces probabilités comme prédicteurs ; leur inclusion reste explicitement distincte du gate requis pour simuler des récompenses. Le manque de probabilités n'invalide pas automatiquement leurs issues enregistrées. Aucun autre champ de probabilité anormal n'est détecté dans ce périmètre.

### Nouvelle réserve sur les fenêtres nominales v0.17

La session DR11 a sept paires consécutives de CSplus dont CSon retourne en arrière, aux indices courants 21, 27, 139, 255, 259, 267 et 293 (base zéro). Les valeurs sont conservées exactement ; elles ne sont ni triées ni remplacées par une estimation.

Cette session concentre huit des neuf absences avec léchage nominal et huit des douze issues finies sans léchage nominal v0.17. Sa chronologie compromise limite donc l'interprétation de ces discordances. Les résultats v0.17 sont maintenus comme comptes sur les exports ; ils ne constituent pas une validation physique des fenêtres.

La prédiction sur l'ordre des lignes exportées n'est pas automatiquement annulée, mais la garantie que cet ordre représente des événements physiques correctement datés reste ouverte pour cette session. Le diagnostic ne justifie aucune exclusion tardive pour améliorer un modèle. Une vue séparée sans cette session peut aider à localiser le problème ; elle doit rester explicitement diagnostique.

## Conservation vérifiée de bout en bout

Les manifestes des analyses v0.13–v0.17 couvrent **106 fichiers**, tous vérifiés. Huit fichiers de données durables sont également vérifiés : deux archives S13/S18, le snapshot S24 et les cinq MAT humains. Total **114 fichiers conformes** à leurs SHA256.

Les **217 fichiers dans le ZIP du dépôt S24** correspondent individuellement aux SHA256 et identifiants Git blob du manifeste auteur. La provenance du snapshot et son contenu sont donc contrôlés, pas seulement le nom du ZIP. La licence auteur reste incluse dans le snapshot.

Les vingt fichiers suivis du socle v0.22 sont inchangés. Cette vérification porte sur les fichiers locaux suivis ; elle ne remplace pas un nouveau test complet du site public. Aucun déploiement ni changement de viewer dans cette passe.

L'intégrité locale est vérifiée. Une sauvegarde externe n'est pas vérifiée, et l'historique Git n'inclut pas les MAT/ZIP ignorés. Les données durables et leurs manifestes doivent rester ensemble pour une restauration complète.

## Comment lire les précisions entre bilans

| Constat antérieur | Précision disponible | Lecture actuelle |
|---|---|---|
| v0.14 : gain prédictif de méta-apprentissage sur certains choix | v0.14–v0.16 : témoins, état initial et départs d'estimation | Gain conditionnel circonscrit ; ni médiation neuronale ni émotion validée |
| v0.15 : signes stables entre 256 et 1 024 agents | v0.18 : sorties DR13 reproduites et expliquées | Stabilité Monte Carlo ne garantit pas domaine ni fidélité biologique |
| v0.16 : 670 absences avec léchage dans une fenêtre large | v0.17 : neuf dans la fenêtre nominale, autre dénominateur incluant les essais terminaux | Les léchages larges sont surtout tardifs ; ne pas confondre mouvement et réponse |
| v0.16 : mauvaise généralisation de participation chez DR06 | v0.17 : adaptation au passé beaucoup meilleure | Dérive de session soutenue, cause indéterminée |
| v0.14–v0.15 : IDs humains concordants | v0.15 : offsets/dérives ; calibration chimique non reproduite | Cohérence interne partielle, horloge physique ouverte |
| v0.10 : accès refusé à certains dépôts | v0.11 et v0.14 : archives ensuite récupérées et contrôlées | Anciennes erreurs d'accès conservées comme historique, statut courant dans la provenance durable |

Les bilans anciens sont des instantanés. Le point d'avancement et le présent index donnent l'état courant ; aucune observation ancienne n'est effacée pour rendre l'ensemble plus favorable.

## Gates avant une clôture des premières étapes

1. Domaine/conventions : obtenir le code original et ses règles de mise à jour avant une correction ou une comparaison mécaniste. Notre estimation hiérarchique originale reste non reproduite.
2. Événements : confirmer les ouvertures matérielles de réponse, mappings et journaux de session, notamment DR06/DR11. L'ordre numérique des événements ne valide pas une horloge physique.
3. Mesures : reconstruire la calibration humaine avec poids et données d'entraînement ; récupérer les bruts et mappings des autres dossiers. Aucune étiquette émotionnelle n'est attribuée aux signaux de tâche seuls.
4. Comparaisons : préserver les données réservées, les concurrents simples et l'unité animal/patient ; distinguer perturbations expérimentales et ablations de calcul.

Les sept demandes auteurs déjà envoyées ne sont pas dupliquées. Aucun nouveau message ni nouvel ajustement de modèle dans cette passe. Les résultats, spécifications, scripts et détails d'intégrité sont conservés dans `analyses_emotionnel_v0.18`.
