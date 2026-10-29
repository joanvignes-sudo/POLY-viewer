# POLY — Réseau des échanges et contraintes, 29 octobre 2026

## Objectif et résultat reçu

Reconstruire les voies qui déterminent le sens et le lieu des échanges, leurs branches afférentes et leurs sorties, puis confronter leurs conséquences aux observations. La vue ne propose aucun paramètre numérique à modifier. Elle rend consultables 35 maillons, 42 relations typées, 13 parcours et 16 croisements dans un repère abstrait explicitement hypothétique. Ce voisinage est borné : il n'est pas la chaîne biologique complète ni un inventaire exhaustif.

Les 22 identités, descriptions et compartiments historiques ainsi que les listes de maillons des huit parcours de case-pellerin.json sont conservés. Sept fiches de couplage existantes sont rattachées aux maillons : Tarczyluk, Hasel, Gandhi, Wang, Vandoorne, Stavrou et Fernández-Moncada. Leurs contextes et leurs limites restent visibles. Les branches ajoutées distinguent glucose neuronal, ATP, redox NADH, protection NADPH, HCAR1–sérine, réponse NMDA et plasticité. Les relations entrantes et sortantes se consultent depuis chaque maillon. Les positions ne localisent aucune cellule réelle.

## Calcul effectif et limites

Les fichiers réversibles P7/P8 déjà produits ont été repris sans changer leurs octets, avec leurs empreintes. Le noyau fermé lactate–pyruvate–NADH/NAD est réellement exécuté : 243 états vérifiés, résidu maximal de bilan 1,0658141036401503e-14 ; aucune valeur positive du produit flux net × affinité dans ce contrôle. Cela vérifie les propriétés numériques du noyau synthétique, sans valider un organisme.

Une recherche finie automatique retrouve quatre combinaisons strictes de sens des deux transports MCT dans des états synthétiques. Les directions P7 sont comparées aux flux P8. Cette recherche n'est ni exhaustive, ni ajustée aux observations ; elle n'élimine aucune hypothèse biologique. Volumes et pH synthétiques ne sont pas des valeurs humaines admises.

La reconstruction recense les incidences du réseau, les parcours se croisant, les opérateurs d'observation et les frontières. Elle affiche explicitement : aucun flux cellulaire identifié, aucune chaîne complète calibrée. Les modules glucose/glycolyse, mitochondries/ATP, fermeture ionique et cinétique HCAR1–sérine ne sont pas calculés par P8. Le dessin ne remplace pas ces équations.

## Données revérifiées et rattachées

Les séries restent hors dépôt et hors site. Le serveur local les expose uniquement lorsque leur dossier est explicitement monté, via deux noms de ressources autorisés. Le client vérifie manifeste, taille, SHA256 et empreinte canonique du graphe avant réception.

- Nasu, DOI 10.1038/s41467-023-42230-5 : quatre séries C12, 17 points chacune, cellules source DM/DP/EM/EP et temps conservés. Cultures séparées de rat ; signaux optiques, pas concentrations ou transport apparié. La normalisation du signal rouge reste non certifiée ; Laconic garde son ΔR/R.
- Koep, DOI 10.1113/JP289216 : cinq conditions C14, indice net artérioveineux cérébral en mmol/min, SE, effectifs et contexte pH/lactate/glucose/oxygène conservés. Conditions catégorielles, pas une évolution temporelle interpolée ; aucune localisation astrocyte–neurone. Le signe anime seulement cette observation régionale.
- Fernández-Moncada, DOI 10.1038/s41467-024-51008-2 : sept séries agrégées C9 de réponse NMDAR-fEPSP chez la souris. Les moyennes incomplètes restent absentes, les minima/maxima ne deviennent pas des intervalles de confiance. Correspondance colonnes/tranches/animaux non résolue. L'incident historique de périmètre C9 reste signalé.
- Vandoorne et Li : intégrité des conteneurs originaux revérifiée, sans décoder de nouvelles cellules de réponse. Le test Vandoorne C3/Con-2 demeure réservé et intact. OCR/ECAR de Li ne sont pas assimilés à un flux lactate.

