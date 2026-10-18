# H01 · annotations synaptiques · v0.110

Le programme entre échelles se poursuit dans le même prélèvement H01. Le registre scientifique EXPLORATION_v0.98.json est préservé.

- 180 annotations LINE C3, release 20210729, avec au moins une extrémité dans la fenêtre contexte acquise. Toutes les cellules spatiales recouvrantes des dix niveaux de sous-échantillonnage ont été lues ; identifiants dédupliqués.
- Six annotations désignent le segment 1072605926 comme partenaire postsynaptique. Ce n’est pas un inventaire de toutes les connexions de ce neurone.
- Coordonnées source multipliées par [8, 8, 33] nm, sans translation ni recalage ajouté. Les identifiants uint64 restent des chaînes décimales.
- Les données spatiales et les enregistrements by_id concordent exactement pour les 180 annotations ; les relations originales sont conservées.
- Localement, les 4 066 809 voxels du masque cible à 64 nm portent le même ID dans C3 et proofread_104. Cela ne constitue pas une correspondance globale entre segmentations.
- Contrôle de douze extrémités à 8 × 8 × 33 nm : neuf identifiants attendus retrouvés, trois voxels non étiquetés (0). Aucun déplacement ni remplacement d’identifiant appliqué.
- Nouveau détail image 256 × 256 × 32, 4 × 4 × 33 nm, autour de l’annotation 95480769. Son masque source est à 8 × 8 × 33 nm. Les deux extrémités ont les étiquettes attendues dans C3.
- Image décodée indépendamment avec TensorStore : 2 097 152 valeurs identiques. Masque lu avec TensorStore puis relu : 524 288 valeurs identiques ; cette répétition n’est pas un contrôle indépendant du décodeur.

## Lecture

[microscopie.html](microscopie.html) conserve les trois fenêtres précédentes et ajoute ce détail, une sélection des six annotations, les extrémités sur la coupe concernée et les traits source en 3D. Les 174 autres annotations sont affichables comme contexte. Les marqueurs ont une taille d’affichage arbitraire, sans valeur morphométrique. Les traits relient les deux points fournis ; ils ne reconstruisent pas une trajectoire biologique au travers de la fente.

Les relations pré/post sont anatomiques. Aucun délai, activité, force de connexion, direction d’une propagation observée ou effet causal n’est mesuré. Le code type 1/2 de C3 est conservé sans traduction excitateur/inhibiteur : les métadonnées n’en fournissent pas la légende.

## Sources

[H01 officiel](https://h01-release.storage.googleapis.com/data.html), Lichtman laboratory / Harvard et Connectomics at Google ; CC BY 4.0. Shapson-Coe et al., Science (2024), doi:10.1126/science.adk4858.

[Validation des auteurs](https://zenodo.org/records/10864205), Shapson-Coe et al., CC BY 4.0 : deux CSV originaux de 2 945 et 2 367 lignes, MD5 conformes à Zenodo. Ils désignent des paires de sites ; aucune correspondance validée avec les identifiants C3 affichés n’est actuellement établie. Ils ne valident donc pas individuellement ces six annotations.

[Provenance](assets/h01-synapses/PROVENANCE.json), [acquisition](assets/h01-synapses/ACQUISITION.json), [contrôles](assets/h01-synapses/VALIDATION.json). Générations et ETags contrôlés pour les plages archivées ; empreinte par plage, pas des shards entiers. Le masque du nouveau détail et les lectures ponctuelles C3 sont lus avec TensorStore ; leurs plages originales ne sont pas archivées ni annoncées comme épinglées.

## Suite

Ajouter des détails natifs pour les autres annotations sélectionnées et vérifier les identifiants des tables de validation humaine. Conserver l’absence de recalage entre les prélèvements H01, Allen, BigBrain et SPARC. Les essais avec lecteurs et spécialistes restent ouverts.
