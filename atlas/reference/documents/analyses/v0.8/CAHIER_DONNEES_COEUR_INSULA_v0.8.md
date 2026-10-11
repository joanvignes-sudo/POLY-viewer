# Cahier des données nécessaires — cœur–insula, POLY v0.8

Document de travail, non envoyé. 4 octobre 2026. Source : Hsueh et al., DOI 10.1038/s41586-023-05748-8.

Objectif : vérifier les résultats locaux de perturbation cardiaque et d'inhibition insulaire, sans reconstruire une chaîne temporelle à partir de cohortes distinctes.

## Inventaire minimal à obtenir ou confirmer

- Table des souris et sessions, identifiants pseudonymes stables, sexe/âge, groupe viral, ciblage, dates relatives et répétitions ; rattachement précis des animaux aux figures. Ne pas demander de données personnelles.
- Trajectoires et événements temporels de stimulation des assays RTPP, EPM et OFT ; délimitation des zones, durées ON/OFF, exclusions et versions des scripts d'analyse.
- Lever presses, récompenses, shocks, fin de session et raisons de non-complétion, avec identifiants souris/session/essai. La période sans pression après le dernier événement doit être conservée pour une analyse de temps censuré.
- Calendrier des impulsions et intensités réelles, motif temporel complet des stimulations nominales 900 et 660 bpm, horodatages des inhibitions pIC/mPFC et groupes lumière/opsine.
- ECG et signaux de pression si disponibles, états éveillé/anesthésié, métadonnées d'instrumentation et synchronisation. Identifier les mesures effectivement simultanées avec le comportement ; ne pas fabriquer cette simultanéité si elle n'existe pas.
- Spikes et metadata d'unités, rattachement aux souris et sessions, régions et électrodes, chronologie de stimulation et qualité ; scripts de bootstrap hiérarchique avec leur niveau d'échantillonnage.
- Clarification Fig2i : quels F/degrés de liberté/P correspondent aux trois effets de l'ANOVA ? Conserver la version originale et l'explication, sans corriger le papier à partir des seuls calculs de POLY.
- Journal des exclusions, randomisation/contrebalancement, critères de qualité et métadonnées de traitement. Distinguer aveugle de l'investigateur et suivi automatisé.

## Analyse proposée avant accès

1. Vérifier identité, unités, disponibilité, intégrité et synchronisation. Les groupes ou fichiers absents restent absents. Fixer les exclusions et métriques avant estimation des effets.
2. Reproduire séparément les métriques rapportées pour chaque assay et figure, au niveau souris, en respectant les répétitions et le contexte. Rapporter effets et incertitudes, pas seulement P.
3. Examiner la non-complétion avec durée de suivi et censure explicites. Ne pas remplacer les latences non mesurées par zéro, ne pas compter les pressions comme autant de souris.
4. Comparer les contrôles de lumière/opsine et d'inhibition, sans prendre un résultat non significatif pour une équivalence. Identifier les contrastes réellement interventionnels et les données observationnelles auxiliaires.
5. Garder les calibrations sous anesthésie, le comportement éveillé et l'enregistrement neuronal comme préparations séparées, sauf identifiants et synchronisation démontrant une mesure simultanée.
6. Ne renseigner la route ou le délai global que si les communications intermédiaires ont été mesurées. Affect et conscience demeurent hors inférence automatique.

Ce cahier prépare une demande scientifique précise. Aucune communication aux auteurs n'est autorisée par ce document seul et aucune n'a été envoyée.
