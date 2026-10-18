# POLY — évaluation de la présentation et des parcours

11 octobre 2026 · v0.93 · audit fonctionnel et critique de conception, sans étude d’utilisabilité auprès de spécialistes.

## Le problème central

La v0.92 ouvre sur une anatomie en brume, mais les quatre exemples A–D de cette scène ne sont pas le catalogue scientifique. C01–C14 ne sont pas sélectionnables depuis la scène. Les 50 parcours de l’atlas sont accessibles dans un autre espace. L’utilisateur doit découvrir lui-même ces correspondances et ne peut pas conserver un même dossier en passant librement d’une présentation à l’autre.

Le problème dépasse la couleur : la représentation et les données ne partagent pas la même sélection. La première page donne une impression de couverture plus réduite que les travaux réellement disponibles.

## Constats et réponses

| Point évalué | Constat v0.92 | Réponse v0.93 |
|---|---|---|
| Trouver C01–C14 | Absentes du choix de la scène ; détour par d’autres documents | Catalogue explicite de 14 chaînes dans l’atelier |
| Trouver les parcours humains | Trois exemples humains reliés à un dossier parmi 50 parcours | Tous les 50 parcours au même endroit ; filtre Humain, 22 entrées |
| Changer de représentation | Chaque mode possède ses propres exemples et son état | Même dossier, même maillon, mêmes preuves dans les cinq modes |
| Comprendre un processus entier | Quatre exemples de cinq maillons ; pas de correspondance exhaustive au registre | Tous les éléments et toutes les relations du dossier sont conservés ; liste dans la scène et carte des branches |
| Dégager une structure | Déplacement prédéfini d’enveloppes dans un autre mode | Curseur d’éclatement continu, remontage et opacité indépendante |
| Comprendre une durée | Animation pédagogique sans chronologie empirique | Mesures locales, portée, horloge, conditions, limites ; intervalle ND sur les raccords non chronométrés |
| Accéder aux preuves | Lien général dépendant de l’exemple | Dossier sous la représentation, attaché à la sélection ; passage vers le parcours exact de l’atlas |
| Revenir à sa lecture | Mode enregistré, dossier incomplet dans l’adresse | Lien conservant dossier, maillon, relation, mode et onglet ; retour navigateur entre dossiers |
| Comparer | Quatre exemples imposés, commande mêlant inspection et masquage | Jusqu’à quatre dossiers choisis ; ouvrir, masquer, retirer et régler chaque tête de lecture séparément |
| Commenter | Aucun commentaire attaché à un objet dans l’accueil | Annotations privées par maillon ou raccord ; sauvegarde navigateur, export, import et préparation d’une discussion GitHub |

## Présentation retenue : l’atelier des chaînes

L’atelier conserve un objet de recherche commun à trois profondeurs de lecture :

1. **Voir** : anatomie en brume, catalogue complet, sélection d’un maillon et lecture courte de son action. La liste du processus est présente dans la scène anatomique ; la carte complète explicite les branches.
2. **Comprendre** : déployer les enveloppes, suivre les relations, inspecter les étapes et distinguer les raccords établis des raccords ouverts. Changer de vue n’enlève aucun élément au dossier.
3. **Étudier et annoter** : ouvrir les sources, les observations temporelles, les protocoles, les données du catalogue et les limites. Chaque annotation conserve son identifiant de cible.

La couleur sert à l’attention et à la comparaison : anatomie grisée, sélection vert doux, quantités temporelles ocre, quatre lecteurs distingués par quatre accents sobres. Le statut scientifique reste aussi indiqué par du texte et par la forme des traits ; il ne dépend pas de la couleur seule.

## Ce que nous reprenons des vues éclatées

