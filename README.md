# 漢字 N5 — application d'apprentissage des kanji

Application web installable (PWA). Fonctionne hors ligne, sans compte, sans abonnement.
Toutes les données restent sur le téléphone : rien n'est envoyé nulle part.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | L'application : moteur SRS, reconnaissance de tracé, interface (63 ko) |
| `kanji.js` | Les 613 kanji N5/N4/N3 — sens, lectures, mots d'exemple (63 ko) |
| `traces.js` | Tracés KanjiVG — 5 456 traits ordonnés (388 ko) |
| `manifest.json` | Métadonnées d'installation sur l'écran d'accueil |
| `sw.js` | Service worker — met l'appli en cache pour l'usage hors ligne |
| `icone-*.png` | Icônes de l'écran d'accueil |

Aucune dépendance, aucun build, aucun `npm install`.

## Installation

### Test immédiat (2 minutes)

Copiez le dossier sur le téléphone et ouvrez `index.html` avec le navigateur.
Tout marche sauf l'icône d'écran d'accueil et le cache hors ligne — les deux
exigent HTTPS.

### Installation complète via GitHub Pages (gratuit, 10 minutes)

1. Créez un dépôt GitHub, par exemple `kanji-n5`, en public.
2. Déposez-y les fichiers de ce dossier, à la racine.
3. `Settings` → `Pages` → Source : `Deploy from a branch`, branche `main`, dossier `/ (root)`.
4. Au bout d'une minute, l'URL est `https://<votre-pseudo>.github.io/kanji-n5/`.
5. Ouvrez cette URL sur le téléphone :
   - **iOS / Safari** : bouton Partager → *Sur l'écran d'accueil*
   - **Android / Chrome** : menu ⋮ → *Installer l'application*

L'icône apparaît alors comme une appli native, plein écran, sans barre d'adresse,
et fonctionne dans le métro sans réseau.

> Autres hébergeurs gratuits équivalents : Netlify (glisser-déposer du dossier),
> Cloudflare Pages, Vercel.

## Fonctionnement

### Sélection des kanji

Onglet **Mes kanji** : **613 kanji** répartis en trois niveaux.

| Niveau | Kanji | Groupes | Organisation |
|---|---|---|---|
| N5 | 110 | 11 | par thème (chiffres, famille, verbes…) |
| N4 | 137 | 7 | par fréquence d'usage décroissante |
| N3 | 366 | 19 | par fréquence d'usage décroissante |

Le N5 est classé par thème parce que c'est le niveau où l'on construit du
vocabulaire utilisable tout de suite. Au-delà, l'ordre thématique perd son
intérêt : les groupes N4 et N3 suivent la **fréquence réelle dans la presse
japonaise**, ce qui est le meilleur ordre d'apprentissage pour de la lecture.
Le groupe 1 du N4 contient donc les kanji que vous croiserez le plus souvent.

Les 30 kanji que les listes JLPT classent en N4/N3 mais qui figuraient déjà
dans les leçons N5 thématiques (会, 力, 口, 新, 空…) n'apparaissent qu'une fois,
dans le N5.

Chaque niveau et chaque groupe se déplie d'une touche, et porte deux boutons
**＋** et **−** qui activent ou retirent tout son contenu d'un coup. Seuls les
kanji activés entrent dans les exercices.

Un formulaire en bas de page permet d'ajouter n'importe quel kanji rencontré
ailleurs. Vos ajouts forment un quatrième niveau, « Mes kanji ».

Format des mots pour un ajout manuel :
`安全|あんぜん|sécurité;品質|ひんしつ|qualité`

### Les cinq exercices

| Exercice | Question | Réponse |
|---|---|---|
| Retrouver le sens | 漢字 | QCM de sens |
| Retrouver le kanji | sens | QCM de kanji |
| Retrouver les lectures | 漢字 | 音 **et** 訓 séparément — 4 + 4 options |
| Lire un mot | mot en kanji | QCM de lecture kana |
| Écrire le kanji | sens + lectures | tracé au doigt, **corrigé trait par trait** |

Chaque exercice est activable ou désactivable indépendamment, depuis l'accueil
ou les réglages. Tous proposent un bouton **Je ne sais pas** qui dévoile la
réponse et suggère la note *Encore*.

### Lectures 音 et 訓 séparées

