# NewroMath - Math Puzzle Games

A modern, high-performance sci-fi 3D math puzzle arcade mobile and web game built with React, TypeScript, Tailwind CSS, Vite, and Capacitor.

![Math Puzzle](assets/hero_scifi_clean.png)

## 🎮 Game Features

- **Daily Challenges:** Unique puzzles every day with special rewards.
- **Multiple Game Modes:**
  - **Quick Math / Crossmath:** Solve dynamic arithmetic equations and interlocking number puzzles.
  - **Level Progression:** Ascend from Beginner to Grandmaster with increasing difficulty.
  - **Endless Mode:** Test stamina and speed against an endless stream of equations.
- **Champions Live Reel:** Facebook Reel-style portrait cards featuring top players worldwide with architectural mathematical blueprint designs.
- **Rich 3D Arcade Visuals:** Glossy, chamfered cards, high-contrast arcade palettes, vibrant particle effects, and tactile feedback.
- **Sound & Haptics:** Custom synthesizer audio effects and native mobile haptic feedback.
- **Cross-Platform:** Runs seamlessly on both Web and Mobile (Android / iOS via Capacitor).

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Mobile Runtime:** [Capacitor](https://capacitorjs.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Effects:** Canvas Confetti

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rudrodeb029/NewroMath-Math-Puzzle-Games.git
cd NewroMath-Math-Puzzle-Games

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` or `http://localhost:3000` (standalone runner) in your browser.

### Building for Production

```bash
# Web production build
npm run build

# Preview build
npm run preview
```

### Capacitor Mobile Build

```bash
# Sync Capacitor web assets
npx cap sync

# Open Android Studio
npx cap open android

# Open Xcode (macOS)
npx cap open ios
```

## 📜 License

MIT License. Feel free to use and contribute!
