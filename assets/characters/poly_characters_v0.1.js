window.POLY_CHARACTER_LIBRARY={
  "version": "0.1",
  "chain_scope": "C08",
  "characters": [
    {
      "id": "CHAR-NA",
      "symbol": "Na⁺",
      "name": "Sodium",
      "family": "Ion",
      "role": "Ion impliqué dans les gradients et les variations électriques.",
      "actions": [
        "entre",
        "s’accumule",
        "diffuse"
      ],
      "scenes": [
        "F03",
        "F04",
        "F05",
        "F06"
      ],
      "objects": [
        "E48",
        "E48.1"
      ],
      "status": "ACTIVE_C08",
      "accent": "#20c7e8"
    },
    {
      "id": "CHAR-K",
      "symbol": "K⁺",
      "name": "Potassium",
      "family": "Ion",
      "role": "Ion majeur des gradients membranaires et partenaire du sodium dans de nombreux mécanismes.",
      "actions": [
        "se déplace selon les gradients",
        "participe au rééquilibrage"
      ],
      "scenes": [],
      "objects": [],
      "status": "GLOSSARY_READY_NOT_BOUND_C08",
      "accent": "#8b67d8"
    },
    {
      "id": "CHAR-CA",
      "symbol": "Ca²⁺",
      "name": "Calcium",
      "family": "Ion",
      "role": "Ion de signalisation locale ; ici utilisé pour le couplage ER–mitochondrie.",
      "actions": [
        "est libéré localement",
        "forme un microdomaine"
      ],
      "scenes": [
        "F07"
      ],
      "objects": [
        "E49"
      ],
      "status": "ACTIVE_C08",
      "accent": "#ef5b4c"
    },
    {
      "id": "CHAR-ATP",
      "symbol": "ATP",
      "name": "ATP",
      "family": "Ressource / énergie",
      "role": "Ressource énergétique utilisée par de nombreux mécanismes cellulaires.",
      "actions": [
        "est disponible",
        "est consommé",
        "se rétablit"
      ],
      "scenes": [
        "F01",
        "F02",
        "F04",
        "F05"
      ],
      "objects": [
        "E47",
        "E48",
        "E50"
      ],
      "status": "ACTIVE_C08",
      "accent": "#f2b632"
    },
    {
      "id": "CHAR-PUMP",
      "symbol": "Pompe",
      "name": "Pompe Na⁺/K⁺",
      "family": "Mécanisme",
      "role": "Mécanisme membranaire de transport actif Na⁺/K⁺.",
      "actions": [
        "transporte des ions",
        "consomme de l’ATP"
      ],
      "scenes": [],
      "objects": [],
      "status": "GLOSSARY_READY_NOT_BOUND_C08",
      "accent": "#59a95a",
      "caveat": "Personnage prêt, mais pas encore lié à une relation empirique C08 du registre actuel."
    },
    {
      "id": "CHAR-MEM",
      "symbol": "Membrane",
      "name": "Membrane cellulaire",
      "family": "Structure cellulaire",
      "role": "Frontière dynamique qui sépare les compartiments et porte de nombreux mécanismes.",
      "actions": [
        "sépare",
        "porte des canaux et protéines",
        "définit un gradient"
      ],
      "scenes": [
        "F02",
        "F03"
      ],
      "objects": [
        "E48",
        "E50"
      ],
      "status": "ACTIVE_C08",
      "accent": "#e98c72"
    },
    {
      "id": "CHAR-MITO",
      "symbol": "Mito",
      "name": "Mitochondrie",
      "family": "Organite",
      "role": "Organite impliqué dans la production et la gestion énergétique cellulaire.",
      "actions": [
        "soutient la disponibilité énergétique",
        "reçoit des signaux locaux"
      ],
      "scenes": [
        "F01",
        "F07"
      ],
      "objects": [
        "E47",
        "E49"
      ],
      "status": "ACTIVE_C08",
      "accent": "#8c57c7"
    },
    {
      "id": "CHAR-VES",
      "symbol": "Vésicule",
      "name": "Vésicule synaptique",
      "family": "Transport / compartiment",
      "role": "Petit compartiment membranaire impliqué dans le cycle synaptique.",
      "actions": [
        "fusionne",
        "est récupérée",
        "est recyclée"
      ],
      "scenes": [
        "F02"
      ],
      "objects": [
        "E50"
      ],
      "status": "ACTIVE_C08",
      "accent": "#59aee6"
    },
    {
      "id": "CHAR-ER",
      "symbol": "ER",
      "name": "Réticulum endoplasmique",
      "family": "Organite",
      "role": "Réseau membranaire intracellulaire ; certaines zones servent de réserve et source de Ca²⁺.",
      "actions": [
        "stocke du Ca²⁺",
        "libère localement du Ca²⁺"
      ],
      "scenes": [
        "F07"
      ],
      "objects": [
        "E49"
      ],
      "status": "ACTIVE_C08",
      "accent": "#6fb9ee",
      "caveat": "F07 repose ici sur une source HeLa non neuronale."
    },
    {
      "id": "CHAR-DEND",
      "symbol": "Dendrite",
      "name": "Dendrite",
      "family": "Structure cellulaire",
      "role": "Compartiment neuronal ramifié recevant et intégrant de nombreux signaux.",
      "actions": [
        "reçoit",
        "conduit localement",
        "permet la diffusion intracellulaire"
      ],
      "scenes": [
        "F03",
        "F05",
        "F06"
      ],
      "objects": [
        "E48",
        "E48.1"
      ],
      "status": "ACTIVE_C08",
      "accent": "#e88a35"
    },
    {
      "id": "CHAR-SOMA",
      "symbol": "Soma",
      "name": "Soma",
      "family": "Structure cellulaire",
      "role": "Corps cellulaire du neurone.",
      "actions": [
        "intègre de nombreux processus cellulaires",
        "présente ses propres dynamiques ioniques et énergétiques"
      ],
      "scenes": [
        "F03",
        "F05"
      ],
      "objects": [
        "E48"
      ],
      "status": "ACTIVE_C08",
      "accent": "#e5a53f"
    }
  ]
};
window.POLY_CHARACTER_SVGS={
  "CHAR-NA": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"48\" r=\"27\" fill=\"#20c7e8\" stroke=\"#087b91\" stroke-width=\"3\"/><circle cx=\"42\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"44\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><path d=\"M40 60 Q50 68 61 59\" fill=\"none\" stroke=\"#111\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"M23 48 L10 40 M77 48 L90 39 M38 74 L31 91 M62 74 L70 91\" stroke=\"#087b91\" stroke-width=\"5\" stroke-linecap=\"round\"/></svg>",
  "CHAR-K": "<svg viewBox=\"0 0 100 100\"><path d=\"M27 28 Q50 12 73 28 Q87 48 72 70 Q50 84 28 70 Q13 50 27 28Z\" fill=\"#8b67d8\" stroke=\"#58389a\" stroke-width=\"3\"/><circle cx=\"42\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"44\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><path d=\"M39 61 Q50 55 62 62\" fill=\"none\" stroke=\"#111\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"M25 50 L10 55 M75 50 L90 55 M40 75 L35 91 M60 75 L66 91\" stroke=\"#58389a\" stroke-width=\"5\" stroke-linecap=\"round\"/></svg>",
  "CHAR-CA": "<svg viewBox=\"0 0 100 100\"><path d=\"M50 14 L62 31 L82 28 L74 48 L87 64 L66 67 L58 87 L43 72 L23 80 L27 59 L11 47 L31 39 L34 20Z\" fill=\"#ef5b4c\" stroke=\"#a83128\" stroke-width=\"3\"/><circle cx=\"42\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"44\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><path d=\"M41 62 Q50 70 61 61\" fill=\"none\" stroke=\"#111\" stroke-width=\"3\"/></svg>",
  "CHAR-ATP": "<svg viewBox=\"0 0 100 100\"><rect x=\"24\" y=\"22\" width=\"52\" height=\"58\" rx=\"16\" fill=\"#f2b632\" stroke=\"#a66e00\" stroke-width=\"3\"/><rect x=\"42\" y=\"14\" width=\"16\" height=\"8\" rx=\"3\" fill=\"#a66e00\"/><circle cx=\"42\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"44\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><path d=\"M52 48 L40 65 H50 L44 80 L65 58 H54 L61 48Z\" fill=\"#fff2a6\" stroke=\"#9b6700\" stroke-width=\"2\"/></svg>",
  "CHAR-PUMP": "<svg viewBox=\"0 0 100 100\"><rect x=\"8\" y=\"18\" width=\"84\" height=\"10\" rx=\"5\" fill=\"#e98c72\"/><rect x=\"8\" y=\"72\" width=\"84\" height=\"10\" rx=\"5\" fill=\"#e98c72\"/><rect x=\"31\" y=\"24\" width=\"38\" height=\"52\" rx=\"12\" fill=\"#59a95a\" stroke=\"#2f6c31\" stroke-width=\"3\"/><circle cx=\"42\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"44\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><path d=\"M40 60 Q50 66 61 59\" fill=\"none\" stroke=\"#111\" stroke-width=\"3\"/><path d=\"M18 48 H31 M69 48 H82\" stroke=\"#2f6c31\" stroke-width=\"5\"/><path d=\"M18 42 L10 48 L18 54 M82 42 L90 48 L82 54\" fill=\"none\" stroke=\"#2f6c31\" stroke-width=\"3\"/></svg>",
  "CHAR-MEM": "<svg viewBox=\"0 0 100 100\"><path d=\"M5 35 Q15 27 25 35 T45 35 T65 35 T85 35 T105 35\" fill=\"none\" stroke=\"#e98c72\" stroke-width=\"14\"/><path d=\"M5 65 Q15 57 25 65 T45 65 T65 65 T85 65 T105 65\" fill=\"none\" stroke=\"#e98c72\" stroke-width=\"14\"/><circle cx=\"42\" cy=\"50\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"50\" r=\"8\" fill=\"white\"/><circle cx=\"44\" cy=\"51\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"51\" r=\"3.5\" fill=\"#111\"/></svg>",
  "CHAR-MITO": "<svg viewBox=\"0 0 100 100\"><path d=\"M18 55 Q15 28 43 22 Q76 15 84 43 Q92 70 63 81 Q30 88 18 55Z\" fill=\"#8c57c7\" stroke=\"#56328a\" stroke-width=\"3\"/><path d=\"M29 42 Q40 28 52 41 T73 41 M28 58 Q40 45 52 59 T73 58\" fill=\"none\" stroke=\"#c9a9ef\" stroke-width=\"4\"/><circle cx=\"42\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"44\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"41\" r=\"3.5\" fill=\"#111\"/></svg>",
  "CHAR-VES": "<svg viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"34\" fill=\"#59aee6\" fill-opacity=\".8\" stroke=\"#2f6d9c\" stroke-width=\"3\"/><circle cx=\"42\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"44\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><circle cx=\"33\" cy=\"65\" r=\"5\" fill=\"#f2a34a\"/><circle cx=\"49\" cy=\"70\" r=\"5\" fill=\"#f2a34a\"/><circle cx=\"66\" cy=\"64\" r=\"5\" fill=\"#f2a34a\"/></svg>",
  "CHAR-ER": "<svg viewBox=\"0 0 100 100\"><g fill=\"none\" stroke=\"#6fb9ee\" stroke-width=\"10\" stroke-linecap=\"round\"><path d=\"M14 30 Q30 15 45 30 T78 30\"/><path d=\"M20 50 Q36 35 52 50 T84 50\"/><path d=\"M14 70 Q30 55 46 70 T78 70\"/></g><circle cx=\"45\" cy=\"48\" r=\"8\" fill=\"white\"/><circle cx=\"61\" cy=\"48\" r=\"8\" fill=\"white\"/><circle cx=\"47\" cy=\"49\" r=\"3.5\" fill=\"#111\"/><circle cx=\"63\" cy=\"49\" r=\"3.5\" fill=\"#111\"/></svg>",
  "CHAR-DEND": "<svg viewBox=\"0 0 100 100\"><path d=\"M50 88 V56 M50 58 L30 39 M50 58 L70 39 M31 40 L19 22 M31 40 L38 20 M69 40 L61 20 M69 40 L84 24\" stroke=\"#e88a35\" stroke-width=\"9\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"43\" cy=\"69\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"69\" r=\"8\" fill=\"white\"/><circle cx=\"45\" cy=\"70\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"70\" r=\"3.5\" fill=\"#111\"/></svg>",
  "CHAR-SOMA": "<svg viewBox=\"0 0 100 100\"><path d=\"M50 18 Q75 20 82 43 Q90 67 68 80 Q45 91 24 75 Q7 59 17 37 Q28 18 50 18Z\" fill=\"#e5a53f\" stroke=\"#a56c18\" stroke-width=\"3\"/><circle cx=\"50\" cy=\"54\" r=\"15\" fill=\"#f3c66f\" stroke=\"#a56c18\" stroke-width=\"2\"/><circle cx=\"42\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"58\" cy=\"40\" r=\"8\" fill=\"white\"/><circle cx=\"44\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><circle cx=\"60\" cy=\"41\" r=\"3.5\" fill=\"#111\"/><path d=\"M18 43 L5 34 M82 43 L95 34 M25 73 L12 86 M75 73 L88 86\" stroke=\"#a56c18\" stroke-width=\"6\" stroke-linecap=\"round\"/></svg>"
};
