# Inman — dissociation corporelle / rapport subjectif, avec sélection du modèle

Source : [Inman et al., en ligne 2018, volume 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC6139084/). Manuscrit intégral HTML acquis ; méthodes, résultats, table 2 et limites examinés. L’échec de l’acquisition XML Europe PMC a été suivi d’une lecture réussie de la version primaire PMC. Le supplément vidéo n’a pas été téléchargé ; aucune vidéo de patient n’est redistribuée.

## Le dénominateur change selon la question

Neuf patients épileptiques ont participé. S9 est écarté de l’analyse autonome en raison d’enregistrements insuffisants. S8, qui possède des données autonomes et rapporte de la peur, est traité séparément à cause de son profil de réponse différent. Le modèle principal porte donc sur **sept patients**, tandis que les descriptions subjectives concernent les neuf. L’absence de réponse émotionnelle dans le groupe principal dépend aussi de cette sélection : elle ne doit pas être présentée comme une estimation non conditionnelle dans l’ensemble de la cohorte.

Les comptes publiés du jeu de modélisation sont 150 stimulations amygdaliennes, 91 stimulations témoins temporales et 72 essais simulés. Les essais répétés ne sont pas des personnes indépendantes ; les nombres effectivement inclus peuvent encore dépendre de l’issue et des stimulations bilatérales écartées. La table du modèle respiratoire ne donne pas à elle seule un dénominateur de personnes certain. L’export individuel par mesure reste nécessaire.

Les patients avaient des électrodes posées pour l’investigation clinique. L’implantation et les traitements ne sont pas distribués aléatoirement comme dans une population générale. Les coordonnées de contacts étaient estimées par recalage de plusieurs images et atlas ; elles ne permettent pas de désigner avec certitude les neurones ou fibres ayant répondu.

## Contrôle expérimental et aveugle

Les essais simulés sont intercalés de façon imprévisible et le patient ignore la condition. Les doses de stimulation augmentent cependant par paliers dans des blocs, et l’investigateur connaît la condition. Il s’agit d’un aveugle du participant, pas d’un double aveugle ni d’une randomisation complète de l’amplitude. L’ordre, les attentes et l’habituation restent des facteurs à vérifier dans les données d’essais.

Les paramètres de fréquence n’ont pas été maintenus identiquement dans toute la cohorte : le protocole a évolué après une première comparaison. L’absence de différence significative entre deux fréquences n’en établit pas l’équivalence. Les impulsions sont contrôlées en tension ; l’impédance n’est pas mesurée pour chaque contact. Une courbe dose–réponse ne devient donc pas une calibration universelle en courant ou en volume de tissu activé.

## Des mesures corporelles, puis un compte rendu

Les signaux électrodermal, ECG et respiratoire sont enregistrés pendant la stimulation. Le rapport subjectif est demandé après chaque essai, y compris simulé. Ce compte rendu porte sur l’expérience de l’essai ; il n’en donne pas l’instant d’apparition. Les mots « ne rapporte pas » doivent être conservés : un questionnaire peut manquer une émotion subtile ou transitoire, limite reconnue par les auteurs.

La réponse électrodermale est définie par une variation creux–pic, avec transformation logarithmique décrite. Les fréquences cardiaque et respiratoire sont résumées relativement à une référence avant stimulation. Les moyennes sur des fenêtres et les maxima ne sont pas des latences neuronales. L’apparition visuelle annoncée dans les premières secondes n’est pas une distribution de latences calibrées.

Le prétraitement comporte sélection de la main de meilleure qualité, interpolation d’artefacts et traitement spécifique du signal respiratoire. Une absence d’effet doit être évaluée avec ce traitement et sa sensibilité, pas seulement par un tracé jugé plat.

## Résultats et exceptions

Le modèle principal décrit une augmentation électrodermale et un ralentissement cardiaque liés à la stimulation amygdalienne. Sept personnes ne rapportent pas d’émotion subjective. Deux autres en rapportent ; chez S8, la peur s’accompagne notamment d’un **accroissement** cardiaque, contrairement à la tendance du groupe principal. Le cas doit rester visible plutôt que devenir une donnée exclue sans explication.

