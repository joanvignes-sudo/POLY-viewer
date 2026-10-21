# Audit transversal et durcissement de la façade

La revue manuelle du chemin façade → baseline → registre → archive a produit trois tests en échec avant correction : manifeste organisme absent, manifeste natif absent, résumé documentaire fermé modifié. Deux erreurs d’E/S n’étaient pas interceptées comme échecs terminaux ; le résumé final n’était pas lié par empreinte au marqueur de fermeture. [Échec initial conservé](results/phase2-interface-audit-2026-10-18/initial-failure.log).

## Corrections qualifiées

La façade transforme maintenant la perte du manifeste organisme ou une erreur d’E/S de la baseline en refus terminal : enfant exact possédé récolté, aucune commande supplémentaire, dernière trame admise conservée. Une indisponibilité physique d’écriture peut encore empêcher la persistance du diagnostic ; ce n’est pas une garantie contre une panne disque ni une récupération distribuée.

Les nouvelles fermetures `poly-technical-organism-closed/0.2` lient `organism-status.json`, le registre final, le manifeste et la fermeture native. Le snapshot CLOSED est persisté avant le marqueur final ; le marqueur est le point d’engagement. Une exception de publication donne FAILED et une interruption réelle avant le marqueur ne permet pas l’export comme run fermé. Après publication, une réponse perdue peut être remplacée par une relecture sans relance du moteur. Ce sont deux frontières nommées de mort de processus, pas une qualification de coupure électrique ou de crash à chaque instruction.

La relecture compare aussi contexte de références, compteurs et limites, horizon natif, reçu d’admission et registre entièrement reconstruit. Re-hasher une mutation de test n’autorise pas un faux compteur ou un faux reçu. Les fichiers de refus restent intacts.

Les fermetures v0.1 historiques sont conservées, sans migration silencieuse ni nouveau SHA. Leur relecture retourne `closed_snapshot_sha256_bound=false` et `V0_1_HAS_NO_FINAL_SNAPSHOT_DIGEST_BINDING`, tout en contrôlant les invariants sémantiques disponibles. Les nouveaux exports portables transmettent cette distinction ; les anciens paquets sans ce champ retournent « non enregistré », jamais true par déduction. Les quatre paquets approuvés de T7 et leur consultation T8 ne sont pas réémis ou promus rétroactivement.

## Résultats

[Synthèse machine](PHASE2_AUDIT_INTERFACES_RESULTATS.json), [audit natif](results/phase2-interface-audit-2026-10-18/report.json), [deux interruptions](results/phase2-interface-audit-2026-10-18/closure-boundaries.json).

- 257 tests Python, dont sept nouveaux tests de façade et un nouveau test portable.
- Quatre nouvelles trajectoires natives / 180 comparaisons au seuil original, cinq cas d’échec antérieurs répétés car le protocole de fermeture a changé.
- Deux pertes réelles de manifestes : aucun nouvel envoi natif, dernier état admis conservé et enfant exact terminé.
- Trois refus d’archives modifiées, dont deux après re-hash délibéré de test ; sources de preuve préservées.
- Relecture sans mutation d’un véritable run v0.1 antérieur, avec sa limite annoncée.
- Deux parents réellement terminés par `os._exit(86)` immédiatement avant/après le marqueur, enfant déjà fermé et récolté.
- Profil numérique, worker, moteur, seuil, C13 original et échec scientifique initial inchangés. Les vues complètes des tests restent locales ; seuls rapports/logs/empreintes sont suivis dans Git.

## Limite maintenue et point d’entrée recommandé

Le contrôleur natif historique épinglé `pulse_live_baseline.py` est conservé octet par octet. Appelé directement hors contexte, une perte de son manifeste ou certaines E/S avant envoi peuvent remonter au client avant son chemin de nettoyage. La façade qualifiée traite ces erreurs ; les autres clients doivent utiliser le gestionnaire de contexte et appeler abort lors d’une exception. Ce contrôleur ne doit pas être présenté comme un cycle dynamique général.

Une correction interne de ce contrôleur nécessiterait un profil distinct et sa qualification, en maintenant la lecture des preuves et sources historiques ; elle reste un item explicite du backlog technique, pas un changement furtif d’empreinte. Les capacités biologiques, restauration générale, anatomie, A/B/C et phases 3–5 restent indisponibles.

Lot ultérieur : une [garde native séparée](PHASE2_GARDE_NATIVE.md) contient maintenant ces pertes d’E/S sans modifier le contrôleur numérique historique. Sa qualification propre ne remplace pas celles des anciennes sessions ; la composition à la façade reste à qualifier distinctement.
