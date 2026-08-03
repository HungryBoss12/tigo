import React from 'react';
import { STOIC_QUOTES, GREEK_QUOTES } from '../utils/constants';

const Menu = ({ onStartGame }) => {
  const randomQuote = STOIC_QUOTES[Math.floor(Math.random() * STOIC_QUOTES.length)];
  const greekQuote = GREEK_QUOTES[Math.floor(Math.random() * GREEK_QUOTES.length)];

  return (
    <div className="stoic-menu">
      <h1 className="stoic-title">ΣΤΟΙΚ Strike</h1>
      <p className="stoic-subtitle">
        "The soul becomes dyed with the color of its thoughts." 
        <br />
        — Marcus Aurelius
      </p>
      
      <button className="stoic-button" onClick={onStartGame}>
        Begin Journey
      </button>
      
      <button className="stoic-button" style={{ background: 'linear-gradient(135deg, #8b8b8b 0%, #5a5a5a 100%)' }}>
        Settings
      </button>
      
      <button className="stoic-button" style={{ background: 'linear-gradient(135deg, #8b8b8b 0%, #5a5a5a 100%)' }}>
        Credits
      </button>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <p style={{ color: '#d4af37', fontSize: '1.5rem', marginBottom: '10px' }}>
          {greekQuote}
        </p>
        <p style={{ color: '#8b8b8b', fontStyle: 'italic' }}>
          "{randomQuote}"
        </p>
      </div>

      <div className="stoic-quote" style={{ bottom: '60px' }}>
        A Counter-Strike Experience • Philosophical Edition
      </div>

      <div className="stoic-quote">
        Press ESC to release cursor • WASD to move • Click to shoot • R to reload
      </div>
    </div>
  );
};

export default Menu;
