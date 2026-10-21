# Inventaire local des dépendances et licences

Mise à jour : le [profil explicite DLL v2](PHASE2_DLL_V2.md) ajoute maintenant les contrôles de fichiers et modules avant stdin. L’entrée historique v1 et le manifest candidat d’inventaire restent inchangés ; les limites ci-dessous décrivent le lot d’inventaire.

L’inventaire porte sur les octets du worker épinglé, sa règle de liaison Ninja et les imports PE déclarés par llvm-readobj. Il n’exécute pas le moteur et ne vérifie pas encore les chemins des modules effectivement chargés. Les [résultats](PHASE2_RUNTIME_AUDIT_RESULTATS.json) et [preuves](results/phase2-runtime-audit-2026-10-18/README.md) conservent empreintes et textes locaux.

| Couche | Observation |
| --- | --- |
| Archives explicitement liées | 81 : libPulse, protobuf, 78 Abseil, utf8_range |
| DLL locales déclarées | libc++.dll, libunwind.dll, libwinpthread-1.dll ; candidats uniquement dans le bin LLVM attendu parmi les trois emplacements locaux inspectés |
| Dépendances Windows | KERNEL32, ADVAPI32, dbghelp et déclarations API CRT ; non copiées et non résolues dans ce lot |
| Dépendance d’en-têtes configurée | Eigen ; contribution précise des fichiers/en-têtes au binaire encore à établir |
| Outils séparés | CMake, Ninja, JDK, compilateur LLVM, environnement Python de génération/contrôle ; absence des imports du worker ne qualifie pas leur redistribution |

Les dix preuves locales couvrent LICENSE et NOTICE Pulse (avec ascendance BioGears), protobuf, utf8_range, Abseil, avis Eigen et MPL2, LLVM avec exceptions, notices runtime MinGW et winpthreads. Les libellés du rapport décrivent les textes trouvés ; leur applicabilité complète par fichier/composant et toutes les obligations de redistribution ne sont pas qualifiées. Le mélange d’avis dans Eigen ou MinGW n’est pas attribué indistinctement à tout le worker. Le contrat/candidat ne sont pas promus à un statut de distribution approuvée.

Les recettes locales épinglées et leurs lignes de versions/URL sont distinctes des archives réellement liées, dont les empreintes sont enregistrées séparément. Aucun binaire, atlas, modèle ou donnée complète n’est copié dans Git ou dans l’archive de livraison de ce lot ; seuls métadonnées, sorties d’inspection et textes de licence nécessaires sont conservés. Les aspects données/patient/modèle et outils/contrôleur restent des revues distinctes.

Limite technique prioritaire : le précontrôle de restauration vérifie actuellement worker, libPulse, contexte et données, mais pas ces trois DLL. Le [manifest candidat](PHASE2_DLL_CANDIDATE_MANIFEST.json) les inventorie avec chemins/tailles/empreintes/imports, sans appliquer de contrôle au runtime. Le chargement effectif peut être influencé par les règles de recherche Windows ; les chemins inspectés à disque ne prouvent pas les chemins chargés.

Prochain lot : lier explicitement une version de contexte aux DLL candidates et vérifier les modules réellement chargés avant de transmettre le checkpoint par stdin. Qualifier manque, changement et masquage, puis continuité native. Préserver les anciens bindings, pointeurs, reçus et échecs ; une nouvelle attente n’autorise aucune migration implicite. Les matrices précédentes gardent leur portée sur cet hôte ; elles ne prouvent pas une sécurité générale de chargement DLL.

Le script d’audit a été exécuté avec succès et ses 16 artefacts vérifiés. Les 127 tests Python restent le socle de régression ; aucun chemin de restauration ni équation modifié. Canon, seuil, échec initial, main et PR #1 préservés ; aucun scénario A/B/C, téléchargement ou déploiement.
