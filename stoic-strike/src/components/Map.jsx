import React, { useRef } from 'react';
import * as THREE from 'three';

const Map = () => {
  return (
    <group>
      {/* Ground - Marble Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#e8e8e8"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Outer Walls */}
      {/* North Wall */}
      <mesh position={[0, 2.5, -25]} receiveShadow>
        <boxGeometry args={[50, 5, 1]} />
        <meshStandardMaterial color="#c9b896" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* South Wall */}
      <mesh position={[0, 2.5, 25]} receiveShadow>
        <boxGeometry args={[50, 5, 1]} />
        <meshStandardMaterial color="#c9b896" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* East Wall */}
      <mesh position={[25, 2.5, 0]} receiveShadow>
        <boxGeometry args={[1, 5, 50]} />
        <meshStandardMaterial color="#c9b896" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* West Wall */}
      <mesh position={[-25, 2.5, 0]} receiveShadow>
        <boxGeometry args={[1, 5, 50]} />
        <meshStandardMaterial color="#c9b896" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Central Pillars - Greek Architecture Style */}
      {[[-10, -10], [10, -10], [-10, 10], [10, 10]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Column Base */}
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.8, 1, 0.6, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.4} roughness={0.3} />
          </mesh>
          
          {/* Column Shaft */}
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.5, 4.4, 16]} />
            <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.7} />
          </mesh>
          
          {/* Column Capital */}
          <mesh position={[0, 4.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.5, 0.8, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Bomb Site A Cover */}
      <mesh position={[15, 1.5, -15]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#a89f8c" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Bomb Site B Cover */}
      <mesh position={[-15, 1.5, 15]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#a89f8c" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Mid Boxes/Crates */}
      {[[-5, 0], [5, 0], [0, -5], [0, 5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.75, z]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#8b7355" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}

      {/* Decorative Elements - Greek Patterns on Walls */}
      {/* Gold Trim on North Wall */}
      <mesh position={[0, 4.5, -24.9]} castShadow>
        <boxGeometry args={[48, 0.3, 0.2]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Fountain in Center */}
      <group position={[0, 0, 0]}>
        {/* Basin */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3, 3.5, 1, 32]} />
          <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.6} />
        </mesh>
        
        {/* Water */}
        <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.5, 32]} />
          <meshStandardMaterial color="#4a90a4" metalness={0.3} roughness={0.1} transparent opacity={0.8} />
        </mesh>
        
        {/* Center Pedestal */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
        </mesh>
        
        {/* Statue Base */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#f5f5f5" metalness={0.2} roughness={0.5} />
        </mesh>
      </group>

      {/* Steps leading to bombsites */}
      <mesh position={[15, 0.5, -10]} castShadow receiveShadow>
        <boxGeometry args={[6, 1, 8]} />
        <meshStandardMaterial color="#c9b896" metalness={0.2} roughness={0.8} />
      </mesh>
      
      <mesh position={[-15, 0.5, 10]} castShadow receiveShadow>
        <boxGeometry args={[6, 1, 8]} />
        <meshStandardMaterial color="#c9b896" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Ceiling - Sky Dome hint */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 15, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#87ceeb"
          metalness={0.1}
          roughness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default Map;
