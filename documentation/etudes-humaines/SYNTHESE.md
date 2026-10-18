# POLY — approfondissement des trois pistes humaines

17 octobre 2026. Ce supplément approfondit Emo-FilM, Hassanpour et Inman au-delà des résumés : textes primaires, suppléments disponibles, tableaux, scripts, inventaire de dépôts et petit pilote réel. Le lecteur et les livraisons antérieures ne sont pas modifiés.

## Les trois conclusions qui changent la suite

| Piste | Apport utilisable | Point qui empêche une conclusion trop forte | État pratique |
|---|---|---|---|
| Emo-FilM | Films, consensus subjectifs et enregistrements physiologiques/IRM documentés | Les annotateurs et sujets IRMf sont différents ; raccord temporel du pilote ambigu | Données pilotes acquises et contrôlées ; synchronisation suspendue |
| Hassanpour | Perturbation corporelle et contrastes insulaires selon les fenêtres | Sensation continue ≠ émotion mesurée en continu ; résultat d’émotion négative p=0,053 | Fiche documentaire qualifiée ; données individuelles non identifiées |
| Inman | Réponses corporelles et rapports subjectifs peuvent différer | Modèle principal limité à sept personnes ; deux cas émotionnels séparés ; ambiguïtés quantitatives | Fiche documentaire et exceptions qualifiées ; modèles non reproduits |

Ces constats n’établissent pas une théorie universelle des émotions. Ils rendent les scènes documentaires plus précises et fixent des conditions concrètes avant une nouvelle analyse.

## Lire les dossiers

- [01_EMO_FILM.md](01_EMO_FILM.md) : populations, exclusions, versions, code auteur, inventaire et contrôle réel de deux matrices.
- [02_HASSANPOUR.md](02_HASSANPOUR.md) : sensations, émotions, fenêtres, ASL, cartes et limites causales.
- [03_INMAN.md](03_INMAN.md) : dénominateurs, exclusions du modèle, cas S8/S9, résultats respiratoires et divergences quantitatives.

Les liens vers publications et dépôts primaires figurent dans chaque dossier. Les exemplaires complets des articles et suppléments sont conservés dans le dossier de travail, avec leurs empreintes dans PROVENANCE_SOURCES.json ; ils ne sont pas redistribués intégralement ici. Les deux objets numériques pilotes et métadonnées du jeu, déclaré CC0, sont fournis dans input/.

## Ce qui a réellement été exécuté

Textes intégraux primaires acquis pour les trois pistes ; lecture ciblée des méthodes, résultats, limites et tables. Pour Hassanpour, quatre suppléments documentaires acquis et extraits ; pour Emo-FilM, les quatre tables du classeur extraites et les fichiers de code pertinents inspectés. Les illustrations TIFF et la vidéo du patient Inman n’ont pas été examinées : aucune conclusion visuelle nouvelle n’en est tirée.

Deux arbres Git de données ont été consultés sans troncature annoncée. Leurs commits sont figés et les métadonnées de version contrôlées. Le comptage local des participants est 44 et 30. Le comptage des chemins n’a pas été confondu avec la complétude : variantes de noms, fichier Error et distributions différentes par sujet sont consignés dans INVENTAIRE_RUNS.json.

Le pilote a acquis un consensus de 496 × 50 valeurs et une série physiologique de 713 500 × 12 valeurs. Les tailles et SHA256 correspondent aux clés Git-annex. Huit tests de convention ont précédé le chargement des séries : origine, dernier échantillon, fréquence invalide, origine manquante, index négatif/hors limite, cas constant et valeur manquante. Ces contrôles vérifient le programme et les formats, pas un mécanisme émotionnel.

Le contrôle a conservé une origine physiologique JSON positive et une première valeur de temps négative. Si elles sont exprimées dans le même repère en secondes, leur écart est d’environ 18,004 s. Une investigation structurelle complémentaire a retrouvé le journal de conversion et un canal candidat scanner : 535 fronts, premier à zéro sur la colonne time, intervalle médian 1,3 s. Cela clarifie le repère de cette colonne par cohérence interne ; la métadonnée et le début exact du film restent à réconcilier. Aucune correction automatique ni synchronisation multimodale n’est faite.

## Réserves nouvelles par rapport au premier catalogue

La première recherche indiquait des pistes à qualifier. Ce supplément remplace toute lecture trop générale de ces fiches par les précisions suivantes, sans écraser le catalogue historique :

1. Emo-FilM comprend des retraits d’items et une validation partielle ; la respiration ressentie n’appartient pas au consensus retenu. Les noms de colonnes « physiologie » sont souvent des rapports subjectifs, distincts des capteurs.
2. Hassanpour apporte des données d’interoception ; il ne démontre pas une induction significative de peur dans cet échantillon sain. Les fenêtres ASL ne fournissent pas de délais de propagation.
3. Inman : neuf personnes étudiées, sept dans le modèle principal, deux personnes avec réponse émotionnelle à traiter séparément. La dissociation corporelle/subjective reste intéressante mais le biais de sélection et les différences de sensibilité de mesure doivent être visibles.
4. Aucun des trois articles ne ferme d’un seul tenant le trajet afférent P01 cœur→NTS→insula. Une scène humaine peut être ajoutée à côté de P01 ; aucune continuité biologique interespèces n’est déduite.

## Suite préparée, sans publier ni contacter qui que ce soit

**Emo-FilM :** confronter le canal candidat scanner et le journal de conversion au JSON, au journal exact de présentation et aux éventuels volumes initiaux. Examiner ensuite les noms de tâches et l’intégrité sujet/film. Un contrôle de qualité du signal pourra être planifié après cette résolution ; aucune corrélation émotionnelle n’est calculée ici.

**Hassanpour :** l’intégration documentaire peut conserver intervention périphérique, mesures, sensation continue, contraste ASL et rapport après scan comme objets séparés. Toute reproduction quantitative demande un jeu individuel, dénominateurs, exclusions, horaires et scripts ; les suppléments seuls ne les remplacent pas.

**Inman :** préparer un groupe principal et des cas exceptionnels séparés. Avant de réutiliser une pente ou une amplitude : résoudre échelle EDA, divergence p texte/table, construction des contrastes et prétraitement respiratoire. Les questions techniques nécessaires sont consignées dans QUESTIONS_NON_ENVOYEES.md, sans message externe.

## Opérations classées

**Exécutées et contrôlées :** recherche primaire, acquisitions sourcées, extractions documentaires, audit des dénominateurs, inspection statique des scripts auteur, inventaire, pilote de structure, empreintes, script local de vérification et conservation des étapes précédentes.

**Écartées :** nouvel essai humain, vidéo de patient, volumes IRM massifs, exécution des scripts de stimulation, transformation de maxima publiés en courbes, fusion de cohortes, moyenne interétudes, correction silencieuse de temps, projection anatomique nouvelle, modification du lecteur, contacts, push, publication et automatisation.

**En attente d’un élément nommé :** synchronisation Emo-FilM (déclenchements et journal exacts), réanalyse Hassanpour (jeu individuel/scripts), reproduction Inman (essais/scripts et ambiguïtés de transformation). Les recherches ciblées de corrections ne constituent pas un audit éditorial exhaustif.

La reproductibilité des contrôles de format est distincte de la robustesse des traitements auteurs et de la validation scientifique : seule la première a fait l’objet d’une exécution locale dans ce supplément.
