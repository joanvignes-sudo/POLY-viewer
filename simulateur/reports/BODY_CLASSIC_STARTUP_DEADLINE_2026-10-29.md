# POLY — Secours du chargement classique silencieusement bloqué

29 octobre 2026. Reprise explicite après cb9af35.

## Écart traité
Le garde classique réagissait aux erreurs de ressource, aux promesses rejetées et à la perte WebGL. Une dépendance gardée en attente sans erreur ne déclenchait aucun secours : le main restait inerte. Les pages régionales possédaient déjà leur avertissement de chargement, mais pas l’entrée classique.

Le garde classique ouvre désormais le secours après 30 secondes si aria-busy reste vrai. Ce délai est une règle d’interface, pas une mesure de latence biologique ou de performance attendue. L’avertissement conserve les vues légères et un bouton de rechargement manuel hors du main inerte. Il ne coupe aucune requête et ne déclenche aucune relance.

Une réussite tardive de l’initialisation ferme seulement l’avertissement de délai ; une erreur explicite ou une perte de contexte reste affichée. Le diagnostic __polyClassicStartup conserve le franchissement du délai, l’état prêt et le motif courant. Les temporisateurs sont annulés au départ et à la réussite ; un retour de page persistée encore occupée les réarme. Cela qualifie une gestion d’événements, pas le fonctionnement physique de BFCache.

## Vérification
- Quatre tests de comportement exécutent le vrai garde dans un environnement contrôlé : délai puis réussite, erreur après délai, réussite puis perte WebGL, départ/retour et rechargement uniquement au clic.
- Suite Node complète : 182 réussites, zéro échec, zéro ignoré ; le contrôle ciblé est aussi passé après changement de version du garde dans le HTML.
- Nouvelle suite navigateur : dépendance enteric-inhibition.js retenue, horloge avancée à 31 secondes, secours accessible, une seule tentative, puis libération du module et retour aux 918 structures. Ordinateur et mobile émulé réussis.
- body-startup-browser et classic-controls-parity-browser : réussis sur ordinateur/mobile émulé ; secours après échec du fichier 3D et commandes classiques conservés.
- Les nouveaux tests unitaires et navigateur sont inscrits dans la configuration CI locale. Aucun lancement distant revendiqué.

## Limites conservées
Ce blocage est injecté volontairement pour vérifier le secours. Il ne reproduit ni n’explique la cause des refus TCP ou délais historiques. La cause reste inconnue. Les sources, paramètres scientifiques et géométries ne changent pas. Aucun téléphone physique mesuré, aucune validation biologique, aucun push, déploiement ou message externe.

## Reçus
outputs/POLY_CLASSIC_STARTUP_DEADLINE_RESULTS_20261029.json ; work/classic-deadline-browser.log ; work/classic-deadline-node.log. Serveur d’essai isolé 8131, ports utilisateur 8124/8128 préservés.
