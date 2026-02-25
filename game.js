const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ui = {
  round: document.getElementById('round'),
  timer: document.getElementById('timer'),
  team: document.getElementById('team'),
  money: document.getElementById('money'),
  health: document.getElementById('health'),
  ammo: document.getElementById('ammo'),
};

const buyMenu = document.getElementById('buyMenu');

const guns = {
  glock: { name: 'Glock', damage: 18, fireRate: 220, magSize: 20, reserve: 120, reloadMs: 1700, cost: 400, spread: 0.08 },
  mp5: { name: 'MP5', damage: 16, fireRate: 110, magSize: 30, reserve: 120, reloadMs: 2300, cost: 1500, spread: 0.11 },
  ak47: { name: 'AK-47', damage: 33, fireRate: 130, magSize: 30, reserve: 90, reloadMs: 2400, cost: 2700, spread: 0.12 },
  m4a1: { name: 'M4A1', damage: 30, fireRate: 115, magSize: 30, reserve: 90, reloadMs: 2200, cost: 3100, spread: 0.1 },
  awp: { name: 'AWP', damage: 97, fireRate: 1300, magSize: 10, reserve: 30, reloadMs: 3200, cost: 4750, spread: 0.01 },
};

const state = {
  keys: new Set(),
  mouse: { x: canvas.width / 2, y: canvas.height / 2 },
  player: null,
  enemies: [],
  bullets: [],
  round: 1,
  roundTime: 90,
  roundEndsAt: performance.now() + 90_000,
  message: 'Counter-Terrorists Win by eliminating all enemies.',
  messageUntil: performance.now() + 3000,
};

function createPlayer() {
  const weapon = { ...guns.m4a1, ammo: guns.m4a1.magSize, reserveAmmo: guns.m4a1.reserve };
  return {
    x: 170,
    y: canvas.height / 2,
    radius: 14,
    speed: 220,
    hp: 100,
    money: 800,
    team: 'CT',
    weapon,
    reloadingUntil: 0,
    nextShotAt: 0,
  };
}

function createEnemy(x, y) {
  const weapon = { ...guns.ak47, ammo: 30, reserveAmmo: 90 };
  return {
    x,
    y,
    radius: 13,
    hp: 100,
    speed: 120 + Math.random() * 40,
    weapon,
    nextShotAt: performance.now() + Math.random() * 500,
  };
}

function resetRound() {
  state.player = createPlayer();
  state.enemies = [
    createEnemy(760, 130),
    createEnemy(830, 450),
    createEnemy(630, 320),
    createEnemy(900, 280),
  ];
  state.bullets = [];
  state.roundEndsAt = performance.now() + state.roundTime * 1000;
  hideBuyMenu();
  updateHud();
}

function setMessage(text, durationMs = 2200) {
  state.message = text;
  state.messageUntil = performance.now() + durationMs;
}

function updateHud() {
  const p = state.player;
  ui.round.textContent = String(state.round);
  ui.timer.textContent = formatTime(Math.max(0, Math.ceil((state.roundEndsAt - performance.now()) / 1000)));
  ui.team.textContent = p.team;
  ui.money.textContent = `$${p.money}`;
  ui.health.textContent = String(Math.max(0, Math.ceil(p.hp)));
  ui.ammo.textContent = `${p.weapon.ammo} / ${p.weapon.reserveAmmo}`;
}

function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function normalize(dx, dy) {
  const len = Math.hypot(dx, dy) || 1;
  return { dx: dx / len, dy: dy / len };
}

function playerShoot() {
  const p = state.player;
  const now = performance.now();
  if (now < p.nextShotAt || now < p.reloadingUntil || p.weapon.ammo <= 0) {
    return;
  }
  p.weapon.ammo -= 1;
  p.nextShotAt = now + p.weapon.fireRate;
  const dir = normalize(state.mouse.x - p.x, state.mouse.y - p.y);
  const spread = p.weapon.spread;
  const jitterX = (Math.random() - 0.5) * spread;
  const jitterY = (Math.random() - 0.5) * spread;
  state.bullets.push({
    x: p.x,
    y: p.y,
    vx: (dir.dx + jitterX) * 560,
    vy: (dir.dy + jitterY) * 560,
    damage: p.weapon.damage,
    fromPlayer: true,
    ttl: 900,
  });
  updateHud();
}

