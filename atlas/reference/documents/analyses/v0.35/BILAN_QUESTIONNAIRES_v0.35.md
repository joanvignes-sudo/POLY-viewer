# POLY — audit des questionnaires v0.35

Douze variables sont documentées dans le dictionnaire, avec objets reformulés en français, fenêtres temporelles, codes et rôle analytique. Les reformulations ne sont pas des traductions validées.

Le DPQ public concerne les adultes ; anglais/espagnol, sans interprète ni répondant proxy, questionnaire audio informatisé au centre mobile. Les neuf symptômes portent sur deux semaines, chacun coté 0–3. DPQ100 mesure un retentissement conditionnel et n’entre pas dans la somme. Le score à huit items utilisé en sensibilité retire le sommeil ; il ne doit pas recevoir les seuils validés du PHQ-9. Les modes d’administration ont changé par rapport aux anciens cycles. [Codebook officiel DPQ](https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/DPQ_L.htm).

Le SLQ concerne les 16 ans et plus, entretien à domicile/téléphone. SLD012/013 dérivent des heures habituelles déclarées, arrondies à une demi-heure. Les codes 2 et 14 représentent respectivement moins de 3 h et au moins 14 h : ce ne sont pas des durées exactes. Ils restent dans les catégories <7 et >9 utilisées précédemment, donc aucun recalcul des estimations n’est motivé par cet audit. La mesure peut omettre les siestes et ne porte pas sur la même fenêtre que DPQ. [Codebook officiel SLQ](https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/SLQ_L.htm).

## Conditions de comparaison

Le rapprochement DPQ–SLQ reste une association entre symptômes récents et horaire habituel autodéclaré, pas une mesure synchronisée d’affect et de sommeil physiologique. La sensibilité sans item sommeil limite un chevauchement de contenu ; elle ne supprime pas la fatigue, les facteurs de santé ou les biais de sélection. La réplication statistique v0.25 reste acquise, sans répétition.

Avant toute comparaison internationale, vérifier item, langue, période, population, mode, échelle et sélection. Une conversion des scores en 0–10 ne démontre pas leur équivalence. L’invariance entre langues/pays n’est pas établie par les codebooks. Le dictionnaire NHANES est terminé dans ce périmètre ; les autres questionnaires internationaux restent à auditer.

Faits : définitions et codes officiels. Modèle : association exploratoire déjà calculée. Hypothèses biologiques : aucune nouvelle. Analyses hors canon, quatre axes ouverts, baseline v0.22 non éditée et dernier contrôle des 20 empreintes v0.30 conservé.
