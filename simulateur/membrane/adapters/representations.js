/* Swappable, explicitly conceptual visual representations of identical POLY events. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PolyRepresentations = api;
})(typeof window === 'undefined' ? globalThis : window, function() {
  'use strict';

  const htmlEscape = value => String(value == null ? '' : value).replace(/[&<>"']/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const ANCHORS = Object.freeze({
    skin: [322, 231],
    cervical_spinal: [204, 137],
    brainstem: [204, 101],
    brain: [205, 71],
    insula: [210, 73],
    recording: [347, 102],
    report: [347, 355],
    heart: [214, 184],
    lungs: [211, 175]
  });

  function label(e) {
    const n=htmlEscape(e.title);
    return '<div class="event-kind">'+htmlEscape(e.role)+' · '+htmlEscape(e.route_status)+'</div>'+
           '<h3>'+n+'</h3><p>'+htmlEscape(e.operation)+'</p>';
  }

  function renderBody(s) {
    const e=s.event, a=ANCHORS[e.from_anchor], b=ANCHORS[e.to_anchor];
    const marks=a && b ?
       '<path d="M'+a.join(' ')+' L'+b.join(' ')+'" fill="none" stroke="#e3a55f" stroke-width="4" stroke-dasharray="5 8"/>'+
       '<circle cx="'+a[0]+'" cy="'+a[1]+'" r="9" fill="#78c4ac"/>'+
       '<circle cx="'+b[0]+'" cy="'+b[1]+'" r="9" fill="#efad73"/>'
       : '<text x="205" y="388" text-anchor="middle" font-size="12" fill="#cfe0da">Localisation corporelle non disponible</text>';
    const note=a&&b?'Repères illustratifs non mesurés : aucun trajet neuronal démontré.':
                    'Compartiment local, mesure ou événement sans ancrage corporel validé : pas de trajet dessiné.';
    return '<section class="presentation" data-view="body_schematic" data-event="'+htmlEscape(e.id)+'">'+
       '<div class="stage-head"><strong>Schéma corporel</strong><span>Repères conceptuels, aucune distance réelle</span></div>'+
       '<svg role="img" aria-label="Corps illustratif, non anatomiquement calibré" viewBox="0 0 410 410" class="body-view">'+
       '<rect x="4" y="4" width="402" height="402" rx="18" fill="#102922"/>'+
       '<g stroke="#8cae9f" fill="#4a7866" fill-opacity=".22" stroke-width="2">'+
       '<ellipse cx="205" cy="68" rx="32" ry="39"/>'+
       '<path d="M185 100 L176 113 L140 126 L105 209 L115 228 L157 160 L164 195 L159 333 L170 376 L192 376 L205 257 L218 376 L240 376 L252 333 L247 195 L254 160 L296 228 L306 209 L270 126 L234 113 L225 100 Z"/>'+
       '</g><path d="M205 102 L205 235" stroke="#8acbb6" stroke-width="4" opacity=".65"/>'+marks+
       '<text x="18" y="27" font-size="11" fill="#afcfc3">SILHOUETTE · NON RECALÉE</text></svg>'+
       '<p class="visual-note">'+htmlEscape(note)+'</p>'+label(e)+'</section>';
  }

  function renderGraph(s) {
    const e=s.event;
    const words=[e.from,...(e.via||[]),e.to].filter(Boolean);
    const steps=words.map((w,i)=>
      '<div class="graph-node"><span class="graph-n">'+(i+1)+'</span><span>'+htmlEscape(w)+'</span></div>'
    ).join('<div class="graph-link" aria-hidden="true">⇢</div>');
    return '<section class="presentation" data-view="evidence_graph" data-event="'+htmlEscape(e.id)+'">'+
      '<div class="stage-head"><strong>Graphe documentaire</strong><span>Ordre de lecture, non validation causale</span></div>'+
      '<div class="graph-body">'+steps+'</div>'+
      '<p class="visual-note">Les liens pointillés représentent une proposition de lecture, pas une continuité anatomique observée.</p>'+
      label(e)+'</section>';
  }

  const ADAPTERS=Object.freeze({
    body_schematic: Object.freeze({
      id:'body_schematic', kind:'presentation', supports_3d:false,
      scientific_coordinates:false, label:'Corps schématique', render:renderBody
    }),
    evidence_graph: Object.freeze({
      id:'evidence_graph', kind:'presentation', supports_3d:false,
      scientific_coordinates:false, label:'Graphe de preuves', render:renderGraph
    })
  });

  function render(snapshot) {
    const adapter=ADAPTERS[snapshot.view_id];
    if (!adapter) throw new RangeError('Adaptateur de représentation absent.');
    if (snapshot.event.measured_anatomical_coordinates ||
        snapshot.event.anatomical_continuity_proven || snapshot.event.chronology_proven)
      throw new Error('Ce prototype ne représente que des hypothèses géométriques non mesurées.');
    return adapter.render(snapshot);
  }

  return Object.freeze({ADAPTERS,ANCHORS,htmlEscape,render});
});
