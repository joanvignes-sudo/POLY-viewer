# Contrat d'interface/adaptateur v0.1

Proposition technique de phase 1, hors canon. [Contrat machine](CONTRAT_ADAPTATEUR.json) et garde-fous sémantiques dans `tools/organisme_entier/contract.py` : ce validateur n’appelle aucun moteur. Des intégrations techniques bornées ont ensuite été qualifiées en phase 2 ; leur [carte API actuelle](API_TECHNIQUE.json) et le [guide de reprise](REPRISE_TECHNIQUE.md) les distinguent du cycle générique futur. Le candidat n’est pas promu automatiquement.

Le [candidat Pulse](PULSE_ADAPTER_CANDIDAT.json) et la [revue de phase 1](REVUE_PHASE1.md) précisent maintenant les signatures natives, les ports et les limites vérifiés. `pulse_contract.py` valide statiquement le descripteur et les événements d'intensité synthétiques ; il ne sérialise ni ne transmet d'action au moteur.

L'adaptateur de référence hors ligne `reference_adapter.py` résout maintenant des objets HRA/ApiNATOMY depuis trois [entrées verrouillées](REFERENCES_VERROUILLEES.json). Il vérifie SHA-256, version, licence déclarée et identifiant natif, retourne une copie de l'objet et sa provenance, sans réseau ni écriture de source. Il ne certifie pas juridiquement une licence fournie par le descripteur : la qualification documentaire est consignée séparément. La résolution d'une référence n'autorise aucune propagation numérique. Détails et reproduction dans la [sortie de phase 1](QUALIFICATION_REFERENCE_ET_BUILD.md).

Un adaptateur possède un identifiant, une version, l'artefact externe épinglé, une licence vérifiée pour l'artefact choisi, un domaine, des capacités et des ports. Deux familles : `reference` (résolution d'identifiants, sans écriture d'état) et `dynamic` (états/événements). Les capacités non déclarées sont indisponibles. Les URI de modèle, atlas, dataset ou article ne sont pas interchangeables.

Cycle futur : `describe() -> capabilities`; `resolve(native_ref) -> assertion envelope`; pour dynamic seulement : `initialize(run_manifest)`, `read(request)`, `apply(event)`, `advance(target_time)`, `checkpoint()`, `restore(checkpoint)`, `close()`. Une capacité restore absente interdit le rollback ; le coordinateur doit choisir un mode sans rollback avant le run. Les événements portent une clé d'idempotence et un ordre stable. Un adaptateur référence ne peut avancer un patient.

Enveloppe de sortie v0.1 : voir exemple synthétique dans les tests. Champs obligatoires : `kind`, `entity_ref` (namespace, version/digest, native_id, pointer), `quantity`, `value`, `unit`, `clock` (id, origin, time, unit), `species`, `owner`, `evidence_status`, `provenance` (URI et version de source), `limitations`. Une valeur ND est `null`, avec justification ; elle ne participe pas à un couplage numérique. Espèce et provenance ne sont jamais inférées à partir d'un libellé.

Le prototype `validate_exchange` vérifie l'enveloppe et exige : port récepteur déclaré, mêmes quantité/unité/espèce/horloge, un seul propriétaire, valeur finie et disponible, preuve d'origine. Les conversions et alignements ne sont pas implémentés : une différence provoque un rejet. Un futur convertisseur devra produire sa propre provenance et subir ses tests. Un appel numérique peut consommer une sortie SIMULATED dans un run exploratoire ; il ne peut pas l'étiqueter MEASURED. Une mesure peut être lue en tant qu'observation isolée sans autoriser sa propagation causale.

Erreurs stables : `INVALID_ENVELOPE`, `ND_VALUE`, `NON_SIMULATION`, `UNDECLARED_PORT`, `QUANTITY_MISMATCH`, `UNIT_MISMATCH`, `CLOCK_MISMATCH`, `SPECIES_MISMATCH`, `OWNER_CONFLICT`. Le prototype applique un garde-fou plus strict au couplage numérique : seules les sorties SIMULATED passent. Les observations restent consultables via les adaptateurs de référence.

À tester depuis la racine du dépôt, avec Python 3.10+ sans bibliothèque tierce :

```text
python -m unittest discover -s tools/organisme_entier -p "test_*.py" -v
python tools/organisme_entier/check.py
python tools/organisme_entier/inventory.py --git GIT_EXECUTABLE --c13 PATH_TO_ORIGINAL_C13_JSON
python tools/organisme_entier/inventory.py --git GIT_EXECUTABLE --c13 PATH_TO_ORIGINAL_C13_JSON --check
```

L'inventaire lit les objets Git épinglés (pas le working tree d'une branche de recherche) et l'artefact local C13. Il ne lit ni n'écrit de base distante. Sur une autre machine, fournir le même C13 (hash attendu dans INVENTAIRE) ; ne pas télécharger une nouvelle version sous le même nom. L'absence de l'artefact est un blocage identifié, jamais un inventaire vide accepté. Vérifier le diff avant de conserver un inventaire régénéré.

Raccord technique séparé : [sorties Pulse engagées](PHASE2_SORTIES_POLY.md), façade `committed_output_reader` limitée à describe/read et aux enveloppes d’état existantes. Elle ne déclare pas le cycle dynamique ni la famille référence HRA intégralement implémentés. Candidat et contrat machine préservés.