Au total : 12 séries, 455 points dont six valeurs manquantes préservées. Les dérivés C9/C12/C14 ont été vérifiés contre leurs manifestes historiques. Trois conteneurs originaux ont aussi été contrôlés ; les empreintes figurent dans RECEPTION.json. Aucune acquisition de données supplémentaire n'a été faite dans cette passe.

## Lecture visuelle

La boule bleue suit une courbe SVG. Son trajet documentaire représente un ordre de lecture ; trois secondes graphiques ne deviennent pas un temps biologique. Une frontière hypothétique ou une rupture de préparation arrête la lecture. Les observations sont relues telles que reçues : leur taille/épaisseur ne se compare qu'au sein d'une même série. Les signaux optiques ou synaptiques ne renversent pas un transport. La courbure associée au pH publié est un code graphique local, pas une déformation anatomique. Aucun effet numérique ne se propage d'une préparation à une autre.

Pause, lecture volontaire, choix d'un maillon et d'un parcours, cadrage, vue d'ensemble et relecture des points sont disponibles. Les animations s'arrêtent lors du départ ou du masquage de la page ; retour sans reprise automatique. Le réglage système de réduction des animations est respecté. Un échec de réception garde les observations déjà vérifiées. Les entrées anatomique et historique pointent vers cette vue sans retirer leurs fonctions.

## Vérifications

193 tests Node et 27 tests Python passent. La suite navigateur nouvelle passe sur ordinateur et mobile émulé : absence de saisie numérique, relations entrantes/sortantes, changement de signe de la seule observation régionale, état manquant, empreinte corrompue, ressource absente, conservation de la réception précédente, arrêt/reprise volontaire et réduction des animations. Échec initial HTTP 503 avec bouton de reprise testé. Les fixtures synthétiques des tests ne sont jamais enregistrées comme observations scientifiques. La page a également reçu les 12 séries locales réelles ; captures relues visuellement.

Pendant le développement, deux assertions de fixture ont été corrigées : sept fiches existaient et non six ; la relecture au dernier point recommence volontairement au premier, donc le test du point manquant a été déplacé à un point intérieur. Une première liaison d'empreinte dépendante des fins de ligne Windows a été remplacée par une sérialisation canonique JSON compacte vérifiée côté navigateur. Le catalogue conserve ses octets locaux : son empreinte de liaison normalise uniquement CRLF vers LF, avec un test qui refuse tout autre changement. Git protège les octets des noyaux P7/P8 via .gitattributes. Une omission d’import du nouvel utilitaire a été corrigée avant la réépreuve complète réussie. Ces incidents ne sont pas des résultats biologiques.

Le téléphone physique n'est pas testé. La cause historique des délais intermittents de chargement reste inconnue. Le délai local explicite et les tests réussis ne constituent pas sa correction.

## Suite scientifique nécessaire

L'extension du réseau doit conserver un contrat par mécanisme : compartiments, espèce/préparation, réaction ou transport, entrées/sorties, équations et unités, paramètres avec incertitudes, source et opérateur de mesure. Un lien documentaire doit devenir un module calculable seulement après qualification. Un réseau plus grand peut laisser plusieurs mécanismes indiscernables ; il faut chercher l'observation ou l'intervention capable de les départager.

Première cible : une seule préparation avec concentrations/pH/volumes, production et utilisation indépendamment contraintes, capacités de transport et observation calibrée. Tester les mécanismes concurrents sur des données indépendantes, en conservant le test réservé, puis étendre aux branches afférentes qui changent les prédictions. La carte permet de repérer les inconnues et leurs emplacements ; elle ne tranche pas aujourd'hui la direction biologique des échanges.

## Reprise locale

Vue : http://127.0.0.1:8131/simulateur/web/metabolic-network-lab.html

Démarrage depuis le dépôt :

```powershell
python simulateur/scripts/serve_body_region_preview.py --port 8131 --chunks-root ../body-chunks --reference-chunks-root ../reference-chunks --skeleton-chunks-root ../skeleton-chunks --metabolic-observations-root ../metabolic-observations
```

OBSERVATIONS_LOCALES.zip contient les seules observations dérivées et leur manifeste, pas les conteneurs bruts ou données réservées. Archive de travail locale, hors site public. Le constructeur joint utilise les chemins locaux historiques et vérifie les empreintes avant génération ; ce n'est pas un téléchargement. Le bundle Git local conserve le code, pas ces séries.
