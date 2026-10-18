# Perturbations corporelles et neuromodulatrices — examen v0.11

Les conclusions ci-dessous ont une portée locale. Les mesures d'évitement, de choix, de sensations et d'affect rapporté ne sont pas interchangeables. Aucune voie universelle ni proposition sur la conscience n'est validée.

| Préparation | Intervention et contrôle | Ce que le résultat permet d'écarter localement | Ce qui reste ouvert |
|---|---|---|---|
| Cœur–comportement, souris, S15 | Stimulation cardiaque optogénétique ; contrôles de génotype et lumière, conditions comportementales distinctes | Une simple association spontanée cœur/comportement ne suffit plus comme explication de l'effet de l'intervention | Route afférente, effets concomitants, ECG éveillé synchronisé, délais ; ne pas raccorder la calibration anesthésiée aux comportements |
| Cœur–insula, souris, S15 | Inhibition de l'insula postérieure ; comparaison préfrontale dans une autre cohorte | La perturbation insulaire soutient une contribution locale dans le contexte testé | Nécessité de toutes les autres voies, médiation complète, spécificité anatomique et état affectif vécu |
| CO₂ et lésions bilatérales amygdaliennes, humains, S16 | Inhalations air puis CO₂ ; identité masquée, ordre fixe | Une amygdale intacte n'est pas nécessaire à toutes les réponses de panique dans ces cas | Compensation chronique, tissus résiduels, voies chimiosensorielles et corporelles alternatives, anticipation, généralisation |
| Isoprotérénol et mêmes lésions, humains, S21 | Agoniste périphérique versus saline ; protocoles de panique et d'interoception distincts | Une panique peut aussi survenir dans cette préparation sans inhalation CO₂ | Effets respiratoires et cardiaques simultanés, médiation par sensations rapportées, différences individuelles |
| Respiration–cerveau, patients avec électrodes, S18 | Respiration automatique sous anesthésie/intubation, puis ventilation externe et paralysie ; rythme lent/profond dans un groupe de cinq participants | Le flux nasal et une commande motrice respiratoire autonome ne sont pas indispensables à toutes les synchronisations observées | Voies mécanosensorielles/chimiosensorielles/vasculaires, artefacts et référence, identité des sites, traitements ; affect non mesuré |
| Inhibition sérotoninergique, souris, S22 | DREADDs + agoniste21/vehicle ; mCherry + mêmes conditions | Une intervention sur cette population peut modifier l'adaptation comportementale dans la tâche publiée | Variable computationnelle unique, mélange de systèmes d'apprentissage, sites récepteurs, effets non spécifiques ; affect non mesuré |
| VTA GABA–dopamine, souris, S10 | Activation et inhibition GABA, attente temporelle de récompense et enregistrements dopaminergiques | Un rôle local des neurones GABA dans la modulation des réponses dopaminergiques est soutenu par intervention | Comparaison soustraction/gain à refaire sur essais bruts, sélection des unités, voies supplémentaires ; dopamine mesurée comme spikes, pas concentration ni émotion |

## Cœur–insula : données primaires toujours attendues

