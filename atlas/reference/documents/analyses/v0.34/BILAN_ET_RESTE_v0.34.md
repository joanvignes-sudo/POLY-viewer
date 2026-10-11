# POLY — clôture des vérifications accessibles v0.34

## Vérification terminée pour les nouvelles paires

Le texte intégral original de Hirai et al. confirme les conditions d'enregistrement : souris des deux sexes, âge électrophysiologique annoncé 6–7 semaines, 30–33 °C, acquisition 20 kHz et filtre 2,9 kHz. La résistance série de 8–20 MΩ n'est pas compensée ; un changement >20 % entraîne une exclusion. Le protocole de stimulation minimale utilise −20 à −30 mV, 100 essais espacés de 10 s, TTX/4-AP/D-AP5 et Ca2+ 1 mM. La préparation est aussi décrite 3–4 semaines après injection : aucune chronologie individuelle n'est fournie et les durées ne sont pas additionnées. [Texte intégral primaire, méthodes](https://cdn.elifesciences.org/articles/99711/elife-99711-v1.pdf).

Les conditions générales et celles de stimulation minimale sont séparées des valeurs individuelles de la figure 3 supplément 2. Le fichier ne donne ni identité animale ni sexe par cellule. Les deux groupes de cinq paires ne sont pas déclarés dix animaux indépendants. Les IC v0.33 restent conditionnels au modèle t et à l'indépendance entre différences.

## État réel du chantier

| Point | État | Ce qui permettrait de terminer |
|---|---|---|
| NHANES : réplication indépendante des six moyennes/SE/IC | Terminé v0.25 | Ne pas recommencer sans nouvelle raison |
| Hirai : valeurs appariées, moyennes/SEM/p et protocole | Terminé dans le périmètre public v0.33–34 | Identités animales nécessaires pour variance par animal |
| Richardson : données, calcul ANOVA et versions | Audit terminé ; divergence 21/22 et p non résolue | Explication des auteurs ou données documentant la sélection |
| Postlethwaite : températures et estimations séparées | Partiel | Données appariées, âge, type des erreurs et unités animales vérifiables |
| Réacidification : conditions et signaux distingués | Partiel | Même estimand, unités indépendantes et incertitudes pour plusieurs études |
| Moyenne interétudes des délais | Non justifiée | Au moins plusieurs estimations indépendantes compatibles, début/fin, protocole et incertitude vérifiés |
| Questionnaires internationaux | Ouvert | Tableau item par item : formulation/langue/période/population/échelle ; invariance non présumée |
| Respiration DR06/DR11 | Dépendances externes | Journaux, provenance, code/modèle et statut brut/corrigé des p demandés |
| LC, cœur–insula et interoception | Dépendances externes | Bruts, horloges et synchronisation ; exports seuls insuffisants |
| Calibration chimique humaine | Ouvert | Mesure validée et compartiment identifié ; atlas de récepteurs insuffisant |
| CASE/DENS et autres corpus prospectés | Ouvert | Acquisition/licence et protocole à vérifier avant analyse |

Cette passe termine la vérification des conditions publiquement accessibles des nouvelles paires. Elle ne termine pas les quatre axes initiaux. Les demandes déjà envoyées ne sont pas dupliquées. Les points dépendant des auteurs restent identifiés, sans transformer une absence de réponse en résultat biologique.

Faits : fichiers originaux et valeurs reproduites. Modèles : IC exploratoires avec hypothèses explicites. Controverses documentaires : divergence Richardson non expliquée. Hypothèses : aucune conception supplémentaire ni rapprochement émotion/conscience. Toutes les nouvelles analyses restent hors canon. Le socle public v0.22 n'a pas été modifié ; dernier contrôle des 20 empreintes conservé de v0.30.

La suite autonome pertinente porte sur les questionnaires et les corpus accessibles. L'automatisation existante reste active pour ces tâches ; aucune nouvelle automatisation créée.
