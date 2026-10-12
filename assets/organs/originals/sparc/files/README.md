# Scaffold Map - Human Vagus Nerve
Overview
This dataset contains computational mapping files for creating subject-specific human vagus nerve scaffolds. The scaffolds map reconstructed vagus nerve data from left and right nerve regions to enable qualitative and quantitative visualization and analysis of nerve pathways from skull to abdomen.

Study Design
This is a computational mapping dataset that transforms segmented vagus nerve paths into standardized scaffold representations. Each scaffold represents a single subject with embedded fascicle data and provides:

Subject-specific mapping: Individual scaffolds based on source anatomical data
Bilateral representation: Separate processing for left (L) and right (R) nerve regions
Fascicle embedding: Orange-colored fascicle data integrated into most scaffolds
Web visualization: JSON-formatted files for portal display

Source Data
The mapped data is derived from **21 original SPARC datasets**, one per subject. Each source dataset provides annotated microCT segmentation data for scaffold creation.

| Subject | Sex | Age | Samples | Source dataset DOI |
|---|---|---|---:|---|
| `sub-M000` | Male | Not Applicable (virtual) | 2 | [10.26275/k7hi-uttf](https://doi.org/10.26275/k7hi-uttf) |
| `sub-f001` | Male | >89 years | 44 | [10.26275/rvfz-bdo3](https://doi.org/10.26275/rvfz-bdo3) |
| `sub-f002` | Female | 88 years | 43 | [10.26275/imas-52lf](https://doi.org/10.26275/imas-52lf) |
| `sub-f003` | Male | >89 years | 37 | [10.26275/umlh-rede](https://doi.org/10.26275/umlh-rede) |
| `sub-f004` | Female | >89 years | 31 | [10.26275/w5z5-fuk3](https://doi.org/10.26275/w5z5-fuk3) |
| `sub-f005` | Male | >89 years | 39 | [10.26275/ikc2-9rce](https://doi.org/10.26275/ikc2-9rce) |
| `sub-f006` | Female | >89 years | 36 | [10.26275/uzk6-5ntj](https://doi.org/10.26275/uzk6-5ntj) |
| `sub-f007` | Male | 73 years | 36 | [10.26275/dp8r-bb7w](https://doi.org/10.26275/dp8r-bb7w) |
| `sub-f008` | Male | 74 years | 39 | [10.26275/gpmp-nogs](https://doi.org/10.26275/gpmp-nogs) |
| `sub-f009` | Female | >89 years | 31 | [10.26275/un0a-zzdl](https://doi.org/10.26275/un0a-zzdl) |
| `sub-f010` | Male | >89 years | 33 | [10.26275/ohiz-hpe2](https://doi.org/10.26275/ohiz-hpe2) |
| `sub-f011` | Female | >89 years | 34 | [10.26275/qcmb-kmbx](https://doi.org/10.26275/qcmb-kmbx) |
| `sub-f012` | Female | 79 years | 33 | [10.26275/rcyg-aggz](https://doi.org/10.26275/rcyg-aggz) |
| `sub-f013` | Male | 76 years | 26 | [10.26275/p4nr-e670](https://doi.org/10.26275/p4nr-e670) |
| `sub-f014` | Male | >89 years | 33 | [10.26275/9o7h-matq](https://doi.org/10.26275/9o7h-matq) |
| `sub-f015` | Female | 88 years | 30 | [10.26275/t05q-dw4m](https://doi.org/10.26275/t05q-dw4m) |
| `sub-f017` | Male | >89 years | 36 | [10.26275/a9ly-fpy6](https://doi.org/10.26275/a9ly-fpy6) |
| `sub-f018` | Female | 76 years | 38 | [10.26275/xulq-rf3s](https://doi.org/10.26275/xulq-rf3s) |
| `sub-f019` | Female | 57 years | 38 | [10.26275/8ekx-tqxe](https://doi.org/10.26275/8ekx-tqxe) |
| `sub-f020` | Female | 77 years | 36 | [10.26275/jril-xkmc](https://doi.org/10.26275/jril-xkmc) |
| `sub-f022` | Female | 88 years | 33 | [10.26275/z4i9-zg3o](https://doi.org/10.26275/z4i9-zg3o) |

Full per-subject metadata is in `subjects.xlsx`; per-sample metadata, including scaffold transform parameters, is in `samples.xlsx`.

Each source dataset provides annotated microCT segmentation data for scaffold creation.

Computational Workflow
MAP-Client Processing Pipeline

Data Preparation (010): Portal data retrieval and initial processing
Stitching(020): Stitching of segmentation data
Scaffold Creation (030): Vagus nerve scaffold generation
Flatmap Generation (050): Flattened representation creation
Visualization (060): Web portal display file generation

Workflow Components

Provenance tracking: Complete workflow documentation
Settings files: JSON configuration for reproducibility
Project files: MAP-Client workflow definitions
PNG documentation: Visual workflow representations

Data Organization
Data is organised per subject, then by nerve region. Each of the 21 subject folders contains an `L/` and an `R/` subtree plus its own `manifest.xlsx`.

```
dataset_description.xlsx
subjects.xlsx
samples.xlsx
README.md
primary/
└── sub-f001/                            # one folder per subject, 21 total
    ├── manifest.xlsx
    ├── L/                               # left nerve region
    │   ├── 010-data-preparation-xml/    # portal data retrieval
    │   ├── 020-stitching/               # stitching of segmentation data
    │   ├── 030-scaffold/                # scaffold generation
    │   ├── 050-flatmap/                 # flattened mapping
    │   └── 060-visualization-fascicles/ # display file generation
    └── R/                               # right nerve region
        └── (same five stage folders as L/)

derivative/
└── sub-f001/                            # same 21 subject folders as primary/
    ├── manifest.xlsx
    ├── L/                               # left nerve region
    │   ├── 010-data-preparation/
    │   ├── 020-stitching/
    │   ├── 030-scaffold/
    │   ├── 050-flatmap/
    │   └── 060-visualization/
    └── R/                               # right nerve region
        └── (same five stage folders as L/)
```

`primary/` and `derivative/` carry the same 21 subject folders, the same L/R split, and the same five pipeline stages.

Primary Data

Workflow files: MAP-Client project definitions (.proj)
Settings: JSON configuration files for workflow reproduction
Provenance: Complete processing history documentation
Flatmap settings: Portal visualization configurations

Derivative Data

JSON files: Web portal visualization data
Workflow outputs: Processed scaffold representations
Visualization files: Ready-to-display scaffold maps

File Types and Purpose
MAP-Client Files

.proj files: Workflow project definitions
.png files: Visual workflow documentation
settings.json: Configuration parameters for reproducibility

Provenance Files

provenance.json: Complete workflow execution history
Processing parameters: Detailed method documentation
Version tracking: Software and workflow versions used

Visualization Files

JSON format: Web portal display data
Scaffold representations: Mapped nerve structures
Fascicle data: Embedded anatomical details 

Contact Information
For questions about scaffold generation methods, workflow reproduction, or data interpretation, please refer to the associated documentation or contact the research team through the SPARC Portal.


Related Resources

Source Dataset 1: DOI 10.26275/k7hi-uttf (Virtual human subject)
Source Dataset 2: DOI 10.26275/rvfz-bdo3 (Male human subject)
Source Dataset 3: DOI 10.26275/imas-52lf (Female human subject)
Source Dataset 4: DOI 10.26275/umlh-rede (Male human subject)
Source Dataset 5: DOI 10.26275/w5z5-fuk3 (Female human subject)
Source Dataset 6: DOI 10.26275/ikc2-9rce (Male human subject)
Source Dataset 7: DOI 10.26275/uzk6-5ntj (Female human subject)
Source Dataset 8: DOI 10.26275/dp8r-bb7w (Male human subject)
Source Dataset 9: DOI 10.26275/gpmp-nogs (Male human subject)
Source Dataset 10: DOI 10.26275/un0a-zzdl (Female human subject)
Source Dataset 11: DOI 10.26275/ohiz-hpe2 (Male human subject)
Source Dataset 12: DOI 10.26275/qcmb-kmbx (Female human subject)
Source Dataset 13: DOI 10.26275/rcyg-aggz (Female human subject)
Source Dataset 14: DOI 10.26275/p4nr-e670 (Male human subject)
Source Dataset 15: DOI 10.26275/9o7h-matq (Male human subject)
Source Dataset 16: DOI 10.26275/t05q-dw4m (Female human subject)
Source Dataset 17: DOI 10.26275/a9ly-fpy6 (Male human subject)
Source Dataset 18: DOI 10.26275/xulq-rf3s (Female human subject)
Source Dataset 19: DOI 10.26275/8ekx-tqxe (Female human subject)
Source Dataset 20: DOI 10.26275/jril-xkmc (Female human subject)
Source Dataset 21: DOI 10.26275/z4i9-zg3o (Female human subject)

Scaffold Mapping Tools: Available via SPARC Portal
MAP-Client Software:https://sparc.science/tools-and-resources/1mv8q3JckdpSYpPK9dvdKx
