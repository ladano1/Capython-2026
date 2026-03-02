const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const healthBar = document.getElementById('health-bar');
const scoreDisplay = document.getElementById('score-display');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const endTitle = document.getElementById('end-title');
const endMessage = document.getElementById('end-message');


restartBtn.addEventListener('click', startGame);

// Configuration du Monde
const WORLD_SIZE = 3000;
const TOTAL_CORES = 5;

// Variables Globales
let animationId;
let coresCollected = 0;
let frameCount = 0;
let camera = { x: 0, y: 0 };
let mouse = { x: canvas.width/2, y: canvas.height/2, isDown: false };

// Contrôles
const keys = { w: false, a: false, s: false, d: false };

window.addEventListener('keydown', (e) => {
    let key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') keys.w = true;
    if (key === 'a' || key === 'arrowleft') keys.a = true;
    if (key === 's' || key === 'arrowdown') keys.s = true;
    if (key === 'd' || key === 'arrowright') keys.d = true;
});

window.addEventListener('keyup', (e) => {
    let key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') keys.w = false;
    if (key === 'a' || key === 'arrowleft') keys.a = false;
    if (key === 's' || key === 'arrowdown') keys.s = false;
    if (key === 'd' || key === 'arrowright') keys.d = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', () => mouse.isDown = true);
canvas.addEventListener('mouseup', () => mouse.isDown = false);

// --- CLASSES ---

class Player {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.worldX = WORLD_SIZE / 2;
        this.worldY = WORLD_SIZE / 2;
        this.vx = 0;
        this.vy = 0;
        this.speed = 0.5;
        this.friction = 0.94;
        this.color = '#00aaff';
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.cooldown = 0;
        this.angle = 0;
    }

    update() {
        // 1. Détecter la direction d'entrée
        let dirX = 0;
        let dirY = 0;

        if (keys.w) dirY -= 1;
        if (keys.s) dirY += 1;
        if (keys.a) dirX -= 1;
        if (keys.d) dirX += 1;

        // 2. Normaliser la direction 
        if (dirX !== 0 || dirY !== 0) {
            let length = Math.hypot(dirX, dirY);
            dirX /= length; 
            dirY /= length;
        }

        // 3. Appliquer l'accélération
        let acceleration = 0.6; 
        this.vx += dirX * acceleration;
        this.vy += dirY * acceleration;

        // 4. Appliquer la friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Limites du monde
        this.worldX = Math.max(0, Math.min(WORLD_SIZE, this.worldX + this.vx));
        this.worldY = Math.max(0, Math.min(WORLD_SIZE, this.worldY + this.vy));

        // Calcul de l'angle vers la souris
        this.angle = Math.atan2(mouse.y - (this.worldY - camera.y), mouse.x - (this.worldX - camera.x));

        // Tir
        if (this.cooldown > 0) this.cooldown--;
        if (mouse.isDown && this.cooldown === 0) {
            projectiles.push(new Projectile(this.worldX, this.worldY, this.angle));
            this.cooldown = 15;
        }

        this.draw();
    }

    draw() {
        let screenX = this.worldX - camera.x;
        let screenY = this.worldY - camera.y;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Canon
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.width/2, -4, 15, 8);
        
        ctx.restore();
    }

    takeDamage(amount) {
        this.health -= amount;
        healthBar.style.width = Math.max(0, (this.health / this.maxHealth) * 100) + '%';
        if (this.health <= 0) endGame(false);
    }
}

class Projectile {
    constructor(x, y, angle) {
        this.worldX = x;
        this.worldY = y;
        this.vx = Math.cos(angle) * 12;
        this.vy = Math.sin(angle) * 12;
        this.radius = 4;
        this.color = '#ffff00';
        this.life = 100; // Disparaît après 100 frames
    }

    update() {
        this.worldX += this.vx;
        this.worldY += this.vy;
        this.life--;
        this.draw();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.worldX - camera.x, this.worldY - camera.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class EnergyCore {
    constructor(x, y) {
        this.worldX = x;
        this.worldY = y;
        this.size = 40;
        this.color = '#00ff88';
        this.pulse = 0;
    }

    update() {
        this.pulse += 0.05;
        this.draw();
    }

    draw() {
        let screenX = this.worldX - camera.x;
        let screenY = this.worldY - camera.y;

        // Aura pulsante
        ctx.globalAlpha = 0.3 + Math.abs(Math.sin(this.pulse)) * 0.3;
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX - this.size/2 - 10, screenY - this.size/2 - 10, this.size + 20, this.size + 20);
        ctx.globalAlpha = 1.0;

        // Noyau
        ctx.fillStyle = '#fff';
        ctx.fillRect(screenX - this.size/2, screenY - this.size/2, this.size, this.size);
    }
}

class SatelliteProtector {
    constructor(core) {
        this.core = core;
        this.angle = Math.random() * Math.PI * 2;
        this.orbitRadius = 80 + Math.random() * 40;
        this.orbitSpeed = 0.02 + Math.random() * 0.03;
        this.attackSpeed = 4 + Math.random() * 1.5; // Vitesse quand il poursuit le joueur
        this.size = 20;
        this.hp = 3;
        this.isAttacking = false; // Nouvel état
    }

