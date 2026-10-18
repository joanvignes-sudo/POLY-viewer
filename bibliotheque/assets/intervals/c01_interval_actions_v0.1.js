window.POLY_C01_INTERVAL_ACTIONS={
  "version":"0.1",
  "chain_id":"C01",
  "status":"MANUAL_AUDITED_BASELINE",
  "actions":[
    {
      "id":"I01","branch":"LUMIERE","title":"Photon → photorécepteur stimulé",
      "targets":["NODE:E01","VALUE:GAP-T-E01"],"actors":["CHAR-PHOTON","CHAR-PHOTOREC"],
      "template":"PHOTON_HIT","action":"Un stimulus lumineux atteint le photorécepteur et déclenche sa réponse locale.",
      "guard":"E01 est mesuré dans un bâtonnet de crapaud isolé. Cette scène ne représente ni une perception consciente ni une chaîne visuelle complète.",
      "time_value_id":"GAP-T-E01","evidence_label":"MESURÉ · TEMPS LOCAL ND",
      "steps":[
        {"label":"Entrée","text":"Un photon atteint le photorécepteur.","status":"MESURÉ · stimulus"},
        {"label":"Changement","text":"Le photorécepteur répond au stimulus lumineux.","status":"MESURÉ · E01"},
        {"label":"Sortie","text":"La phototransduction est engagée localement.","status":"MESURÉ · chronométrie élémentaire ND"}],
      "phase_visuals":[
        {"actors":["CHAR-PHOTON","CHAR-PHOTOREC"],"cue":"le photon arrive sur le photorécepteur","mark":"entrée"},
        {"actors":["CHAR-PHOTOREC"],"cue":"le photorécepteur change d’état","mark":"interaction mesurée"},
        {"actors":["CHAR-PHOTOREC"],"cue":"réponse locale engagée","mark":"sortie"}],
      "continuations":[{"kind":"DECOMPOSITION_SAME_NODE","to":"I02","label":"Décomposition de E01","detail":"I01 et I02 déplient le même nœud mesuré E01 ; aucun délai séparé entre ces deux dessins n’est enregistré."}]
    },
    {
      "id":"I02","branch":"LUMIERE","title":"Phototransduction → variation du courant membranaire",
      "targets":["NODE:E01","VALUE:GAP-T-E01"],"actors":["CHAR-PHOTOREC","CHAR-MEM","CHAR-CHANNEL"],
      "template":"PHOTO_CURRENT","action":"La phototransduction s’accompagne d’une variation du courant membranaire du photorécepteur.",
      "guard":"Le registre autorise la variation de courant liée à E01, mais pas une chronologie commune avec E03 ni un raccord direct vers un neurone cortical.",
      "time_value_id":"GAP-T-E01","evidence_label":"MESURÉ · TEMPS LOCAL ND",
      "steps":[
        {"label":"Entrée","text":"Photorécepteur stimulé.","status":"MESURÉ"},
        {"label":"Changement","text":"Le courant membranaire varie pendant la phototransduction.","status":"MESURÉ · E01"},
        {"label":"Sortie","text":"État électrique local du photorécepteur modifié.","status":"MESURÉ"}],
      "phase_visuals":[
        {"actors":["CHAR-PHOTOREC"],"cue":"photorécepteur stimulé","mark":"entrée"},
        {"actors":["CHAR-PHOTOREC","CHAR-MEM","CHAR-CHANNEL"],"cue":"variation du courant membranaire","mark":"changement"},
        {"actors":["CHAR-MEM"],"cue":"état électrique local modifié","mark":"sortie"}],
      "continuations":[{"kind":"RECONSTRUCTED_CONVERGENCE","to":"I05","label":"Convergence pédagogique vers la dynamique membranaire","detail":"Le lien vers I05 est une reconstruction multi-préparations. Il ne prouve ni même cellule, ni même interface, ni horloge commune."}]
    },
    {
      "id":"I03","branch":"MECANIQUE","title":"Force mécanique → membrane déformée",
      "targets":["NODE:E02","VALUE:GAP-T-E02"],"actors":["CHAR-FORCE","CHAR-MEM","CHAR-MECHANOCHANNEL"],
      "template":"MECH_FORCE","action":"Une contrainte mécanique déforme la membrane portant un canal mécanosensible.",
      "guard":"E02 concerne une stimulation mécanique et doit rester séparé de la branche photon. La cinétique dépend du stimulus et de la cellule.",
      "time_value_id":"GAP-T-E02","evidence_label":"MESURÉ · TEMPS LOCAL ND",
      "steps":[
        {"label":"Entrée","text":"Une force agit sur la membrane.","status":"MESURÉ · stimulus"},
        {"label":"Changement","text":"La membrane et le canal mécanosensible sont soumis à la déformation.","status":"MESURÉ · E02"},
        {"label":"Sortie","text":"Le canal atteint un état compatible avec son ouverture.","status":"MESURÉ · représentation pédagogique"}],
      "phase_visuals":[
        {"actors":["CHAR-FORCE","CHAR-MEM"],"cue":"la force atteint la membrane","mark":"entrée"},
        {"actors":["CHAR-FORCE","CHAR-MECHANOCHANNEL"],"cue":"la contrainte déforme le canal","mark":"changement"},
        {"actors":["CHAR-MECHANOCHANNEL"],"cue":"canal mécanosensible prêt à conduire","mark":"sortie"}],
      "continuations":[{"kind":"DECOMPOSITION_SAME_NODE","to":"I04","label":"Décomposition de E02","detail":"I03 et I04 déplient le même nœud E02 ; aucune durée élémentaire force→ouverture n’est enregistrée dans POLY."}]
    },
    {
      "id":"I04","branch":"MECANIQUE","title":"Canal mécanosensible → courant cationique",
      "targets":["NODE:E02","VALUE:GAP-T-E02"],"actors":["CHAR-MECHANOCHANNEL","CHAR-CATION","CHAR-MEM"],
      "template":"MECH_CHANNEL","action":"L’ouverture du canal mécanosensible permet un courant ionique ; le personnage ionique reste volontairement générique.",
      "guard":"Ne pas réduire PIEZO à un canal Na⁺ : la scène utilise un cation générique pour ne pas inventer une sélectivité absente du nœud.",
      "time_value_id":"GAP-T-E02","evidence_label":"MESURÉ · TEMPS LOCAL ND",
      "steps":[
        {"label":"Entrée","text":"Canal soumis à une contrainte mécanique.","status":"MESURÉ"},
        {"label":"Changement","text":"Le canal s’ouvre et un courant cationique apparaît.","status":"MESURÉ · E02"},
        {"label":"Sortie","text":"Le courant modifie localement l’état électrique membranaire.","status":"MESURÉ · local"}],
      "phase_visuals":[
        {"actors":["CHAR-MECHANOCHANNEL"],"cue":"canal avant ouverture","mark":"entrée"},
        {"actors":["CHAR-MECHANOCHANNEL","CHAR-CATION"],"cue":"des cations traversent le canal","mark":"changement"},
        {"actors":["CHAR-MEM","CHAR-CATION"],"cue":"courant ionique local","mark":"sortie"}],
      "continuations":[{"kind":"RECONSTRUCTED_CONVERGENCE","to":"I05","label":"Convergence pédagogique vers la dynamique membranaire","detail":"Le raccord vers E03 est documentaire/reconstruit : il ne transforme pas E02 et E03 en une même expérience."}]
    },
    {
      "id":"I05","branch":"TRONC","title":"Gradients Na⁺/K⁺ et canaux → potentiel de membrane",
      "targets":["NODE:E03","VALUE:GAP-T-E03","EDGE:SEQ-C01-E02-E03"],"actors":["CHAR-NA","CHAR-K","CHAR-MEM","CHAR-CHANNEL"],
      "template":"MEMBRANE_DYNAMICS","action":"Les conductances ioniques et les gradients Na⁺/K⁺ font évoluer le potentiel de membrane.",
      "guard":"Le repère empirique E03 s’appuie sur le modèle de l’axone géant de calmar ; il ne fixe pas la durée universelle d’un neurone mammifère.",
      "time_value_id":"GAP-T-E03","evidence_label":"MESURÉ · TEMPS LOCAL ND",
      "steps":[
        {"label":"Entrée","text":"Gradients Na⁺/K⁺ et canaux disponibles.","status":"MESURÉ"},
        {"label":"Changement","text":"Les conductances changent et les ions contribuent aux courants membranaires.","status":"MESURÉ · E03"},
        {"label":"Sortie","text":"Le potentiel de membrane évolue : dépolarisation puis repolarisation dans le modèle source.","status":"MESURÉ"}],
      "phase_visuals":[
        {"actors":["CHAR-NA","CHAR-K","CHAR-MEM"],"cue":"gradients de part et d’autre de la membrane","mark":"entrée"},
        {"actors":["CHAR-NA","CHAR-K","CHAR-CHANNEL"],"cue":"courants ioniques à travers les canaux","mark":"changement"},
        {"actors":["CHAR-MEM"],"cue":"potentiel membranaire modifié","mark":"sortie"}],
      "continuations":[{"kind":"PEDAGOGICAL_DECOMPOSITION","to":"I06","label":"Étape pédagogique de déclenchement","detail":"I06 explicite la notion de seuil pour rendre le passage vers un potentiel d’action lisible ; ce sous-intervalle n’est pas un nœud empirique autonome du registre."}]
    },
    {
      "id":"I06","branch":"TRONC","title":"Seuil franchi → potentiel d’action engagé",
      "targets":["NODE:E03","EDGE:SEQ-C01-E03-E04"],"actors":["CHAR-MEM","CHAR-AP"],
      "template":"THRESHOLD_TRIGGER","action":"La scène représente pédagogiquement le passage d’une dynamique membranaire à un potentiel d’action régénératif.",
      "guard":"RECONSTRUCTION PÉDAGOGIQUE : POLY n’enregistre pas ici une mesure indépendante du délai seuil→déclenchement ni une même préparation E03→E04.",
      "time_value_id":null,"evidence_label":"RECONSTRUIT PÉDAGOGIQUE · PAS DE DÉLAI PROPRE",
      "steps":[
        {"label":"Entrée","text":"Potentiel membranaire dans une dynamique susceptible d’atteindre un seuil.","status":"CONTEXTE ÉTABLI"},
        {"label":"Changement","text":"Franchissement du seuil représenté comme relais pédagogique.","status":"RECONSTRUIT"},
        {"label":"Sortie","text":"Potentiel d’action engagé.","status":"RECONSTRUIT vers E04"}],
      "phase_visuals":[
        {"actors":["CHAR-MEM"],"cue":"dynamique membranaire","mark":"entrée"},
        {"actors":["CHAR-MEM","CHAR-AP"],"cue":"seuil franchi","mark":"reconstruction pédagogique"},
        {"actors":["CHAR-AP"],"cue":"potentiel d’action engagé","mark":"sortie"}],
      "continuations":[{"kind":"RECONSTRUCTED_SEQUENCE","to":"I07","label":"Vers la propagation axonale","detail":"Le raccord E03→E04 reste explicitement reconstruit et multi-préparations."}]
    },
    {
      "id":"I07","branch":"TRONC","title":"Potentiel d’action proximal → terminaison axonale",
      "targets":["NODE:E04","VALUE:GAP-T-E04","EDGE:SEQ-C01-E03-E04"],"actors":["CHAR-AP","CHAR-AXON","CHAR-TERMINAL"],
      "template":"AP_PROPAGATION","action":"Le potentiel d’action est représenté en propagation le long d’un axone vers une terminaison.",
      "guard":"E04 est RECONSTRUCTED dans le registre. Longueur et vitesse du trajet varient ; aucun délai universel n’est attribué.",
      "time_value_id":"GAP-T-E04","evidence_label":"RECONSTRUIT · TEMPS LOCAL ND",
      "steps":[
        {"label":"Entrée","text":"Potentiel d’action proximal.","status":"RECONSTRUIT"},
        {"label":"Changement","text":"Propagation régénérative le long de l’axone.","status":"MÉCANISME ÉTABLI · raccord E04 reconstruit"},
        {"label":"Sortie","text":"Terminaison axonale atteinte.","status":"RECONSTRUIT"}],
      "phase_visuals":[
        {"actors":["CHAR-AP","CHAR-AXON"],"cue":"PA au début du trajet","mark":"entrée"},
        {"actors":["CHAR-AP","CHAR-AXON"],"cue":"le PA se propage","mark":"changement"},
        {"actors":["CHAR-AP","CHAR-TERMINAL"],"cue":"arrivée à la terminaison","mark":"sortie"}],
      "continuations":[{"kind":"RECONSTRUCTED_SEQUENCE","to":"I08","label":"Raccord documentaire vers l’intégration postsynaptique","detail":"E04→E05 n’est pas une même trajectoire co-enregistrée ; le raccord est une reconstruction documentaire."}]
    },
    {
      "id":"I08","branch":"INTEGRATION","title":"Courants synaptiques dendritiques → état dendritique modifié",
      "targets":["NODE:E05","VALUE:GAP-T-E05","EDGE:SEQ-C01-E04-E05"],"actors":["CHAR-DEND","CHAR-SYN-CURRENT"],
      "template":"SYNAPTIC_CURRENT","action":"Des courants synaptiques locaux contribuent à l’état électrique de la dendrite.",
      "guard":"E05 rassemble des mécanismes d’intégration ; la fenêtre d’intégration n’est pas le temps de conduction de l’axone.",
      "time_value_id":"GAP-T-E05","evidence_label":"MESURÉ · TEMPS LOCAL ND",
      "steps":[
        {"label":"Entrée","text":"Courants synaptiques reçus sur la dendrite.","status":"MESURÉ"},
        {"label":"Changement","text":"Les contributions locales se combinent avec fuite, seuil et conductances actives.","status":"MESURÉ · E05"},
        {"label":"Sortie","text":"État électrique dendritique modifié.","status":"MESURÉ"}],
      "phase_visuals":[
        {"actors":["CHAR-DEND","CHAR-SYN-CURRENT"],"cue":"courants arrivent localement","mark":"entrée"},
        {"actors":["CHAR-DEND","CHAR-SYN-CURRENT"],"cue":"sommation et intégration","mark":"changement"},
        {"actors":["CHAR-DEND"],"cue":"état dendritique résultant","mark":"sortie"}],
      "continuations":[{"kind":"DECOMPOSITION_SAME_NODE","to":"I09","label":"Décomposition de E05","detail":"I08 et I09 séparent pédagogiquement les courants reçus de l’issue déclenchement/silence, sans inventer un délai supplémentaire."}]
    },
    {
      "id":"I09","branch":"INTEGRATION","title":"Intégration → déclenchement ou silence du neurone",
      "targets":["NODE:E05","VALUE:GAP-T-E05"],"actors":["CHAR-DEND","CHAR-SOMA","CHAR-DECISION"],
      "template":"NEURON_DECISION","action":"L’intégration des courants peut conduire au déclenchement ou à l’absence de déclenchement.",
      "guard":"Le dessin oui/non est pédagogique : l’intégration réelle dépend de la dynamique membranaire, des conductances et de la distribution spatio-temporelle des entrées.",
      "time_value_id":"GAP-T-E05","evidence_label":"MESURÉ · TEMPS LOCAL ND",
      "steps":[
        {"label":"Entrée","text":"État résultant des courants synaptiques.","status":"MESURÉ"},
        {"label":"Changement","text":"Intégration, fuite, seuil et conductances actives déterminent l’évolution du neurone.","status":"MESURÉ · E05"},
        {"label":"Sortie","text":"Déclenchement ou silence.","status":"MESURÉ · représentation pédagogique"}],
      "phase_visuals":[
        {"actors":["CHAR-DEND","CHAR-SOMA"],"cue":"entrées intégrées","mark":"entrée"},
        {"actors":["CHAR-DECISION"],"cue":"comparaison dynamique au seuil","mark":"changement"},
        {"actors":["CHAR-AP","CHAR-DECISION"],"cue":"déclenchement possible — sinon silence","mark":"sortie"}],
      "continuations":[{"kind":"STOP","to":null,"label":"Fin de la branche C01 enregistrée","detail":"C01 s’arrête ici. La suite synaptique détaillée appartient à d’autres chaînes et ne doit pas être ajoutée comme continuité mesurée de cette préparation."}]
    }
  ]
};