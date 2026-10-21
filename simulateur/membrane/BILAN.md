# POLY — intégration locale terminée, validation expérimentale bloquée

Le visualiseur adaptatif contient maintenant l'atlas HRA, le parcours documentaire et un panneau des cinq traces Hodgkin–Huxley du calmar, consultables ensemble. Les contrôles de trace ne changent pas le parcours documentaire ; changer de représentation ou d'étape ne change pas la trace. Aucun calcul du corps humain, lien causal, synchronisation biologique ou recalage anatomique n'est activé.

33 contrôles navigateur réussis : PC, mobile, agrandissement CSS 150/200 %, atlas peau et moelle, sélection des cinq traces et empreintes, préservation du parcours, refus de trois altérations. Les agrandissements CSS ne sont pas présentés comme un test du zoom natif du navigateur. Les suites locales noyau/atlas/contrat/raccord passent ; journaux dans reports/. Les 30 comparaisons numériques du lot E sont reprises avec leur portée, sans multiplier les simulations ni les confondre avec une validation expérimentale. Les originaux contrôlés sont inchangés.

La première copie manquait du dossier models/ : le navigateur a détecté le défaut, qui est corrigé. Des débordements de petits écrans agrandis ont été corrigés dans cette copie. Un essai négatif de navigateur avait aussi une erreur de callback dans le test ; le test final utilise des pages neuves et conserve les refus effectifs. Ces incidents ne sont pas présentés comme des réussites initiales.

La recherche SGAMP a retrouvé température et préparation dans l'article source. Le problème est désormais une incompatibilité documentée, accompagnée d'une calibration toujours contradictoire, et non simplement une température absente. Voir RECHERCHE_SGAMP.md et reports/SGAMP_REVIEW.json. Il serait injustifié de déclarer toute la validation scientifique terminée.

Le travail réalisable convenu — confrontation numérique, recherche ciblée et raccord local de consultation — est terminé. La validation empirique reste bloquée par les pièces décrites ; aucun ajustement opportuniste ni extrapolation humaine. Aucun push, site public, GitHub ou original modifié.

Vérification de livraison : les 33 contrôles navigateur ont aussi été exécutés depuis le dossier livré, avec les ressources locales de ce seul dossier. Playwright, utilisé uniquement par les tests, est fourni par un environnement de test séparé.
