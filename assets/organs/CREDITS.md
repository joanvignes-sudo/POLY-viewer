# Crédits des données organes et nerf vague

## Human Organ Atlas · HiP-CT

Overview scan at 19.85 um of the heart of the body donor S-20-28

Joseph, Brunet, 0000-0002-8424-9510; Andrew C., Cook, 0000-0001-5079-7546; Claire L., Walsh, 0000-0003-3769-3392; James, Cranley, 0000-0002-0408-5801; Paul, Tafforeau, 0000-0002-5962-1683; Klaus, Engel, 0009-0001-1423-898X; Camille, Berruyer, 0000-0002-0046-2972; Emer, Burke O’Leary, 0000-0002-8831-8077; Alexandre, Bellier, 0000-0003-0907-0315; Ryo, Torii, 0000-0001-9479-8719; Christopher, Werlein, 0000-0002-7694-4257; Danny D., Jonigk, 0000-0002-5251-2281; Maximilian, Ackermann, 0000-0001-9996-2477; Kathleen, Dollman, 0000-0002-5468-4896; Peter D., Lee, 0000-0002-3898-8881

Source : https://doi.org/10.15151/ESRF-DC-1966163810 · CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).

Adaptation POLY : décodage N5, sous-échantillonnage ponctuel du niveau s4, extraction d’un bloc natif s0, conversion de stockage en uint16 little endian gzip, affichage par coupes et fenêtres de contraste. Aucune segmentation ou mesure fonctionnelle ajoutée.

## SPARC · Scaffold et prélèvement original

Scaffold map - Human vagus nerve · version 7

Mabelle Lin, Richard Christie, Valerie Chopovda, David P Nickerson

https://doi.org/10.26275/tjzi-muqm

Human vagus nerve anatomical reconstruction using microCT and immunohistochemistry - f002 · version 1

Stavros Zanos, Naveen Jayaprakash, Qanud Khaled, Zeinab Nassrallah, Mary Barbe, Frank Lui Chen, larry miller, Theodoros Zanos, Todd J Levy, Avantika Vardhan, Jinxuan Cang, Viktor Toth, Kevin Coppa, Netanel Ben-Shalom, Weiguo Song, Nicole Carpentiere, Theofilos Kanavos, Effrosyni Birbas, Siyar Bahadir, Parisa Saleknezhad, Tara Yari

https://doi.org/10.26275/imas-52lf

Licence déclarée dans les métadonnées : Creative Commons Attribution ; version non précisée. Les métadonnées originales sont conservées avec les noms et ORCID.

Adaptation POLY : reprise des surfaces nommées, extraction des paires de sommets Lines dans un tampon float32, omission du remplissage final de longueur nulle, rotation rigide des axes pour la vue et transparence de lecture. Aucun raccord de contours ajouté ; aucun recalage dans un corps et unités physiques vérifiées sur C10 en v0.101.


## Région cardiaque et micro-CT C10 · v0.101

Zoom at 6.51 um in the sinoatrial node of the heart of the body donor S-20-28

Claire L., Walsh, 0000-0003-3769-3392; Joseph, Brunet, 0000-0002-8424-9510; Camille, Berruyer, 0000-0002-0046-2972; Emer, Burke O'Leary, 0000-0002-8831-8077; Shahrokh, Rahmani, 0000-0002-5773-7076; Alexandre, Bellier, 0000-0003-0907-0315; Yanis, Boukortt, ; Alejandro, de Maria, 0000-0002-1710-8769; Marjolaine, Bodin, 0000-0003-0321-3952; Klaus, Engel, 0009-0001-1423-898X; Kathleen, Dollman, 0000-0002-5468-4896; Joseph, Jacob, 0000-0002-8054-2293; Christopher, Werlein, 0000-0002-7694-4257; Danny D., Jonigk, 0000-0002-5251-2281; Maximilian, Ackermann, 0000-0001-9996-2477; Paul, Tafforeau, 0000-0002-5962-1683; Peter D., Lee, 0000-0002-3898-8881

Source : https://doi.org/10.15151/ESRF-DC-1966162380 · CC BY 4.0.

Adaptation POLY : décodage de 13 blocs N5, contexte sous-échantillonné, extrait natif 128³ et transformation publiée avec ses échelles. Aucun recalage estimé ou segmentation ajouté.

Micro-CT original : dataset SPARC 674 v1, https://doi.org/10.26275/imas-52lf ; auteurs et licence déclarée déjà crédités ci-dessus et conservés dans les métadonnées originales. Adaptation : permutation des axes, sous-échantillonnage par 4 du contexte, extrait natif Z64..191, stockage uint8 gzip, contours XML sur les seuls plans annotés. Raccord C10 et unités vérifiés par import EXF et transformation source, sans précision biologique déduite de l’arrondi numérique.