La variable respiratoire n’est pas simplement « inchangée ». La table rapporte un terme de tension significatif, mais pas de contraste régional amygdale contre témoins clairement significatif au seuil usuel. La discussion n’observe pas d’apnée dans les conditions examinées. Ni « tout effet respiratoire est absent », ni « l’amygdale est le centre de l’apnée » n’est une synthèse fidèle.

Le détail de S8 mentionne aussi l’arrêt d’une exploration gauche lors d’après-décharges à des paramètres plus élevés. L’énoncé rassurant concernant les essais **inclus** ne permet pas d’affirmer qu’aucune après-décharge n’a été rencontrée durant toute l’exploration. Ce travail ne doit pas devenir une démonstration générale d’innocuité.

## Quatre points quantitatifs à clarifier avant réutilisation

1. Le texte EDA et la table 2 n’impriment pas la même valeur p pour le terme de tension : 0,002 dans le paragraphe, 0,0004 dans la table. Nous conservons les deux avec leur localisation ; nous ne choisissons pas celle qui favorise le résultat.
2. Le coefficient EDA tabulé est sur une échelle transformée. Un effet logarithmique ne peut pas être converti en augmentation additive fixe en microsiemens sans modèle et retransformation explicites. La formulation additive du texte ne sera pas utilisée pour animer une amplitude dans POLY.
3. La méthode évoque logarithme et standardisation individuelle, tandis que l’exposé du modèle insiste sur le logarithme. L’ordre exact et la variable effectivement ajustée doivent être vérifiés dans le code et les exports.
4. Le filtrage respiratoire décrit une bande 0,5–1 Hz. Il faut vérifier les unités, le filtre réellement appliqué et son effet sur les fréquences respiratoires ; le texte seul ne permet pas de conclure que les signaux sont erronés ni que l’absence d’apnée serait un artefact.

Ces constats sont une **lecture critique après observation**, pas une analyse confirmatoire et pas une correction publiée. Les contradictions doivent être comparées à la version éditeur et à un éventuel historique de corrections avant d’attribuer une erreur définitive. Les recherches ciblées de corrigendum n’ont pas permis d’établir une résolution ; elles ne prouvent pas qu’aucune correction n’existe.

## Ce que l’expérience autorise à dire

Formulation prudente : « Dans cette petite série clinique et sous ces conditions de stimulation, des réponses autonomes peuvent être observées sans émotion déclarée après l’essai. Deux patients présentent des réponses subjectives, traitées séparément du modèle principal. »

La stimulation constitue une intervention susceptible d’étayer un effet causal local sous les conditions testées ; elle n’identifie pas l’intégralité du chemin amygdale→corps et ne démontre pas la nécessité de l’amygdale pour toutes les émotions. La comparaison témoin temporel améliore l’interprétation régionale ; sa non-significativité ne prouve pas son équivalence absolue au simulé. Les modèles mixtes gèrent une partie de la répétition mais sept personnes ne deviennent pas plusieurs centaines de réplications.

## Scène POLY et éléments manquants

Préparer deux parcours explicitement reliés par une comparaison : groupe principal de sept patients et cas S8/S9. Dans chacun : contexte clinique, site de stimulation, mesure périphérique, puis rapport après essai. Aucune flèche « amygdale → peur » universelle ; aucune trajectoire de propagation vers le cœur inventée. Le détail respiratoire et les divergences texte/table apparaissent dans les limites.

Il manque pour reproduire les modèles : tableau des essais par patient/site/paramètre, exclusions exactes par capteur, annotations d’artefacts, unités des variables transformées, scripts SAS et contrastes, séries physiologiques alignées et données de localisation exploitables. Aucun paquet brut/code correspondant n’a été identifié dans les pièces contrôlées. Les renvois à des tables supplémentaires de compte d’essais ne sont pas résolus par les pièces jointes accessibles du manuscrit inspecté ; la table 2 accessible est une table de coefficients. Ces lacunes sont nommées, sans nouvelle demande externe.
