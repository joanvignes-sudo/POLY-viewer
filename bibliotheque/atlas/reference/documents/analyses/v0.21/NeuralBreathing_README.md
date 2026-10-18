# NeuralBreathing
MATLAB code for analyzing forebrain neural synchronization with breathing using intracranial EEG (Mowla et al., Nature Communications, 2026)

# NeuralBreathing

MATLAB code for analyzing forebrain neural synchronization and entrainment to breathing during wakefulness, sleep, and external mechanical ventilation.

## Reference

Mowla MR, Rhone AE, Kumar S, et al. Human forebrain neural synchronization and entrainment to breathing during wakefulness, sleep, and external mechanical ventilation. *Nature Communications* (2026).

## Overview

- `NeuralbreathingScript.m` — Main analysis script for computing breathing–LFP coherence across conditions using a GLM-based framework
- `reqfunc/` — Helper functions for plotting, brain visualization, and ROI management

## Requirements

- MATLAB R2023a or later
- Statistics and Machine Learning Toolbox
- [DBT Toolbox](https://github.com/dbt-toolbox/dbt-matlab) for signal denoising

## Data

Processed coherence data and source data are available on Zenodo (DOI will be added upon release).

Raw intracranial data are available from the corresponding author upon request, subject to a data sharing agreement.

## License

MIT License — see [LICENSE](LICENSE) for details.