function enemyShoot(enemy) {
  const p = state.player;
  const now = performance.now();
  if (now < enemy.nextShotAt || enemy.weapon.ammo <= 0) {
    return;
  }
  enemy.weapon.ammo -= 1;
  enemy.nextShotAt = now + enemy.weapon.fireRate + Math.random() * 180;
  if (enemy.weapon.ammo === 0 && enemy.weapon.reserveAmmo > 0) {
    enemy.weapon.ammo = enemy.weapon.magSize;
  }
  const dir = normalize(p.x - enemy.x, p.y - enemy.y);
  state.bullets.push({
    x: enemy.x,
    y: enemy.y,
    vx: (dir.dx + (Math.random() - 0.5) * 0.08) * 500,
    vy: (dir.dy + (Math.random() - 0.5) * 0.08) * 500,
    damage: enemy.weapon.damage,
    fromPlayer: false,
    ttl: 1200,
  });
}

function startReload() {
  const p = state.player;
  if (p.weapon.ammo >= p.weapon.magSize || p.weapon.reserveAmmo <= 0) {
    return;
  }
  const now = performance.now();
  if (now < p.reloadingUntil) return;
  p.reloadingUntil = now + p.weapon.reloadMs;
  setMessage(`Reloading ${p.weapon.name}...`, p.weapon.reloadMs);
}

function finishReloadIfNeeded() {
  const p = state.player;
  const now = performance.now();
  if (p.reloadingUntil === 0 || now < p.reloadingUntil) return;
  const needed = p.weapon.magSize - p.weapon.ammo;
  const toLoad = Math.min(needed, p.weapon.reserveAmmo);
  p.weapon.ammo += toLoad;
  p.weapon.reserveAmmo -= toLoad;
  p.reloadingUntil = 0;
  updateHud();
}

function update(dtMs) {
  const dt = dtMs / 1000;
  const p = state.player;

  let dx = 0;
  let dy = 0;
  if (state.keys.has('w')) dy -= 1;
  if (state.keys.has('s')) dy += 1;
  if (state.keys.has('a')) dx -= 1;
  if (state.keys.has('d')) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const n = normalize(dx, dy);
    p.x = clamp(p.x + n.dx * p.speed * dt, 40, canvas.width - 40);
    p.y = clamp(p.y + n.dy * p.speed * dt, 40, canvas.height - 40);
  }

  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    const toPlayer = normalize(p.x - enemy.x, p.y - enemy.y);
    enemy.x += toPlayer.dx * enemy.speed * dt * 0.4;
    enemy.y += toPlayer.dy * enemy.speed * dt * 0.4;
    const dist = Math.hypot(p.x - enemy.x, p.y - enemy.y);
    if (dist < 340) enemyShoot(enemy);
  }

  for (const bullet of state.bullets) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.ttl -= dtMs;
  }

  state.bullets = state.bullets.filter((b) => b.ttl > 0 && b.x > 0 && b.y > 0 && b.x < canvas.width && b.y < canvas.height);

  for (const bullet of state.bullets) {
    if (bullet.fromPlayer) {
      for (const enemy of state.enemies) {
        if (enemy.hp <= 0) continue;
        if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < enemy.radius + 2) {
          enemy.hp -= bullet.damage;
          bullet.ttl = 0;
          if (enemy.hp <= 0) {
            state.player.money += 300;
            setMessage('Enemy down! +$300', 900);
          }
          break;
        }
      }
    } else if (Math.hypot(bullet.x - p.x, bullet.y - p.y) < p.radius + 2) {
      p.hp -= bullet.damage;
      bullet.ttl = 0;
      if (p.hp <= 0) {
        setMessage('You were eliminated. Terrorists win this round.', 2000);
        endRound(false);
        return;
      }
    }
  }

  finishReloadIfNeeded();
  state.enemies = state.enemies.filter((e) => e.hp > 0);

  if (state.enemies.length === 0) {
    setMessage('Counter-Terrorists win! Round secured.', 1800);
    endRound(true);
    return;
  }

  if (performance.now() >= state.roundEndsAt) {
    setMessage('Time over. Terrorists survive and win.', 1800);
    endRound(false);
    return;
  }

  updateHud();
}

