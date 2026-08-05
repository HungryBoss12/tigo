import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';

import { GAME_CONFIG, WEAPONS, MAP_DATA, BOT_NAMES_CT, BOT_NAMES_T, TEAM } from '../utils/constants';
import { usePlayerControls, useGameState } from '../hooks/useGame';
import Map from './Map';
import Bot from './Bot';
import Weapon from './Weapon';
import HUD from './HUD';
import Menu from './Menu';

const Player = ({ onShoot, isShooting, playerRef }) => {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);
  
  const controls = usePlayerControls(onShoot);
  
  useFrame((state, delta) => {
    if (!playerRef.current || !controls.isLocked) return;

    const player = playerRef.current;
    
    // Apply gravity
    if (!isGrounded.current) {
      velocity.current.y += GAME_CONFIG.GRAVITY * delta;
    }
    
    // Movement
    direction.current.z = Number(controls.movement.forward) - Number(controls.movement.backward);
    direction.current.x = Number(controls.movement.right) - Number(controls.movement.left);
    direction.current.normalize();
    
    const speed = GAME_CONFIG.PLAYER_SPEED;
    
    if (controls.movement.forward || controls.movement.backward) {
      velocity.current.z -= direction.current.z * speed * delta;
    } else {
      velocity.current.z *= 0.9; // Friction
    }
    
    if (controls.movement.left || controls.movement.right) {
      velocity.current.x -= direction.current.x * speed * delta;
    } else {
      velocity.current.x *= 0.9; // Friction
    }
    
    // Apply movement relative to camera direction
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();
    
    const camRight = new THREE.Vector3();
    camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0));
    
    player.position.x += camDir.x * velocity.current.z * delta + camRight.x * velocity.current.x * delta;
    player.position.z += camDir.z * velocity.current.z * delta + camRight.z * velocity.current.x * delta;
    
    // Jump
    if (controls.movement.jump && isGrounded.current) {
      velocity.current.y = GAME_CONFIG.PLAYER_JUMP;
      isGrounded.current = false;
    }
    
    // Apply vertical velocity
    player.position.y += velocity.current.y * delta;
    
    // Ground collision
    if (player.position.y < GAME_CONFIG.PLAYER_HEIGHT) {
      player.position.y = GAME_CONFIG.PLAYER_HEIGHT;
      velocity.current.y = 0;
      isGrounded.current = true;
    }
    
    // Boundary checks
    const limit = 24;
    player.position.x = Math.max(-limit, Math.min(limit, player.position.x));
    player.position.z = Math.max(-limit, Math.min(limit, player.position.z));
    
    // Camera rotation
    if (controls.euler) {
      camera.quaternion.setFromEuler(controls.euler.current);
    }
    
    // Sync camera position with player
    camera.position.copy(player.position);
  });

  return null;
};

