# Portfolio 2027 — Yahya Falhaoui

Portfolio web premium pour **Yahya Falhaoui**, étudiant ingénieur Full-Stack & IA (EMSI Casablanca).

## Stack technique

- **HTML5 / CSS3 / JavaScript pur** — zéro dépendance npm
- Google Fonts : Space Grotesk + Inter + JetBrains Mono + Noto Sans Arabic
- Animations CSS + Intersection Observer (performant)

## Fonctionnalités 2027

- **Preloader** animé avec barre de progression
- **Barre de scroll** gradient en haut de page
- **Mesh aurora** animé + grille + grain en arrière-plan
- **Hero bento grid** avec compteurs animés et orbit avatar
- **Marquee tech** défilant (Angular, Spring Boot, Docker…)
- **Layout bento** pour À propos et Projets
- **Projet featured** Traçabilité IA en pleine largeur
- **Compétences interactives** avec onglets (Langages / Frameworks / Data / IA / Outils)
- **Cartes tilt 3D** au survol (desktop)
- **Spotlight** qui suit la souris dans le hero
- **Curseur custom** + effet magnétique sur boutons
- **Timeline expérience** redesignée
- **Navigation sticky** glassmorphism + rétraction au scroll
- Typewriter, reveal au scroll, formulaire contact FormSubmit
- Responsive mobile-first + `prefers-reduced-motion`
- **Multilingue FR / EN / AR** avec switcher dans la nav
- **Mode clair & sombre** avec persistance localStorage

## Déploiement Vercel

1. Pousser le repo sur GitHub (compte `Yahyafl3`)
2. Aller sur [vercel.com/new](https://vercel.com/new)
3. Importer le repository GitHub
4. Laisser les paramètres par défaut (site statique, pas de build)
5. Deploy — URL type `portfolio-xxx.vercel.app`

Le fichier `vercel.json` est déjà configuré pour un déploiement statique.

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou utiliser un serveur local :

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Puis ouvrir `http://localhost:8080`

## Certification Oracle Java SE 17

La carte Oracle affiche l’intitulé visible sur le certificat : **Oracle Certified Professional: Java SE 17 Developer**. Elle reprend la date imprimée (19 octobre 2026) et l’identifiant visible (103522663OCPJSE17). Le certificat PDF est disponible dans `assets/certs/oracle-javase17-developer.pdf` et s’ouvre depuis la carte. Le document comporte un QR code de vérification qui reste dans le PDF ; son URL n’a pas pu être décodée de façon fiable, donc aucun lien externe n’est ajouté.

## Personnalisation

1. **CV** — Remplacer le PDF dans `assets/cv-yahya-falhaoui.pdf`
2. **Liens GitHub** — Vérifier les URL des dépôts dans la section Projets
3. **LinkedIn** — Vérifier l'URL dans les liens sociaux
4. **Photo** — Remplacer les initiales `YF` dans `.bento-avatar` par une balise `<img>`

## Structure

```
portfolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── cv-yahya-falhaoui.pdf
│   └── certs/
│       ├── oracle-javase17-developer.pdf
│       └── oracle-javase17-developer.jpg
└── README.md
```

## Déploiement

Compatible avec GitHub Pages, Netlify, Vercel (site statique) ou tout hébergeur de fichiers statiques.
