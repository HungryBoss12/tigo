import React from 'react';
import { WEAPONS, STOIC_QUOTES, GREEK_QUOTES } from '../utils/constants';

const HUD = ({ health, armor, ammo, weapon, score, roundTime, killFeed }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentWeapon = WEAPONS[weapon] || WEAPONS.PISTOL;

  return (
    <div className="stoic-ui">
      {/* Crosshair */}
      <div className="stoic-crosshair" />

      {/* Kill Feed */}
      <div className="stoic-killfeed">
        {killFeed.map((kill) => (
          <div key={kill.id} className="stoic-kill-item">
            <strong>{kill.killer}</strong> → {kill.victim} 
            <span style={{ color: '#d4af37', marginLeft: '8px' }}>
              {WEAPONS[kill.weapon]?.name || kill.weapon}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom HUD */}
      <div className="stoic-hud">
        {/* Left Panel - Health & Armor */}
        <div className="stoic-panel">
          <div className="stoic-stat">
            <span style={{ color: '#d68a59' }}>❤</span> {health}
          </div>
          <div className="stoic-stat-label">Υγεία (Health)</div>
          
          <div className="stoic-stat" style={{ marginTop: '10px' }}>
            <span style={{ color: '#5b9bd5' }}>🛡</span> {armor}
          </div>
          <div className="stoic-stat-label">Πανοπλία (Armor)</div>
        </div>

        {/* Center - Round Info */}
        <div className="stoic-panel" style={{ textAlign: 'center' }}>
          <div className="stoic-stat" style={{ fontSize: '2rem' }}>
            {formatTime(roundTime)}
          </div>
          <div className="stoic-stat-label">Χρόνος (Time)</div>
          
          <div style={{ marginTop: '15px', display: 'flex', gap: '30px' }}>
            <div>
              <div className="stoic-stat" style={{ color: '#5b9bd5' }}>{score.CT}</div>
              <div className="stoic-stat-label">Αντί-Τρομοκράτες</div>
            </div>
            <div style={{ color: '#d4af37' }}>-</div>
            <div>
              <div className="stoic-stat" style={{ color: '#d68a59' }}>{score.T}</div>
              <div className="stoic-stat-label">Τρομοκράτες</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Weapon & Ammo */}
        <div className="stoic-panel stoic-weapon">
          <div className="stoic-weapon-name">{currentWeapon.name}</div>
          <div className="stoic-ammo">
            {ammo.magazine} / {ammo.reserve}
          </div>
          <div className="stoic-stat-label">Πυρομαχικά (Ammunition)</div>
        </div>
      </div>

      {/* Random Stoic Quote at bottom */}
      <div className="stoic-quote">
        "{STOIC_QUOTES[Math.floor(Math.random() * STOIC_QUOTES.length)]}"
      </div>
    </div>
  );
};

export default HUD;
