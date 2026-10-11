# POLY émotionnel v0.13 — audit, modèles, perturbations

Extensions exploratoires fixées avant leurs résultats, après v0.11–v0.12. Aucun test confirmatoire ni conception.

## Audit

Vérifier les champs temporels, les valeurs de récompense/choix et les reconstructions de spikes dans les données utilisées. Rechercher les conventions susceptibles de créer des doublons ou fuites temporelles. Les incohérences d'export ne sont pas des observations biologiques. Un contrôle informatique ne valide pas une horloge physique. Vérifier à nouveau les SHA256 des archives et du socle v0.22.

## Transfert sérotoninergique

Apprendre les six familles temporelles fournies sur trois animaux, avec les mêmes réglages et les neuf initialisations prospectives de v0.11, sélectionnées sur perte d'apprentissage seule. Le quatrième animal est séparé, pour chaque unité, en premiers 20 % des essais (calibration) et derniers 80 % (évaluation). Écarter les cinq premiers essais de chaque unité avant cette séparation pour limiter les bords de reconstruction et l'initialisation. Ne jamais utiliser les essais d'évaluation pour choisir les paramètres ou la calibration.

Comparer le transfert direct à une correction additive commune : moyenne pré-indice de l'animal de calibration moins moyenne pré-indice de la prédiction du modèle. Garder un témoin constant égal au niveau pré-indice de calibration et un modèle constant entraîné sur les autres animaux. Aucun ajustement de gain ni d'échelle sur l'évaluation. Rapporter les R² et erreurs quadratiques sur la fenêtre entière et après indice ; rapporter séparément la dérive de baseline entre calibration et évaluation. Même ensemble d'essais pour toutes les familles. Une prédiction négative après correction additive est signalée, conservée comme diagnostic et ne devient pas une intensité neuronale valide.

La cible reste la forme temporelle moyenne pondérée par nombre d'essais/unité, dans la convention du code auteur. Ce n'est ni une prédiction d'émotion ni une comparaison de neurones identiques entre animaux. Toute optimisation signalée en échec ou dominée par le modèle constant sur apprentissage est mise en quarantaine. Les minima globaux ne sont pas garantis.

## Perturbation comportementale

Conserver uniquement les inversions strictes de préférence avec au moins vingt CSplus dans le bloc précédent et vingt dans le suivant. Cela fixe les mêmes événements pour les fenêtres de 5, 10 et 20 essais. Comparer ancien côté après inversion et avant inversion, ainsi que fractions sans choix. Exclure tout événement avec choix simultané des deux côtés dans les quarante essais ; conserver les fenêtres sans choix pour les proportions sur tous les essais, et marquer leur proportion conditionnelle non estimable.

Calculer chaque mesure par événement, session, animal et condition, puis les différences agoniste−véhicule. Comparer également la différence après−avant afin de distinguer niveau initial et changement. Aucun p sur les essais ou transitions ; aucune interprétation causale ajustée. Les fenêtres ne sont pas des réplications indépendantes et la sélection de blocs longs limite la portée.

Sources : [Harkin/Naud, données et code](https://doi.org/10.5281/zenodo.14628985), [Grossman et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825708/).

## Extensions d'audit et de modèles avant leurs résultats

Le chargeur foraging a émis une alerte de dépassement de type numérique avant le calcul de cette extension. Refaire sa reconstruction récursive en int64, comparer les arrays relatifs et les matrices binned aux originaux, et ne jamais modifier ces originaux. Si les comptes pré-indice diffèrent, conserver les deux versions et signaler la portée des analyses fondées sur la reconstruction indépendante.

Pour la seconde tâche neuronale, tester les comptes pré-indice reconstruits en int64 sur essais CSplus seulement. Exiger cinq CSplus précédents avec choix unique et récompense binaire documentée ; conserver les essais courants sans choix pour éviter une sélection selon leur issue future. Exclure ainsi l'initialisation d'historique. Comparer quatre modèles Poisson : temps seul ; temps + dernier choix et dernière récompense ; ce contrôle + fraction récompensée des cinq CSplus précédents ; ce contrôle + fraction récompensée + proxy p(1−p). Ce proxy n'est pas la variable latente du modèle de méta-apprentissage. Cinq blocs d'évaluation chronologiques avec entraînement croissant, standardisation sur entraînement seul et pénalité L2 λ=1 sauf constante, comme v0.11. Moyennes unités→sessions→animaux ; aucun p sur les unités. L'identification optogénétique individuelle et les horloges physiques doivent être distinguées des champs TT distribués.

Pour la respiration, vérifier les coordonnées et régions quand présentes, puis calculer la sensibilité des moyennes et des fractions retenues à l'exclusion de chaque participant. Reproduire numériquement le test non apparié éveil/sommeil du script, en signalant le chevauchement des personnes ; le comparer descriptivement aux moyennes appariées par participant. Aucun remplacement silencieux du test original, aucune correction supplémentaire des Pvalues de statut inconnu, aucune sélection d'exclusion favorable.

Amendement numérique après le premier essai foraging : trust-exact s'arrête sur une approximation insuffisante avec gradient moyen 1,087e−7, légèrement au-dessus du seuil fixé 1e−7. Ajouter jusqu'à huit pas de Newton avec Hessienne analytique sur le même objectif, sans changer les modèles, la pénalité, les partitions ou le seuil d'acceptation. Conserver le drapeau d'origine et le nombre de pas de raffinement.
