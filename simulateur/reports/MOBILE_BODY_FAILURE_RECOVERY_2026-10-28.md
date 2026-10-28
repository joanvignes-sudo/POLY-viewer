# POLY — Corps entier sur téléphone : première protection mémoire et récupération

**État :** correctif candidat indépendant, branche `fix/mobile-body-recovery-20261028`. Aucun changement de données biologiques, atlas, moteur scientifique, ni fusion.

## Diagnostic ciblé

La page `simulateur/web/index.html` charge dès son démarrage le modèle de corps `../models/body-display.bin` (environ 30,7 Mo non compressé d'après le registre des ressources) et les métadonnées d'une scène comportant 918 structures de référence. Le module construit toutes les géométries et matériaux pendant l'initialisation. Le coût réel dépend des mémoires CPU/GPU, du navigateur et de l'appareil : **aucune mesure sur un téléphone réel n'est disponible dans ce lot**.

L'interface place initialement son `main` en `inert` / `aria-busy=true` puis le libère à la fin de l'initialisation. Si l'import JavaScript, le chargement du modèle ou la création WebGL échoue avant cette étape, les commandes principales restent inaccessibles. La récupération était insuffisamment explicitée.

## Modification proposée

1. `body-startup-guard.js` capte les échecs non gérés d'initialisation du module ainsi que la perte de contexte WebGL. Il ne prétend pas restaurer lui-même un contexte GPU ni un fichier non téléchargé.
2. Un panneau `role="alert"`, inséré **hors du `main inert`**, apparaît uniquement en cas de défaillance détectable. Il permet d'ouvrir l'explorateur de cerveau chargé à la demande, les observations humaines ou la documentation sans démarrer à nouveau le gros corps.
3. La densité d'affichage Three.js est plafonnée à `pixelRatio = min(devicePixelRatio, 1)` sur les périphériques déclarant un pointeur grossier ; le comportement desktop conserve le plafond précédent de 1,7. Ceci réduit la taille des cibles de rendu du WebGL, pas la mémoire nécessaire au maillage complet.
4. Un bouton de rechargement est proposé. Il n'est pas déclenché automatiquement pour éviter une boucle d'échec de la page.

## Périmètre exact et limites

- La gestion des échecs JavaScript, WebGL ou réseau **fonctionne uniquement si le navigateur reste ouvert et peut encore exécuter du code**. Si le processus est brutalement tué par manque de mémoire, aucun script client ne peut garantir la récupération.
- Le maillage binaire est encore téléchargé et géométriquement construit en entier dans la page lourde. Il n'y a **pas** de progressive loading / LOD / streaming anatomique à ce stade.
- Les performances et la mémoire GPU n'ont pas été mesurées sur le Samsung A14 ou un autre Android réel.
- Le pointeur grossier est un signal d'interface, pas une mesure de puissance GPU ; certains ordinateurs tactiles utiliseront aussi le plafond 1. C'est une concession délibérée au rendu au profit d'une consommation moindre.
- Les scènes scientifiques, identifiants et maillages restent strictement inchangés.
- La version publique actuelle n'est pas affectée tant que cette PR n'a pas été approuvée et fusionnée.

## Tests automatisés

- Contrôle statique : fallback hors `main inert`, import du garde avant `app.js`, navigation de secours présente, plafond du pixel ratio sur pointeur grossier.
- Test navigateur : pour chaque fenêtre desktop (1440 × 900) et mobile tactile émulée (390 × 844), interrompre délibérément la requête `body-display.bin`, vérifier que le panneau de récupération s'affiche, reste accessible pendant l'inertie du `main`, ne déborde pas horizontalement et permet de rejoindre le cerveau à la demande.
- Ce test **simule une erreur de réseau**, pas un manque de mémoire physique ni une erreur GPU réelle.

## Étapes de qualification suivante

1. Mesurer sur un téléphone physique : octets transférés, pic de heap JS, usage GPU observé si disponible, durée de chargement et récupération après interruption.
2. Construire un manifeste de niveaux de détail réellement sourcés et qualifier les simplifications géométriques ; ne pas inventer d'anatomie à partir d'un LOD.
3. Implémenter un chargement sélectif par région avec budgets de mémoire mesurés et libération des buffers/textures lors des changements de région.
4. Couper les rendus invisibles et recycler les ressources WebGL ; définir des tests de perte/recréation de contexte.
5. Maintenir un chemin de consultation de source, de chaîne et de preuve indépendante de la 3D lourde.

**Cette livraison ne ferme pas le problème « corps entier sur téléphone » : elle réduit le budget de rendu et empêche une panne détectable de bloquer complètement l'accès au reste de POLY.**
