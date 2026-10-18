# POLY v0.105 — première exploitation COGITATE

## Réalisé

- 25 fichiers publics acquis depuis des versions Git identifiées et contrôlés par SHA-256 et empreintes des objets Git.
- Trois tableurs de métadonnées lus intégralement, neuf feuilles contrôlées. Seuls les agrégats sont publiés ; aucune fiche clinique individuelle recopiée.
- Deux figures extraites sans modification du notebook officiel : cellule 39 (canal LO1) et cellule 55 (localisation des canaux réactifs). Numérotation des cellules à partir de zéro.
- Résultats sauvegardés par les auteurs pour CF102 : 28 canaux réactifs sur 92 analysés, 18 augmentations et 10 diminutions selon leur classification. 720 époques alignées sur le début du stimulus dans la sortie correspondante. Ce n'est pas une réplication de POLY.
- Neuf facteurs du dictionnaire présentés. Les champs category à response sont imbriqués sous miniblock dans le JSON original ; parcours récursif pour leur présentation, original inchangé. Copier-coller face dans des exemples letter/false signalé.
- Lecteur local events.tsv : contrôle de structure, types d'événements, horodatages manquants/non numériques, ordre et durées. Pas d'envoi, stockage automatique, appariement d'essais ou latence biologique.

## Limites

Les tables de 2024 ne représentent pas automatiquement la diffusion actuelle ni les effectifs finaux des publications. Les feuilles all et les feuilles par modalité ne sont pas des consolidations exactes ; aucun total combiné et aucune jointure entre préfixes de versions ne sont établis. Les comptes de contrôle qualité et d'inclusion dans MSP restent distincts.

Les fenêtres avant/après du tutoriel ne sont pas des latences estimées. Les coordonnées numériques et signaux du participant n'ont pas été acquis. Aucun recalage à l'atlas de POLY, aucune nouvelle chaîne affective, aucune conclusion sur le moment d'apparition de la conscience. Accès XNAT à rétablir avant une réanalyse indépendante.

## Sources et attribution

[Provenance et versions exactes](assets/cogitate/PROVENANCE.json). Tutoriel iEEG COGITATE, équipe Alex Lepauvre et coauteurs, dépôt sous MIT ([texte conservé](assets/cogitate/LICENSE_CODE.txt)), DOI 10.5281/zenodo.13832169. Article de données : Seedat et al., DOI [10.1038/s41597-025-04833-z](https://doi.org/10.1038/s41597-025-04833-z). Données complètes annoncées sous CC BY 4.0 et conditions du portail ; aucun engagement d'accès n'est pris par la page publique.

Aucune correspondance privée, adresse de contact ni information de compte publiée. Registre scientifique EXPLORATION_v0.98 et canon v0.92 conservés.
