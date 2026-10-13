# POLY v0.120 · Préparer le raccord BigBrain–CerebrA

Trois champs de déformation du recalage amélioré de Xiao et al. (2019) sont maintenant acquis : **506 305 524 octets**, conservés dans les archives de recherche. Le site reçoit la provenance, les matrices et les notices ; les volumes lourds ne sont pas chargés par les lecteurs.

## Ce qui a été vérifié

- Extraction sélective dans l’archive officielle de 2 343 946 256 octets, sans télécharger tous les atlas. Contrôle CRC ZIP de chaque membre et empreinte SHA-256 conservée.
- Lecture des trois volumes MINC2 : dimensions, ordre des axes et composantes vectorielles ; toutes les valeurs stockées des trois composantes sont finies.
- Concordance entre les trois fichiers référencés par la transformation et les champs acquis ; ordre 0 → 1 → 2 conservé.
- Acquisition des transformations linéaire et non linéaire de 2015. La matrice affine est lisible et inversible numériquement ; cela ne démontre pas une précision anatomique.
- Méthodes BigBrainWarp consultées à un commit identifié. Le code distingue les entrées histologiques et BigBrainSym ; son parcours surfacique utilise une géométrie symétrisée.

## Ce que cela change dans la préparation

Le README des auteurs précise que le recalage amélioré de 2019 **part du BigBrain déjà grossièrement recalé en 2015**. L’appliquer directement à des coordonnées histologiques omettrait une étape. À l’inverse, appliquer deux fois l’étape de 2015 à des surfaces déjà transformées fausserait leur position.

Le NIST précise que les atlas MNI 2009b et 2009c décrivent la même anatomie avec des échantillonnages et prétraitements différents. La seule différence de nom ne prouve donc pas une incompatibilité anatomique ; elle ne permet pas non plus de réutiliser leurs indices de voxels sans conversion.

L’en-tête de notre fichier GIFTI cortical indique des repères inconnus (`unknown-to-unknown`). La déclaration historique de coordonnées BigBrain natives est conservée dans ses métadonnées ; cet en-tête seul ne la confirme pas indépendamment. Le dossier rend cette vérification restante explicite.

## Pour terminer ce raccord

1. Comparer la géométrie exacte PLoSBiology2020 aux références histologique et BigBrainSym correspondantes.
2. Si le départ est histologique, acquérir et contrôler le champ non linéaire de 2015 encore manquant ; l’affine seule ne suffit pas.
3. Composer la transformation adaptée, contrôler direction, conventions et coordonnées physiques sur un petit échantillon.
4. Évaluer repères anatomiques, recouvrements régionaux et régularité des déformations avant toute superposition présentée comme validée.

**Aucune nouvelle transformation n’est appliquée aux vues actuelles.** Les contrôles de fichiers ne remplacent pas l’évaluation anatomique. Le recalage vers un atlas moyen ne relierait pas individuellement BigBrain, H01, Allen ou P8 et ne fournirait aucun délai biologique.

## Sources et droits

- [Archive officielle Xiao/PD25, version 2019](https://packages.bic.mni.mcgill.ca/mni-models/PD25/mni_PD25_Bigbrain_2019release_minc2.zip) ; [méthode publiée](https://doi.org/10.1038/s41597-019-0217-0).
- [README original](assets/bigbrain-registration-v0120/XIAO2019_README) et [licence originale jointe](assets/bigbrain-registration-v0120/XIAO2019_LICENSE). Le texte comporte attribution, non-commercial et partage dans les mêmes conditions ; il est conservé intégralement, sans lui attribuer une version non établie.
- [Transformations officielles de 2015](https://ftp.bigbrainproject.org/bigbrain-ftp/BigBrainRelease.2015/3D_Volumes/MNI-ICBM152_Space/transformation/) ; données BigBrain et adaptations sous leurs conditions CC BY-NC-SA 4.0 existantes.
- [Description officielle des variantes MNI2009](https://nist.mni.mcgill.ca/icbm-152-nonlinear-atlases-2009/).
- [Code BigBrainWarp consulté](https://github.com/caseypaquola/BigBrainWarp/tree/68b068fbb93df49eb1339bf7a038876b4412577c), [distinction des repères](https://github.com/caseypaquola/BigBrainWarp/blob/68b068fbb93df49eb1339bf7a038876b4412577c/docs/pages/FAQs.rst).
- [Provenance et empreintes](assets/bigbrain-registration-v0120/PROVENANCE.json), [inventaire actualisé](INVENTAIRE_ECHELLES_v0.120.json).

La présentation reste conservée ; le nouveau dossier est accessible dans un volet fermé de la page « Préparer la suite ». Aucun essai auprès de lecteurs n’est revendiqué.
