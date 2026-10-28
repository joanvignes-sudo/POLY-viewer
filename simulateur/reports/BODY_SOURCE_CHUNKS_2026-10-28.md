# POLY — Préparation du vrai chargement par zones : découpage vérifiable des géométries

**Date :** 28 octobre 2026  
**Statut :** **prototype de construction, non déployé**, sur branche isolée empilée sur le mode léger. Aucune géométrie de sortie ni modèle biomédical n'est ajouté au dépôt par cette opération.

## Pourquoi ce lot existe

Le corps 3D utilise encore un seul binaire décompressé de 30 693 264 octets. Le mode léger de POLY permet de naviguer sans l'ouvrir, et la création des géométries 3D a été fractionnée dans le temps. Mais pour **charger réellement les structures à la demande**, il faut en amont un format de sources découpées en fichiers indépendants, conservant des preuves de concordance avec les surfaces d'origine.

## Reproduction exacte

Depuis la racine du dépôt :

```sh
python simulateur/scripts/build_body_source_chunks.py \
  --output-root /tmp/poly-body-source-chunks \
  --max-chunk-bytes 4194304 \
  --verify
```

Le répertoire de sortie doit être vide. Le programme refuse de remplacer une sortie déjà présente. Le test GitHub Actions exécute cette même opération dans le répertoire **temporaire** de la machine CI et ne publie pas les artefacts.

Entrées protégées :
- `simulateur/models/body-display.json.gz` — sha256 du JSON décompressé attendu `cf140a39c11163508e91e12b0df9820e6e36ea2f2b50392f62cd9f404fea1573`.
- `simulateur/models/body-display.bin.gz` — sha256 du binaire décompressé attendu `41fb852fb1c3d00dd8be90150226f92e5adf1d1fc783cb1223945f3a4ba229c4`.

Ces empreintes sont celles déclarées par le gestionnaire de ressources POLY ; une divergence bloque la construction plutôt que de réinterpréter silencieusement les données.

## Méthode

1. Décompresser les fichiers d'origine **en lecture seule** et vérifier les empreintes.
2. Pour chacune des 918 entrées existantes : conserver `name`, `path`, `node`, `bounds`, compte de sommets, triangles et autres métadonnées. Déterminer le groupe de système selon les mêmes chemins que le lecteur existant.
3. Extraire **à l'octet près** les trois zones originales : positions (`vertex_count × 3 × 4`), normales (`vertex_count × 3 × 4`) et indices (`triangle_count × 3 × 4`). Vérifier alignement et indices locaux.
4. Regrouper les structures **sans découper une structure en deux**, dans un budget cible de 4 Mio de données géométriques brutes. Les éléments individuels dépassant ce budget restent isolés dans un bloc et sont signalés comme dépassant le budget — jamais amputés.
5. Pour chaque bloc : réassembler des octets identiques, modifier seulement les **décalages des trois zones dans le nouveau fichier**, conserver les anciens décalages sous `source_offsets`, stocker `source_index`, calculer SHA256 du binaire brut, de sa version gzip et des métadonnées.
6. Écrire `MANIFEST.json` contenant la liste exhaustive des indices d'origine, catégories, tailles, empreintes et dépassements du budget.
7. En mode `--verify` : relire les sorties, vérifier les SHA256, décompresser chaque bloc et comparer les positions/normales/indices **octet par octet** aux 918 objets source. Vérifier aussi les identifiants, métadonnées et l'absence de perte/doublon.

Les fichiers produits sont `chunks/<système>-<ordinal>.bin.gz` et `chunks/<système>-<ordinal>.json`. Les catégories servent au chargement graphique : **elles ne prétendent pas être une classification physiologique complète**.

## Ce qui est qualifié, et ce qui ne l'est pas

| Point | Preuve recherchée | Ne pas conclure |
| --- | --- | --- |
| Source d'origine | Empreintes SHA256 épinglées du binaire et JSON décompressés | Validité biologique du maillage |
| Structure individuelle | Copie exacte des octets positions, normales, indices, des autres champs du manifeste | Recalage humain individuel ou origine/insertion musculaire |
| Couverture du catalogue | 918 identifiants, chacun une seule fois | Exactitude exhaustive de l'anatomie |
| Taille des blocs | Budget visé 4 Mio bruts, **dépassement déclaré** | Budget GPU assuré ou streaming effectif |
| Compression | Gzip avec horodatage nul et empreintes | Licence de redistribution des données déjà approuvée |
| Tests de CI | Production/lecture/comparaison sur runner temporaire | Fichiers distribués ou validés sur Android |
| Moteur WebGL | **Aucune modification** par ce lot | Chargement régional à la demande déjà actif |

## Tests

Les tests `simulateur/tests/test_body_source_chunks.py` couvrent les fixtures synthétiques : complétude de l'inventaire, mutation interdite des octets, tampering des sorties, indices invalides, bornes hors fichiers, comportement d'une structure trop volumineuse et refus de sortie écrasée. Le workflow `attachments.yml` exécute **en plus** la reconstruction complète du vrai modèle, avec `--verify`.

La prochaine itération devra :
- qualifier les droits/licences de redistribution de chaque lot avant exposition publique ;
- définir un format de chargement minimal garantissant une seule copie CPU des blocs utiles, la libération des ressources WebGL et une stratégie de récupération ;
- produire les chunks candidats dans un espace de travail révisable, **puis** ajouter les assets explicitement approuvés au site ;
- tester sélections, maillages proches, altérations et modes hors-ligne dans le navigateur ;
- enregistrer des mesures réelles de mémoire et de FPS sur un Android physique.

**En l'état, aucune modification des champs physiologiques ni du dépôt public n'est réalisée. Le vrai streaming 3D reste ouvert.**
