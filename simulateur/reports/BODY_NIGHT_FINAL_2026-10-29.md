# POLY — Bilan final de la reprise nocturne du 28 au 29 octobre 2026

Fenêtre autorisée : jusqu’au 29 octobre à 08:00 Europe/Paris (07:00 UTC). La clôture porte sur cette fenêtre de travail ; **la liste de convergence n’est pas entièrement terminée**. Aucun nouveau chantier ne doit être lancé après l’échéance.

## Acquis utilisables localement

- Entrée commune `http://127.0.0.1:8124/simulateur/web/anatomy.html`, préservant le parcours classique, avec accès aux lecteurs régionaux et pages indépendantes.
- HRA régional : identités source, recherche catalogue/résidents, inspections, caméra/retour, atténuation graphique bornée, marche et postures historiques partagées. Œil/P1, atlas CerebrA et main distincts avec contrôle des sources et libération.
- Références de membres/tronc : 526 pièces source conservées, groupes bornés, fiches, postures illustratives et parcours documentaires dans un repère explicitement compatible. La source n’est pas recalée individuellement.
- Dossiers génériques : moteur historique, étapes/branches/frontières, lecture/pause/retour, sources, cadrage des seules surfaces résidentes et reprise JSON liée aux empreintes et résidents exacts. Les contextes modifiés et reprises périmées sont refusés.
- Contexte HASS-BODY : curation cardiaque générique avec 14 surfaces HRA exactes exigées, isolation/contexte/retour. La région inconnue du protocole source reste inconnue ; aucune donnée du participant ou de son capteur transférée.
- Guide qualitatif nerf–muscle raccordé à la véritable référence de main, trois conditions de culture conservées, horloge pédagogique indépendante, pause et destruction explicites. Pilotes médian/ulnaire disponibles aussi en lecture documentaire sans WebGL, arrêtés à leur frontière réelle.
- Squelette Z-Anatomy distinct : 208 objets / 206 concepts, quatre blocs exacts, lecteur borné, filtres région/concept, picking des triangles, vue par bloc ou ensemble complet sous budget brut explicitement choisi de 16 Mio. Les valeurs, métadonnées, évaluations, polygones exclus et licences sont conservés.
- Journal déclaré de 24 h sans WebGL : brouillon explicite, sauvegarde précédente avant remplacement, conflits détectés, import/export et conservation des champs inconnus. Aucune horloge d’avatar ou prédiction biologique déduite du journal.

## Optimisations mesurées et limites des chiffres

Les profils sont reproductibles et limités à leurs opérations CPU : écriture des positions du tronc environ 4,54× plus rapide sur le cas testé ; normales d’affichage environ 3,96× sur la dernière mesure, avec 1578 comparaisons exactes couvrant 526 pièces à trois phases. Le picking utilise un espace de travail par clic : buffers de positions alloués 1277316 → 42864 octets sur le bloc comparé, mêmes 36 sélections. Ces résultats ne mesurent ni fréquence d’images globale, ni RAM totale, GPU, batterie, température ou téléphone physique.

## Vérification et sauvegarde

Dernière suite Node complète : **146 réussites, zéro échec**, sur le code `22a0c1f4bb7fa3e15781bd6c7039178b9579a54e`. Dernière suite Python complète : **23 réussites**. **24 suites navigateur disposent de résultats réussis au fil des reprises** ; elles n’ont pas toutes été réexécutées ensemble sur le dernier commit. Les régressions ont été ciblées selon les modules modifiés. Les erreurs intermédiaires et délais restent conservés dans les journaux du dossier work.

Les nouveaux blocs du squelette ont aussi été comparés indépendamment en Python et JavaScript à chaque nombre, indice, identité, métadonnée et registre source. Des tests forcent corruption, chevauchement, budget insuffisant, annulation réseau, remplacement périmé et perte de contexte.

Branche locale : `feat/regional-body-bridge-20261028`. Base préservée : `59d7571ca780f74dcfa9b261b13515f5f49ffb59`. Le bundle local `POLY-suite-regionale-20261028.bundle` nécessite cette base et contient les commits locaux de convergence. Il a été vérifié ; il est régénéré après le commit documentaire de clôture. Les blocs générés restent hors dépôt et hors site. Aucun push, fusion, publication, déploiement, message externe ou sous-agent.

## Limites non closes

1. **Délai intermittent de démarrage : cause inconnue.** Des expirations de 30–45 s ont été conservées. Délais explicites, annulation, reprise manuelle et traces d’étapes/requêtes ont été ajoutés. Des passages ultérieurs ne prouvent pas la correction de la cause.
2. Le contrôleur 3D global des 575 routes nerveuses et ses marqueurs/états historiques ne sont pas remplacés par les lecteurs documentaires indépendants.
3. Les 80 surfaces de revue osseuse DB, certains ateliers de recalage, proxies osseux et modèles spécialisés (excitabilité, entérique, travaux récupérés/Cogitate) restent distincts, accessibles dans le parcours historique ; leur équivalence régionale complète n’est pas revendiquée.
4. Les lignes/carte documentaire 3D, certains détails d’occlusion globale et correspondances cérébrales fines restent partiels ou non qualifiés. Aucun ancrage individuel ni connexion anatomique n’est inventé pour remplir la liste.
5. Aucun recalage individuel, insertion, plaque motrice, délai, activation, force, causalité ou validation biologique n’est déduit du rendu. Les tests mobiles sont de l’émulation.

## Reprise proposée

Lire `work/POLY_NUIT_REPRISE.json`, puis la matrice `BODY_FEATURE_PARITY_2026-10-28.md`, l’état Git et les traces existantes. Choisir un chantier limité parmi les fonctions historiques restantes, avec ses véritables dépendances et son repère source. Préserver les fonctionnalités closes, ne pas répéter des stress de rechargement sans nouvelle preuve et ne pas confondre référence graphique et observation individuelle.

L’automatisation nocturne est arrêtée à la clôture ; aucune nouvelle relance n’est nécessaire pour cette fenêtre échue. Une reprise ultérieure pourra repartir du checkpoint et du bundle sans réinitialiser le travail.
