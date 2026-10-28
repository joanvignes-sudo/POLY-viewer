# POLY — Human metabolic evidence demonstration (Li et al. 2025)

**Date:** 2026-10-28  
**Status:** exploratory, branch-only proposal; not merged into POLY main, not externally validated.  
**Public article:** Li X, Zhu X-H, Li Y, Wang T, Zhang G, Wiesner HM, Liang Z-P, Chen W. *Quantitative mapping of key glucose metabolic rates in the human brain using dynamic deuterium magnetic resonance spectroscopic imaging*. **PNAS Nexus** 4(3):pgaf072 (2025). DOI: [10.1093/pnasnexus/pgaf072](https://doi.org/10.1093/pnasnexus/pgaf072), PMID 40109558.  
**Authors' repository:** https://github.com/CMRRChenLab/DynamicDMRSI

## One-paragraph explanation for visitors / funding reviewers

We transcribed 60 published, model-derived rate estimates from five healthy volunteers (Table 1, four metabolic parameters × three tissue summaries). POLY independently recomputes the 12 reported group means and sample standard deviations at the article's two-decimal precision. A separate, explicitly **synthetic** two-parameter allocation then shows why the tissue-level lactate production rate alone cannot determine an intracellular astrocyte-to-neuron lactate transfer. This is a demonstration of scientific traceability and limits, **not** a human cellular-flux measurement, a reproduction of the paper's fitted 7 T time courses, a diagnostic, or proof of an obligatory shuttle.

## Source and preservation

- Transcription: `simulateur/data/li-2025-table1.json` — source DOI, cohort size, units, original Table 1 rows, published aggregates and modeling limitations.
- Reusable arithmetic: `simulateur/web/li-metabolism-core.mjs`.
- Public-facing demonstration candidate: `simulateur/web/metabolisme-humain.html`, `metabolisme-humain.mjs`, `metabolisme-humain.css`.
- Tests: `simulateur/tests/li-metabolism-core.test.mjs` and `simulateur/tests/li-metabolism-browser.cjs`.
- Existing Boumezbeur `simulateur/web/human-lactate-core.mjs` is unchanged and is NOT calibrated from Li's independent cohort.
- No author's code, proprietary figures, or source spectra copied into this pilot; only the compact article table was transcribed with attribution. Reuse terms of further sources must be evaluated separately.

## The 12 arithmetic checks

For each of three tissue descriptions (pure WM, pure GM and WB average) and each of four rates (CMRGlc, CMRLac, VTCA, Tmax):

```text
mean = sum(x_i)/5
SD_sample = sqrt( sum((x_i - mean)^2)/4 )
check: round(mean, 2) == published_mean
       round(SD_sample, 2) == published_SD
```

The starting values are themselves reported to two decimal places. Arithmetic agreement therefore checks the transcription and computation **only**. Group means can change slightly when computed from unrounded underlying fitted estimates. The table-derived **mean of five rounded inputs** is what drives the demonstration; we do not falsely substitute the article's printed two-decimal group mean as the exact measured datum.

### Representative whole-brain estimates (from five published rounded participant values)

| Rate | Recomputed mean | Published mean ± SD | Units |
|---|---:|---:|---|
| CMRGlc | 0.308 | 0.31 ± 0.04 | µmol/g/min |
| CMRLac | 0.132 | 0.13 ± 0.03 | µmol/g/min |
| VTCA | 0.598 | 0.60 ± 0.13 | µmol/g/min |
| Tmax | 1.260 | 1.26 ± 0.14 | µmol/g/min |

**Scientific distinction:** all four rates are derived by the article's quantitative kinetic model. Pure WM/GM rates are regression-derived tissue extrapolations. They are not directly observed cellular reactions, and `CMRLac` does **not** equal astrocyte-to-neuron flux.

## Synthetic exchange model

Select one tissue and one published participant (or the mean); let `P = CMRLac`, `0 ≤ α ≤ 1`, `0 ≤ β ≤ 1`.

```text
P_A = α P                  assumed astrocyte production
P_N = (1-α) P              assumed neuron production
J_A→N = β P_A              assumed transfer
A_remaining = P_A - J_A→N
N_contribution = P_N + J_A→N
A_remaining + N_contribution = P
```

This is an **accounting illustration**, not a cell-validated kinetic model: no direct inference is made about net neuronal oxidation, transporter rates, extracellular volume, blood–brain exchange, steady-state biology or anatomical localization.

The observation operator for one tissue datum is `y = P_A + P_N` with sensitivity `[1, 1, 0]` to the three internal variables `(P_A, P_N, J_A→N)`. Its rank is 1; the two unconstrained internal directions cannot be recovered from `y` alone. In the two-parameter `(α, β)` representation, the observation `P` is constant for all allowed values. Sensitivity of the displayed total to α and β is therefore zero. Selecting different sliders changes the hypothetical allocation, **not** the human observation. This formal non-identifiability is expected and is not experimental proof of shuttle absence or presence.

For example with WB mean P = 0.132 and α = 0.5, β = 0 yields assumed transfer 0 while β = 1 yields 0.066 µmol/g/min, with the same tissue-level P. Both are hypothetical endpoints, not known human physiology.

## Comparison with Boumezbeur et al. 2010

The existing POLY `human-lactate-core.mjs` calculates **plasma-to-regional-brain** lactate quantities from published rounded 13C regression coefficients. The study population, tracer protocol, tissue region and observation operator differ from the Li DMRSI cohort. We preserve those as **separate source objects**, without adding unlike quantities or claiming a shared subject. The conditional `J_A→N` is neither Boumezbeur influx nor their derived efflux.

## Explicit exclusions

- No raw 7 T spectra processed by this demonstration.
- No independent refitting of the authors' kinetic model.
- No estimation of uncertainty intervals for a cellular shuttle or transporters.
- No clinical prediction, individual brain state, neurodegenerative diagnosis, or treatment simulation.
- No physiological avatar write, no source mesh modifications, no automatic promotion to POLY's scientific canon.
- No inferred relationship between CMRLac and a particular person's consciousness.

## Reproduction and quality gates

```sh
node --test simulateur/tests/li-metabolism-core.test.mjs
python -m http.server 8123 --bind 127.0.0.1
# separate terminal, with Playwright Chromium installed:
POLY_BROWSER_CHANNEL=chromium node simulateur/tests/li-metabolism-browser.cjs
```

The GitHub Action `Attachment qualification gates` runs the new Node test and the browser demonstration checks at both desktop 1440 × 900 and mobile touch emulation 390 × 844, including receipt export and fail-closed behavior when the evidence JSON cannot be loaded. **These are software acceptance tests, not human experiments or validation on a real phone.**

## Next scientific gates before publishing claims about cellular mechanisms

1. Obtain and version an authorized set of dynamic concentration traces and blood glucose input functions, with units, timestamps and cohort attribution.
2. Reimplement and independently refit the authors' published observation operator, with residuals, parameter bounds, goodness-of-fit and uncertainty; preserve discrepancies.
3. Couple a separate astrocyte/interstitium/neuron model with mass, carbon and isotopic conservation, transport constraints and independently measurable outputs.
4. Test structural and practical identifiability for shuttle-free, optional and mandatory-shuttle models under the same experimental conditions.
5. Require independent human observations capable of distinguishing hypotheses; otherwise report admissible sets rather than a preferred internal flux.
6. Review provenance, licences and accessibility with an independent scientific reviewer before promoting any result to canonical status.

**Status owner decision:** keep this demonstrator as an unmerged draft until code checks, source review, UI review and communication scope are approved.
