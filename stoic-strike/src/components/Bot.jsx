import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Bot = ({ position, name, team, onBotShoot, playerPos, isAlive }) => {
  const botRef = useRef();
  const stateRef = useRef({
    state: 'patrol', // patrol, chase, attack, retreat
    targetPos: new THREE.Vector3(),
    lastShot: 0,
    health: 100,
    patrolIndex: 0,
  });

  const patrolPoints = [
    new THREE.Vector3(-10, 0, -10),
    new THREE.Vector3(10, 0, -10),
    new THREE.Vector3(10, 0, 10),
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(0, 0, 0),
  ];

  useFrame((state, delta) => {
    if (!botRef.current || !isAlive) return;

    const bot = botRef.current;
    const botState = stateRef.current;

    // Simple AI state machine
    if (playerPos && isAlive) {
      const distanceToPlayer = bot.position.distanceTo(new THREE.Vector3(playerPos.x, 0, playerPos.z));
      
      if (distanceToPlayer < 15) {
        botState.state = 'attack';
      } else if (distanceToPlayer < 25) {
        botState.state = 'chase';
      } else {
        botState.state = 'patrol';
      }

      // Attack state
      if (botState.state === 'attack' && distanceToPlayer < 20) {
        bot.lookAt(playerPos.x, 0, playerPos.z);
        
        const now = Date.now();
        if (now - botState.lastShot > 800 + Math.random() * 400) {
          onBotShoot(bot.position.clone(), playerPos, name);
          botState.lastShot = now;
        }
      }
      
      // Chase state
      if (botState.state === 'chase') {
        const direction = new THREE.Vector3().subVectors(
          new THREE.Vector3(playerPos.x, 0, playerPos.z),
          bot.position
        ).normalize();
        
        bot.position.add(direction.multiplyScalar(delta * 3));
        bot.lookAt(playerPos.x, 0, playerPos.z);
      }
    }

    // Patrol state
    if (botState.state === 'patrol') {
      const target = patrolPoints[botState.patrolIndex];
      const distance = bot.position.distanceTo(target);
      
      if (distance < 1) {
        botState.patrolIndex = (botState.patrolIndex + 1) % patrolPoints.length;
      } else {
        const direction = new THREE.Vector3().subVectors(target, bot.position).normalize();
        bot.position.add(direction.multiplyScalar(delta * 2));
        bot.lookAt(target);
      }
    }

    // Keep bot on ground
    bot.position.y = 0.9;
  });

  return (
    <group ref={botRef} position={position}>
      {/* Bot Body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.4, 1, 4, 8]} />
        <meshStandardMaterial 
          color={team === 'CT' ? '#5b9bd5' : '#d68a59'}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Bot Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#f5deb3"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Name Tag */}
      <mesh position={[0, 2.2, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial 
          color={team === 'CT' ? '#5b9bd5' : '#d68a59'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Weapon */}
      <mesh position={[0.3, 0.8, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

export default Bot;