const GameScene = ({ gameState, onKill, playerPos }) => {
  const playerRef = useRef(new THREE.Group());
  const [bots, setBots] = useState([]);
  const [weapon, setWeapon] = useState('AK47');
  const [isShooting, setIsShooting] = useState(false);
  const [health, setHealth] = useState(100);
  const [armor, setArmor] = useState(100);
  const [ammo, setAmmo] = useState({ 
    magazine: WEAPONS.AK47.magSize, 
    reserve: WEAPONS.AK47.reserveAmmo 
  });

  useEffect(() => {
    if (gameState === 'playing') {
      // Initialize bots
      const newBots = [];
      for (let i = 0; i < GAME_CONFIG.BOT_COUNT; i++) {
        newBots.push({
          id: i,
          name: i % 2 === 0 ? BOT_NAMES_CT[i % BOT_NAMES_CT.length] : BOT_NAMES_T[i % BOT_NAMES_T.length],
          team: i % 2 === 0 ? TEAM.CT : TEAM.T,
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 30,
            0,
            (Math.random() - 0.5) * 30
          ),
          isAlive: true,
          health: 100,
        });
      }
      setBots(newBots);
    }
  }, [gameState]);

  const handleShoot = () => {
    if (ammo.magazine <= 0) {
      // Reload
      if (ammo.reserve > 0) {
        setTimeout(() => {
          const reloadAmount = Math.min(ammo.reserve, WEAPONS[weapon].magSize);
          setAmmo(prev => ({
            magazine: reloadAmount,
            reserve: prev.reserve - reloadAmount + (prev.magazine - reloadAmount)
          }));
        }, 2000);
      }
      return;
    }

    setIsShooting(true);
    setAmmo(prev => ({ ...prev, magazine: prev.magazine - 1 }));
    
    setTimeout(() => setIsShooting(false), 100);

    // Raycast for hit detection
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), document.querySelector('canvas')._reactThreeFiber?.camera || new THREE.Camera());
    
    // Simple hit detection logic
    bots.forEach(bot => {
      if (!bot.isAlive) return;
      
      const distance = playerRef.current?.position.distanceTo(bot.position) || 50;
      if (distance < 30) {
        const hitChance = Math.random();
        const accuracy = 1 - (distance / 50);
        
        if (hitChance < accuracy * 0.7) {
          const damage = WEAPONS[weapon].damage;
          const newHealth = bot.health - damage;
          
          if (newHealth <= 0) {
            setBots(prev => prev.map(b => 
              b.id === bot.id ? { ...b, isAlive: false, health: 0 } : b
            ));
            onKill('Player', bot.name, weapon);
          } else {
            setBots(prev => prev.map(b => 
              b.id === bot.id ? { ...b, health: newHealth } : b
            ));
          }
        }
      }
    });
  };

  const handleBotShoot = (botPos, targetPos, botName) => {
    const distance = botPos.distanceTo(new THREE.Vector3(targetPos.x, 0, targetPos.z));
    if (distance < 25) {
      const hitChance = Math.random();
      if (hitChance < 0.3) {
        setHealth(prev => {
          const newHealth = prev - 10;
          if (newHealth <= 0) {
            // Player died
            return 0;
          }
          return newHealth;
        });
      }
    }
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Sky */}
      <Sky 
        sunPosition={[100, 20, 100]}
        inclination={0.5}
        azimuth={0.25}
      />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Map */}
      <Map />

      {/* Player */}
      <Player 
        onShoot={handleShoot} 
        isShooting={isShooting} 
        playerRef={playerRef}
      />
      
      {/* Bots */}
      {bots.map(bot => (
        <Bot
          key={bot.id}
          position={bot.position}
          name={bot.name}
          team={bot.team}
          onBotShoot={handleBotShoot}
          playerPos={playerRef.current?.position}
          isAlive={bot.isAlive}
        />
      ))}

      {/* Weapon Model */}
      <group position={[0.3, -0.3, -0.5]}>
        <Weapon 
          weaponType={weapon} 
          isShooting={isShooting}
          onShoot={handleShoot}
        />
      </group>

      {/* HUD */}
      <HUD 
        health={health}
        armor={armor}
        ammo={ammo}
        weapon={weapon}
        score={{ CT: 5, T: 3 }}
        roundTime={120}
        killFeed={[]}
      />
    </>
  );
};

const App = () => {
  const { gameState, startGame, killFeed, addKill } = useGameState();

  return (
    <>
      {gameState === 'menu' && <Menu onStartGame={startGame} />}
      
      <Canvas 
        shadows 
        camera={{ 
          fov: 75, 
          near: 0.1, 
          far: 1000,
          position: [0, GAME_CONFIG.PLAYER_HEIGHT, 5]
        }}
        style={{ background: '#1a1a2e' }}
      >
        {gameState === 'playing' && (
          <GameScene 
            gameState={gameState}
            onKill={addKill}
          />
        )}
      </Canvas>
    </>
  );
};

export default App;
