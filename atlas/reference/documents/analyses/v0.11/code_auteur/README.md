# A prospective code for value in the serotonin system

This repository contains code and data to reproduce the results of Harkin et al.
(2025) "A prospective code for value in the serotonin system".

## System requirements

This repo requires Python and either `pip` or Anaconda to install dependencies.
Code is theoretically compatible with all operating systems, but file paths for
loading data and saving figures use Unix path separators (forward slashes `/`)
so these components will require editing to run on Windows (which uses
backslashes `\` in file paths).

No minimum hardware requirement. Scripts run easily on a ~10 year old PC with
4GB of memory.

Tested with Python 3.10 on MacOS (versons 13 and 15) and Manjaro Linux (rolling
release, 2024). The font used in figures, Avenir, is only available on MacOS.

## Installation guide

Install minimal Python dependencies by running the following in a terminal:
```sh
pip install -r requirements.txt
```
Installation should take one or two minutes at most.

`environment.yml` is provided to exactly reproduce the Anaconda environment used
for this project.

## Demo/usage instructions

Start a jupyter notebook server by running the following in a terminal from the
top-level project directory:
```sh
jupyter notebook
```
This should produce a link that starts with `http://localhost:8888`,
`http://128.0.0.1:8888` or something similar. Click the link or copy/paste it
into a browser, select a notebook containing figures or analysis to reproduce,
and run the code using the "plus" button at the top of the screen or by pressing
shift + enter to advance one cell at a time.

Most analyses should run in under one or two minutes. Steps that normally take
more than a few seconds to run will produce a progress bar.

For ease of use, all data needed to reproduce results are already included in
the `data` folder.

## Data provenance

Datasets located in `data` were obtained as follows:
- Recordings from head-fixed mice in `data/data.mat` are from Cohen, Grossman,
  and Bari (Dryad, 2017, CC-0, https://doi.org/10.5061/dryad.cz8w9gj4s).
- Computed expected uncertainty values used in Grossman et al. (Current Biology,
  2022) in `data/expected-uncertainty.mat` were provided by Cooper Grossman in
  2024 (CC-BY-NC).
- Recordings from freely-moving mice in `data/li_2016_data` are from Li and Luo
  (Zenodo, 2024, CC-BY, https://doi.org/10.5281/zenodo.12776509).

## Credit/blame

All code written by Emerson Harkin.

## License

Science thrives on openness. This code is provided in the spirit of the [CRAP
license](https://matt.might.net/articles/crapl/).

Code is licensed under the [CC-BY-NC license](https://creativecommons.org/licenses/by-nc/4.0/). Datasets are provided under their original licenses.