# Audit des horloges v0.4 — critères avant extension

4 octobre 2026. Le premier fichier ZS060 du 28 mars a servi à découvrir les correspondances ; il reste un fichier de développement. Les quatre sessions de la cohorte v0.3 servent à vérifier leur transportabilité, sans sélectionner selon le résultat.

Décodage NEV suivant la spécification officielle Neuralynx : en-tête de 16 384 octets, enregistrements de 184 octets ; timestamps en microsecondes. Isoler les transitions montantes du bit 128 du port 0, sans confondre les ports. Comparer leur ordre et leur nombre aux goCue NWB. Exiger autant de signaux que d'essais et une erreur maximale ≤ 0,51 ms pour la correspondance directe, seuil d'arrondi et non précision physique garantie.

Comparer chaque unité exportée à son fichier de spikes brut nommé d'après unit_id : même nombre et erreur maximale ≤ 0,51 ms, sans permutation. Ne pas extrapoler une unité vérifiée aux autres.

Comparer les événements Odor on du journal ASC aux signaux électroniques en ordre si les nombres correspondent. Ajuster une horloge affine sur la première moitié seulement, puis tester la seconde moitié. Critère de travail : résidu maximal ≤ 5 ms dans la partie tenue à l'écart ; dérive et résidus par moitié sont conservés. Si le critère échoue, conserver l'échec, ne pas retoucher le seuil. Vérifier séparément les mentions CS PLUS/MINUS avant de traiter les non-réponses comme un état comportemental.

La concordance de l'export et des fichiers bruts n'est pas une mesure de la latence acoustique, sensorielle ou synaptique. Une borne d'arrondi ne doit jamais être présentée comme une borne complète d'incertitude biologique. Aucun modèle neuronal ni test émotionnel dans cette étape.

Référence : [format des fichiers Neuralynx](https://neuralynx.com/_software/NeuralynxDataFileFormats.pdf), sections File Header et Event Record.
