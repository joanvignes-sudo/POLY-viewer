# Emo-FilM — audit du jeu, des méthodes et du premier raccord temporel

État du 17 octobre 2026. Source : [Morgenroth et al., Scientific Data, 2025](https://www.nature.com/articles/s41597-025-04803-5). Texte intégral XML acquis, méthodes et validation technique examinées ; quatre tables supplémentaires extraites du classeur éditeur. Les chiffres d’article sont des résultats publiés ; les contrôles de fichiers sont nos observations locales, distinctes.

## Deux populations et trois types de mesure

Le volet annotations contient 44 annotateurs dans le fichier participants contrôlé. Le volet IRMf en contient 30, issus de 32 recrutements : deux exclusions initiales sont décrites, pour intolérance au scanner et artefacts dentaires. L’article précise que les deux groupes ne se recouvrent pas. Le tableau supplémentaire d’allocation identifie aussi des remplacements d’annotations. Cela interdit de traiter une courbe de consensus comme le témoignage simultané du sujet dont on regarde le cerveau.

Il faut distinguer : les annotations continues du premier groupe, les signaux IRMf/physiologiques du second, et les évaluations de validation recueillies hors scanner à partir d’extraits après la séance. Le fichier `beh/...events.tsv` du pilote est un tableau de clips et de réponses ; il ne constitue pas le journal des apparitions du film pendant l’IRM.

Les catégories nommées « expression » et « physiologie » dans les annotations sont des **rapports subjectifs**. `Smile` n’est pas une mesure faciale AU12 ; `Heartrate` n’est pas un ECG. Le signal PPG du volet IRMf est une mesure optique du pouls, pas une fréquence cardiaque déjà calculée. Les coordonnées cérébrales, les ressentis et les signaux périphériques demandent des traitements distincts.

## Ce qui a été retenu, ce qui a été écarté

La sélection publiée passe de 16 films et 55 items à 14 films et 50 items. Cinq items sont retirés pour accord insuffisant : Breathing, Consequences, Movement, EyesOpen et Jaw. Deux films sont également retirés. Le consensus final provient de trois ou quatre annotations par couple film/item. Le texte décrit encore des séries retirées pour segments constants, valeurs extrêmes et désaccord.

Conséquence pour POLY : la présence d’un signal respiratoire enregistré ne rétablit pas la fiabilité de l’annotation subjective `Breathing`. Cette dernière est absente du consensus acquis, ce que le contrôle local confirme. Le tableau supplémentaire 1 marque aussi `Heartrate` et `Warm` comme absents de la validation IRMf : on ne peut pas étendre la validation moyenne à chacun des items.

L’accord est calculé après des exclusions fondées en partie sur l’accord lui-même. Il renseigne la cohérence des séries retenues ; il ne constitue pas une vérité exhaustive sur les émotions et ne supprime pas la diversité des vécus. Pour une nouvelle analyse, publier les résultats avant/après sélection et maintenir les groupes séparés est plus informatif qu’un simple label « validé ».

## Dépôts figés et inventaire réel

Les instantanés consultés sont les miroirs des dépôts auteurs OpenNeuro :

| Volet | Version déclarée | Commit consulté | Licence déclarée |
|---|---|---|---|
| IRMf / physiologie ds004892 | 1.0.2 ; CHANGES du 13 août 2026 | cdf68fe448ad180a476fa2371473a1a6ed063774 | CC0 |
| Annotations ds004872 | 1.0.3 ; CHANGES du 5 avril 2024 | e9b1bf0b05975f7815f2924da16e3ff37111739e | CC0 |
| Code auteur | instantané Git | 8a358f820bb0782cbef2ea4bb9820f7fe1413325 | licence à réexaminer avant redistribution du code |

Sources : [dépôt IRMf](https://github.com/OpenNeuroDatasets/ds004892), [annotations](https://github.com/OpenNeuroDatasets/ds004872), [code auteur](https://github.com/EllieMo/Emo-FilM). Les versions de dépôt sont celles des métadonnées lues, sans prétendre qu’un commit de branche est automatiquement le tag de publication correspondant.

Les arbres Git sont complets selon leur champ `truncated=false`. On dénombre 450 paires physiologiques JSON/TSV et 14 fichiers de consensus. **450 chemins ne prouvent pas 30 acquisitions utilisables pour chacun des 14 films.** L’inventaire trouve notamment les variantes `ToClairefromSonny` / `ToClaireFromSonny`, `BetweenViewing` / `BetweenViewings`, ainsi qu’une tâche `Error`. Un sujet ne possède que 13 fichiers physiologiques, deux en possèdent 16. Les alias et fichiers manquants doivent être examinés, pas corrigés silencieusement par rapprochement approximatif.

Les petits objets `.tsv.gz` de 200 octets obtenus via GitHub sont des pointeurs Git-annex, pas des signaux compressés. Les deux vrais objets du pilote ont été acquis depuis le stockage public ; taille et SHA256 concordent avec les clés des pointeurs figés. Cet accord contrôle l’identité des objets, pas la qualité scientifique des enregistrements.

## Pilote réel, fixé avant acquisition des séries

La sélection déterministe est AfterTheRain, sujet sub-S01, session 2. Le plan est conservé dans PLAN_AVANT_PILOTE.md. Aucun effet, région ou pic n’a été recherché.

| Objet contrôlé | Observation locale |
|---|---|
| Consensus | 496 lignes × 50 items, 1 Hz, origine déclarée 0, dernier échantillon 495 |
| Physiologie | 713 500 lignes × 12 colonnes, 1 000 Hz déclarés |
| Valeurs non finies | Aucune dans ces deux matrices |
| Colonnes numériques constantes | Une entrée numérique digitale constante dans ce pilote, conservée |
| Libellés de colonnes | Huit colonnes portent le même nom Digital input : l’index est indispensable |
| Unités des signaux | Absentes du fichier descriptif contrôlé ; ne pas afficher automatiquement mV ou µS |
| Origine du fichier descriptif physiologique | StartTime = +9,002 |
| Première valeur de la colonne time | −9,002002 ; unité de cette colonne non explicitée |

Si l’on interprète la colonne `time` en secondes, son origine diffère de celle reconstruite à partir du JSON d’environ 18,004 secondes. Selon [BIDS 1.7.0](https://bids-specification.readthedocs.io/en/v1.7.0/04-modality-specific-files/06-physiological-and-other-continuous-recordings.html), StartTime se rapporte au début de l’acquisition neurale correspondante. **La jointure temporelle est donc suspendue.** Il peut s’agir de conventions ou d’une métadonnée à corriger ; les fichiers contrôlés seuls ne permettent pas de choisir. Aucun signe n’a été inversé, aucun délai n’a été compensé.

Un contrôle supplémentaire, décidé après ce constat, a retrouvé le journal de conversion de cette acquisition. Son empreinte concorde également avec Git-annex. Il indique 535 déclenchements et définit le temps zéro comme le premier déclenchement. Dans la colonne digitale d’index 11 (indexation depuis zéro), nous trouvons 535 fronts montants ; le premier est à 0 dans la colonne time, avec un intervalle médian de 1,3 s. C’est une forte cohérence interne pour un canal candidat scanner et pour le repère de cette colonne. Cela ne certifie ni la calibration physique ni le début exact du film ; le JSON positif reste conservé comme conflit à résoudre. Les valeurs et le diagnostic sont fournis dans input/pilot_trigger_diagnostic.json.

Le consensus couvre le film ; le signal physiologique couvre une acquisition plus longue, comprenant des périodes avant/après. L’existence de périodes de repos de 90 secondes dans la méthode ne justifie pas d’aligner les deux en retranchant automatiquement 90 secondes. Il reste à obtenir le journal de présentation exact, vérifier volumes initiaux et premiers échantillons stockés, puis confronter ces repères aux déclenchements désormais repérés.

## Lecture du code auteur, sans exécution de la chaîne complète

MakeMasterfile.py standardise les annotations par annotateur/item sur plusieurs films, sélectionne des séries et calcule leur moyenne ; un centrage supplémentaire intervient avant export. Le consensus n’est donc pas une note absolue 0–100. La fonction nommée lins_ccc renvoie par défaut une corrélation de Pearson : son nom ne suffit pas à conclure qu’un coefficient de concordance de Lin a été utilisé.

Les scripts ont aussi des conventions à vérifier avant réexécution : arguments de ligne de commande comparés à `True`, organisation locale `Annotstudy`, interpolation de valeurs manquantes et cas limites aux extrémités. L’examen statique n’établit pas que ces branches aient modifié les résultats publiés. Nous n’avons ni corrigé ni exécuté le code auteur, ni reproduit toutes les figures.

## Contrat proposé pour une scène POLY

Afficher d’abord deux panneaux identifiés par groupe : « annotations de personnes A » et « mesures chez une personne B ». Conserver des axes temporels séparés jusqu’à résolution du raccord. Montrer les signaux dans leurs unités déclarées, et l’unité non renseignée quand elle manque. Ne pas calculer de cœur→peur, de région→émotion ou de délai neuronal à partir d’une simple corrélation.

Le futur adaptateur doit refuser une jointure sans clé film/sujet/session, origine résolue, fréquence et index de canal. Les alias nécessitent une table explicite avec preuve ; le fichier `Error` reste exclu de toute sélection automatique. La scène peut déjà expliquer l’expérience et ses mesures. Une lecture multimodale synchronisée exige encore ces contrôles.

Prochaine étape circonscrite : retrouver les journaux exacts de la séance du pilote et documenter le canal de déclenchement. Une fois le raccord démontré, fixer une analyse descriptive de qualité avant de calculer quelque association émotionnelle. Les séries acquises sont désormais un domaine consulté, pas un jeu vierge de validation.