    update() {
        if (!this.isAttacking) {
            // Comportement normal : orbite autour du core
            this.angle += this.orbitSpeed;
            this.worldX = this.core.worldX + Math.cos(this.angle) * this.orbitRadius;
            this.worldY = this.core.worldY + Math.sin(this.angle) * this.orbitRadius;
        } else {
            // Comportement agressif : fonce sur le joueur
            let angle = Math.atan2(player.worldY - this.worldY, player.worldX - this.worldX);
            this.worldX += Math.cos(angle) * this.attackSpeed;
            this.worldY += Math.sin(angle) * this.attackSpeed;
        }
        this.draw();
    }

    draw() {
        let screenX = this.worldX - camera.x;
        let screenY = this.worldY - camera.y;
        ctx.fillStyle = this.isAttacking ? '#ff0000' : '#ff6600'; // Devient rouge quand il attaque
        ctx.fillRect(screenX - this.size/2, screenY - this.size/2, this.size, this.size);
    }
}

class Enemy {
    constructor() {
        // Spawn hors de l'écran par rapport à la caméra
        let angle = Math.random() * Math.PI * 2;
        let dist = Math.max(canvas.width, canvas.height); 
        this.worldX = player.worldX + Math.cos(angle) * dist;
        this.worldY = player.worldY + Math.sin(angle) * dist;
        
        let isFast = Math.random() < 0.3; // 30% de chance d'être un ennemi rapide

        if (isFast) {
            this.size = 15; // Plus petit
            this.color = '#ff0055'; // Rouge/Rose
            this.speed = 5 + Math.random() * 3; // Très rapide (5 à 8)
            this.hp = 1; // Meurt en 1 coup
        } else {
            this.size = 25; // Taille normale
            this.color = '#ff3333'; // Rouge standard
            this.speed = 1.5 + Math.random() * 2; // Vitesse moyenne (1.5 à 3.5)
            this.hp = 2; // Meurt en 2 coups
        }
    }

    update() {
        // Suit le joueur
        let angle = Math.atan2(player.worldY - this.worldY, player.worldX - this.worldX);
        this.worldX += Math.cos(angle) * this.speed;
        this.worldY += Math.sin(angle) * this.speed;
        this.draw();
    }

    draw() {
        let screenX = this.worldX - camera.x;
        let screenY = this.worldY - camera.y;
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX - this.size/2, screenY - this.size/2, this.size, this.size);
    }
}

class StaticDebris {
    constructor() {
        this.worldX = Math.random() * WORLD_SIZE;
        this.worldY = Math.random() * WORLD_SIZE;
        this.size = 10 + Math.random() * 50;
        this.color = `rgba(100, 100, 100, ${0.1 + Math.random() * 0.3})`;
    }
    draw() {
        let screenX = this.worldX - camera.x;
        let screenY = this.worldY - camera.y;
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX, screenY, this.size, this.size);
    }
}

// --- INSTANCES ---
let player;
let projectiles = [];
let cores = [];
let protectors = [];
let enemies = [];
let debris = [];

// --- LOGIQUE ---

function initWorld() {
    for(let i=0; i<150; i++) debris.push(new StaticDebris());

    for(let i=0; i<TOTAL_CORES; i++) {
        let cx, cy;
        do {
            cx = Math.random() * WORLD_SIZE;
            cy = Math.random() * WORLD_SIZE;
        } while (Math.hypot(cx - WORLD_SIZE/2, cy - WORLD_SIZE/2) < 500); 

        let core = new EnergyCore(cx, cy);
        cores.push(core);

        let numProtectors = 2 + Math.floor(Math.random() * 3);
        for(let j=0; j<numProtectors; j++) {
            protectors.push(new SatelliteProtector(core));
        }
    }
}

function drawRadarIndicators() {
    cores.forEach(core => {
        let dx = core.worldX - player.worldX;
        let dy = core.worldY - player.worldY;
        let dist = Math.hypot(dx, dy);
        
        if (dist > canvas.width / 2) {
            let angle = Math.atan2(dy, dx);
            let radarRadius = Math.min(canvas.width, canvas.height) / 2 - 30;
            
            let indX = canvas.width/2 + Math.cos(angle) * radarRadius;
            let indY = canvas.height/2 + Math.sin(angle) * radarRadius;

            ctx.save();
            ctx.translate(indX, indY);
            ctx.rotate(angle);
            
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-5, 5);
            ctx.lineTo(-5, -5);
            ctx.fillStyle = '#00ff88'; 
            ctx.fill();
            
            ctx.restore();
        }
    });
}

