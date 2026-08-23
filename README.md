# Portfolio 2027 — Yahya Falhaoui

Portfolio web premium pour **Yahya Falhaoui**, étudiant ingénieur Full-Stack & IA (EMSI Casablanca).

## Stack technique

- **HTML5 / CSS3 / JavaScript pur** — zéro dépendance npm
- Google Fonts : Space Grotesk + Inter + JetBrains Mono
- Animations CSS + Intersection Observer (performant)

## Fonctionnalités 2027

- **Preloader** animé avec barre de progression
- **Barre de scroll** gradient en haut de page
- **Mesh aurora** animé + grille + grain en arrière-plan
- **Hero bento grid** avec compteurs animés et orbit avatar
- **Marquee tech** défilant (Angular, Spring Boot, Docker…)
- **Layout bento** pour À propos et Projets
- **Projet featured** Traçabilité IA en pleine largeur
- **Compétences interactives** avec onglets (Langages / Frameworks / Data / Outils)
- **Cartes tilt 3D** au survol (desktop)
- **Spotlight** qui suit la souris dans le hero
- **Curseur custom** + effet magnétique sur boutons
- **Timeline expérience** redesignée
- **Navigation sticky** glassmorphism + rétraction au scroll
- Typewriter, reveal au scroll, formulaire contact mailto
- Responsive mobile-first + `prefers-reduced-motion`
- **Multilingue FR / EN / AR** avec switcher dans la nav
- **Mode clair & sombre** avec persistance localStorage

## Lancer le site

Ouvrir `index.html` dans un navigateur, ou utiliser un serveur local :

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Puis ouvrir `http://localhost:8080`

## Personnalisation

1. **CV** — Placer votre PDF dans `assets/cv-yahya-falhaoui.pdf`
2. **Liens GitHub** — Mettre à jour les `href="#"` dans la section Projets
3. **LinkedIn** — Vérifier l'URL dans les liens sociaux
4. **Photo** — Remplacer les initiales `YF` dans `.hero__avatar` par une balise `<img>`

## Structure

```
portfolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   └── cv-yahya-falhaoui.pdf  (à ajouter)
└── README.md
```

## Déploiement

Compatible avec GitHub Pages, Netlify, Vercel (site statique) ou tout hébergeur de fichiers statiques.
