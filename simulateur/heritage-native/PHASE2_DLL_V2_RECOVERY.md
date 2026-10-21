# Récupérations et transactions propres au profil DLL v2

Les outils de qualification acceptent désormais --dll-v2 via QualificationProfile : bindings, enveloppes, contrôleur et commande CLI v2 sont sélectionnés ensemble. Les anciennes commandes sans option et leurs rapports restent v1 ; aucune promotion ou migration implicite. Le runtime et les équations ne sont pas modifiés dans ce lot.

Le [protocole préalable](PHASE2_DLL_V2_RECOVERY_PROTOCOL.json), les [résultats](PHASE2_DLL_V2_RECOVERY_RESULTATS.json) et les [preuves](results/phase2-dll-v2-recovery-2026-10-18/README.md) couvrent 24 cas spécifiques :

| Matrice | Cas et résultats |
| --- | --- |
| Transactions | Six sorties réelles de parent aux frontières nommées, branche non engagée et déjà engagée ; 54 comparaisons des workers initiaux |
| Refus CLI | Huit injections possédées ; refus sans changement d’octets ni nouveau worker ; neuf comparaisons initiales |
| Durée de vie de l’enfant | Quatre cas : propriétaire vivant, mort avant stdin, mort pendant calcul, restauration normale ; 45 comparaisons normales et 45 diagnostiques sur l’orphelin sans adoption |
| Exclusion | Six cas entre processus exécution/récupération, libération du verrou OS et récupération avant mutation ; neuf comparaisons |

Chaque worker de ces matrices utilise le contexte v2 et la vérification des modules avant checkpoint stdin. Le signal de test avant entrée v2 attend explicitement la preuve de modules. Les marqueurs de disponibilité des fixtures sont publiés atomiquement, afin que le contrôleur ne lise pas un JSON en cours d’écriture.

Les invariants restent les mêmes : pas de worker lancé pendant reprise/refus ; pas d’adoption d’un candidat non engagé ou de sorties orphelines ; pointeur exact conservé ; guard et verrous d’origine archivés avec leurs octets ; propriétaire ou enfant vivant refusé ; seconde reprise sans mutation tant que le contexte n’a pas changé. Les quatre rapports complets et leurs empreintes sont vérifiés. Les 141 méthodes Python passent.

La qualification couvre ces frontières et fixtures sur cet hôte Windows. Les anciens guards sans transaction, fenêtre avant identité de l’enfant, modules OS non épinglés, chargements tardifs, stockage/panne électrique et cycle général de l’adaptateur restent ouverts. Le contrôle DLL v2 n’améliore pas rétroactivement l’entrée v1. Aucun rollback général, scénario A/B/C ou déploiement annoncé.

Les [timeouts réels v2](PHASE2_DLL_V2_TIMEOUT.md) et la [synthèse technique](BILAN_TECHNIQUE_P2_01.md) sont maintenant livrés ; aucun nouveau lot expérimental engagé. Canon, seuil, échec initial, main et PR #1 restent préservés.
