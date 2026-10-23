# POLY — Registre de la jonction sacro-coccygienne, v0 (23 octobre 2026)

## État de départ
Les deux surfaces sacrées documentées sont BodyParts3D v4.3 FJ3393 (5 293 sommets, SHA256 075790fa7c698f2128c83c9321167a19f67d09830cbc93b465619b4ac86bd7e6) et Z-Anatomy BONE:sacrum (5 832 sommets, SHA256 064b5fba441f260d4a43c0691b2ea1d019bc0810e1dfb9663741882cf86aef1d). Les identifiants et empreintes des surfaces coccygiennes ne sont pas encore relevés. Aucun repère anatomique homologue validé.

## Registre des repères à annoter dans CHAQUE atlas
| Identifiant | Objet | Définition recherchée | Statut |
| --- | --- | --- | --- |
| SAC_APEX | Sacrum | Extrémité caudale anatomique du sacrum | non annoté |
| SAC_FACET | Sacrum | Facette destinée à l'articulation sacro-coccygienne | non annoté |
| SAC_CORNU_L | Sacrum | Corne sacrée gauche | non annoté |
| SAC_CORNU_R | Sacrum | Corne sacrée droite | non annoté |
| COC_BASE | Coccyx | Base de Co1 | non annoté |
| COC_FACET | Coccyx | Surface articulaire supérieure de Co1 | non annoté |
| COC_CORNU_L | Coccyx | Corne coccygienne gauche | non annoté |
| COC_CORNU_R | Coccyx | Corne coccygienne droite | non annoté |
| COC_APEX | Coccyx | Extrémité caudale du coccyx | non annoté |

Pour chaque entrée : objet et version, face/triangle, coordonnées natives, unités, méthode, vue de contrôle, observateur, incertitude, correspondance dans l'autre atlas, preuve et statut. Les champs absents doivent rester absents, jamais estimés par défaut.

## Critères de rejet
1. Un point extrême d'une boîte englobante ne peut pas être présenté comme une facette ou une corne anatomique identifiée.
2. Deux atlas dérivés de sources communes ne constituent pas nécessairement une validation indépendante.
3. Une distance inter-maillage faible ne démontre ni contact articulaire réel, ni enthèse musculaire.
4. La séparation sacrum/coccyx doit être inspectée dans chaque géométrie native avant recalage.
5. Le recalage candidat v0.136.0 reste rejeté : erreurs lombaires L2 ×4,97 ; L4 ×2,46 ; L5 ×3,35.
6. Les mouvements de l'avatar restent illustratifs et ne démontrent pas la biomécanique sacro-coccygienne.

## Procédure d'exécution
A. Extraire la table des 206 os et retrouver les entrées sacrum et coccyx ; relever les objets et leurs empreintes.
B. Localiser le coccyx BodyParts3D v4.3 dans la même version que FJ3393.
C. Afficher les deux paires de surfaces avec repères d'axes explicites.
D. Annoter manuellement les neuf repères sur les deux atlas ; archiver les captures.
E. Vérifier la cohérence des cornes et facettes et la distance inter-surfaces dans les unités natives.
F. Comparer sans toucher au squelette public ; transmettre pour revue indépendante.
G. Ne qualifier les rattachements os-muscle qu'après validation des surfaces.

## Livrable et limite
Ce document est un **registre de qualification** et non une mesure géométrique. Aucun nouveau placement, recalage, contact ou rattachement n'est validé. Le fichier compressé du squelette n'a pas été décodé dans cette passe.
