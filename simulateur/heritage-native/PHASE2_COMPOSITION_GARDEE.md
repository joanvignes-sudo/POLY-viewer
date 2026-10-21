# Composition explicite avec la garde native

Le raccord technique ajoute un backend explicite `guarded_bounded_baseline` à OrganismWorkbench, par `baseline_factory=GuardedLiveBaseline` ou CLI `--guarded`. Le défaut historique est conservé pour compatibilité ; il n’existe aucun repli silencieux du backend demandé. La relecture suit le type capturé dans le manifeste, pas une supposition sur le nom du dossier.

## Contrat du raccord

Le manifeste distingue profil de l’adaptateur/garde et profil numérique. Les enveloppes gardent execution_profile_sha256 pour le calcul et lifecycle_guard_profile/session_sha256 pour son encadrement. Le registre exige aussi ces deux empreintes de garde ; elles ne remplacent ni l’entité patient, l’horloge native ou les statuts documentaires. Toute l’admission est reconstruite après fermeture.

La preuve portable contient le profil numérique et, pour ce backend seulement, le profil de garde distinct. Son vérificateur standard contrôle leurs liens, les champs de provenance et le manifeste de garde identifié dans la table des empreintes. Les archives historiques sans garde restent lisibles sans inventer ces champs. Le paquet reste une vue d’archive, pas une requalification du runtime courant.

L’export utilise les octets/empreintes capturés par les lecteurs forts et refuse un changement entre vérification et publication : manifeste, profil ou source finale. Ce contrôle ne constitue pas un verrou contre toute mutation non coopérante ni une garantie de stockage atomique distribué.

## Protocole de qualification

Avant utilisation du raccord : quatre ancres, cinq horizons, 180 comparaisons au seuil inchangé ; références consultées sans avancer le moteur ; façade/registre/relecture/native/portable cohérents. Vérificateur portable exécuté en processus Python isolé avec son seul fichier. Échecs : perte du manifeste de garde, admission refusée après un avancement réel, mort du parent sans adoption, export d’une source changée et deux refus de provenance/profil après re-hash de test. Relire des runs historiques sans mutation. CLI explicite et lecture automatique par manifeste à vérifier séparément.

## Résultats

[Synthèse machine](PHASE2_COMPOSITION_GARDEE_RESULTATS.json), [rapport natif](results/phase2-guarded-composition-2026-10-18/report.json), [quatre vues approuvées](results/phase2-guarded-composition-2026-10-18/trusted-bundles.json).

guarded-workbench-20261018-105201 : quatre trajectoires/cinq horizons/six ports, 180 comparaisons, provenance des deux profils et registre entièrement reconstruits. Quatre contrôles portables avec le seul vérificateur copié et Python -I, sans moteur. Références relation/temps global/registre stable/C13 consultées sans progression native ; relecture historique v0.1 inchangée.

Trois échecs réels : manifeste de garde retiré, refus injecté du coordinateur après avancement natif réel, parent terminé par os._exit(86). Dernière trame admise conservée, enfant récolté ou sorti sur EOF, pas d’adoption/rollback implicite. Trois refus : source modifiée avant export et faux profil/provenance après re-hash de test. Sept tests nouveaux et 282 tests au total ; CLI --guarded et relecture par manifeste vérifiées. Les paquets négatifs complets restent dans le workspace ; seuls les quatre paquets approuvés sont suivis.

Le défaut historique de CLI reste inchangé. Pour une nouvelle session gardée, choisir explicitement --guarded ; aucun repli vers le contrôleur historique si la qualification de garde manque. Aucun scénario, action biologique, couplage neuronal ou phase 3–5 n’est engagé.
