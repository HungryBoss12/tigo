# ΣΤΟΙΚ Strike - Stoic Counter-Strike 1.6 Clone

A philosophical reimagining of the classic Counter-Strike 1.6, built with modern web technologies and infused with Ancient Greek aesthetics and Stoic philosophy.

## 🏛️ Features

### Core Gameplay
- **First-Person Shooter Mechanics**: Classic CS 1.6-style movement and shooting
- **AI Bots**: Intelligent opponents with state-based AI (patrol, chase, attack)
- **Multiple Weapons**: AK-47, M4A1, AWP, and Pistol with authentic stats
- **Health & Armor System**: Complete damage and protection mechanics
- **Round-Based Combat**: Timed rounds with score tracking
- **Kill Feed**: Real-time elimination notifications

### Philosophical Theme
- **Stoic Quotes**: Wisdom from Marcus Aurelius, Seneca, Epictetus, and more
- **Greek Architecture**: Marble columns, golden accents, and ancient design
- **Philosophical UI**: All game elements styled with Greek terminology
- **Ancient Color Palette**: Gold, marble white, bronze, and deep navy

### Technical Implementation
- **React 19**: Modern component-based architecture
- **Three.js & React Three Fiber**: Full 3D graphics in the browser
- **Vite**: Lightning-fast build tool and dev server
- **Responsive Design**: Adapts to different screen sizes

## 🎮 Controls

| Key | Action |
|-----|--------|
| W/A/S/D | Move Forward/Left/Backward/Right |
| Space | Jump |
| Mouse | Look Around |
| Left Click | Shoot |
| R | Reload |
| ESC | Release Cursor/Pause |

## 🏗️ Project Structure

```
stoic-strike/
├── index.html                 # Main HTML entry point
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Main application component
│   ├── index.css            # Global styles with Stoic theme
│   ├── components/
│   │   ├── Bot.jsx          # AI bot component with behavior
│   │   ├── HUD.jsx          # Heads-up display
│   │   ├── Map.jsx          # 3D map with Greek architecture
│   │   ├── Menu.jsx         # Main menu with philosophical quotes
│   │   └── Weapon.jsx       # 3D weapon models
│   ├── hooks/
│   │   └── useGame.js       # Custom hooks for game state
│   └── utils/
│       └── constants.js     # Game configuration and data
└── public/                   # Static assets
```

## 🚀 Installation & Running

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Navigate to project directory
cd stoic-strike

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access the Game

Once running, open your browser to:
- **Development**: http://localhost:5173
- **Production**: Open `dist/index.html` after building

## 🎨 Design Philosophy

### Visual Theme
The game draws inspiration from:
- **Ancient Greek Architecture**: Doric columns, marble surfaces, golden trim
- **Stoic Philosophy**: Quotes and wisdom displayed throughout gameplay
- **Classical Color Theory**: Gold (#d4af37), marble whites, deep blues

### Weapon Names
Each weapon bears a Greek epithet:
- **AK-47 (Φονεύς)** - "The Slayer"
- **M4A1 (Προστάτης)** - "The Protector"
- **AWP (Κρίσιμος)** - "The Decisive"
- **Glock (Δόρυ)** - "The Spear"

### Team Names
- **Counter-Terrorists**: Αντί-Τρομοκράτες (Anti-Terrorists)
- **Terrorists**: Τρομοκράτες (Terrorists)

## 🤖 AI Bot System

Bots operate on a state machine with three states:

1. **Patrol**: Wander between predefined waypoints
2. **Chase**: Pursue player when detected at medium range
3. **Attack**: Engage player in combat at close range

Bot behavior includes:
- Dynamic target acquisition
- Accuracy falloff based on distance
- Randomized reaction times
- Team-based spawning

## ⚙️ Configuration

Game constants can be modified in `src/utils/constants.js`:

```javascript
GAME_CONFIG = {
  PLAYER_SPEED: 5,
  PLAYER_JUMP: 3,
  GRAVITY: -15,
  MOUSE_SENSITIVITY: 0.002,
  ROUND_TIME: 120, // seconds
  BOT_COUNT: 5,
}
```

## 📜 Stoic Wisdom

The game features quotes from renowned Stoic philosophers:

> "The obstacle is the way." - Marcus Aurelius

> "Waste no more time arguing about what a good man should be. Be one." - Marcus Aurelius

> "You have power over your mind - not outside events. Realize this, and you will find strength." - Epictetus

## 🛠️ Technologies Used

- **Frontend Framework**: React 19
- **3D Engine**: Three.js
- **3D React Integration**: @react-three/fiber, @react-three/drei
- **Build Tool**: Vite 8
- **Styling**: CSS3 with custom properties
- **State Management**: React Hooks (useState, useEffect, useRef)

## 🎯 Future Enhancements

Potential additions for future versions:
- Multiplayer support via WebRTC
- Additional maps inspired by ancient locations
- More weapons with unlockable skins
- Bot difficulty levels
- Bomb defusal game mode
- Voice lines in Ancient Greek
- Achievement system based on Stoic virtues

## 📝 License

This project is created for educational and entertainment purposes.

## 🙏 Acknowledgments

- Valve Corporation for creating Counter-Strike
- The Stoic philosophers for timeless wisdom
- The Three.js community for amazing 3D tools
- React team for the excellent framework

---

*"It is not death that a man should fear, but he should fear never beginning to live."* - Socrates

**Made with ἀρετή (virtue) and φιλοσοφία (philosophy)**
