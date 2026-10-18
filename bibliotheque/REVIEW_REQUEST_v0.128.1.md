# POLY · request for independent surface guidance

POLY is a developing, source-linked explorer of anatomical scales and documented biological mechanisms, intended for researchers, philosophers and learners. AI tools assist the implementation and reproducible numerical checks; no independent expert anatomical validation is claimed.

We use the published BigBrain cortical surfaces from Wagstyl et al. (2020), retaining the original geometry and attribution. Optional derived previews apply the published 2015 and 2019 registrations. Synthetic subdivisions are labelled as calculations, not acquired microanatomy.

Local tests found triangle contacts beyond indexed shared vertices or edges. Of 119 original face pairs associated with the first preview contacts, 46 also have a contact in the original native stored surface. This is a selected subset, not an estimate for the whole cortex. These contacts are not labelled as anatomical errors. Independent exact rational calculations agree on the examined stored triangles.

Could a surface specialist advise whether these contacts are expected, whether particular regions or duplicate vertices require special handling, and which documented preprocessing is appropriate before quantitative anatomical use? A brief pointer or referral would be valuable; a full review is not presumed.

[Original face indices, native and registered triangle coordinates](assets/bigbrain-audits-v0128/SOURCE_CONTACT_COMPARISON.json) · [Viewer example](microstructures.html?bbframe=mni&meshcheck=1&facet=context-left%3A11342&refine=1&neighbors=1&adaptive=1&wide=1&conform=1&contact=0&v=0.128.1) · [Provenance and limitations](assets/bigbrain-conform-v0128/PROVENANCE.json).

Coordinate units are millimetres; registered physical coordinates are ICBM152 2009b symmetric. Stored local positions plus their anchor reconstruct registered coordinates. Display axes are permuted as (x,z,-y). Each preview is independent and overlays the unchanged cortex; no global mesh replacement is applied.

Sources: [Amunts et al. 2013](https://doi.org/10.1126/science.1235381), [Wagstyl et al. 2020](https://doi.org/10.1371/journal.pbio.3000678), [Xiao et al. 2019](https://doi.org/10.1038/s41597-019-0217-0). BigBrain-derived geometry retains CC BY-NC-SA 4.0; original credits and transform-specific conditions are linked in provenance.
