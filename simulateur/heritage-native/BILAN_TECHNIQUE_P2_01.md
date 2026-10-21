# Bilan du périmètre technique autorisé P2-01

Le lot build/données/initialisation/baseline/reprise est achevé dans son périmètre expérimental fermé. Le relais nocturne a été mis en pause avant l’échéance, conformément à la consigne d’arrêt anticipé si tout le travail autorisé est terminé. **P2-01 global reste partiel : aucun scénario A/B/C ni convergence physiologique validée, aucun cycle général d’adaptateur ou phase 3–5 engagé.**

## Ce qui est livré

Le [plan directeur](PLAN_DIRECTEUR.md), [état machine](ETAT.json) et [journal](JOURNAL.md) sont les points de reprise permanents. Le canon neurobiologique demeure la base de POLY : 86 relations, statuts 74 MEASURED/huit RECONSTRUCTED/quatre ND ; C13 distinct, 80 nœuds/92 liens. L’inventaire a été reproduit exactement depuis les objets Git épinglés et le C13 original du workspace du 16 octobre, sans fixture QA ni réécriture de source.

Les couches externes restent séparées : Pulse fournit le moteur agrégé expérimental ; SPARC/SCKAN, ApiNATOMY et HRA ont des références/identifiants documentés ; OpenSim et CellML/BioModels restent à sélectionner selon un besoin qualifié. Aucun cerveau détaillé n’est couplé numériquement au corps et aucun corps complet animé n’est annoncé.

| Partie | Preuve et portée |
| --- | --- |
| Build et patient | [Construction/initialisation](PHASE2_BUILD_ET_INITIALISATION.md), installation confinée au workspace, baseline native |
| Moteur original | Échec de continuité conservé au seuil initial ; aucune reclassification |
| Correction O2 isolée | [Expérience](PHASE2_CORRECTION_O2.md) : 360 comparaisons ; 4542 lignes continues identiques au contrôle ; rejets des anciens états ; aucune équation modifiée |
| Checkpoints | [Bindings v1](PHASE2_CHECKPOINT_BINDINGS.json) conservés ; quatre états épinglés, contexte et précontrôles, 180 comparaisons séparées |
| Runtime v2 | [Profil explicite](PHASE2_DLL_V2.md) : moteur/patch/données/patient/horloge et trois DLL, chemins/SHA observés avant stdin ; 180 comparaisons + neuf CLI |
| Récupération v2 | [24 cas](PHASE2_DLL_V2_RECOVERY.md) : six transactions, huit refus CLI, quatre cas enfant/parent, six exclusions |
| Timeout réel v2 | [Deux essais](PHASE2_DLL_V2_TIMEOUT.md) : début de worker puis calcul engagé, enfant récolté, dernier succès inchangé, ID échoué non relancé |
| Dépendances/licences | [Inventaire](PHASE2_RUNTIME_AUDIT.md) : 81 archives, trois DLL, dix preuves locales ; aucune distribution approuvée |
| Contrôles finaux | 141 tests Python réussis ; contrôle du dossier et inventaire exact réussis ; Git/références protégées vérifiés |

Les résultats natifs sont SIMULATED ; les refus/qualifications techniques ne sont pas des mesures biologiques ou une validation physiologique. Les comparaisons de matrices différentes se recouvrent : ne pas les additionner en un score scientifique.

## Reprise pratique

Pour les nouveaux essais bornés, utiliser tools/pulse_probe/restore_dll_bound.py, les bindings/enveloppes DLL v2 et une nouvelle racine de sortie sous work/p2/o2-experiment. L’entrée historique reste v1, non liée aux DLL. Un ancien pointeur ou reçu n’est pas migré automatiquement ; ne pas mélanger les profils sur une racine.

Les commandes de préparation/inspection/reprise de transaction sont explicites. Une préparation publie une intention bloquante ; la reprise vérifie le plan et avance seulement les octets prévus. Les anciens guards sans transaction restent refusés. Aucun résultat non engagé ou orphelin n’est adopté ; une relecture n’écrit pas le pointeur. La relecture d’une transaction terminée est qualifiée avant tout changement ultérieur de contexte.

L’environnement natif et les états complets restent locaux dans work/p2. Les archives de livraison conservent métadonnées, sources de sondes, sorties/logs et preuves ; aucun moteur, DLL ou modèle complet n’est ajouté à Git ou à ces archives. Conserver ce workspace pour reproduire les essais ; une autre machine exige une nouvelle qualification de toolchain/runtime, pas une approbation implicite.

## Limites et décision suivante

L’échec du moteur original demeure FAIL. Le correctif O2 et le contexte DLL v2 sont des profils expérimentaux isolés ; ils ne sont pas fusionnés dans main ou la PR #1. Le cycle dynamique POLY complet, application/déduplication d’événements biologiques, scheduler couplé, convergence, rollback général et raccords anatomiques/physiologiques restent non implémentés ou non validés.

Les garanties sont bornées aux états/horizons et frontières nommées sur cet hôte Windows : modules OS approuvés par chemin sans empreinte, chargements tardifs après stdin, fenêtre avant identité de l’enfant, anciens guards, panne électrique/stockage arbitraire et obligations complètes de redistribution restent hors qualification. Un refus conservateur n’autorise pas de déverrouillage forcé.

La suite exige un nouveau périmètre explicite et des critères scientifiques/convergence préalables, conformément à l’instruction utilisateur « sans engager les phases 3–5 ni les scénarios A/B/C sans critères et autorisations nécessaires ». Le prochain travail peut être une intégration formelle d’adaptateur ou un protocole de scénario choisi et revu ; aucun n’est autorisé par ce lot technique clos. Main, PR #1, canon, identifiants, statuts, provenance et seuils sont préservés.
