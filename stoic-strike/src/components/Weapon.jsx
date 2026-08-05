import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Weapon = ({ weaponType, isShooting, onShoot }) => {
  const weaponRef = useRef();
  const recoilRef = useRef(0);

  useFrame((state, delta) => {
    if (!weaponRef.current) return;

    // Recoil animation
    if (isShooting && recoilRef.current === 0) {
      recoilRef.current = 0.2;
    }

    if (recoilRef.current > 0) {
      recoilRef.current -= delta * 2;
      if (recoilRef.current < 0) recoilRef.current = 0;
    }

    weaponRef.current.position.z = 0.5 + recoilRef.current;
    
    // Subtle weapon sway while moving
    const time = state.clock.getElapsedTime();
    weaponRef.current.rotation.x = Math.sin(time * 2) * 0.02;
    weaponRef.current.rotation.y = Math.cos(time * 1.5) * 0.01;
  });

  const getWeaponModel = () => {
    switch (weaponType) {
      case 'AK47':
        return (
          <group ref={weaponRef}>
            {/* AK-47 Body */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.12, 0.7]} />
              <meshStandardMaterial color="#4a3728" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Barrel */}
            <mesh position={[0, 0.05, -0.4]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Magazine */}
            <mesh position={[0, -0.15, 0.1]} castShadow>
              <boxGeometry args={[0.06, 0.25, 0.1]} />
              <meshStandardMaterial color="#3a2718" metalness={0.5} roughness={0.5} />
            </mesh>
            {/* Stock */}
            <mesh position={[0, 0, 0.4]} castShadow>
              <boxGeometry args={[0.07, 0.1, 0.25]} />
              <meshStandardMaterial color="#5a4738" metalness={0.3} roughness={0.6} />
            </mesh>
          </group>
        );
      
      case 'M4A1':
        return (
          <group ref={weaponRef}>
            {/* M4A1 Body */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.07, 0.1, 0.65]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Barrel */}
            <mesh position={[0, 0.03, -0.35]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.35, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Magazine */}
            <mesh position={[0, -0.12, 0.08]} castShadow>
              <boxGeometry args={[0.05, 0.2, 0.08]} />
              <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        );
      
      case 'AWP':
        return (
          <group ref={weaponRef}>
            {/* AWP Body */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.06, 0.08, 0.9]} />
              <meshStandardMaterial color="#1a3a1a" metalness={0.5} roughness={0.4} />
            </mesh>
            {/* Scope */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Barrel */}
            <mesh position={[0, 0.02, -0.5]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );
      
      default: // Pistol
        return (
          <group ref={weaponRef}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.06, 0.08, 0.25]} />
              <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.05, 0.05]} castShadow>
              <boxGeometry args={[0.05, 0.12, 0.06]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
            </mesh>
          </group>
        );
    }
  };

  return getWeaponModel();
};

export default Weapon;
