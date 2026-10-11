window.POLY_INTERVAL_ACTIONS={
  "version": "0.3",
  "chain_id": "C08",
  "note": "Chaque intervalle explicite maintenant Entrée → Changement → Sortie, avec statut de preuve. Les temps et garde-fous restent attachés au dataset scientifique.",
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
      "time_value_id": "GAP-E47-DYNAMIC-TIME",
      "evidence_label": "MESURÉ · TEMPS ÉLÉMENTAIRE ND",
      "steps": [
        {
          "label": "Entrée",
          "text": "Substrats et O₂ sont disponibles pour la mitochondrie.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "La production mitochondriale rend de l’ATP localement disponible.",
          "status": "MESURÉ"
        },
        {
          "label": "Sortie",
          "text": "Un pool local d’ATP peut alimenter des processus consommateurs.",
          "status": "MESURÉ / dynamique locale"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-MITO"
          ],
          "cue": "substrats + O₂ disponibles",
          "mark": "entrée"
        },
        {
          "actors": [
            "CHAR-MITO",
            "CHAR-ATP"
          ],
          "cue": "production locale d’ATP",
          "mark": "transformation"
        },
        {
          "actors": [
            "CHAR-ATP"
          ],
          "cue": "ATP local disponible",
          "mark": "sortie"
        }
      ]
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
      "time_value_id": "GAP-E50-CYCLE-ATP-TIME",
      "evidence_label": "MÊME ÉTUDE · DÉLAI ÉLÉMENTAIRE ND",
      "steps": [
        {
          "label": "Entrée",
          "text": "ATP présynaptique disponible et machinerie vésiculaire présente.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "Des étapes du cycle vésiculaire utilisent de l’énergie pendant que le cycle avance.",
          "status": "MESURÉ"
        },
        {
          "label": "Sortie",
          "text": "Le cycle vésiculaire reste opérationnel dans les conditions étudiées.",
          "status": "MESURÉ"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-ATP",
            "CHAR-VES"
          ],
          "cue": "ATP + machinerie vésiculaire",
          "mark": "entrée"
        },
        {
          "actors": [
            "CHAR-ATP",
            "CHAR-VES",
            "CHAR-MEM"
          ],
          "cue": "cycle vésiculaire consommateur d’énergie",
          "mark": "interaction"
        },
        {
          "actors": [
            "CHAR-VES",
            "CHAR-MEM"
          ],
          "cue": "cycle opérationnel",
          "mark": "sortie"
        }
      ]
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
      "time_value_id": "O48_NA_DEND_PEAK",
      "evidence_label": "OBSERVATION MESURÉE",
      "steps": [
        {
          "label": "Avant",
          "text": "Le signal Na⁺ dendritique est proche de sa ligne de base.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "Après stimulation, la concentration intracellulaire dendritique de Na⁺ augmente.",
          "status": "MESURÉ"
        },
        {
          "label": "Après",
          "text": "Le signal atteint le pic dendritique observé.",
          "status": "MESURÉ"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-NA",
            "CHAR-MEM",
            "CHAR-DEND"
          ],
          "cue": "Na⁺ majoritairement hors du compartiment",
          "mark": "avant"
        },
        {
          "actors": [
            "CHAR-NA",
            "CHAR-MEM",
            "CHAR-DEND"
          ],
          "cue": "entrée de Na⁺ après stimulation",
          "mark": "changement"
        },
        {
          "actors": [
            "CHAR-NA",
            "CHAR-DEND"
          ],
          "cue": "signal Na⁺ dendritique au pic",
          "mark": "après"
        }
      ]
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
      "time_value_id": "O48_NA_SOMA_PEAK",
      "evidence_label": "OBSERVATION MESURÉE",
      "steps": [
        {
          "label": "Avant",
          "text": "Le signal Na⁺ somatique est proche de sa ligne de base.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "Après stimulation, la concentration intracellulaire somatique de Na⁺ augmente.",
          "status": "MESURÉ"
        },
        {
          "label": "Après",
          "text": "Le signal atteint le pic somatique observé.",
          "status": "MESURÉ"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-NA",
            "CHAR-MEM",
            "CHAR-SOMA"
          ],
          "cue": "Na⁺ avant élévation somatique",
          "mark": "avant"
        },
        {
          "actors": [
            "CHAR-NA",
            "CHAR-MEM",
            "CHAR-SOMA"
          ],
          "cue": "augmentation intracellulaire de Na⁺",
          "mark": "changement"
        },
        {
          "actors": [
            "CHAR-NA",
            "CHAR-SOMA"
          ],
          "cue": "signal Na⁺ somatique au pic",
          "mark": "après"
        }
      ]
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
      "time_value_id": "O48_ATP_DEND_NADIR",
      "evidence_label": "OBSERVATION MESURÉE",
      "steps": [
        {
          "label": "Avant",
          "text": "Le signal ATP dendritique est proche de sa ligne de base.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "Après stimulation, le signal ATP dendritique diminue.",
          "status": "MESURÉ"
        },
        {
          "label": "Après",
          "text": "Le signal atteint le minimum dendritique observé.",
          "status": "MESURÉ"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-ATP",
            "CHAR-DEND"
          ],
          "cue": "ATP dendritique proche de la ligne de base",
          "mark": "avant"
        },
        {
          "actors": [
            "CHAR-ATP",
            "CHAR-DEND"
          ],
          "cue": "signal ATP diminue après stimulation",
          "mark": "changement"
        },
        {
          "actors": [
            "CHAR-ATP",
            "CHAR-DEND"
          ],
          "cue": "minimum ATP dendritique observé",
          "mark": "après"
        }
      ]
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
      "time_value_id": "O48_ATP_SOMA_NADIR",
      "evidence_label": "OBSERVATION MESURÉE",
      "steps": [
        {
          "label": "Avant",
          "text": "Le signal ATP somatique est proche de sa ligne de base.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "Après stimulation, le signal ATP somatique diminue.",
          "status": "MESURÉ"
        },
        {
          "label": "Après",
          "text": "Le signal atteint le minimum somatique observé.",
          "status": "MESURÉ"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-ATP",
            "CHAR-SOMA"
          ],
          "cue": "ATP somatique proche de la ligne de base",
          "mark": "avant"
        },
        {
          "actors": [
            "CHAR-ATP",
            "CHAR-SOMA"
          ],
          "cue": "signal ATP diminue après stimulation",
          "mark": "changement"
        },
        {
          "actors": [
            "CHAR-ATP",
            "CHAR-SOMA"
          ],
          "cue": "minimum ATP somatique observé",
          "mark": "après"
        }
      ]
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
      "time_value_id": "GAP-E48-NA-ATP-CAUSAL-DELAY",
      "evidence_label": "RELATION CAUSALE INCONNUE",
      "steps": [
        {
          "label": "Série Na⁺",
          "text": "Une augmentation de Na⁺ est observée dans sa propre série temporelle.",
          "status": "MESURÉ"
        },
        {
          "label": "Entre les deux",
          "text": "Aucun délai causal Na⁺ → ATP n’est mesuré avec une horloge commune.",
          "status": "ND"
        },
        {
          "label": "Série ATP",
          "text": "Une diminution d’ATP est observée dans une série distincte.",
          "status": "MESURÉ"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-NA"
          ],
          "cue": "série Na⁺ : hausse mesurée",
          "mark": "mesuré"
        },
        {
          "actors": [],
          "cue": "AUCUN raccord temporel causal mesuré",
          "mark": "ND"
        },
        {
          "actors": [
            "CHAR-ATP"
          ],
          "cue": "série ATP : baisse mesurée séparément",
          "mark": "mesuré"
        }
      ]
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
      "time_value_id": "O48_NA_DEND_RETURN",
      "evidence_label": "OBSERVATION MESURÉE",
      "steps": [
        {
          "label": "Entrée",
          "text": "Le Na⁺ dendritique vient d’atteindre son pic observé.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "La concentration intracellulaire dendritique de Na⁺ redescend.",
          "status": "MESURÉ"
        },
        {
          "label": "Sortie",
          "text": "Le signal revient vers sa ligne de base.",
          "status": "MESURÉ · mécanisme élémentaire non isolé"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-NA",
            "CHAR-DEND"
          ],
          "cue": "pic Na⁺ dendritique",
          "mark": "entrée"
        },
        {
          "actors": [
            "CHAR-NA",
            "CHAR-DEND"
          ],
          "cue": "le signal Na⁺ redescend",
          "mark": "changement"
        },
        {
          "actors": [
            "CHAR-DEND"
          ],
          "cue": "retour vers la ligne de base",
          "mark": "sortie"
        }
      ]
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
      "time_value_id": "O48_NA_SOMA_RETURN",
      "evidence_label": "OBSERVATION MESURÉE",
      "steps": [
        {
          "label": "Entrée",
          "text": "Le Na⁺ somatique vient d’atteindre son pic observé.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "La concentration intracellulaire somatique de Na⁺ redescend.",
          "status": "MESURÉ"
        },
        {
          "label": "Sortie",
          "text": "Le signal revient vers sa ligne de base.",
          "status": "MESURÉ · mécanisme élémentaire non isolé"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-NA",
            "CHAR-SOMA"
          ],
          "cue": "pic Na⁺ somatique",
          "mark": "entrée"
        },
        {
          "actors": [
            "CHAR-NA",
            "CHAR-SOMA"
          ],
          "cue": "le signal Na⁺ redescend",
          "mark": "changement"
        },
        {
          "actors": [
            "CHAR-SOMA"
          ],
          "cue": "retour vers la ligne de base",
          "mark": "sortie"
        }
      ]
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
      "time_value_id": "O48_ATP_RETURN",
      "evidence_label": "OBSERVATION MESURÉE",
      "steps": [
        {
          "label": "Entrée",
          "text": "Le signal ATP est au voisinage de son minimum observé.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "Le signal ATP remonte progressivement.",
          "status": "MESURÉ"
        },
        {
          "label": "Sortie",
          "text": "Le signal revient vers sa ligne de base.",
          "status": "MESURÉ · mécanisme de recharge non isolé"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-ATP"
          ],
          "cue": "ATP au voisinage du minimum",
          "mark": "entrée"
        },
        {
          "actors": [
            "CHAR-ATP"
          ],
          "cue": "le signal ATP remonte",
          "mark": "changement"
        },
        {
          "actors": [
            "CHAR-ATP"
          ],
          "cue": "retour vers la ligne de base",
          "mark": "sortie"
        }
      ]
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
      "time_value_id": "O48_DIFFUSION",
      "evidence_label": "MESURÉ · COEFFICIENT, PAS DURÉE",
      "steps": [
        {
          "label": "Entrée",
          "text": "Une élévation locale de Na⁺ est présente dans la dendrite.",
          "status": "MESURÉ"
        },
        {
          "label": "Changement",
          "text": "Le profil de Na⁺ s’étale spatialement le long de la dendrite.",
          "status": "MESURÉ"
        },
        {
          "label": "Sortie",
          "text": "La charge locale est redistribuée sur une plus grande distance.",
          "status": "MESURÉ"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-NA",
            "CHAR-DEND"
          ],
          "cue": "charge Na⁺ localisée",
          "mark": "entrée"
        },
        {
          "actors": [
            "CHAR-NA",
            "CHAR-DEND"
          ],
          "cue": "étalement longitudinal",
          "mark": "diffusion"
        },
        {
          "actors": [
            "CHAR-NA",
            "CHAR-DEND"
          ],
          "cue": "distribution spatiale plus large",
          "mark": "sortie"
        }
      ]
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
      "time_value_id": "GAP-E49-NEURONAL-TIMING",
      "evidence_label": "MESURÉ EN HeLa · TEMPS NEURONAL ND",
      "steps": [
        {
          "label": "Entrée",
          "text": "Du Ca²⁺ est libéré depuis l’ER vers le cytosol local.",
          "status": "MESURÉ · HeLa"
        },
        {
          "label": "Changement",
          "text": "Un microdomaine local de Ca²⁺ atteint la proximité mitochondriale.",
          "status": "MESURÉ · HeLa"
        },
        {
          "label": "Sortie",
          "text": "La mitochondrie est exposée à cette élévation locale de Ca²⁺.",
          "status": "MESURÉ · HeLa, extrapolation neuronale interdite"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-ER",
            "CHAR-CA"
          ],
          "cue": "libération locale de Ca²⁺ depuis l’ER",
          "mark": "entrée · HeLa"
        },
        {
          "actors": [
            "CHAR-CA",
            "CHAR-MITO"
          ],
          "cue": "microdomaine Ca²⁺ vers la mitochondrie",
          "mark": "interaction · HeLa"
        },
        {
          "actors": [
            "CHAR-MITO",
            "CHAR-CA"
          ],
          "cue": "mitochondrie exposée au Ca²⁺ local",
          "mark": "sortie · HeLa"
        }
      ]
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
      "time_value_id": null,
      "evidence_label": "RELATION RECONSTRUITE",
      "steps": [
        {
          "label": "Entrée",
          "text": "De l’ATP est disponible à proximité d’un transport actif.",
          "status": "CONCEPTUEL"
        },
        {
          "label": "Changement",
          "text": "Le transport actif utilise de l’ATP et déplace des ions contre leurs gradients.",
          "status": "MÉCANISME ÉTABLI · raccord C08 reconstruit"
        },
        {
          "label": "Sortie",
          "text": "Cette activité contribue à entretenir les gradients ioniques.",
          "status": "RECONSTRUIT dans C08"
        }
      ],
      "phase_visuals": [
        {
          "actors": [
            "CHAR-ATP",
            "CHAR-PUMP"
          ],
          "cue": "ATP disponible près d’un transport actif",
          "mark": "entrée"
        },
        {
          "actors": [
            "CHAR-PUMP",
            "CHAR-NA",
            "CHAR-K"
          ],
          "cue": "transport actif d’ions",
          "mark": "mécanisme établi"
        },
        {
          "actors": [
            "CHAR-NA",
            "CHAR-K",
            "CHAR-MEM"
          ],
          "cue": "gradients ioniques entretenus",
          "mark": "raccord C08 reconstruit"
        }
      ]
    }
  ]
};
