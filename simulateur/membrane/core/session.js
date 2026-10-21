/* POLY scientific core — independent of DOM, atlas, browser, and renderer. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PolyAdaptiveCore = api;
})(typeof window === 'undefined' ? globalThis : window, function() {
  'use strict';

  const VIEW_IDS = Object.freeze(['body_schematic', 'evidence_graph', 'hra_atlas']);
  const CAPABILITIES = Object.freeze({
    documentary_replay: true,
    evidence_links: true,
    view_interchange: true,
    conceptual_anchors: true,
    measured_anatomical_3d: false,
    biological_clock: false,
    predictive_physiology: false,
    drug_dose_response: false,
    body_motion_simulation: false
  });

  class ScientificModelUnavailable extends Error {
    constructor(message='Aucun modèle quantitatif validé pour ces conditions.') {
      super(message);
      this.name = 'ScientificModelUnavailable';
      this.code = 'SCIENTIFIC_MODEL_NOT_VALIDATED';
    }
  }

  function validateScenario(s) {
    if (!s || s.schema !== 'poly.adaptive.scenario/1' || !Array.isArray(s.events) || !s.events.length)
      throw new TypeError('Scénario absent ou schéma inconnu.');
    if (s.scientific_mode !== 'DOCUMENTARY_REPLAY_ONLY' || s.timing !== 'EDITORIAL_NOT_BIOLOGICAL' ||
        s.quantitative_model_available !== false || s.whole_path_validated !== false)
      throw new TypeError('Scénario non documentaire : module de calcul validé requis.');
    if (!s.canonical_source || !Array.isArray(s.canonical_source.files) || !s.canonical_source.files.length)
      throw new TypeError('Traçabilité de la source absente.');
    const ids = new Set();
    for (const e of s.events) {
      if (!e || typeof e.id !== 'string' || !e.id || ids.has(e.id))
        throw new TypeError('Intervalle invalide ou doublonné.');
      ids.add(e.id);
      if (!Array.isArray(e.source_urls) || !e.source_urls.every(x => /^https:\/\//.test(x)))
        throw new TypeError('Références de publication invalides.');
      if (typeof e.title !== 'string' || typeof e.operation !== 'string' ||
          e.chronology_proven !== false || e.anatomical_continuity_proven !== false ||
          e.causal_link_to_next_established !== false || e.observed_biological_time_ms !== null ||
          e.measured_anatomical_coordinates !== false)
        throw new TypeError('Interprétation scientifique non autorisée : ' + e.id);
    }
    return true;
  }

  function makeSession(source, options={}) {
    validateScenario(source);
    const sourceText = JSON.stringify(source);
    // Defensive copy: renderer mutations cannot rewrite the scientific record.
    const data = JSON.parse(sourceText);
    let index=0, viewId=options.viewId || VIEW_IDS[0];
    if (!VIEW_IDS.includes(viewId)) throw new RangeError('Adaptateur inconnu.');

    function snapshot() {
      const event = data.events[index];
      return {
        scenario_id: data.id,
        scenario_title: data.title,
        index, total: data.events.length,
        progress_fraction: data.events.length === 1 ? 1 : index / (data.events.length - 1),
        view_id: viewId,
        event: JSON.parse(JSON.stringify(event)),
        source: JSON.parse(JSON.stringify(data.canonical_source)),
        warnings: [
          'Rejeu documentaire multi-préparations, sans chronologie biologique commune.',
          'Points graphiques conceptuels, non coordonnées anatomiques mesurées.',
          'Une référence liée ne constitue pas une validation indépendante de la relation.'
        ],
        capabilities: { ...CAPABILITIES },
        timeline_type: 'PEDAGOGICAL_STEP_INDEX'
      };
    }

    return Object.freeze({
      snapshot,
      step(n=1) {
        if (!Number.isInteger(n)) throw new TypeError('Pas entier requis.');
        index=Math.max(0,Math.min(data.events.length-1,index+n));
        return snapshot();
      },
      seek(n) {
        if (!Number.isInteger(n) || n<0 || n>=data.events.length) throw new RangeError('Étape hors scénario.');
        index=n;return snapshot();
      },
      setView(id) {
        if (!VIEW_IDS.includes(id)) throw new RangeError('Vue non prise en charge.');
        viewId=id;return snapshot();
      },
      requestPrediction(conditions={}) {
        void conditions;
        throw new ScientificModelUnavailable();
      },
      getScenarioDigest() {
        return JSON.stringify({id:data.id,events:data.events.map(e=>[e.id,e.title,e.source_urls])});
      }
    });
  }

  return Object.freeze({makeSession,validateScenario,ScientificModelUnavailable,VIEW_IDS,CAPABILITIES});
});
