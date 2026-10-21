# POLY — confrontation scientifique approfondie (lot G)

Le travail a été poursuivi au-delà du raccord de consultation. NEURON a été réellement exécuté, le décodage SGAMP a été vérifié avec WFDB, trois autres essais ont été acquis avec contrôle des empreintes et le code du modèle Clay a été compilé et testé.

## Ce qui est maintenant démontré

**Reproduction numérique :** les dix cas du banc NEURON passent les seuils fixés avant exécution. Écart maximal de tension : 0,006348 mV. NEURON utilise CVode, le calcul local RK4 ; tables d'interpolation HH désactivées, paramètres, température, état initial et unités appariés. Le courant ponctuel NEURON est calculé à partir de l'aire réelle du compartiment. Cela renforce la vérification numérique, sans transformer les simulations en mesures.

**Décodage :** WFDB 4.3.0 et notre décodage manuel donnent exactement les mêmes échantillons sur a1t18 et a1t01. Aucun échantillon manquant dans ces deux essais. Le courant RMS de a1t01 sur 1–9 s vaut environ 0,433740 µA/cm², pour 0,43470 publié. La fenêtre est déclarée et ce rapprochement n'est pas une certification de calibration instrumentale.

**Annotations des impulsions :** a3t03 et a2t11 présentent des pics voisins de 5 µA/cm² ; a4t13, environ 10 µA/cm² et 5 ms. Tous portent une annotation de 25 µA/cm². Les différences de durée et d'amplitude invalident une correction globale arbitraire par cinq. Les fichiers reçus correspondent bien aux SHA-256 officiels.

**Modèle alternatif :** le mécanisme ModelDB 189922 (Clay et al., 2008) a été compilé sans modification. Avec les paramètres de contrôle explicités, HH classique produit six franchissements de 0 mV pendant l'impulsion, la révision Clay un seul. Le mécanisme externe laisse par défaut sa température locale et son potentiel de fuite à zéro : ces omissions sont enregistrées ; les essais avec valeurs explicites sont distincts, et ne sont pas annoncés comme reproduction automatique de toute la figure publiée.

## Verdict scientifique pour le couple modèle–données choisi

Le HH classique ne peut pas être déclaré prédicteur direct de cette préparation SGAMP. Le repos mesuré de a1t18 est −40,329 mV, contre un équilibre calculé proche de −64,996 mV. Une simple multiplication commune des cinétiques par un Q10 ne change pas cet équilibre lorsque conductances et potentiels d'inversion restent fixes ; la différence de repos d'environ 24,67 mV ne peut donc pas être réparée par ce seul réglage de température.

La révision Clay 2008 décrit un régime de type 3, pas le modèle complet de la préparation alcalinisée et bistable. La publication Clay–Shrier 2002 décrit un couplage de l'activation/inactivation sodique et un Q10 potassique de 3,63 : remplacer ce système par un Q10 commun de 3 n'est pas justifié. Les équations et paramètres complets correspondants n'ont pas été retrouvés dans les sources vérifiées. Aucun ajustement aux signaux n'a été effectué.

L'examen du couple actuel aboutit ainsi à un résultat négatif documenté, et non à une précision empirique validée. Le lecteur adaptatif local du lot F reste utilisable ; aucun résultat de G n'autorise une prédiction humaine, une propagation nerveuse ou un lien causal documentaire.

## Ce qui nécessite encore une information externe

Le document DEMANDE_CALIBRATION_PREPAREE.md formule les questions de calibration et de provenance du modèle. Après autorisation explicite de Joan, le message préparé a été envoyé à David Paydarfar via Gmail. Le reçu est conservé dans reports/CORRESPONDANCE_SGAMP.json. Une reprise automatique toutes les six heures surveille uniquement cette conversation et n'autorise aucun nouvel envoi.

Le protocole prospectif PROTOCOL_EVALUATION.json sépare les axones de réglage et d'évaluation, énumère les métriques et interdit d'ajuster les gains de conversion pour améliorer les scores. Il n'a pas été exécuté avec un modèle incompatible. Aucune évaluation humaine n'est engagée.

## Références vérifiées

- [PhysioNet SGAMP 1.0.0](https://physionet.org/content/sgamp/1.0.0/) : fichiers, conversion et sommes de contrôle.
- [Clay et al. 2008 — modèle externe](https://modeldb.science/189922), source [figée au commit 2bd29df](https://github.com/ModelDBRepository/189922/tree/2bd29df0588e076579da51604ffceb49e6a63a64).
- [Clay–Shrier 2002](https://pubmed.ncbi.nlm.nih.gov/12163979/) : cinétique couplée et température ; résumé primaire consulté, texte intégral non disponible par les accès vérifiés.
- [NEURON 9.0.2](https://github.com/neuronsimulator/nrn/releases/tag/9.0.2) : distribution officielle, SHA-256 conforme au digest de la release.
- [Paydarfar et al. 2006](https://journals.physiology.org/doi/abs/10.1152/jn.00486.2006) : préparation et tableau des axones, déjà documentés au lot F.

## Reprise

Lire ETAT_REPRISE.json et JOURNAL.md. Les scripts du supplément identifient explicitement les anciens dossiers sources du PC : les comparer à une autre machine demande de fournir ces entrées et de reconstruire le runtime local. Le paquet fournit preuves, scripts et protocoles ; il ne prétend pas inclure NEURON ni toutes ses dépendances. Les figures sont consultables sans ces dépendances.

Des essais de préparation ont révélé une incompatibilité de WFDB 4.3.0 avec pandas 3.0.6 : pandas 2.2.3 est utilisé et enregistré. Le chargement initial de NEURON a nécessité des chemins HOC explicites. Le compilateur a émis un avertissement /tmp absent, puis produit le DLL et réussi les exécutions. Les sources ModelDB et les modèles antérieurs ne sont pas réécrits. Pas de push, de déploiement ou de modification du site public.
