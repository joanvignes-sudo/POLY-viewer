# Adaptateur de références POLY en lecture seule

`tools/organisme_entier/canon_reference_adapter.py` résout les preuves déjà présentes sans modifier le canon, fusionner la PR #1 ou créer de valeurs de simulation. Les empreintes attendues viennent de l'inventaire versionné ; elles ne sont pas calculées depuis un fichier observé puis approuvées automatiquement.

Trois couches restent distinctes : registre documentaire stable v1.2 de main, modèle de relations v0.2 de la branche PR #1 lu au commit épinglé (recherche, non promu en main), et corpus C13 local séparé fourni explicitement. Deux sources Git sont lues par objet immuable, sans checkout, objet de remplacement, diff externe, textconv ou récupération réseau paresseuse. Les snapshots vérifiés sont ensuite mis en cache ; une nouvelle instance est nécessaire pour vérifier la fraîcheur d'un fichier local modifié.

## Références résolues

| Famille | Nombre |
| --- | ---: |
| Relations de recherche | 86 (74 MEASURED, huit RECONSTRUCTED, quatre ND, statuts natifs) |
| Connecteurs / chaînes / observations temporelles / catalogue de sources | 74 / 12 / 39 / 90 |
| C13 : groupes / nœuds / liens | 10 / 80 / 92 |
| Registre stable : observations / concepts / relations typées | 18 / 71 / 63 |
| Registre stable : transitions / contraintes / modèles de capacité | 5 / 23 / 7 |
| Total de références consultables dans ces familles | 670 |

Ces nombres comptent des références documentaires hétérogènes, pas des preuves indépendantes additionnables. Les statuts `ETABLI`, `contesté/nuancé`, `M`, etc. restent ceux de leur champ source ; aucun vocabulaire uniforme n'est imposé. Les portées, espèces/préparations et caveats restent dans la vue native. Les coordonnées/layouts présents ne deviennent pas des coordonnées anatomiques enregistrées.

Les objets C13 exigent groupe + type + identifiant : aucune collision de nom n'est résolue par supposition. Chaque paquet conserve le contexte d'espèce/étude du groupe et la qualification de lecteur originale, y compris les champs biologicalTime/dataset/participants/experiment manquants et scientific_validation=false. Une latence globale Q01 n'est jamais distribuée automatiquement sur ses relations élémentaires.

## NaN natifs : préserver sans propager

Le registre stable contient **169 jetons NaN non cités**. Les octets originaux et leur empreinte sont conservés. Le lecteur utilise une représentation intermédiaire dédiée, puis une vue JSON stricte avec marqueurs :

```json
{"kind":"NATIVE_NONFINITE_LITERAL","native_token":"NaN","numeric_use_authorized":false}
```

Le paquet porte explicitement payload_view et la liste des pointeurs/jetons natifs. Le marqueur n'est ni zéro ni null, et n'est pas présenté comme le contenu JSON brut. Les chaînes ordinaires contenant le texte « NaN » ne sont pas changées. Les clés JSON dupliquées sont refusées ; Infinity et un lexème débordant tel que 1e400 sont également marqués dans les tests synthétiques. Aucune correction du fichier scientifique n'est réalisée.

## API, provenance et barrières

`describe()`, `list_references(kind)`, `resolve(kind, native_id, group_id=...)`, `close()`. Chaque paquet a kind=reference, namespace/version/identifiant/pointeur qualifiés, URI et SHA du fichier source, empreinte de l'inventaire, champ et statut originaux. numeric_propagation_authorized, dynamic_bridge_authorized et scientific_promotion_authorized sont false. Même une observation temporelle mesurée ne peut passer par to_numeric().

La vue interne ne constitue ni une nouvelle validation scientifique ni une approbation de redistribution. Les références d'articles sont conservées telles quelles, sans prétendre avoir vérifié ici leur contenu clinique ou leurs licences. L'adaptateur n'exécute aucun moteur, n'applique aucun événement et ne crée aucun raccord anatomique/causal.

Exemples depuis le dépôt :

```text
python tools/organisme_entier/canon_reference_adapter.py --kind research.relation --native-id R-E01
python tools/organisme_entier/canon_reference_adapter.py --kind research.temporal --native-id Q01
python tools/organisme_entier/canon_reference_adapter.py --kind registry.relation --native-id REL-0001
python tools/organisme_entier/canon_reference_adapter.py --c13 PATH_TO_ORIGINAL_C13 --kind c13.node --native-id P01-LIGHT --group-id P01
```

Qualification : les 670 références résolues, statuts 74/8/4 inchangés, trois empreintes natives vérifiées, index de preuves limité aux identifiants/pointeurs/statuts/empreintes (pas de copie des corpus complets), C13/HEAD/état Git inchangés, zéro processus natif Pulse. Treize tests spécifiques. [Résultats](PHASE2_REFERENCES_CANON_RESULTATS.json).
