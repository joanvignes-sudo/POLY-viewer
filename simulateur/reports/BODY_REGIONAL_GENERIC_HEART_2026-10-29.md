# POLY — Contexte cardiaque générique régional

29 octobre 2026. Consultation locale de la référence HRA existante ; aucune observation nouvelle importée.

## Portée

L’étape `HASSANPOUR / HASS-BODY` conserve sa région source inconnue (`null`). Un encart distinct propose le contexte générique déjà qualifié dans `protocol-heart-reference.json`. Sa relation reste une curation de POLY, pas une localisation du participant ni de son capteur. Le contrat, la source primaire, le terme UBERON et les licences restent accessibles dans leur page existante.

L’ouverture vérifie l’empreinte du texte avec normalisation des seules fins de ligne Git, le contrat existant et les 14 triplets exacts nœud/nom/chemin dans les métadonnées HRA. Les 14 surfaces doivent déjà être chargées. Aucun téléchargement de bloc ni nouvelle géométrie n’est déclenché. Une référence incomplète provoque un refus explicite.

Le lecteur propose isolation des 14 surfaces, corps et contexte, puis retour au cadrage et à la sélection précédents. Le cadrage utilise l’union des limites source des 14 surfaces. Le mode contexte conserve les seules surfaces déjà en mémoire, sans prétendre afficher le corps complet ni atténuer tous les occultants. La session documentaire historique assure l’identité de l’étape et sa progression ; la lecture est mise en pause lors de l’ouverture.

Un changement d’étape, la perte d’un résident, la perte de contexte WebGL, le masquage ou la sortie ferment la référence et libèrent son état. Aucune reprise automatique. Les commandes de cadrage/export documentaire normal restent exclues pendant cette vue spécialisée. Les contrôles classiques n’ont pas été remplacés.

## Vérification

- 135 tests Node réussis, dont résolution des 14 identités, refus de résidents manquants et de champs scientifiques altérés, empreinte LF/CRLF et refus d’altération du contrat.
- Nouvelle suite navigateur réussie sur ordinateur et émulation mobile : absence de chargement automatique, refus des absents, ouverture exacte sans géométrie supplémentaire, modes isolation/contexte, conservation du contexte et retour caméra, refus d’un contrat corrompu, fermeture au changement d’étape, à la perte WebGL et au retrait des blocs.
- Régression documentaire régionale réussie après raccordement. Résultats détaillés et autres suites retestées dans le checkpoint.
- Le premier essai a révélé une empreinte brute CRLF incompatible avec le vérificateur de texte normalisé ; la constante a été corrigée vers l’empreinte LF et le cas est couvert par un test. Le contrat source n’a pas été modifié.

Aucune localisation individuelle, activation, contraction, délai physiologique, effet du protocole ou précision biologique n’est déduite de l’ouverture du cœur HRA. Les 14 surfaces ne prouvent pas une complétude anatomique. L’émulation ne constitue pas une mesure sur téléphone physique. La cause du délai intermittent de démarrage reste ouverte.
