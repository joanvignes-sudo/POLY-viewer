# Vérification MATLAB native préparée

Package POLY_MATLAB_v0.80.zip : uniquement les données et fonctions du dépôt public Bang, les trois scripts de travail et les résultats attendus Python. Aucune correspondance privée, donnée personnelle de Joan ou autre volet POLY. Ancien modèle et correction auteur conservés ; contrôle à trois intercepts libres séparé.

Dans MATLAB, après extraction, ouvrir le dossier POLY_MATLAB_v0.80 et lancer :

~~~matlab
RUN_POLY_MATLAB
~~~

La fonction exige glmfit, ttest2, zscore et nanmean. Elle exécute les trois scripts dans un espace de variables isolé, conserve leurs sorties et compare coefficients/p individuels et groupés, tests t, moyennes et SEM à Python v0.79, tolérance absolue10⁻⁸. Le script auteur ferme les figures ouvertes ; privilégier une session dédiée. Aucun résultat ne sera déclaré passé avant exécution effective et examen des exports.

RESULTATS_MATLAB/VERIFICATION_NATIVE.json indique PASSED ou FAILED avec diagnostic. RESULTATS_MATLAB.zip regroupe résultats et figures. Les quatre premiers bins initialisés à zéro ne deviennent pas des tests p interprétables. Aucun résultat attendu n'est une preuve d'exécution native. Même en cas de PASSED, entraînement chimique, waveforms TTL et quatre axes ouverts demeurent hors portée de ce test.

État à la préparation : MATLAB Online ouvert dans Chrome, compte MathWorks non connecté. Aucune installation, souscription, création de compte ou acceptation de contrat effectuée. Les fichiers ne sont pas encore téléversés.