Dans [Autodesk Fusion](https://help.autodesk.com/cloudhelp/ENU/Fusion-Animate/files/GUID-25E6D2E0-8057-4BFF-93B3-E7AEE2C4404A.htm), les vues éclatées et l’animation des assemblages sont organisées dans un espace d’animation avec des storyboards. [SOLIDWORKS](https://help.solidworks.com/2023/english/SolidWorks/Sldworks/t_Exploding_and_Collapsing_an_Exploded_View.htm) propose l’animation de l’éclatement et du remontage. Pour POLY, cela inspire un déplacement continu des enveloppes, avec maintien du repère et du dossier étudié.

L’horlogerie fournit un autre principe utile : retirer visuellement l’habillage pour regarder l’organe et son fonctionnement. La [Jaeger-LeCoultre Atmos Infinite](https://www.jaeger-lecoultre.com/eu-en/clocks/atmos/atmos-collection/atmos-collection-infinite-glass-q540531j) présente ainsi un mouvement visible dans une enveloppe de verre. Nous en retenons une direction de lisibilité, pas une équivalence entre mécanisme horloger et organisme vivant.

Le principe de [dévoilement progressif décrit par Nielsen Norman Group](https://www.nngroup.com/articles/progressive-disclosure/) éclaire la séparation entre lecture immédiate et détails spécialisés : la transition doit rester visible et explicite. Les chaînes et la sélection sont donc communes ; les sources et mesures approfondissent la lecture sans créer un second catalogue caché.

Ces références inspirent la composition. Elles ne prouvent ni l’unicité de cette présentation, ni son efficacité pour les utilisateurs de POLY. Ces deux points demandent une évaluation propre.

## Les temps : une règle de lecture essentielle

C02 contient une mesure de 0,15 ms couvrant E08–E11. Elle est présentée avec sa portée globale et sa source. Elle n’est jamais divisée artificiellement entre trois flèches. Les constantes τ de décroissance, délais jusqu’au pic, temps de prélèvement et vitesses restent dans leurs catégories respectives.

Le registre comporte 127 observations ou manques attachés aux chaînes, dont 38 valeurs affichées autres que ND. L’atlas fournit aussi 45 repères temporels. Une sélection de ces repères est reliée au contexte des protocoles concernés ; ils ne deviennent pas des durées de flèche. Aucun intervalle direct entre deux nœuds adjacents n’est attribué automatiquement : les raccords sans mesure propre affichent **Δt ND**.

La lecture à l’écran avance toutes les 1,5 seconde. C’est une cadence de présentation indiquée à l’utilisateur, pas une simulation de propagation. L’ordre enregistré contient parfois des branches et des préparations différentes ; il ne devient pas une chronologie commune.

## Limites qui restent à traiter

- Les enveloppes et les organes restent procéduraux et schématiques. L’éclatement révèle leur disposition illustrative ; il ne constitue pas encore une dissection anatomique mesurée.
- Aucun trajet animal n’est transposé sur un cerveau humain. Les dossiers mixtes restent représentés par leur carte documentaire. Les surbrillances humaines sont des repères de grandes structures explicitement mentionnées, sans coordonnées d’électrode ni axones tracés.
- Le mode Échelles présente un schéma cellulaire distinct. Il ne prétend pas zoomer continûment du corps à une cellule identifiée. L’anatomie mesurée, le recalage des coordonnées et la provenance spatiale restent à intégrer.
- Montrer tous les éléments enregistrés ne rend pas une chaîne causalement complète. Les lacunes sont des éléments de la représentation, pas des raccords à dessiner arbitrairement.
- Les annotations du navigateur ne sont pas un forum partagé. L’export permet leur circulation ; GitHub fournit une voie de discussion publique avec publication manuelle. Un espace collaboratif intégré demanderait une identité, un stockage partagé et une modération.
- Les registres historiques C01–C14 conservent leurs statuts et leurs portées d’origine. Cette passe corrige l’accès et la présentation ; elle ne constitue pas une nouvelle validation primaire de chaque relation.

## Épreuve de praticité à organiser

Faire réaliser les mêmes tâches à des spécialistes et à des lecteurs non spécialistes : retrouver C08 ; retrouver un protocole humain de respiration ; suivre les branches de C02 ; expliquer la portée des 0,15 ms ; identifier un raccord non mesuré ; retrouver la source ; annoter ce raccord ; ouvrir quatre dossiers et distinguer temps de présentation et temps biologique.

Relever la réussite, les détours, les confusions de quantité ou d’espèce et la capacité à revenir à la sélection. Les contrôles automatiques de navigation et d’affichage sont consignés dans VERIFICATION_v0.93.json ; ils ne remplacent pas ces observations auprès d’utilisateurs.
