# Sorties Pulse vérifiées vers les enveloppes POLY

Reprise explicitement autorisée le 18 octobre pour quatre heures supplémentaires, jusqu'à 14 h 36 Europe/Paris (12 h 36 UTC). Le chantier technique reprend en continu ; les phases 3–5 et scénarios A/B/C restent exclus. Le bilan nocturne est conservé comme photographie historique.

## Raccord livré

`tools/organisme_entier/pulse_output_adapter.py` expose `PulseOutputAdapter.describe()` et `read(operation_id)` sur une opération DLL v2 déjà COMMITTED. Cette façade de lecture réutilise les enveloppes d'état du contrat ; elle n'annonce pas le cycle dynamique complet ni les capacités de la famille référence HRA. Son type explicite est `committed_output_reader`. Le candidat dynamique historique reste inchangé.

Six sorties sont traduites sans conversion : fréquence cardiaque (1/min), pression artérielle moyenne (mmHg), fréquence respiratoire (1/min), ventilation pulmonaire totale (L/min), température centrale (degC) et métabolisme total (W). Temps, pression O2 et facteur chémorécepteur restent des colonnes techniques ; aucun nouveau port n'est inventé.

La lecture vérifie reçu, requête, bindings v2, pointeur de l'opération, rapport, enveloppe connue, identité du patient synthétique, preuve des trois DLL et sorties numériques contre les références persistées. Les octets CSV capturés sont revérifiés au seuil original 1e-9. Un module encore présent est revérifié sur disque : cette version exige donc le runtime local intact, même pour une lecture historique. Ce contrôle ne certifie pas les chargements tardifs ni les modules OS.

Chaque valeur porte SIMULATED, son unité, espèce human, propriétaire pulse.whole_body, référence native du patient initial par empreinte, origine de l'horloge, temps natif flottant exact, tick d'alignement et provenance détaillée : moteur/patch/worker/bibliothèque/données/patients/configuration/DLL, reçu, CSV/ligne/colonne, logs et enveloppe. Aucun statut scientifique existant n'est promu. Les champs CurrentPatient décrivent le checkpoint de départ, sans prétendre capturer le patient au dernier horizon.

Les trajectoires restaurées indépendamment ont des horloges distinctes, même si leur étiquette run est identique : l'identifiant inclut l'UUID de tentative. L'égalité d'un tick ne démontre pas un alignement inter-études ou entre simulations. L'horodatage natif est conservé ; le tick ne remplace pas le temps réellement observé.

La porte OS exclut les autres clients coopérants pendant la lecture. Verrou d'opération/restauration ou récupération en attente = refus conservateur. Aucun Pulse, reçu, pointeur ou récupération n'est lancé ou modifié. Une lecture historique ne rembobine pas le dernier succès. Le point observé à la fin n'est pas présenté comme un checkpoint restaurable.

## Reproduire

Depuis le dépôt, Python stdlib et runtime local préalablement qualifié :

```text
python tools/organisme_entier/pulse_output_adapter.py --runtime-root ../p2 --output-root EXISTING_V2_OUTPUT_ROOT --run-id LOCAL_RUN_LABEL --operation-id COMMITTED_ID
python tools/pulse_probe/qualify_output_adapter.py --runtime-root ../p2
python -m unittest discover -s tools/organisme_entier -p "test_*.py" -q
python tools/organisme_entier/check.py
```

La CLI écrit le JSON en sortie standard. Une racine absente est refusée sans création. Aucune sélection de binaire/runner/profil historique n'est exposée. Code 4 et OUTPUT_READ_REJECTED indiquent un refus ; aucune remise à zéro ou adoption d'un résultat orphelin.

Qualification : quatre vrais processus DLL v2, 180 comparaisons natives de préparation et 120 enveloppes sémantiques validées sur six ports/cinq horizons. La commande séparée produit les mêmes enveloppes que la bibliothèque, sans nouvelle tentative ni changement d'octets runtime. Le premier essai est conservé ; la répétition finale inclut l'isolation des horloges de trajectoire. Résultats et empreintes : [rapport structuré](PHASE2_SORTIES_POLY_RESULTATS.json).

Limites : lecteur local de résultats engagés sur ensemble fermé ; aucune application d'événement biologique, initialisation générale, export d'état final, convergence, couplage causal ou validation physiologique. Le contrat générique et le descripteur dynamique restent candidats ; ce raccord ne les rend pas intégralement exécutables.

Prochaine étape technique : manifeste de session explicitement lié au contexte, commandes bornées d'ouverture/restauration/lecture/fermeture, réouverture et refus de capacités indisponibles ; réutiliser le contrôleur et ses protections au lieu de créer un second chemin natif.
