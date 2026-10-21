# Consultation des preuves gardées actuelles

Le livrable local POLY_BANC_CONSULTATION_2026-10-18.html est maintenant construit explicitement depuis le [registre des quatre vues gardées](results/phase2-guarded-composition-2026-10-18/trusted-bundles.json). La [qualification initiale de consultation](PHASE2_CONSULTATION_LOCALE.md) reste historique et ses quatre paquets/proofs ne sont pas réécrits.

Le générateur accepte --bundle-registry uniquement pour un registre sous docs/organisme-entier/results. Il exige les quatre ancres approuvées et une seule famille d’exécution par vue, vérifie chaque paquet avec le checker portable et conserve leurs octets après décodage JSON. Les sources canoniques restent vérifiées contre le même inventaire et leur qualification. Aucun moteur, serveur ou accès distant n’est lancé.

Le panneau « Garde de session » apparaît uniquement après vérification d’un paquet gardé qui déclare la liaison du résumé final à la fermeture. Source montre les empreintes du profil numérique et du cycle de vie dans deux lignes distinctes, ainsi que le manifeste de garde ; l’enveloppe complète reste consultable. Un paquet refusé retire également ce panneau, avec les valeurs/références/provenance/download précédents. Aucun statut de simulation n’est promu en mesure.

## Reproduction

```text
python tools/organisme_entier/build_evidence_view.py --output OUTPUT_DIRECTORY/POLY_BANC_CONSULTATION_2026-10-18.html --bundle-registry docs/organisme-entier/results/phase2-guarded-composition-2026-10-18/trusted-bundles.json --c13-original PATH_TO_ORIGINAL_C13_JSON
```

Une sortie existante exige --replace-generated et un reçu correspondant à ses octets ; un changement étranger reste refusé. Le défaut de génération vers les paquets historiques est conservé, le registre courant est un choix explicite. Le reçu nomme ce registre, la famille d’exécution et les quatre garanties de fermeture observées.

## Résultats

[Synthèse](PHASE2_CONSULTATION_GARDEE_RESULTATS.json), [rapport navigateur](results/phase2-guarded-local-view-2026-10-18/report.json), [reçu de génération](results/phase2-guarded-local-view-2026-10-18/build.json).

120 valeurs exactes, quatre trajectoires/cinq instants, provenance complète, profils distincts et résumé lié à la fermeture visibles ; téléchargement identique par SHA. Sélection rapide et clavier, cinq largeurs 320–1440 px sans débordement, provenance complète mobile, cibles tactiles 44 px, clair/sombre inspectés. Trois refus : hash corrompu, portée scientifique interdite après re-hash de test, crypto indisponible. Zéro requête distante/erreur console/page et zéro Pulse. Deux nouveaux tests du générateur, huit spécifiques et 284 tests au total.

Le HTML courant est un artefact de consultation local d’environ 667 Ko. Ses données restent archivées SIMULATED ; cette consultation n’exécute pas la marche, le bruit, l’exercice, une brûlure ou un autre événement. Le contrôle intégré du paquet ne constitue pas une authentification indépendante de l’ensemble du HTML : conserver son reçu et le registre épinglé séparément.