function checkCollisions() {
    // Projectiles touchant Protectors ou Ennemis
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        let hit = false;

        for (let j = protectors.length - 1; j >= 0; j--) {
            let prot = protectors[j];
            if (Math.hypot(p.worldX - prot.worldX, p.worldY - prot.worldY) < prot.size) {
                prot.hp--;
                hit = true;
                if (prot.hp <= 0) protectors.splice(j, 1);
                break;
            }
        }

        if (!hit) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                let e = enemies[j];
                if (Math.hypot(p.worldX - e.worldX, p.worldY - e.worldY) < e.size) {
                    e.hp--;
                    hit = true;
                    if (e.hp <= 0) enemies.splice(j, 1);
                    break;
                }
            }
        }

        if (hit) projectiles.splice(i, 1);
    }

    // Joueur ramasse un Core
    for (let i = cores.length - 1; i >= 0; i--) {
        let core = cores[i];
        if (Math.hypot(player.worldX - core.worldX, player.worldY - core.worldY) < core.size + player.width/2) {
            
            // --- DÉCLENCHE L'ATTAQUE DES SATELLITES ---
            protectors.forEach(prot => {
                if (prot.core === core) {
                    prot.isAttacking = true;
                }
            });

            cores.splice(i, 1);
            coresCollected++;
            scoreDisplay.innerText = coresCollected;
            
            player.health = Math.min(player.maxHealth, player.health + 30);
            healthBar.style.width = (player.health / player.maxHealth) * 100 + '%';

            if (coresCollected >= TOTAL_CORES) endGame(true);
        }
    }

    // Satellites protecteurs touchent le joueur
    for (let i = protectors.length - 1; i >= 0; i--) {
        let prot = protectors[i];
        if (Math.hypot(player.worldX - prot.worldX, player.worldY - prot.worldY) < (prot.size + player.width)/2) {
            if (prot.isAttacking) {
                player.takeDamage(10); // S'ils attaquent, ils explosent en kamikaze
                protectors.splice(i, 1);
            } else {
                player.takeDamage(1); // S'ils orbitent, dégâts continus si on se cogne
            }
        }
    }

    // Ennemis touchent le joueur
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (Math.hypot(player.worldX - e.worldX, player.worldY - e.worldY) < (e.size + player.width)/2) {
            player.takeDamage(15); 
            enemies.splice(i, 1); 
        }
    }
}

function animate() {
    if (player.health <= 0 || coresCollected >= TOTAL_CORES) return;

    camera.x = player.worldX - canvas.width / 2;
    camera.y = player.worldY - canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for(let i=0; i<100; i++) {
        let starX = (i * 12345) % WORLD_SIZE;
        let starY = (i * 54321) % WORLD_SIZE;
        ctx.fillRect(starX - camera.x * 0.5, starY - camera.y * 0.5, 2, 2);
    }

    debris.forEach(d => d.draw());
    cores.forEach(c => c.update());
    protectors.forEach(p => p.update());
    
    // Fréquence d'apparition des ennemis
    if (frameCount % 90 === 0 && enemies.length < 15) {
        enemies.push(new Enemy());
    }
    enemies.forEach(e => e.update());

    projectiles.forEach((p, index) => {
        p.update();
        if (p.life <= 0) projectiles.splice(index, 1);
    });

    player.update();
    checkCollisions();
    drawRadarIndicators();

    ctx.strokeStyle = '#ff0000';
    ctx.strokeRect(-camera.x, -camera.y, WORLD_SIZE, WORLD_SIZE);

    frameCount++;
    animationId = requestAnimationFrame(animate);
}

function startGame() {
    gameOverScreen.style.display = 'none';
    player = new Player();
    projectiles = [];
    cores = [];
    protectors = [];
    enemies = [];
    debris = [];
    coresCollected = 0;
    frameCount = 0;
    scoreDisplay.innerText = coresCollected;
    healthBar.style.width = '100%';
    
    initWorld();
    cancelAnimationFrame(animationId);
    animate();
}

function endGame(victory) {
    gameOverScreen.style.display = 'flex';
    if (victory) {
        endTitle.style.color = '#00ff88';
        endTitle.innerText = "CORES SECURED";
        endMessage.innerText = "Hope is not dead. Kahz found what he was looking for.";
    } else {
        endTitle.style.color = '#ff3333';
        endTitle.innerText = "CRITICAL FAILURE";
        endMessage.innerText = "\"We estimate the global population at a mere 8,000. And now, one less.\"";
    }
}

startGame();