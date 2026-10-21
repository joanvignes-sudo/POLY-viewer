# Diagnostic de continuité — 2026-10-17

Le défaut de continuité est reproduit. Deux états cardiovasculaires O2 utilisés par Pulse sont absents du schéma et du sérialiseur épinglés. Les traces montrent une divergence O2/chémorécepteurs avant celle de HR. Cette concordance étaye une explication, sans remplacer un essai causal correctif. Le contrôle initial reste FAIL au seuil relatif 1e-9 ; P2-01 reste partiel et A n'est pas lancé.

## Expérience et observations

Le [protocole post hoc](PHASE2_STATE_DIAGNOSTIC_PROTOCOL.json) compare 500 pas natifs de 0,02 s à partir du checkpoint à 30 s, avec états complets aux pas 0, 1, 50 et 500. Premier run à 15:04:34 UTC, puis extension instrumentée à 15:06:01 UTC ajoutant les deux sorties intermédiaires. Chaque run repart d'une initialisation fraîche ; aucune équation modifiée. Le programme initial et ses résultats demeurent conservés séparément.

| Première différence exacte dans la trace instrumentée | Pas après checkpoint | Temps simulé | Mémoire / reprise |
| --- | ---: | ---: | --- |
| O2 artériel moyen | 33 | 30,66 s | 92,30957552174303 / 92,31287816598379 mmHg |
| Signal chémorécepteur sur HR | 33 | 30,66 s | 0,05691782872724276 / 0,05685934416155041 |
| Fréquence cardiaque | 75 | 31,50 s | 72,00469994804817 / 72,00469760866555 par min |
| Pression artérielle moyenne | 495 | 39,90 s | différence de 1,42e-14 mmHg, sous le seuil original |

Le premier écart HR vaut 2,33938e-6/min. À 40 s il vaut 1,55529825463e-6/min, contre un seuil de 7,1989e-8/min. Cette nouvelle valeur diffère légèrement de l'essai original : l'instrumentation et l'avancement pas à pas forment un essai distinct. Quatre autres sorties et le temps restent exactement égaux dans les traces. Les deux runs pas à pas retrouvent le même premier écart HR au pas 75.

Juste après rechargement, les états JSON ne diffèrent que par quatre valeurs/présences : deux débits d'ordre 1e-91 avec un écart de dernier chiffre, et deux modificateurs de configuration réintroduits à 1,5 pour les trajets aorte→rein. Ces différences ne constituent pas une démonstration de causalité. Des variables internes omises ne peuvent, par définition, apparaître dans une comparaison des seuls JSON.

## Omission établie dans les sources

L'[audit avec empreintes et lignes](results/phase2-state-2026-10-17/source_audit.json) porte sur le commit `60c4473912b047500bcbc396eceec7588c48fad4` :

- `m_CardiacCycleArterialO2PartialPressure_mmHg` est déclarée, échantillonnée à chaque pas, utilisée pour l'O2 moyen puis remise à zéro à la frontière du cycle. `Clear()` l'invalide au chargement. Elle n'est ni chargée ni sauvegardée dans les méthodes cardiovasculaires de `PBPhysiology.cpp` et manque au message `CardiovascularData`.
- `m_LastCardiacCycleMeanArterialO2PartialPressure_mmHg` est utilisée pour calculer le delta entre cycles ; elle manque également au schéma et aux deux sens du sérialiseur. L'audit ne garantit pas son initialisation ni celle de tous les autres membres.
- Les homologues CO2 sont présents dans le schéma et le sérialiseur. Le modèle nerveux utilise l'O2 moyen pour le signal chémorécepteur ; le modèle cardiovasculaire ajoute ce signal au calcul de HR au début du cycle suivant.

L'omission est confirmée, son impact causal exact reste à isoler. Il ne s'agit pas d'un audit exhaustif du moteur. Le seuil inchangé ne permet pas de déclarer le rollback fiable. La répétabilité entre deux moteurs tous deux rechargés n'est pas une preuve de continuité avec le moteur d'origine.

## Reproduire

Après la préparation et le build décrits dans le [rapport initial](PHASE2_BUILD_ET_INITIALISATION.md) :

```text
python tools/pulse_probe/native_build.py --runtime-root RUNTIME probe-build
python tools/pulse_probe/native_build.py --runtime-root RUNTIME state-diagnostic
python tools/pulse_probe/analyze_state.py RUN_DIRECTORY
python tools/pulse_probe/audit_state_source.py RUNTIME/src RUN_DIRECTORY/source_audit.json
python tools/pulse_probe/analyze.py RUN_DIRECTORY
```

Le programme natif et le dernier analyseur renvoient **4**, échec attendu de continuité. L'analyseur des états peut terminer avec 0 lorsqu'il produit correctement son rapport d'échec : ce code ne signifie pas que le moteur satisfait le contrôle. Les 33 méthodes Python passent ; elles testent les contrats et outils, pas la validité physiologique. Pas de convergence du solveur ni scénario clinique évalué.

Résultats compacts : [traces et rapports](results/phase2-state-2026-10-17/README.md). États complets et journaux restent dans les deux dossiers horodatés sous `work/p2`, avec copie dans l'archive de livraison ; aucun moteur complet ajouté à Git.

## Prochain point de reprise

1. Préparer et revoir un essai distinct de sérialisation seulement : conserver la somme et le compteur de la moyenne O2 du cycle, et l'O2 moyen du cycle précédent, dans les deux sens. Ne pas modifier les équations ni remplacer une moyenne historique par une estimation.
2. Définir explicitement le traitement des anciens checkpoints : leurs informations perdues ne sont pas reconstructibles depuis le seul fichier ; rejet explicite ou migration qualifiée, sans valeur silencieuse par défaut.
3. Tester mémoire/reprise et reprise fraîche à plusieurs phases du cycle et horizons, au seuil original, sur un build distinct. Comparer aussi le chemin sans rechargement au moteur témoin. Conserver chaque échec et la provenance de chaque patch.
4. Examiner les autres écarts de reconstruction et l'exhaustivité des variables d'état avant de fermer le contrôle. Définir ensuite la politique de rollback ; préparer les critères physiologiques et de convergence avant tout exercice A.

Aucun correctif physiologique ou de sérialisation appliqué dans ce lot. Le seul changement du checkout Pulse reste celui de l'horodatage de compilation déjà déclaré. Canon, main, PR #1 et déploiement exclus.
