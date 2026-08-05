// Game Constants
export const GAME_CONFIG = {
  PLAYER_SPEED: 5,
  PLAYER_JUMP: 3,
  GRAVITY: -15,
  MOUSE_SENSITIVITY: 0.002,
  PLAYER_HEIGHT: 1.8,
  PLAYER_RADIUS: 0.5,
  MAX_HEALTH: 100,
  MAX_ARMOR: 100,
  ROUND_TIME: 120, // seconds
  BOT_COUNT: 5,
};

export const WEAPONS = {
  AK47: {
    name: 'AK-47 (Φονεύς)',
    damage: 35,
    fireRate: 600, // ms between shots
    magSize: 30,
    reserveAmmo: 90,
    spread: 0.03,
    auto: true,
  },
  M4A1: {
    name: 'M4A1 (Προστάτης)',
    damage: 32,
    fireRate: 550,
    magSize: 30,
    reserveAmmo: 90,
    spread: 0.025,
    auto: true,
  },
  AWP: {
    name: 'AWP (Κρίσιμος)',
    damage: 100,
    fireRate: 1500,
    magSize: 10,
    reserveAmmo: 30,
    spread: 0.001,
    auto: false,
  },
  PISTOL: {
    name: 'Glock (Δόρυ)',
    damage: 25,
    fireRate: 400,
    magSize: 20,
    reserveAmmo: 120,
    spread: 0.04,
    auto: false,
  },
};

export const STOIC_QUOTES = [
  "The obstacle is the way.",
  "Waste no more time arguing about what a good man should be. Be one.",
  "You have power over your mind - not outside events. Realize this, and you will find strength.",
  "The happiness of your life depends upon the quality of your thoughts.",
  "It is not death that a man should fear, but he should fear never beginning to live.",
  "First say to yourself what you would be; and then do what you have to do.",
  "He who fears death will never do anything worth of a man who is alive.",
  "The best revenge is to be unlike him who performed the injury.",
  "When you arise in the morning, think of what a precious privilege it is to be alive.",
  "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
];

export const GREEK_QUOTES = [
  "Γνῶθι σεαυτόν (Know thyself)",
  "Μέτρον ἄριστον (Moderation is best)",
  "Ἀρετή ἐστιν (Virtue is excellence)",
  "Εὐδαιμονία (Happiness through virtue)",
  "Σωφροσύνη (Temperance and self-control)",
  "Ἀνδρεία (Courage and fortitude)",
  "Δικαιοσύνη (Justice and righteousness)",
  "Φρόνησις (Practical wisdom)",
];

export const MAP_DATA = {
  name: 'de_stoic',
  size: { x: 40, y: 40, z: 10 },
  spawnCT: { x: -15, y: 0, z: -15 },
  spawnT: { x: 15, y: 0, z: 15 },
  bombsites: {
    A: { x: 15, y: 0, z: -15 },
    B: { x: -15, y: 0, z: 15 },
  },
};

export const TEAM = {
  CT: 'counter_terrorist',
  T: 'terrorist',
  SPECTATOR: 'spectator',
};

export const BOT_NAMES_CT = [
  'Socrates',
  'Plato',
  'Aristotle',
  'Zeno',
  'Epictetus',
  'Marcus',
  'Seneca',
  'Cleanthes',
];

export const BOT_NAMES_T = [
  'Sophist',
  'Epicurus',
  'Diogenes',
  'Heraclitus',
  'Pyrrho',
  'Carneades',
  'Protagoras',
  'Gorgias',
];
