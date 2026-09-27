window.POLY_INTERVAL_ACTIONS={
  "version": "0.1",
  "chain_id": "C08",
  "note": "Chaque animation décrit une transformation ou interaction. Les valeurs restent lues dans le dataset scientifique du viewer.",
  "actions": [
    {
      "id": "I01",
      "title": "Production locale → ATP disponible",
      "targets": [
        "VALUE:GAP-E47-DYNAMIC-TIME",
        "NODE:E47"
      ],
      "actors": [
        "CHAR-MITO",
        "CHAR-ATP"
      ],
      "template": "ATP_SUPPLY",
      "action": "La mitochondrie soutient une disponibilité locale d’ATP ; production et consommation peuvent se chevaucher.",
      "guard": "Temps élémentaire production → disponibilité : ND. Ne pas faire croire à un stock immobile.",
      "time_value_id": "GAP-E47-DYNAMIC-TIME"
    },
    {
      "id": "I02",
      "title": "ATP disponible → cycle vésiculaire opérationnel",
      "targets": [
        "EDGE:ED-C08-E47-E50",
        "VALUE:GAP-E50-CYCLE-ATP-TIME",
        "NODE:E50"
      ],
      "actors": [
        "CHAR-ATP",
        "CHAR-VES",
        "CHAR-MEM"
      ],
      "template": "VESICLE_CYCLE",
      "action": "Le cycle vésiculaire avance tandis que de l’énergie est utilisée localement.",
      "guard": "Même étude pour le lien fonctionnel, mais pas de délai élémentaire unique ATP → cycle.",
      "time_value_id": "GAP-E50-CYCLE-ATP-TIME"
    },
    {
      "id": "I03",
      "title": "Stimulation → pic Na⁺ dendritique",
      "targets": [
        "VALUE:O48_NA_DEND_PEAK"
      ],
      "actors": [
        "CHAR-NA",
        "CHAR-MEM",
        "CHAR-DEND"
      ],
      "template": "NA_INFLUX_DEND",
      "action": "Des Na⁺ franchissent la membrane et la concentration intracellulaire dendritique monte jusqu’au pic observé.",
      "guard": "Animation pédagogique non à l’échelle ; temps mesuré attaché à la série Na⁺ dendritique.",
      "time_value_id": "O48_NA_DEND_PEAK"
    },
    {
      "id": "I04",
      "title": "Stimulation → pic Na⁺ somatique",
      "targets": [
        "VALUE:O48_NA_SOMA_PEAK"
      ],
      "actors": [
        "CHAR-NA",
        "CHAR-MEM",
        "CHAR-SOMA"
      ],
      "template": "NA_INFLUX_SOMA",
      "action": "La concentration intracellulaire de Na⁺ somatique monte jusqu’au pic observé.",
      "guard": "Série Na⁺ ; ne pas la synchroniser avec la série ATP.",
      "time_value_id": "O48_NA_SOMA_PEAK"
    },
    {
      "id": "I05",
      "title": "Stimulation → creux ATP dendritique",
      "targets": [
        "VALUE:O48_ATP_DEND_NADIR"
      ],
      "actors": [
        "CHAR-ATP",
        "CHAR-DEND"
      ],
      "template": "ATP_DROP_DEND",
      "action": "Le signal ATP mesuré diminue après la stimulation jusqu’à son minimum dendritique.",
      "guard": "Cette série ATP est distincte de la série Na⁺ ; l’animation ne montre pas un mécanisme causal Na⁺ → ATP.",
      "time_value_id": "O48_ATP_DEND_NADIR"
    },
    {
      "id": "I06",
      "title": "Stimulation → creux ATP somatique",
      "targets": [
        "VALUE:O48_ATP_SOMA_NADIR"
      ],
      "actors": [
        "CHAR-ATP",
        "CHAR-SOMA"
      ],
      "template": "ATP_DROP_SOMA",
      "action": "Le signal ATP somatique diminue après la stimulation jusqu’à son minimum observé.",
      "guard": "Série ATP distincte des mesures Na⁺.",
      "time_value_id": "O48_ATP_SOMA_NADIR"
    },
    {
      "id": "I07",
      "title": "Relation temporelle Na⁺ ↔ ATP : inconnue",
      "targets": [
        "VALUE:GAP-E48-NA-ATP-CAUSAL-DELAY",
        "NODE:E48"
      ],
      "actors": [
        "CHAR-NA",
        "CHAR-ATP"
      ],
      "template": "SPLIT_UNKNOWN",
      "action": "On peut montrer séparément l’augmentation du Na⁺ et la baisse d’ATP, mais pas les relier par un délai causal mesuré.",
      "guard": "Na⁺ et ATP viennent de séries cellulaires distinctes. Aucun calcul de soustraction entre leurs temps.",
      "time_value_id": "GAP-E48-NA-ATP-CAUSAL-DELAY"
    },
    {
      "id": "I08",
      "title": "Pic Na⁺ dendritique → retour vers la ligne de base",
      "targets": [
        "VALUE:O48_NA_DEND_RETURN"
      ],
      "actors": [
        "CHAR-NA",
        "CHAR-DEND"
      ],
      "template": "NA_RECOVERY_DEND",
      "action": "La concentration Na⁺ dendritique redescend progressivement vers la ligne de base.",
      "guard": "Le temps publié est un retour global observé, pas une latence spécifique de la pompe.",
      "time_value_id": "O48_NA_DEND_RETURN"
    },
    {
      "id": "I09",
      "title": "Pic Na⁺ somatique → retour vers la ligne de base",
      "targets": [
        "VALUE:O48_NA_SOMA_RETURN"
      ],
      "actors": [
        "CHAR-NA",
        "CHAR-SOMA"
      ],
      "template": "NA_RECOVERY_SOMA",
      "action": "La concentration Na⁺ somatique redescend progressivement vers la ligne de base.",
      "guard": "Ne pas attribuer toute la récupération à un seul mécanisme sans mesure dédiée.",
      "time_value_id": "O48_NA_SOMA_RETURN"
    },
    {
      "id": "I10",
      "title": "Creux ATP → retour vers la ligne de base",
      "targets": [
        "VALUE:O48_ATP_RETURN"
      ],
      "actors": [
        "CHAR-ATP"
      ],
      "template": "ATP_RECOVERY",
      "action": "Le signal ATP remonte progressivement vers sa ligne de base.",
      "guard": "La mesure décrit la dynamique de récupération ATP ; elle ne donne pas le mécanisme élémentaire de recharge.",
      "time_value_id": "O48_ATP_RETURN"
    },
    {
      "id": "I11",
      "title": "Charge locale Na⁺ → diffusion longitudinale",
      "targets": [
        "VALUE:O48_DIFFUSION",
        "NODE:E48.1",
        "EDGE:ED-C08-E48-E48.1"
      ],
      "actors": [
        "CHAR-NA",
        "CHAR-DEND"
      ],
      "template": "NA_DIFFUSION",
      "action": "Un groupe local de Na⁺ s’étale le long de la dendrite : la charge locale se redistribue spatialement.",
      "guard": "D ≈ 330 µm²/s est un coefficient de diffusion, pas une durée.",
      "time_value_id": "O48_DIFFUSION"
    },
    {
      "id": "I12",
      "title": "ER : libération Ca²⁺ → proximité mitochondriale",
      "targets": [
        "VALUE:GAP-E49-NEURONAL-TIMING",
        "NODE:E49",
        "EDGE:ED-C08-E49-E47"
      ],
      "actors": [
        "CHAR-ER",
        "CHAR-CA",
        "CHAR-MITO"
      ],
      "template": "CA_ER_MITO",
      "action": "Du Ca²⁺ libéré par l’ER forme un microdomaine local atteignant la proximité mitochondriale.",
      "guard": "Source HeLa non neuronale ; temps neuronal et ancrage cérébral : ND.",
      "time_value_id": "GAP-E49-NEURONAL-TIMING"
    },
    {
      "id": "I13",
      "title": "ATP disponible → entretien des gradients",
      "targets": [
        "EDGE:ED-C08-E47-E48"
      ],
      "actors": [
        "CHAR-ATP",
        "CHAR-PUMP",
        "CHAR-NA",
        "CHAR-K",
        "CHAR-MEM"
      ],
      "template": "GRADIENT_SUPPORT",
      "action": "Animation conceptuelle : de l’ATP alimente un transport actif qui contribue à maintenir les gradients ioniques.",
      "guard": "Relation reconstruite dans C08 : pas de chronométrie commune démontrée ici.",
      "time_value_id": null
    }
  ]
};