function endRound(playerWon) {
  const p = state.player;
  if (playerWon) p.money += 3250;
  else p.money += 1400;
  state.round += 1;
  setTimeout(() => {
    const carryMoney = p.money;
    resetRound();
    state.player.money = carryMoney;
    updateHud();
  }, 1350);
}

function drawMap() {
  ctx.fillStyle = '#1a2435';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cover = [
    [250, 90, 130, 80],
    [420, 250, 150, 75],
    [740, 360, 120, 95],
    [560, 80, 90, 130],
  ];
  ctx.fillStyle = '#2b3852';
  for (const [x, y, w, h] of cover) ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = '#445a7e';
  ctx.lineWidth = 2;
  ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);
}

function drawActor(actor, team) {
  ctx.beginPath();
  ctx.fillStyle = team === 'CT' ? '#66a9ff' : '#ff6b66';
  ctx.arc(actor.x, actor.y, actor.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  const dir = team === 'CT' ? normalize(state.mouse.x - actor.x, state.mouse.y - actor.y) : normalize(state.player.x - actor.x, state.player.y - actor.y);
  ctx.strokeStyle = '#f5f8ff';
  ctx.lineWidth = 3;
  ctx.moveTo(actor.x, actor.y);
  ctx.lineTo(actor.x + dir.dx * 18, actor.y + dir.dy * 18);
  ctx.stroke();
}

function drawBullets() {
  for (const bullet of state.bullets) {
    ctx.beginPath();
    ctx.fillStyle = bullet.fromPlayer ? '#ffd166' : '#ff8a80';
    ctx.arc(bullet.x, bullet.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCrosshair() {
  const { x, y } = state.mouse;
  ctx.strokeStyle = '#ffffffc0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + 8, y);
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x, y + 8);
  ctx.stroke();
}

function drawMessage() {
  if (performance.now() > state.messageUntil) return;
  ctx.fillStyle = '#00000099';
  ctx.fillRect(canvas.width / 2 - 260, 22, 520, 34);
  ctx.fillStyle = '#f3f7ff';
  ctx.font = '18px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(state.message, canvas.width / 2, 45);
}

function render() {
  drawMap();
  drawActor(state.player, 'CT');
  for (const enemy of state.enemies) drawActor(enemy, 'T');
  drawBullets();
  drawCrosshair();
  drawMessage();
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function toggleBuyMenu() {
  buyMenu.classList.toggle('hidden');
}

function hideBuyMenu() {
  buyMenu.classList.add('hidden');
}

buyMenu.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-gun]');
  if (!btn) return;
  const id = btn.dataset.gun;
  const gun = guns[id];
  if (!gun) return;
  if (state.player.money < gun.cost) {
    setMessage('Not enough money.', 1000);
    return;
  }
  state.player.money -= gun.cost;
  state.player.weapon = { ...gun, ammo: gun.magSize, reserveAmmo: gun.reserve };
  setMessage(`Purchased ${gun.name}`, 1200);
  hideBuyMenu();
  updateHud();
});

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  state.mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  state.mouse.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

canvas.addEventListener('mousedown', () => {
  playerShoot();
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (['w', 'a', 's', 'd'].includes(key)) {
    state.keys.add(key);
    event.preventDefault();
  }
  if (key === 'r') startReload();
  if (key === 'b') toggleBuyMenu();
});

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  state.keys.delete(key);
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(34, now - last);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(frame);
}

resetRound();
requestAnimationFrame(frame);
