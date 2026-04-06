# Abiting's Pokédex

**The Essential Pokédex for Pokémon Champions**

A comprehensive, fast, and user-friendly Pokédex application designed for competitive Pokémon players. Access detailed stats, type matchups, abilities, and moves for all 1,025 Pokémon species (Generations 1-9) in both English and Traditional Chinese.

---

## 🎯 Project Overview

Abiting's Pokédex is a bilingual React-based web application that provides battle-ready information for Pokémon Champions players. The site features an intuitive interface, real-time search, and detailed Pokémon analysis tools to help players optimize their team strategies.

**Live Domains:**
- English: [list.abitingpokedex.com](https://list.abitingpokedex.com)
- Manus Hosting: [abitingdex-rzu58tey.manus.space](https://abitingdex-rzu58tey.manus.space)

---

## ✨ Key Features

### 📱 Bilingual Interface
- **English & Traditional Chinese** - Complete UI localization with seamless language switching
- Language preference persists across sessions
- Consistent terminology across both versions

### 🔍 Search & Discovery
- **Real-time Search** - Search Pokémon by name or National Pokédex number
- **Type Filtering** - Filter by Pokémon type (Fire, Water, Grass, etc.)
- **Quick Access** - Browse all 1,025 species with pagination

### 📊 Detailed Pokémon Information
- **Base Stats** - HP, Attack, Defense, Sp. Atk, Sp. Def, Speed with visual representations
- **Type Information** - Primary and secondary types with color-coded badges
- **Abilities** - All available abilities with descriptions
- **Form Variants** - Support for Pokémon with multiple forms (Oricorio, Castform, etc.)

### 🎮 Battle-Ready Tools
- **Type Matchups** - Interactive type effectiveness chart showing strengths and weaknesses
- **Champions SP Calculator** - Quick access to Pokémon Champions stat calculations
- **Moves and Items** - External links to comprehensive move and item databases

### 🎨 Design & UX
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Cyberpunk Aesthetic** - Modern purple gradient design with tech-inspired elements
- **Custom Favicon** - Minimalist Pikachu icon with cyberpunk styling (transparent background, red eyes, gradient layers)
- **Smooth Animations** - Subtle transitions and interactions for polished feel

### 📈 Monetization & Analytics
- **Google AdSense Integration** - Automatic ad placement for revenue generation
- **Site Verification** - Integrated with Google Search Console, Bing Webmaster Tools, and Impact Site verification
- **Analytics Ready** - Configured for tracking user behavior and engagement

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with modern hooks and features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling with OKLCH color support
- **Wouter** - Lightweight client-side routing
- **shadcn/ui** - Pre-built accessible UI components

### Styling & Design
- **Custom Design Tokens** - Centralized color palette and typography system in `index.css`
- **Responsive Grid System** - Mobile-first approach with breakpoints for tablet and desktop
- **CSS Variables** - Theme-aware styling with light/dark mode support

### Data & APIs
- **PokéAPI** - Comprehensive Pokémon data source (1,025 species, stats, abilities, moves)
- **Static Data** - Pre-processed Pokémon information for instant loading
- **External Links** - Integration with Bulbapedia and 52Pokémon Wiki for extended information

### Deployment & Hosting
- **Manus Hosting** - Built-in deployment with automatic SSL and CDN
- **Custom Domains** - Support for custom domain binding (list.abitingpokedex.com)
- **Static Site Generation** - Optimized for fast loading and SEO

---

## 📁 Project Structure

```
abiting_pokedex/
├── client/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── manifest.json
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Landing page with search
│   │   │   ├── PokemonDetailPage.tsx # English Pokémon details
│   │   │   └── PokemonDetailPageZh.tsx # Chinese Pokémon details
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── Map.tsx               # Google Maps integration
│   │   │   └── [other components]
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx   # Language switching logic
│   │   ├── hooks/
│   │   │   └── [custom hooks]
│   │   ├── lib/
│   │   │   ├── pokemonNameFormatter.ts # Format Pokémon names
│   │   │   └── [utility functions]
│   │   ├── App.tsx                   # Main app with routing
│   │   ├── main.tsx                  # React entry point
│   │   └── index.css                 # Global styles & design tokens
│   └── index.html                    # HTML template with meta tags
├── server/                           # Placeholder for future backend
├── shared/                           # Placeholder for shared types
└── package.json                      # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22.13.0+
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd abiting_pokedex

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build static site
pnpm build

# Preview production build
pnpm preview
```

---

## 🎨 Design System

### Color Palette
- **Primary Purple** - `#9333ea` (Cyberpunk theme)
- **Accent Blue** - `#3b82f6` (CTA buttons)
- **Type Colors** - Unique colors for each Pokémon type (Fire: `#f97316`, Water: `#0ea5e9`, etc.)

### Typography
- **Display Font** - Bold, modern serif for headings
- **Body Font** - Clean sans-serif for readability
- **Monospace** - For stats and technical information

### Responsive Breakpoints
- **Mobile** - < 640px (sm)
- **Tablet** - 640px - 1024px (md, lg)
- **Desktop** - > 1024px (xl, 2xl)

---

## 📝 Key Components

### Home Page (`Home.tsx`)
- Hero section with search bar
- Featured Pokémon grid with pagination
- Type filter buttons
- Language switcher

### Pokémon Detail Page (`PokemonDetailPage.tsx` / `PokemonDetailPageZh.tsx`)
- Pokémon image and basic info
- Base stats with visual bars
- Type matchup chart
- Abilities section
- External resource links (Moves and Items, Champions SP Calculator)
- Responsive layout for mobile/desktop

### Language Context (`LanguageContext.tsx`)
- Global language state management
- Automatic UI text translation
- Persistent language preference

---

## 🔧 Configuration

### Environment Variables
The app uses the following environment variables (automatically injected by Manus):
- `VITE_APP_ID` - Application identifier
- `VITE_APP_TITLE` - App title for branding
- `VITE_ANALYTICS_ENDPOINT` - Analytics tracking endpoint
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID

### SEO & Meta Tags
- Google Site Verification: `GXTtv6n9tb9KAzX3PEPVfjqvPHafeubyIU6ql8-FAzs`
- Bing Webmaster Tools: `2966AF8E9195E3C4A9A577BAAE651882`
- Impact Site Verification: `cad9ad5e-49cb-42a5-8781-b4fdf20c7d68`

### AdSense Integration
- Publisher ID: `ca-pub-2648968341090496`
- Automatic ad placement enabled
- Ads display on Pokémon detail pages

---

## 📊 Performance Optimizations

- **Code Splitting** - Route-based lazy loading with Wouter
- **Image Optimization** - CDN-hosted Pokémon images with responsive sizing
- **Caching** - Browser caching with version-based cache busting
- **Minification** - Automatic production build optimization
- **Static Generation** - Pre-rendered pages for instant loading

---

## 🐛 Known Issues & Limitations

- **Form Display** - Pokémon with form variants (e.g., Oricorio) show base name only (brackets removed)
- **Mobile Ads** - AdSense ads hidden on mobile to preserve UX
- **External Links** - Moves and Items link to external Pokémon Champions Team Builder

---

## 🔮 Future Enhancements

### Planned Features
1. **Team Builder Integration** - Built-in team composition and strategy tools
2. **Move Database** - Comprehensive move list with damage calculations
3. **Item Database** - Complete item information and effects
4. **Competitive Stats** - Usage rates and tier rankings from competitive play
5. **Dark Mode** - Full dark theme support with system preference detection
6. **PWA Support** - Offline access and installable app
7. **Advanced Filters** - Filter by stats, abilities, move pools, etc.
8. **Comparison Tool** - Side-by-side Pokémon comparison
9. **User Accounts** - Save favorite Pokémon and teams
10. **API Endpoint** - Public API for third-party integrations

### Performance Improvements
- Service Worker for offline support
- Image lazy loading with Intersection Observer
- Virtual scrolling for large lists
- GraphQL API for optimized data fetching

---

## 📄 License

This project is built with Pokémon data from [PokéAPI](https://pokeapi.co/). Pokémon is a trademark of The Pokémon Company International, Inc. This project is for educational and fan purposes only.

---

## 👨‍💻 Development Notes

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Component-based architecture with React best practices

### Testing
- Manual testing across browsers (Chrome, Firefox, Safari, Edge)
- Responsive design testing on various devices
- Performance testing with Lighthouse
- SEO validation with Google Search Console

### Deployment
- Automatic deployment on git push to main branch
- Zero-downtime deployments with Manus hosting
- CDN integration for static assets
- SSL certificate auto-renewal

---

## 📞 Support & Feedback

For issues, feature requests, or feedback, please contact the project maintainer or submit an issue through the project repository.

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Active Development
