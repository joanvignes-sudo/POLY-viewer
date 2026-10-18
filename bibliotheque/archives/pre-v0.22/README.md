# POLY Viewer v0.9

Version publique expérimentale du viewer POLY.

## Nouveau : animations des intervalles C08

La v0.9 ajoute un onglet **Animation** qui représente l'interaction ou le changement ayant lieu dans chaque intervalle scientifique de C08.

### Principe
Le personnage est un acteur visuel.  
L'unité pédagogique devient :

`état A → transformation / interaction → état B`

Les animations sont réalisées avec des SVG réutilisables et du CSS, donc elles restent très légères même affichées en grand.

### 13 actions / intervalles couverts
- production locale → ATP disponible ;
- ATP disponible → cycle vésiculaire opérationnel ;
- stimulation → pic Na⁺ dendritique ;
- stimulation → pic Na⁺ somatique ;
- stimulation → creux ATP dendritique ;
- stimulation → creux ATP somatique ;
- relation temporelle Na⁺ ↔ ATP inconnue ;
- retour Na⁺ dendritique vers la ligne de base ;
- retour Na⁺ somatique vers la ligne de base ;
- retour ATP vers la ligne de base ;
- diffusion longitudinale du Na⁺ ;
- ER / Ca²⁺ → proximité mitochondriale ;
- ATP disponible → entretien des gradients (relation reconstruite).

### Garde-fous
- durée visuelle de la boucle ≠ durée biologique ;
- les temps réels sont lus dans le dataset scientifique ;
- les mécanismes non mesurés ne sont pas inventés ;
- Na⁺ et ATP restent séparés quand les séries expérimentales sont distinctes ;
- un ND reste explicitement ND ;
- le retour du Na⁺ n'est pas attribué automatiquement à la pompe ;
- le coefficient de diffusion n'est pas transformé en durée ;
- E49 reste identifié comme preuve HeLa non neuronale.

## Glossaire
Le glossaire figuratif reste accessible depuis le bouton **📚 Glossaire** et contient 11 personnages SVG réutilisables.

## Illustration
Les 7 scènes figuratives F01–F07 restent disponibles dans l'onglet **Illustration**.

Les commentaires restent stockés localement dans le navigateur de chaque visiteur.