Une seule liste mélangeant les deux lectures permet de deviner : on reconnaît
le 音 et on en déduit le 訓. L'exercice pose donc **deux questions distinctes**
sur le même kanji — quatre propositions de 音'yomi, quatre de 訓'yomi, tirées
indépendamment.

Le verdict n'apparaît qu'une fois les deux choix faits, pour que le premier
n'oriente pas le second. La carte n'est réussie que si les deux réponses sont
justes.

Soixante kanji n'ont pas de 訓'yomi courant (百, 万, 曜, 毎, 週, 午, 校, 気, 電,
駅, 議, 制, 期…) et un seul n'a pas de 音'yomi (込) : l'exercice ne pose alors
qu'une question.

### Correction du tracé

L'exercice d'écriture compare chaque trait au modèle KanjiVG et **impose l'ordre
d'écriture**. Un trait n'est validé que si sa position de départ, sa position
d'arrivée, sa forme, son sens et sa longueur correspondent au trait attendu.

Les messages sont explicites plutôt que binaires :

- « Ce trait est bien tracé, mais c'est le n° 4. Le trait n° 2 vient d'abord. »
- « Trait tracé dans le mauvais sens. En japonais, on va toujours de haut en bas
  et de gauche à droite. »
- « Le trait ne part pas du bon endroit. » / « Trait trop court. »

Au deuxième échec sur le même trait, le modèle s'anime dans le carreau.
Le bouton *Montrer le trait* fait la même chose à la demande, au prix d'une erreur.

*Je ne sais pas — montrer le kanji* dessine le caractère entier trait par trait,
dans l'ordre, à une vitesse proportionnelle à la longueur de chaque trait. La
carte est alors notée *Encore* et repasse dans la même session.

La note SRS est suggérée automatiquement d'après le nombre d'erreurs
(0 erreur → Bien, 1–2 → Difficile, 3+ → Encore), mais reste modifiable.

**Réglage d'exigence** (Réglages → Exigence sur le tracé) : *Strict*, *Normal*
ou *Indulgent*. L'ordre des traits est toujours vérifié — le réglage ne joue que
sur la tolérance de forme et de placement.

Mesures sur les 5 456 traits des 613 kanji :

| Scénario | Résultat attendu | Taux |
|---|---|---|
| Tracé exact | accepté | 100 % |
| Tremblement de doigt ±2 | accepté | 100 % |
| Tracé décalé de 6 px | accepté | 100 % |
| Tracé 15 % plus petit | accepté | 100 % |
| Tracé penché de 10° | accepté | 100 % |
| Trait dessiné à l'envers | refusé | 99,6 % |
| Trait voisin joué à la place | refusé | 97,1 % |
| Tracé décalé de 30 px | refusé | 100 % |

Les 2,9 % de traits voisins acceptés à tort concernent les kanji à traits
quasi identiques et rapprochés (三, 目, 川). Passer en *Strict* les rattrape,
au prix d'un peu de tolérance sur le reste.

### Répétition espacée

Algorithme SM-2 simplifié. **Une fiche par couple (kanji, exercice)** : vous
pouvez très bien connaître le sens de 生 et échouer à ses lectures — les deux
progressent séparément, comme dans WaniKani.

Après chaque carte, quatre notes :

- **Encore** — la carte repasse en fin de session, l'ease factor baisse de 0,2
- **Difficile** — intervalle × 1,3, ease −0,15
- **Bien** — 1 j → 6 j → × ease
- **Facile** — intervalle × ease × 1,3, ease +0,1

Une carte est comptée « acquise » au-delà de 21 jours d'intervalle.

Le nombre de nouveaux kanji introduits par session se règle dans les réglages
(10 par défaut, 0 pour ne faire que des révisions).

### Sauvegarde

Les données vivent dans le `localStorage` du navigateur. Elles disparaissent si
vous videz les données du site ou changez de téléphone.

**Exportez régulièrement** depuis l'onglet Suivi : vous obtenez un `.json`
réimportable. À faire au moins une fois par mois.

## Modifier l'application

Tout est dans `index.html`, en JavaScript sans framework, commenté et découpé
en sept sections :

1. Constantes et types d'exercices (les kanji sont dans `kanji.js`)
2. Stockage local
3. État de l'application
4. Moteur SRS
5. Rendu des vues
6. Session d'exercices — dont le moteur de reconnaissance de tracé
7. Démarrage

