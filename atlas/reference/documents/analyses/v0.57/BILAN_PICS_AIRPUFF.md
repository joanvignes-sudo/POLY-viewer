# POLY v0.57 — pics après souffle d’air, effectifs séparés

Trois lots : Fig3f unité/estimand confirmés et 76 cellules référencées; Fig3d 24 paires de sessions extraites; calculs et niveaux de réplication audités. La figure originale a été inspectée : secondes, pic de fréquence neuronale et pic de variation de force. [Article et figure 3](https://www.nature.com/articles/s41467-025-64132-4).

## Calculs POLY

| Population cellulaire | Nombre | Moyenne du pic après repère air-puff | SD | Médiane |
|---|---:|---:|---:|---:|
| Forward DA | 41 | 93,41 ms | 67,51 ms | 70 ms |
| Backward DA | 35 | 62,86 ms | 34,60 ms | 60 ms |

Le t-test non apparié à variance commune reproduit p=0,0180398, donc l’arrondi publié 0,018. La sensibilité Welch donne p=0,0138265. Ces tests utilisent les cellules comme unités : ils ne corrigent pas leur regroupement par animal. Sans mapping, aucun IC de population animale ni validation de l’indépendance des cellules n’est annoncé.

Vingt-quatre paires de sessions, quatre souris selon la légende : pic de variation de force de réponse 77,92 ms, rebond 147,92 ms, différence moyenne 70 ms. Le test apparié de sessions donne t(23)=11,57156, p=4,55×10⁻¹¹, concordant avec le seuil publié <0,0001. L’attribution des sessions aux souris manque; ce calcul ne transforme pas 24 sessions en 24 animaux. Les cellules neuronales et sessions de force ne sont pas assemblées en une chaîne causale suivie.

## Intervalle et trous

Entrée : repère d’air-puff enregistré. Sorties : pics de décharge ou de variation de force, pas première détection ni retour à l’état de départ. Règle numérique de sélection et fenêtre du pic non extraites. Le souffle nominal dure 20 ms dans le protocole; ce n’est pas le transit pneumatique vers le visage. Calibration déclenchement→arrivée physique non extraite. Ne pas déclarer ces calibrations inexistantes.

Ces résultats appartiennent à un autre stimulus que la récompense S10 ou l’épreuve CO₂ P03. Une valence aversive décrite dans l’expérience ne suffit pas à établir le même mécanisme émotionnel dans les trois tâches. Aucun pooling ou délai émotionnel global. Recherche hors canon, baseline non éditée, quatre axes ouverts, aucune conception nouvelle.
