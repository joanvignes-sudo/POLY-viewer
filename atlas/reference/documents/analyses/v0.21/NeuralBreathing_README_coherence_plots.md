# Coherence Plotting Pipeline — README

This README describes how to run the MATLAB script that generates coverage and breathing–LFP coherence visualizations and summary statistics across physiological states (Awake, Sleep, Anesthetized, Ventilated).

---

## 1) Overview

The script:
- Loads precomputed coherence `.mat` results for four states.
- Adds helper functions from `./reqfunc/` to the MATLAB path.
- Plots per‑participant coverage and coherence on brain templates.
- Produces state‑level coverage/coherence maps.
- Creates ROI scatter/summary figures, violin plots, and LME summaries.
- Prints per‑state site counts and significance summaries to the console.

The code assumes **bipolar LFP** processing and state‑specific significance indices are included in each results file.

---

## 2) Folder layout (expected)

```
project_root/
|-- saved_results/
|   |-- CohAwakeBiPolar.mat
|   |-- CohAnesBiPolar.mat
|   |-- CohVentBiPolar.mat
|   `-- CohSleepBiPolar.mat
|-- reqfunc/                 # helper functions used by the script
|   |-- plotBrainPatch.m
|   |-- plotbrainscatter.m
|   |-- plotPatientBrain.m
|   |-- plotPatientscatter.m
|   |-- plotPatientSagittal.m
|   |-- plotPSD.m
|   |-- roiNameUpdate.m
|   |-- sortROI.m
|   |-- plotLME.m
|   |-- violinplot.m          # external (File Exchange) or your local copy
|   `-- sigstar.m             # external (File Exchange) or your local copy
`-- run_plotting_script.m    # your main script (the code you pasted)

```

> **Tip (Windows paths):** The script currently uses backslashes (e.g., `'.\saved_results\'`). On macOS/Linux, use forward slashes (e.g., `'./saved_results/'`).

---

## 3) Required MATLAB / Toolboxes

- **MATLAB** R2020b or newer recommended (earlier may work).
- **Statistics and Machine Learning Toolbox** (for `ranksum`, `signrank`, `iqr`).  
- External utilities in `reqfunc/`:
  - `violinplot.m` (e.g., from MATLAB File Exchange)
  - `sigstar.m` (e.g., from MATLAB File Exchange)

If `violinplot` or `sigstar` are missing, add them to `reqfunc/` or remove those plots.

---

## 4) Input `.mat` file format

Each of the four `.mat` files should contain, at minimum, these fields:

- `ptID` — vector of participant IDs (numeric or string), one per site.
- `ChnCoordinates` — `N×3` array of MNI (or subject‑space mapped) coordinates `[x y z]` for each site.
- `CohValue` — vector of coherence amplitudes per site.
- `significance_v` — logical or 0/1 vector of **significant** site flags per site (FDR‑corrected or as defined in your pipeline).
- `LocationsKN` — cell array of ROI labels per site (used for ROI plots).
- `tsData` — struct array with a field `belt` (respiration belt signal per participant) used to estimate breathing frequency for display.

> The **Sleep** `.mat` uses a different sampling rate (`Fs_slp = 250`) than the other blocks (`Fs = 500`).

---

## 5) Key script parameters (defaults)

- **Paths**
  - `coh_results_Path = '.\saved_results\';`
  - `addpath(genpath('.\reqfunc\'));`

- **Colors**
  - `color_aw = [0.1 0.7 0];` (Awake)
  - `colorSleep = [0.9 0.4 0.1];` (Sleep)
  - `color_sp = [0 0.6 0.8];` (Anesthetized)
  - `color_vs = [0.6 0.12 0.47];` (Ventilated)

- **Sampling rates**
  - `Fs = 500;`  (Awake/Anes/Vent)
  - `Fs_slp = 250;` (Sleep)

- **Plot styling**
  - Marker/cluster sizes, alpha values: `Msize`, `Csize`, `templateAlpha`, `Malpha`
  - Template brain hemisphere mode: `BrHem = 1;`
  - Camera/view presets used for Axial/Coronal/Lateral

---

## 6) How to run

1. Place your `.mat` files in `./saved_results/`.
2. Ensure all helper functions are available in `./reqfunc/`.
3. Start MATLAB in `project_root` and run:

