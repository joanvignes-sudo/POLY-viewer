# POLY — réplication du calcul EPSC, recherche v0.29

L'ANOVA du temps de montée a été recalculée avec scipy sur les valeurs originales déjà acquises : F=1.70120783, ddl=2/56, p=0.19175636. L'arrondi p=0,1918 reproduit le fichier éditeur ; p=0,1576 dans la légende ne se reproduit pas sur ces 21/21/17 valeurs. Cela localise l'écart entre fichier et légende, sans établir pourquoi les effectifs annoncés diffèrent. [Source primaire et données figure 3](https://elifesciences.org/articles/75219/figures).

Ce contrôle reproduit le calcul classique supposant les neurones indépendants. Il ne valide pas cette hypothèse : plusieurs neurones proviennent d'une même souris et le lien neurone→animal manque. Aucune conclusion de significativité nouvelle, aucun IC corrigé du regroupement, aucune moyenne interétudes. Le fichier original est préservé ; 59 neurones restent distincts de 118 mesures.

Le registre v0.29 conserve les quatre axes ouverts et toutes les réserves antérieures. Le socle public n'a pas été édité. Prochain travail utile : établir le protocole et la température de cette série, rechercher les effectifs complets/version correspondante et une série indépendante compatible. La réplication NHANES terminée n'est pas répétée.
