# Observatoire POLY — préparation non publiée (19 octobre 2026)

## État vérifié
Site public : https://joanvignes-sudo.github.io/POLY-viewer/
Hébergement : GitHub Pages ; interface statique HTML/JavaScript (v0.130.0).
Aucune statistique de trafic temps réel ne peut être déduite du dépôt GitHub seul.

## Architecture recommandée
1. Installer une mesure d'audience respectueuse de la vie privée (Cloudflare Web Analytics ou équivalent) avec la configuration réelle du compte propriétaire ; ne pas inventer de jeton.
2. Ajouter des événements métier explicites et anonymes : ouverture d'une chaîne, lecture d'un intervalle, lancement d'une animation, clic vers une source. Ne pas transmettre les textes libres, identifiants personnels ni données de santé.
3. Prévoir une page d'administration protégée par une authentification serveur, jamais par un mot de passe codé dans le JavaScript public. L'hébergement statique GitHub Pages ne suffit pas pour cette protection.
4. Créer un système de retours volontaires (commentaire, correction scientifique, source suggérée), avec stockage serveur, modération, anti-spam et consentement ; aucune collecte silencieuse.
5. Afficher les métriques avec leur fraîcheur réelle : « dernières 5 minutes » ou « dernières 24 h » selon les capacités du fournisseur. Ne pas annoncer du direct si le fournisseur ne le permet pas.

## Étapes de mise en œuvre
- Vérifier le compte analytics à utiliser et créer le jeton/site ID.
- Brancher le script de mesure sur les pages voulues.
- Vérifier les mesures sur deux navigateurs distincts, avec et sans bloqueur.
- Déployer les retours et la modération sur une solution avec authentification.
- Faire valider l'impact RGPD/cookies selon les traceurs retenus.
- Publier seulement après validation explicite du propriétaire.

## Critères de réception
- Compteur de visiteurs actifs avec fenêtre temporelle explicite.
- Vues par page et événements d'exploration.
- Boîte de réception des retours, statut de modération.
- Accès administrateur utilisable sur téléphone.
- Aucun secret dans le dépôt ni données personnelles dans les événements.