Le dossier v0.8 conserve les cohortes séparées, les sessions incomplètes de la tâche avec choc et les divergences entre deux couples F/P publiés. Les contrôles lumineux ne sont pas un simple changement de fréquence : la méthode du contrôle 660 bpm emploie une séquence de Poisson. Les déclarations de non-significativité ne démontrent pas une équivalence. La demande envoyée à Karl Deisseroth vise les trajectoires, événements, identifiants, scripts et clarifications statistiques. [S15](https://www.nature.com/articles/s41586-023-05748-8).

## GABA–dopamine : comparaison interventionnelle encore à refaire

L'étude manipule l'attente de récompense et les neurones GABA de la VTA pour distinguer des transformations des réponses dopaminergiques. Les cohortes d'identification, d'activation, d'inhibition et de comportement restent séparées. L'erratum de l'axe temporel de la figure 3 est conservé. Les données par essai et les scripts sont demandés à Naoshige Uchida, également interrogé sur les données sérotoninergiques récompense/punition de S12. Aucun contraste soustraction/division nouveau n'est annoncé avant accès aux données. [S10](https://www.nature.com/articles/nature14855).

## CO₂ : trois cas, plusieurs effectifs de mesure

Trois participantes avec lésions et douze témoins ont été étudiées ; les inhalations répétées ne sont pas de nouvelles personnes. La panique repose sur un critère composite. L'analyse cardiaque exclut SM, sous propranolol, et les premiers essais des deux autres cas sont contaminés par les mouvements ; la conductance cutanée exploitable dans le groupe lésion ne concerne qu'AM. Les manquants ne deviennent pas des zéros. L'ordre air→CO₂ et l'affection chronique empêchent de traiter ce protocole comme une lésion expérimentale aiguë randomisée. [S16](https://pmc.ncbi.nlm.nih.gov/articles/PMC3739474/).

## Isoprotérénol : réplication partielle chez deux mêmes personnes

BG et AM sont les jumelles déjà présentes dans S16. Le protocole de panique est à ordre fixe et simple aveugle ; ses quinze témoins, plus jeunes, proviennent d'une autre étude. Le protocole d'interoception emploie quatorze injections randomisées en double aveugle et seize témoins distincts. BG rapporte une panique, AM une anxiété sans panique, avec des sensations respiratoires différentes. Les critères de panique diffèrent de S16 : aucune fusion des taux. La concordance temporelle des rapports, du cœur et de la respiration devra être testée sur les traces, désormais demandées à Sahib Khalsa. [S21](https://pmc.ncbi.nlm.nih.gov/articles/PMC4804013/).

## Ventilation : couplage traité, pas accès au signal intracrânien brut

Le contexte comprend propofol, tube endotrachéal et, sous ventilation, rocuronium ; les paramètres de CO₂ expiré sont approximativement appariés. Le contraste lent/profond modifie simultanément fréquence et volume courant. Les six fichiers traités sont auditables, mais ne contiennent pas les signaux intracrâniens bruts. Les traces de ceinture présentes n'établissent pas seules leur horloge ou leur association aux électrodes. Une synchronisation persistante ne localise donc pas une voie afférente complète. La demande à Brian Dlouhy porte sur les conventions d'export et la procédure d'accès. [S18](https://www.nature.com/articles/s41467-026-73828-0).

À partir des seuls indicateurs fournis, la comparaison des fractions de sites retenus entre ventilation standard et lente/profonde reproduit le p unilatéral 0,03125 publié (p bilatéral 0,0625). Il s'agit de cinq participants ; la cohérence moyenne de tous leurs sites est une autre cible et ne présente pas le même contraste. Les indicateurs correspondent au seuil 0,05 des Pvalues exportées ; on ne sait pas encore si ces Pvalues sont déjà ajustées. Aucune seconde correction n'est imposée sans cette information. Les six fichiers comprennent neuf identifiants distincts au total : le groupe de cinq ne se réduit pas à un sous-ensemble exact du groupe principal de huit.

## Sérotonine : intervention distincte de la réanalyse neuronale

La publication rapporte six animaux DREADDs et six témoins mCherry, avec un effet de l'inhibition compatible avec un modèle de méta-apprentissage. Une lésion simulée de variables du modèle n'est pas la mesure de leur suppression biologique. D'autres organisations de l'apprentissage restent possibles. [S22](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825708/).

Notre audit trouve 158 sessions de ces douze animaux dans le fichier distribué avec S13. Une session est écartée pour probabilités manquantes, sans imputation. Le contraste exploratoire des choix après inversion de préférence comprend 839 transitions admissibles et 127 blocs trop courts écartés. La différence médiane agoniste−véhicule de persistance vers l'ancien côté favorisé vaut +0,0762 dans le groupe DREADDs et +0,0138 chez les témoins. Les sessions sont moyennées avant les animaux ; les nombres de sessions par condition restent inégaux. Ce contraste descriptif ne reproduit ni les constantes de temps ni le modèle Stan et ne fournit pas une nouvelle preuve statistique causale.

## Conditions pour avancer encore

Il faut des traces synchronisées pour tester les médiations et latences, des métadonnées de capteurs/horloges, les règles d'exclusion et l'identité des unités de réplication. Pour l'humain, la procédure de partage doit être clarifiée avant d'accepter un accord. Pour les modèles, il faut distinguer reproduction sur les mêmes données, prédiction temporelle et transfert à une nouvelle personne ou un nouvel animal. La v0.22 reste figée pendant ce travail.
