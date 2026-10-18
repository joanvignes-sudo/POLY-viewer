This repository contains anonymised raw data supporting:

[Bang*, Kishida*, Lohrenz, White, Laxton, Tatter, Fleming & Montague (2020) “Sub-second dopamine and serotonin signalling in human striatum during perceptual decision-making” Neuron][1]

Each data file contains for patient PN (where N indicates patient number):

 - "current_trace_nanoamps": current response during the triangular voltage waveform portion of the 100 ms duty cycle [column: time; rows: measurement]
 - "current_trace_center_times": timestamp for centre of current response
 - "stimulus_onset_times": timestamp for onset of motion stimulus
 - "response_onset_times": timestamp for submission of choice
 - "trial": trial number

The raw data can be indexed by finding the minimum timestamp distance between a current response and stimulus onset / choice submission.

See accompanying GitHub repository for code and data supporting main results:

https://github.com/danbang/article-DA-5HT-perceptual-decision


  [1]: https://www.cell.com/neuron/fulltext/S0896-6273%2820%2930715-7