Le moteur de tracé tient en une centaine de lignes, section 6. Chaque trait
attendu est échantillonné via `getPointAtLength` (le navigateur fait la
géométrie des Béziers), puis rééchantillonné en 16 points équidistants ;
le trait de l'utilisateur subit le même traitement. Cinq mesures décident :
distance de départ, distance d'arrivée, distance moyenne point à point,
cosinus des directions, rapport des longueurs. Les seuils sont dans `SEUILS`.

Pour ajouter des kanji en masse, éditez `kanji.js` : un tableau `NIVEAUX`,
chaque niveau contenant des groupes, chaque groupe une liste d'entrées
`[kanji, sens, on'yomi, kun'yomi, "mot|lecture|sens;…"]`. Pensez à ajouter les
tracés correspondants dans `traces.js` (fichiers `kanji/<codepoint>.svg` du
dépôt KanjiVG), sinon l'exercice d'écriture bascule en auto-évaluation pour ces
kanji.
Format d'une entrée :

```js
["漢", "sens en français", "オンヨミ", "くんよみ", "単語|たんご|mot;漢字|かんじ|kanji"]
```

Après toute modification, incrémentez `VERSION` dans `sw.js` — sinon le service
worker continue de servir l'ancienne version depuis le cache.

## Mettre à jour l'application

```
git add . && git commit -m "…" && git push
```

C'est tout. GitHub Pages se reconstruit dans la minute, et l'application
détecte le changement au lancement suivant sur le téléphone, se met à jour et
se recharge d'elle-même.

Comment ça marche : le service worker répond depuis le cache — donc lancement
instantané, et hors ligne dans le train — mais relance la requête réseau en
parallèle. Si l'ETag renvoyé par le serveur diffère de celui du fichier en
cache, il remplace le cache et prévient la page, qui se recharge.

Seuls `index.html` et `traces.js` déclenchent un rechargement : retoucher une
icône ne relance pas l'application. Le rechargement est bloqué pendant une
session de révision, il s'applique au lancement d'après.

`VERSION` dans `sw.js` ne sert plus qu'à nommer le cache. Vous n'avez pas
besoin d'y toucher à chaque commit. La changer force un vidage complet du
cache — gardez ça pour les cas de blocage.

Le numéro affiché en bas de l'écran Réglages vient de `VERSION_APP` dans
`index.html`. Purement indicatif, mais pratique pour vérifier d'un coup d'œil
ce qui tourne réellement sur le téléphone.

En cas de blocage réel (un `sw.js` cassé mis en ligne, par exemple) :
exportez votre progression, supprimez l'icône de l'écran d'accueil, videz les
données du site dans les réglages du navigateur, réinstallez, réimportez.

## Crédits et licence

Trois sources de données, toutes en **Creative Commons BY-SA** :

| Source | Apport | Licence |
|---|---|---|
| [KanjiVG](https://kanjivg.tagaini.net/) — Ulrich Apel | tracés et ordre des traits | CC BY-SA 3.0 |
| [KANJIDIC2](https://www.edrdg.org/wiki/KANJIDIC_Project.html) — EDRDG | sens français, lectures | CC BY-SA 4.0 |
| [OpenJLPT](https://github.com/evanclan/OpenJLPT) | listes N5–N3, vocabulaire | CC BY-SA 4.0 |

Les définitions françaises viennent de KANJIDIC2, qui couvre les 613 kanji.
Les gloses françaises des mots d'exemple ont été traduites à partir des
définitions anglaises d'OpenJLPT.

Ce que la licence impose si vous publiez l'application :

1. **Citer les trois sources** — les en-têtes de `kanji.js` et `traces.js` le
   font, laissez-les en place ; ajoutez la mention dans l'interface si vous
   diffusez l'appli largement.
2. **Partage à l'identique** — toute redistribution de ces données, modifiées
   ou non, doit rester sous CC BY-SA.

Pour un usage personnel, rien à faire. Le code de l'application est à vous.

## Pistes d'évolution

- Saisie de la lecture au clavier kana plutôt qu'en QCM
- Statistiques de rétention par kanji pour repérer les points faibles
- Extension aux niveaux N2 et N1, même format de données
- Deuxième mot d'exemple pour les kanji N4 et N3
- Synchronisation entre appareils via un simple fichier dans un cloud
