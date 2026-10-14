# BigBrain · raccord local expérimental · v0.125

Le panneau de subdivision propose maintenant de raccorder la face sélectionnée à ses trois voisines. Il permet de voir pourquoi subdiviser une face isolée ne suffit pas, sans modifier les données sources.

## Résultats

- 86 aperçus indépendants de quatre faces, 6 854 triangles calculés au total.
- Les trois arêtes internes de chaque aperçu réutilisent exactement les mêmes indices de sommets : aucune fissure topologique interne.
- Le contour externe conserve six arêtes et les sommets du cortex recalé publié. L’arrondi de stockage local maximal à ces sommets est de 0,000000207 mm. Une égalité mathématique des coordonnées externes après stockage flottant n’est donc pas revendiquée.
- Avant raccord, l’écart maximal observé entre une arête subdivisée et le segment plan de sa voisine atteint 0,511 mm. C’est un écart de rendu, pas une erreur anatomique.
- Aucune opposition d’orientation aux centres testés des faces centrales. En revanche, 42 oppositions persistent dans les faces voisines de 24 aperçus. Elles restent indiquées dans l’interface ; cette construction n’est pas prête à remplacer le maillage global.
- Aucun déterminant non positif aux centres testés. Cela ne certifie pas tout l’intérieur des triangles ni le volume.

## Construction reproductible

La face centrale reprend la grille barycentrique et le premier niveau acceptable de l’analyse v0.124. Chaque voisine est triangulée en éventail depuis son centre natif transformé, en réutilisant les sommets de l’arête commune. Ses deux arêtes extérieures restent les segments sources. Les sommets sources sont contraints aux coordonnées enregistrées du cortex recalé ; la correction d’arrondi correspondante est consignée par aperçu. Les autres points suivent exactement les champs publiés de 2015 puis 2019, avec le même interpolateur cubique et les mêmes repères. Les coordonnées sont stockées relativement à une origine locale pour limiter leur arrondi.

Le nombre de faces incidentes, leur orientation native, les indices partagés, les six arêtes externes et la caractéristique d’Euler du disque sont contrôlés. Les normales calculées sont comparées à la normale source transformée par la cofactrice du Jacobien, au centre de chaque petit triangle. L’écart au centre est mesuré séparément.

## Usage et limites

Dans **Inspecter les facettes → Subdiviser**, activer **Raccorder les trois faces voisines dans l’aperçu**, puis **Voir la subdivision de face**. La densité est celle retenue pour cette face ; désactiver le raccord rend le choix de densité disponible. Le lien conserve le mode, la face et la visibilité. L’export conserve les coordonnées, les indices, les alertes et la provenance.

L’aperçu bleu se superpose aux faces sources inchangées. Les 86 propositions peuvent se recouvrir : elles ne constituent pas un cortex unifié. Les éventails voisins demandent encore une méthode de subdivision mieux adaptée aux triangles minces, avec contrôle d’orientation et des intersections. Une topologie raccordée ne prouve ni une géométrie correcte ni une correspondance anatomique.

Aucun point anatomique acquis, neurone, activité, délai biologique ou nouvelle précision histologique n’est ajouté. Les validations anatomiques indépendantes et les essais avec spécialistes restent à réaliser.

## Sources

Les fichiers, empreintes et références sont consignés dans [la provenance v0.125](assets/bigbrain-neighbors-v0125/PROVENANCE.json). Les surfaces, coordonnées recalées et contrôles précédents sont conservés sans modification.

BigBrain : Amunts et al., [Science 2013](https://doi.org/10.1126/science.1235381). Surfaces corticales : Wagstyl et al., [PLoS Biology 2020](https://doi.org/10.1371/journal.pbio.3000678). Recalage : [Xiao et al. 2019](https://doi.org/10.1038/s41597-019-0217-0). Attribution McGill / Forschungszentrum Jülich et crédits originaux conservés. Dérivés BigBrain sous CC BY-NC-SA 4.0 ; conditions des transformations conservées dans les provenances référencées.
