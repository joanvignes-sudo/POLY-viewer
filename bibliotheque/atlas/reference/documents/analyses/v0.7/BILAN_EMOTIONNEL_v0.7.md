# POLY emotionnel v0.7 — contacts bruts validés localement, candidat toujours non retenu

4 octobre 2026. Travail hors socle public v0.22, conservé intact.

## Vérification indépendante du proxy de contact

Les transitions montantes des bits 8 et 2 du seul port 3 sont comparées aux lignes [archive locale] du journal ASC après transformation affine de l'horloge, sans événements des autres ports. Les neuf sessions qui passent le critère d'horloge atteignent le seuil fixé de 99 % dans les deux sens ; la fraction minimale est 99.509 %. Le journal ASC et les événements bruts soutiennent donc localement l'interprétation comme contacts candidats gauche/droite.

L'appariement temporel ne démontre pas la latence physique du capteur ni l'exhaustivité des mouvements. Les comptes ne sont pas nettoyés après lecture des résultats ; leurs rebonds et les rares différences journal/électronique restent documentés. Les appariements réciproques et les nombres de correspondances uniques sont conservés. Le fichier ZS060_Q25 est déjà vu et reste marqué comme développement.

Les contacts exportés ambigus sont conservés dans les fichiers d'origine et ne sont pas réécrits. Cette étape construit une variable distincte à partir du port 3, sur spécification fixée avant calcul. La pupille et la vidéo restent exclues.

## Test prédictif sous ce contrôle

| Session | PLUS sans choix admissibles | Perte intercept seul | Perte ML contacts+histoire | Perte MLN avec spikes | Gain ML−MLN |
|---|---:|---:|---:|---:|---:|
| ZS061_MEDIAN | 23 | 0.4135 | 0.6571 | 0.6883 | -0.0312 |
| ZS062_MEDIAN | 20 | 0.5144 | 0.7388 | 0.7579 | -0.0191 |
| ZS061_Q75 | 5 | 0.0419 | 0.0447 | 0.0573 | -0.0126 |

Le gain neuronal est négatif dans chacune des trois sessions estimables avec toutes les unités vérifiées selon le critère strict. Deux sont des sessions médianes de développement ; la troisième est une extension temporelle chez ZS061, avec un seul non-choix dans les essais de test. Il s'agit donc de trois sessions chez deux animaux, pas de trois confirmations indépendantes dans la population.

Le modèle à intercept seul fait mieux que les modèles de présence de choix plus complexes dans les trois sessions. C'est une limite de la famille prédictive retenue et de la rareté/non-stationnarité de la cible, pas une absence de rôle neurobiologique démontrée. Aucun ajustement de modèle n'a été sélectionné après ces résultats.

ZS061_Q25 fournit les modèles sans prédicteur neuronal seulement, conformément au critère strict de nombre de spikes. D'autres sessions n'ont pas les deux classes, échouent à un bloc temporel, à l'horloge ASC ou manquent de fichier neuronal. Ces exclusions figurent dans le résultat complet ; aucune session n'est remplacée. Le contraste contrôlé ne conclut ni sur l'émotion ni sur la conscience.

## Conséquence pour la méthode POLY

Inventaire : indices, choix, récompenses, événements de contacts candidats et spikes. Communications : correspondances temporelles électroniques et ASC validées localement ; latences physiques ouvertes. États : indice et réponse séparés. Perturbations de modèle : ajout de contacts puis ajout de spikes, en gardant les blocs d'apprentissage/test. Élimination : cette variante prédictive de spikes avant indice n'est pas retenue, même sous contrôle du proxy de contact. Couplage survivant candidat : passé de récompenses et choix gauche/droite dans les sessions admissibles, toujours observationnel. Hypothèses : ne pas confondre cette dépendance avec un état affectif, et rechercher des interventions dans des préparations séparées.

Le travail peut désormais revenir à la branche cœur–insula avec une règle claire : une intervention peut appuyer un effet local, tandis que le chemin de communication complet, les états affectifs vécus et les délais ne sont pas acquis par simple raccord entre expériences. La synthèse des chiffres publiés doit précéder toute demande de données primaires.

Spécification, comptes par essai, appariements, pertes par bloc et script propre sont archivés dans analyses/v0.7. Les sources et empreintes brutes sont celles de v0.4/v0.6. Aucune correction externe, demande aux auteurs ou publication n'a été envoyée.
