import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export const usePlayerControls = (onShoot) => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const [isLocked, setIsLocked] = useState(false);
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMovement((prev) => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
          setMovement((prev) => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
          setMovement((prev) => ({ ...prev, left: true }));
          break;
        case 'KeyD':
          setMovement((prev) => ({ ...prev, right: true }));
          break;
        case 'Space':
          setMovement((prev) => ({ ...prev, jump: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMovement((prev) => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
          setMovement((prev) => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
          setMovement((prev) => ({ ...prev, left: false }));
          break;
        case 'KeyD':
          setMovement((prev) => ({ ...prev, right: false }));
          break;
        case 'Space':
          setMovement((prev) => ({ ...prev, jump: false }));
          break;
        default:
          break;
      }
    };

    const handleMouseMove = (event) => {
      if (!isLocked) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      euler.current.setFromQuaternion(new THREE.Quaternion());
      euler.current.y -= movementX * 0.002;
      euler.current.x -= movementY * 0.002;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));

      return euler.current;
    };

    const handleMouseDown = (event) => {
      if (isLocked && event.button === 0 && onShoot) {
        onShoot();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isLocked, onShoot]);

  const lock = () => {
    document.body.requestPointerLock();
  };

  const unlock = () => {
    document.exitPointerLock();
  };

  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement === document.body);
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
    };
  }, []);

  return {
    movement,
    isLocked,
    lock,
    unlock,
    euler,
    velocity,
    direction,
  };
};

export const useGameState = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, roundEnd
  const [score, setScore] = useState({ CT: 0, T: 0 });
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTime, setRoundTime] = useState(120);
  const [killFeed, setKillFeed] = useState([]);
  const [lastKiller, setLastKiller] = useState(null);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setRoundTime((prev) => {
        if (prev <= 1) {
          endRound('time_expired');
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const addKill = (killer, victim, weapon) => {
    const newKill = {
      id: Date.now(),
      killer,
      victim,
      weapon,
      timestamp: Date.now(),
    };

    setKillFeed((prev) => {
      const updated = [newKill, ...prev].slice(0, 5);
      return updated;
    });

    setLastKiller(killer);
  };

  const endRound = (reason) => {
    setGameState('roundEnd');
    setTimeout(() => {
      setCurrentRound((prev) => prev + 1);
      setRoundTime(120);
      setGameState('playing');
    }, 3000);
  };

  const startGame = () => {
    setGameState('playing');
    setScore({ CT: 0, T: 0 });
    setCurrentRound(1);
    setRoundTime(120);
    setKillFeed([]);
  };

  return {
    gameState,
    score,
    currentRound,
    roundTime,
    killFeed,
    lastKiller,
    setGameState,
    setScore,
    addKill,
    endRound,
    startGame,
  };
};
