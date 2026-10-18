**Study Purpose:** The goal of this work is to map reconstructed human vagus nerve data from left and right nerve regions to multiple subject-specific vagus scaffold maps.

**Data Collection:** The data mapped in this dataset was derived from the original datasets (DOI [10.26275/k7hi-uttf][1], DOI [10.26275/rvfz-bdo3][21], DOI [10.26275/imas-52lf][4], DOI [10.26275/umlh-rede][5], DOI [10.26275/w5z5-fuk3][6], DOI [10.26275/ikc2-9rce][7], DOI [10.26275/uzk6-5ntj][8], DOI [10.26275/dp8r-bb7w][9], DOI [10.26275/gpmp-nogs][10], DOI [10.26275/un0a-zzdl][11], DOI [10.26275/ohiz-hpe2][22], DOI [10.26275/qcmb-kmbx][12], DOI [10.26275/rcyg-aggz][13], DOI [10.26275/p4nr-e670][14], DOI [10.26275/9o7h-matq][15], DOI [10.26275/t05q-dw4m][16], DOI [10.26275/a9ly-fpy6][19], DOI [10.26275/xulq-rf3s][17], DOI [10.26275/8ekx-tqxe][18], DOI [10.26275/jril-xkmc][20], DOI [10.26275/z4i9-zg3o][23]). For each dataset, a subject-specific vagus scaffold (more about [organ scaffolds][2]) is created based on the annotated microCT segmentation data from the left and right nerve regions. 

**Primary Conclusion:** None stated.

---

**Curator's Notes**

**Experimental Design:** This is a computational mapping dataset where segmented paths of human vagus nerve from skull to abdomen are mapped to subject-specific vagus nerve scaffolds for qualitative and quantitative visualization and analysis. Each scaffold represents a single subject with corresponding links to the source dataset, with most scaffolds including embedded fascicle data. The mapping process utilizes MAP-Client workflows and provenance data to generate scaffold visualizations from original microCT segmentation data.

**Completeness:** Not complete. Potentially will link to other datasets where the data is used for mapping onto the scaffold.

**Subjects & Samples:** The data mapped in this dataset were derived from data from one virtual human subject published in (DOI [10.26275/k7hi-uttf][1]) and 20 late adult human published in (DOI [10.26275/rvfz-bdo3][21], DOI [10.26275/imas-52lf][4], DOI [10.26275/umlh-rede][5], DOI [10.26275/w5z5-fuk3][6], DOI [10.26275/ikc2-9rce][7], DOI [10.26275/uzk6-5ntj][8], DOI [10.26275/dp8r-bb7w][9], DOI [10.26275/gpmp-nogs][10], DOI [10.26275/un0a-zzdl][11], DOI [10.26275/ohiz-hpe2][22], DOI [10.26275/qcmb-kmbx][12], DOI [10.26275/rcyg-aggz][13], DOI [10.26275/p4nr-e670][14], DOI [10.26275/9o7h-matq][15], DOI [10.26275/t05q-dw4m][16], DOI [10.26275/a9ly-fpy6][19], DOI [10.26275/xulq-rf3s][17], DOI [10.26275/8ekx-tqxe][18], DOI [10.26275/jril-xkmc][20], DOI [10.26275/z4i9-zg3o][23]).

**Primary vs derivative data:** The primary folder contains the mapping tool provenance data files needed to produce the scaffold map and MAP-Client workflows with settings files to reproduce the results. The derivative folder contains workflow files and JSON files used to generate visualization of the scaffold map on the web portal. Data is organized by left (L) and right (R) nerve regions with subfolders for data preparation, scaffold generation, flatmap creation, and visualization workflows.

**Code Availability:** [Scaffold Mapping Tools][3]

  [1]: https://doi.org/10.26275/k7hi-uttf
  [2]: https://docs.sparc.science/docs/organ-scaffolds
  [3]: https://sparc.science/tools-and-resources/1mv8q3JckdpSYpPK9dvdKx
  [4]: https://doi.org/10.26275/imas-52lf
  [5]: https://doi.org/10.26275/umlh-rede
  [6]: https://doi.org/10.26275/w5z5-fuk3
  [7]: https://doi.org/10.26275/ikc2-9rce
  [8]: https://doi.org/10.26275/uzk6-5ntj
  [9]: https://doi.org/10.26275/dp8r-bb7w
  [10]: https://doi.org/10.26275/gpmp-nogs
  [11]: https://doi.org/10.26275/un0a-zzdl
  [12]: https://doi.org/10.26275/qcmb-kmbx
  [13]: https://doi.org/10.26275/rcyg-aggz
  [14]: https://doi.org/10.26275/p4nr-e670
  [15]: https://doi.org/10.26275/9o7h-matq
  [16]: https://doi.org/10.26275/t05q-dw4m
  [17]: https://doi.org/10.26275/xulq-rf3s
  [18]: https://doi.org/10.26275/8ekx-tqxe
  [19]: https://doi.org/10.26275/a9ly-fpy6
  [20]: https://doi.org/10.26275/jril-xkmc
  [21]: https://doi.org/10.26275/rvfz-bdo3
  [22]: https://doi.org/10.26275/ohiz-hpe2
  [23]: https://doi.org/10.26275/z4i9-zg3o