```matlab
restoredefaultpath; rehash toolboxcache;
addpath(genpath('./reqfunc'));  % on Windows: addpath(genpath('.\reqfunc\'));
coh_results_Path = './saved_results/'; % on Windows: '.\saved_results\'

run('run_plotting_script.m');   % or paste the code into the command window
```

The script will:
- Open per‑participant coverage/coherence figures.
- Create state‑level coverage/coherence maps.
- Print summary stats for each state to the command window.
- Generate violin plots and LME figures for comparisons (Awake vs Sleep; Anes vs Vent).

---

## 7) Figure naming conventions (by `set(gcf,'Name',...)`)

- **Coverage Map: Awake Fig3B, Anesthetized Fig5B, Ventilated Fig6B**
- **Coherence Map: Awake Fig3C**
- **Coherence Map: Sleep Fig4C**
- **Coherence Map: Anesthetized Fig5C**
- **Coherence Map: Ventilated Fig6C**
- **Fig3H Awake Breathing‑LFP coherence** (ROI scatter)
- **Fig4D Sleep Breathing‑LFP coherence** (ROI scatter)
- **Fig5D Anesthetized automatic Breathing‑LFP coherence** (ROI scatter)
- **Anethetized vs. Ventilated LME: Fig6E** (paired comparison)

> You can export figures manually (File → Save) or programmatically using `exportgraphics(gcf, 'FigureName.png', 'Resolution', 300)`.

---

## 8) ROI analysis notes

- ROIs are harmonized via `roiNameUpdate.m`.
- ROIs with total contact count ≤ 5 are removed prior to summary.
- `sortROI.m` imposes a canonical ROI order for consistent plots.
- `plotLME.m` runs a state‑contrast LME and renders ROI‑wise predicted means; figure y‑limits are set immediately after the call (e.g., `ylim([0 0.38])`).

---

## 9) Console summaries (what you’ll see)

For each state the script prints, e.g.:

```
=== Awake ===
Total sites: 1236
Total significant sites: 366
Sites per participant: 154.5 ± 27.1
Significant sites per participant: 45.8 ± 12.3
Overall percentage of significant sites: 29.6%
```

(Your exact counts depend on the `.mat` contents.)

It also prints the nonparametric test results and effect sizes for:
- **Awake vs Sleep** (Wilcoxon rank‑sum; displays `p` and rank‑biserial correlation)
- **Anesthetized vs Ventilated** (Wilcoxon signed‑rank; displays `p` and paired rank‑biserial)

---

## 10) Customization

- **Hemisphere orientation:**  
  `hemRev` flags and `BrHem` control whether LH/RH are mirrored for visualization. Adjust in your plotting helpers as needed.

- **Views/lighting:**  
  Calls like `view([0 0 90])`, `camlight('headlight')`, `material dull/metal` can be tuned per figure for consistency.

- **State labels and colors:**  
  Update `stateNames`, color arrays, and figure names for your manuscript mapping.

---

## 11) Troubleshooting

- **Undefined function `violinplot` or `sigstar`:**  
  Add these files to `./reqfunc/` (File Exchange) or comment out the violin/significance‑bar sections.

- **Missing fields in `.mat`:**  
  Ensure your results structs contain `ptID`, `ChnCoordinates`, `CohValue`, `significance_v`, `LocationsKN`, and `tsData(j).belt`.

- **Path issues on macOS/Linux:**  
  Replace backslashes with forward slashes in paths; use `addpath(genpath('./reqfunc'))`.

- **Figures not visible / overwriting:**  
  The script uses multiple `figure` calls and changes `gcf` names. If a window is reused, explicitly create new figures and store handles (e.g., `fig = figure('Name',...)`).

---

## 12) Reproducibility tips

- Start from a clean MATLAB path:  
  ```matlab
  restoredefaultpath; rehash toolboxcache; savepath;
  addpath(genpath('./reqfunc'));
  ```

- Fix random seeds if any stochastic components are added later.

- Record the MATLAB version and toolbox versions (e.g., using `ver`) in your methods.

---

## 13) License / Citation

- Add your preferred license (e.g., MIT) to this repository.
- If you use external code (`violinplot`, `sigstar`), follow their licenses and cite appropriately.
