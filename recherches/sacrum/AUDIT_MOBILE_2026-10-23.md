# POLY — Audit anatomique sacrum–coccyx, passe mobile 2026-10-23

## Base vérifiée
- Départ : POLY-viewer v0.136.0, commit 80b063ea86ef3ecda3f04a48f71379086f5460c7.
- Le recalage candidat sur 11 proxys géométriques (7 ajustement, 4 contrôle) est **rejeté** : le RMS local diminue mais les surfaces L2/L4/L5 se dégradent.
- 0 homologue anatomique expert vérifié ; 0 attache nouvelle validée ; 0 transformation nouvelle appliquée.
- Le squelette affiché comporte 206 concepts / 208 surfaces sources. Les 1496 tests du lot DE sont techniques, non anatomiques.

## Problème à résoudre
Le gabarit existant recense 12 repères sur le sacrum mais pas encore la **base du coccyx** dans une paire de surfaces indépendantes. Une frontière sacrum–coccyx n'est pas déterminée par une extrémité de boîte englobante ni par la proximité de deux sommets.

## Plan de qualification (sans inventer de coordonnées)
1. Identifier dans les deux géométries source les surfaces du sacrum ET du coccyx, leurs unités, axes, latéralité, transformations et empreintes SHA256.
2. Définir sur chaque atlas l'apex sacré, la facette caudale sacro-coccygienne, la base du premier segment coccygien, les cornes sacrées/coccygiennes, le hiatus sacré et l'orientation antérieure/postérieure.
3. Enregistrer chaque repère comme annotation indépendante : atlas, objet, face/triangle ou barycentrique, xyz natif, définition anatomique, observateur, méthode, incertitude et capture de contrôle.
4. Vérifier visuellement les paires homologues sur plusieurs vues et contrôler les rapports avec S5, Co1 et le hiatus. Ne pas imposer de contact si les maillages ne le montrent pas.
5. Réaliser un recalage rigide sur repères d'apprentissage ; réserver des repères homologues indépendants pour la validation. Rapporter les résidus par point, les distances inter-surfaces, les écarts aux os voisins et les limites d'échelle/unité.
6. Rejeter toute transformation qui dégrade les régions lombaires ou l'alignement du squelette ; ne jamais modifier les maillages originaux.
7. Qualifier les attaches musculaires seulement après validation de la surface correspondante ; distinguer localisation textuelle établie, géométrie proposée et enthèse démontrée.

## Règles de décision
- Une annotation sans correspondance anatomique vérifiée reste CANDIDATE, jamais VALIDATED.
- Un ajustement RMS favorable ne prouve ni l'homologie ni l'absence de déformation régionale.
- Les données anatomiques ne doivent pas être promues au statut de chaîne physiologique mesurée.
- Ne pas publier ni fusionner avant validation explicite.

## Contrôles attendus
- Schéma JSON avec identifiants stables pour les deux os et deux atlas.
- Test : aucun champ xyz nul ne peut recevoir validated=true.
- Test : aucun proxy géométrique ne peut être labellisé « expert homologué ».
- Test : les repères de validation ne sont pas réutilisés pour le fit.
- Test : toute matrice candidate est archivée séparément et jamais injectée dans le rendu canonique sans accord.
- Test : régression L2/L4/L5, sacrum, coccyx, muscles, nerfs, animations marcher/courir/manger.
- Journal des données manquantes et lien vers chaque source.

## État de reprise
Statut : **plan d'audit créé, annotation anatomique non effectuée**.
Blocage : les repères homologues des deux atlas ne sont pas encore identifiés sur leurs maillages.
Prochaine exécution : inspecter les objets sacrum/coccyx et renseigner les repères anatomiques sans modifier le rendu.
