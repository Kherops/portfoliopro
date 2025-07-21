# Portfolio Louis Proton

Portfolio professionnel de Louis Proton, développeur web en transition vers la cybersécurité.

## 🎨 Design & Fonctionnalités

- **Design minimaliste** : Interface sobre et professionnelle
- **Dark/Light mode** : Toggle avec icône lune/soleil
- **Responsive** : Mobile-first et desktop
- **Palette sobre** : Noir, blanc, gris avec accent bleu (#0ea5e9)
- **Typographie moderne** : Inter font
- **Animations légères** : Fade-in et slide-up subtiles

## 🚀 Technologies

- **React 18** + **Vite** pour un développement moderne
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **GitHub Pages** pour le déploiement

## 📱 Sections

1. **Navbar sticky** - Nom, liens sociaux, CV, toggle thème
2. **Hero/Intro** - Photo, titre, présentation complète
3. **Projets** - 3 projets avec descriptions détaillées
4. **À propos** - Bio, langues, compétences, centres d'intérêt
5. **Footer** - Contacts et liens

## 🛠️ Installation & Développement

```bash
# Installation des dépendances
npm install

# Serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview
```

## 🌐 Déploiement

### GitHub Pages

```bash
# Déploiement automatique
npm run deploy
```

### Configuration DNS pour louisproton.com

1. **Chez votre registrar**, configurez les DNS :
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A  
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   
   Type: CNAME
   Name: www
   Value: louisproton.github.io
   ```

2. Le fichier `CNAME` est déjà configuré dans `/public/`

## 📋 Prochaines étapes

- [ ] Remplacer le placeholder photo par votre vraie photo professionnelle
- [ ] Ajouter votre CV (`cv-louis-proton.pdf`) dans le dossier `/public/`
- [ ] Mettre à jour les liens GitHub/LinkedIn avec vos vrais profils
- [ ] Ajuster les URLs des projets avec les vraies démos/repos
- [ ] Déployer sur GitHub Pages avec `npm run deploy`

## 📞 Contact

- **Email** : louis.proton@email.com
- **GitHub** : [louisproton](https://github.com/louisproton)
- **LinkedIn** : [louisproton](https://linkedin.com/in/louisproton)

---

*Développé avec ❤️ et React + Tailwind CSS*
