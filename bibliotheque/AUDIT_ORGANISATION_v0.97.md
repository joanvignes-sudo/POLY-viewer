# POLY v0.97 — Organisation, sources et concordance

[Dossiers et sources réunis](dossiers.html) · [Contrôles structurels](CONTROLES_ORGANISATION_v0.97.json) · [Contrôles dans le navigateur](NAVIGATION_ORGANISATION_v0.97.json)

## Périmètre et conclusion

Audit des registres actifs et de leurs accès : 14 chaînes, 50 parcours, 172 maillons de chaînes, 165 fiches de preuve, 127 observations, 45 repères temporels, 128 extractions, 215 documents archivés et catalogue de 1 631 fichiers. Les trois vues anatomiques conservent leur provenance et leurs limites entre échelles. Le catalogue avait été parcouru intégralement lors du contrôle v0.96.1 ; il n'a pas été revalidé scientifiquement article par article ici. Les maquettes et documents historiques sont des archives, pas des versions concurrentes du registre actif.

L'organisation présentait des défauts réels : références de contexte trop proches des mesures, cibles anciennes, accès dispersés, documents strictement identiques affichés plusieurs fois, et divergences de liens entre deux vues. Les corrections ci-dessous portent sur ces défauts établis.

## Corrections effectuées

- Quatre adresses primaires manquantes rétablies : C01 (State-Dependent Dendritic Computation), deux observations d'épissage de C06 (PMID 24035393 et 12215528), et C07 (Mao et al., 2024, article 8435). L'identité des articles a été vérifiée. Les résumés primaires de C06 décrivent respectivement 20–30 secondes et des demi-vies de 0,4–7,5 minutes ; ces quantités ne sont pas fusionnées.
- Dans C13 et C14, les synthèses de plusieurs études ne sont plus répétées comme si chacune était intégralement prouvée par chaque article. Le texte est conservé dans le dossier, séparé des références individuelles. La référence Harvard–Oxford est présentée comme anatomique, sans lui attribuer les mesures expérimentales.
- Les 24 cibles anciennes de C13 sont conservées comme historique. La navigation de contexte utilise les maillons actuels ; aucun nouveau rattachement scientifique fin n'est inventé.
- Le maillon P01-LIGHT de C13 reprend la précision déjà présente dans le parcours : distinction entre étalonnage et stimulation dans les préparations concernées. Aucun changement des mesures enregistrées.
- Les 50 parcours et les 45 repères concordent entre l'atelier, le fichier de l'atlas et les données réellement intégrées dans sa page. Trois liens de parcours et les liens publics des repères ont été harmonisés. Les synthèses POLY sont nommées comme telles, distinctement d'un article primaire. Les numéros de ligne désignent le texte archivé.
- Le parcours humain P8 ne reçoit plus par défaut le repère temporel d'une autre expérience sur les expressions faciales. L'absence de mesure propre n'est pas comblée.
- Dix groupes de documents strictement identiques regroupés : 205 textes distincts, 215 originaux conservés. Seules les fins de ligne sont normalisées pour établir l'identité. La recherche affiche un résultat commun et signale les copies historiques ; aucune fusion par simple ressemblance de titre ou de sujet.
- Un accès commun réunit chaque dossier, ses observations, ses références, ses extractions et ses maillons. Les références des dossiers peuvent être recherchées transversalement ; le registre complet donne aussi accès aux sept extractions sans parcours assigné. Les provenances CerebrA, BigBrain et histologiques sont réunies dans le même répertoire.
- Les contrôles automatiques refusent désormais une preuve, une cible, une référence de maillon ou une extraction absente. La concordance des deux vues et des documents regroupés est vérifiée par les scénarios conservés.

## Source de référence et répétitions utiles

EXPLORATION_v0.97.json est le registre courant de l'atelier. L'export de l'atlas reste le registre détaillé du catalogue, des documents et des analyses. ORGANISATION_v0.97.json en est un index dérivé : il ne constitue pas une troisième base scientifique à enrichir indépendamment. Une évolution des contenus doit régénérer l'index et les exports puis exécuter les contrôles de concordance.

Une source peut servir plusieurs dossiers ; ces usages ne sont pas des doublons inutiles. Les identifiants de source historiques ne sont pas tous des identifiants mondiaux d'article. Le répertoire regroupe les URL ou DOI explicitement identiques ; il ne fusionne pas arbitrairement un article PMC et un DOI sans identité établie. Les notices bibliographiques, extraits, fichiers acquis et bilans remplissent des fonctions différentes et restent distincts.

## Ce qui reste ouvert

Le bon fonctionnement d'un lien et la présence d'une référence ne garantissent pas, à eux seuls, que chaque interprétation est correcte. Cet audit ne revendique pas une relecture indépendante exhaustive de toutes les publications ni une reproduction des résultats. Les 25 observations marquées MEASURED ont un rattachement résolu ; seule une partie des passages primaires a fait l'objet d'une nouvelle vérification ciblée dans cette passe. Les autres valeurs et conclusions gardent leur statut antérieur.

Les références contextuelles de C13/C14 nécessitent encore une attribution précise à chaque proposition si l'on veut en faire des preuves locales. Sept extractions (S22-CIBLE, S22-DOSE, S22-VOIE, S22-CONTROLE, S22-EXCLUSION, S22-HISTO, VTA-VALVE) n'ont pas de parcours explicitement assigné ; elles restent consultables sans attribution supposée.

Le registre humain conserve deux questions ouvertes sur H01 : dénominateurs des participants et deux valeurs p différentes pour un même résultat hippocampique. Les limites de synchronisation et de correction statistique de H02 restent affichées. Aucune donnée brute ni reproduction indépendante n'est revendiquée.

Les images, maillages et 628 fichiers anatomiques et histologiques sont conservés octet pour octet. Les 127 observations gardent toutes leurs valeurs, identifiants et portées. L'atlas de population, le cerveau BigBrain et les expériences fonctionnelles ne deviennent pas un trajet individuel continu par ce regroupement.

## Validation

Contrôles structurels, concordance des 50 parcours et 45 repères, identité des dix groupes de copies, intégrité des fichiers anatomiques, tests de refus de références invalides. Dans Chrome : 64 dossiers, 142 groupes de références de dossiers, 128 extractions, 205 groupes documentaires, 45 repères, trois accès anatomiques et 816 liens internes présents. Six vues du répertoire vérifiées à 390 pixels ; aucun débordement constaté.

Régression réussie de l'atelier : 14 chaînes, 50 parcours, tous les maillons et relations, cinq modes, quatre lecteurs, annotations, export/import, retour depuis l'atlas et liens partageables. Aucun appareil mobile physique, nouveau test d'endurance prolongée ou validation scientifique exhaustive revendiqué.
