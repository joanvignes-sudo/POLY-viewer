# Conformité P2-01 : capacités et limites

POLY dispose de sondes natives Pulse et d’une restauration expérimentale fermée ; le cycle général d’un adaptateur dynamique POLY reste non implémenté. Le contrat et le candidat statique sont conservés. La [matrice structurée](PHASE2_CONFORMITE_CAPACITES.json) lie chaque capacité à sa preuve et sa portée.

| Capacité | Qualification réelle |
| --- | --- |
| describe | Descripteur candidat statique ; aucun adaptateur dynamique installé |
| initialize | Initialisation native d’un patient synthétique de référence |
| read | Neuf sorties fixes, dont le temps ; pas de méthode générale d’enveloppes d’état |
| apply | Non exécuté ; aucun événement biologique appliqué |
| advance | Pas natif 0,02 s, horizons fixes sur checkpoints épinglés ; pas de scheduler couplé |
| close | Gestion de l’enfant direct et timeout ; pas de cycle général d’adaptateur |
| checkpoint | Quatre états moteurs connus ; aucun nouvel état final arbitraire exporté |
| restore | Moteur/patch/données/patient/horloge exacts, ensemble fermé ; pas de rollback général |
| Identifiants d’opération | Déduplication des restaurations ; pas des événements biologiques |

L’échec de continuité du moteur original reste FAIL au seuil initial. La correction O2 et ses résultats appartiennent au profil expérimental isolé ; ils ne reclassent pas cet échec et ne modifient pas le canon. Une enveloppe technique de checkpoint n’est pas une relation biologique mesurée. Le statut des 86 relations reste 74 MEASURED, huit RECONSTRUCTED, quatre ND.

La [matrice de refus CLI](PHASE2_TRANSACTION_REFUSAL_RESULTATS.json), son [protocole préalable](PHASE2_TRANSACTION_REFUSAL_PROTOCOL.json) et ses [preuves](results/phase2-transaction-refusals-2026-10-18/README.md) couvrent huit injections sur un fixture natif possédé : plan, nonce du guard, reçu, verrou, pointeur JSON invalide, preuve de fin, guard archivé dupliqué, identifiant sortant. Chaque commande renvoie code 4 avec l’erreur prévue, ne change aucun octet du snapshot et ne crée aucune tentative. Le pointeur invalide est refusé dès l’ouverture du répartiteur. Après retrait contrôlé des seules injections du fixture, la reprise valide aboutit sans nouveau worker ni adoption du résultat non engagé. Un worker initial, neuf comparaisons diagnostiques. Les 127 méthodes Python restent réussies.

L’audit ne couvre pas tout stockage hostile, corruption ou panne arbitraire. Les anciennes preuves sans transaction, fenêtre avant identité enfant, panne électrique et cycle complet restent ouverts. Les critères physiologiques/convergence et l’autorisation de scénario sont préalables à A/B/C ; aucun n’est exécuté ici.

Prochain lot de build : inventorier imports DLL réels, dépendances statiques, licences/NOTICE depuis les sources locales épinglées. Le candidat conserve sa réserve sur les obligations binaires. Cette revue ne distribue pas de moteur et ne change pas les capacités scientifiques ou le contrat.
