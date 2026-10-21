# Consulter un run fermé sans moteur installé

Le [manifeste de composition réel](COMPOSITION_TECHNIQUE.json) décrit les composants, capacités et barrières actuellement implémentés. Les atlas/connectivités restent des références non enregistrées dans le runtime ; OpenSim/CellML/BioModels ne sont pas sélectionnés. Aucun scénario A/B/C ou raccord neurophysiologique n'est déclaré actif.

`tools/organisme_entier/portable_evidence.py` exporte une vue d'un banc **déjà fermé et vérifié**. Avant export, le lecteur natif vérifie la fermeture, les sources/profils et la reconstruction de l'historique d'admission. Le paquet contient les observations, le snapshot, les textes JSON des manifests et des empreintes de sources. Aucun moteur, DLL, bibliothèque, modèle complet, état patient complet ou corpus scientifique n'est inclus.

## Une empreinte de confiance séparée

Le fichier d'export et son reçu sont publiés sans écraser un fichier existant. Une sortie dans le run source est refusée. Les empreintes attendues des quatre paquets qualifiés sont conservées dans [le registre de confiance](results/phase2-portable-evidence-2026-10-18/trusted-bundles.json).

L'inspection exige une empreinte attendue fournie séparément. Elle n'utilise pas l'empreinte calculée depuis le fichier à vérifier comme approbation automatique. Une modification, même un espace, ne passe plus avec l'ancienne empreinte. Le modèle de confiance reste celui du registre/version Git ou du reçu conservé par l'utilisateur ; un fichier et une empreinte tous deux fournis par une source inconnue ne constituent pas une authentification indépendante.

Le vérificateur d'inspection est un seul fichier Python utilisant la bibliothèque standard. Il n'importe pas le runtime, ne lit pas les chemins de modèles contenus comme métadonnées, ne lance pas Pulse et n'a pas besoin du dépôt ou de Git. Il contrôle intégrité du paquet, schémas/portée, manifests, six unités/quantités, statuts SIMULATED, entité, horloge, trajectoire, liens de provenance et cohérence du dernier snapshot.

```text
python portable_evidence.py inspect --package body-1500.json --expected-sha256 TRUSTED_SHA256_FROM_SEPARATE_RECORD
```

Créer un paquet sur le workspace qualifié :

```text
python tools/organisme_entier/portable_evidence.py export --runtime-root ../p2 --source-root CLOSED_BODY_ROOT --destination EXISTING_OUTPUT_DIRECTORY/view.json
```

## Portée exacte du résultat

PASS_PORTABLE_EVIDENCE_INTEGRITY signifie **vue archivée intègre par rapport à l'empreinte attendue**, avec structure technique cohérente. Il ne signifie pas nouveau test du moteur, nouveau contrôle des DLL présentes sur l'hôte, validation clinique/scientifique, alignement biologique des sources ou autorisation de recréer un état patient. Les flags current_runtime_verified et scientific_validation restent false.

Les références documentaires gardent leurs statuts originaux dans une couche distincte. Les sorties physiologiques restent SIMULATED. Une augmentation frauduleuse du statut vers MEASURED, une fausse unité ou une revendication de validation scientifique sont refusées même dans les tests de paquets volontairement re-hashés.

## Qualification

Quatre paquets réels d'environ 139 Ko, cinq observations/six sorties par paquet. Quatre vérifications réussies avec le fichier de contrôle copié seul dans un répertoire isolé et Python en mode -I. Six refus (octets modifiés, promotion, unité, validation scientifique, destination existante, run abandonné), sources runtime inchangées et zéro processus Pulse. Les paquets de tests négatifs complets restent locaux ; le code de mutation et les erreurs attendues sont conservés, les quatre seules vues approuvées figurent dans le registre de confiance. Huit tests spécifiques ; [rapport](PHASE2_PREUVES_PORTABLES_RESULTATS.json).

La [vue de consultation locale](PHASE2_CONSULTATION_LOCALE.md) utilise ces paquets comme données archivées, sans commande d’action/simulation. Le [durcissement des fermetures](PHASE2_AUDIT_INTERFACES.md) ajoute aux nouveaux exports la garantie observée du snapshot source ; les anciens paquets ne sont pas promus rétroactivement.
