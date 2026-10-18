# POLY — admission des données, v0.94
12 octobre 2026. Le contrôle de structure ne remplace pas la vérification scientifique.

## Avant d’ajouter une observation
Conserver l’identifiant de l’étude et de la préparation, l’espèce, la personne ou le groupe, l’instrument, les conditions, le nombre d’unités indépendantes et la source primaire avec emplacement vérifiable. Une donnée absente reste ND ; elle ne vaut ni zéro ni un intervalle interpolé.

Pour une quantité : valeur et unité, nature (latence, pic, constante, fréquence…), repère de départ, repère d’arrivée, horloge et portée. Une mesure globale n’est pas divisée entre les relations. Des préparations incompatibles ne deviennent pas un même objet suivi. Les relations instrumentales, analytiques, mécanistiques et hypothétiques gardent leur statut.

Pour une anatomie : fichier source, licence, citation, empreinte, repère, orientation, unités, affine, segmentation, transformation appliquée et résolution utile. Un atlas moyen reste distinct d’une personne. Un ancrage de contexte reste distinct d’un recalage documenté. Un zoom ne crée pas des données cellulaires.

## Porte d’entrée contrôlée
Le fichier EXPLORATION_v0.94.json contient trois ensembles : chains (dictionnaire), paths (liste), timings (liste).
- Identifiants uniques des dossiers, maillons, relations, observations et repères temporels.
- Chaque relation renvoie à deux maillons présents du même dossier.
- Chaque observation conserve une liste applies_to de maillons présents et une quantity_type pour les valeurs renseignées.
- Les chaînes conservent metadata, nodes, edges, values et evidence ; les parcours conservent steps, links et sources.
- Les temps conservent unité, nature, départ et arrivée.
- Les sources utilisent http(s), ou un chemin local public contrôlé sous atlas/.
- Les ancrages humains citent un parcours et des étiquettes présentes dans l’atlas.
- Les empreintes des surfaces et de la segmentation anatomique doivent correspondre.

Le navigateur refuse les erreurs de structure avant d’ouvrir le registre. L’outil tools/validate.cjs utilise le même contrôleur, vérifie en plus les fichiers locaux et les empreintes anatomiques. Exécution depuis la racine de publication : node tools/validate.cjs. Une sortie non nulle bloque l’admission. Le contrôleur ne vérifie pas la disponibilité permanente des sites externes ni la vérité d’une interprétation.

## Versionner et réviser
1. Préserver la version publiée et les identifiants existants.
2. Consigner dans change_record la version, la date, la version source et le type de changement ; citer la justification documentaire d’une correction.
3. Faire passer le contrôle d’intégrité puis la relecture scientifique des valeurs, portées et espèces.
4. Vérifier le parcours visuel, les intervalles, les sources et l’aller-retour vers le dossier.
5. Produire les empreintes de publication ; conserver le bilan et les reçus de tests.

La v0.94 conserve les valeurs scientifiques de la v0.93 et répare 12 adresses de sources. Les anciennes adresses sont conservées dans original_locator.

## Annotations et contribution
Une note cite dossier, maillon et cible (maillon ou relation), identifiant, date et texte. Un import est refusé en entier si une cible ou une date est invalide. Les doublons d’identifiant ne sont pas ajoutés. Le stockage illisible est protégé et exportable sans réécriture. Un échec de stockage laisse les nouvelles notes en mémoire, avec invitation à exporter.
La discussion collective est volontaire sur le dépôt public. Aucun courrier, annotation privée ni donnée de participant n’est publié automatiquement.
