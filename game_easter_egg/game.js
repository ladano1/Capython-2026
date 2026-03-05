const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const healthBar = document.getElementById('health-bar');
const scoreDisplay = document.getElementById('score-display');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const endTitle = document.getElementById('end-title');
const endMessage = document.getElementById('end-message');

restartBtn.addEventListener('click', startGame);

const WORLD_SIZE = 3000;
const TOTAL_CORES = 5;

let animationId;
let coresCollected = 0;
let frameCount = 0;
let camera = { x: 0, y: 0 };
let mouse = { x: 0, y: 0, isDown: false };
const keys = { w: false, a: false, s: false, d: false };

// --- CHARGEMENT DES SPRITES ---
const imgPlayerDown = new Image();
imgPlayerDown.src = 'player_forward.png'; 

const imgPlayerUp = new Image();
imgPlayerUp.src = 'player_back.png';      

const imgPlayerLeft = new Image();
imgPlayerLeft.src = 'player_left.png';       

const imgPlayerRight = new Image();
imgPlayerRight.src = 'player_right.png';     

const imgProjectile = new Image();
imgProjectile.src = 'projectile.png';     

const imgEnemySlow = new Image();
imgEnemySlow.src = 'enemy_slow.png';      

const imgSatellite = new Image();
imgSatellite.src = 'satellite.png';       

const imgEnemyFast = new Image();
imgEnemyFast.src = 'small.gif'; 

// --- GESTION DE LA TAILLE DE L'ÉCRAN ---
function resizeCanvas() {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;
}
window.addEventListener('resize', resizeCanvas);
setTimeout(resizeCanvas, 0); 

// --- GESTION TACTILE & SOURIS ---
function updatePointerPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
}

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
canvas.addEventListener('mousemove', (e) => updatePointerPos(e.clientX, e.clientY));
canvas.addEventListener('mousedown', () => mouse.isDown = true);
canvas.addEventListener('mouseup', () => mouse.isDown = false);

function bindMobileButton(btnId, keyMap) {
    const btn = document.getElementById(btnId);
    if(!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[keyMap] = true; }, {passive: false});
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[keyMap] = false; }, {passive: false});
}
bindMobileButton('btn-up', 'w');
bindMobileButton('btn-down', 's');
bindMobileButton('btn-left', 'a');
bindMobileButton('btn-right', 'd');

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
    mouse.isDown = true;
}, {passive: false});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
}, {passive: false});
canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    mouse.isDown = false;
}, {passive: false});


// --- CLASSES ---

class Player {
    constructor() {
        this.width = 100;  
        this.height = 100; 
        this.pickupRadius = 60;
        this.hitboxRadius = 20;
        this.worldX = WORLD_SIZE / 2; 
        this.worldY = WORLD_SIZE / 2;
        this.vx = 0; 
        this.vy = 0;
        this.friction = 0.94; 
        this.maxHealth = 100; this.health = this.maxHealth;
        this.cooldown = 0; this.angle = 0;
        
        this.currentSprite = imgPlayerDown; 

        this.frameIndex = 0;       
        this.tickCount = 0;        
        this.ticksPerFrame = 10;   
        this.numberOfFrames = 3;   

        this.hitTimer = 0; 
    }

    update() {
        let dirX = 0;
        let dirY = 0;
        if (keys.w) dirY -= 1;
        if (keys.s) dirY += 1;
        if (keys.a) dirX -= 1;
        if (keys.d) dirX += 1;

        if (dirX < 0) {
            this.currentSprite = imgPlayerLeft;     
        } else if (dirX > 0) {
            this.currentSprite = imgPlayerRight;    
        } else if (dirY < 0) {
            this.currentSprite = imgPlayerUp;       
        } else if (dirY > 0) {
            this.currentSprite = imgPlayerDown;     
        }

        if (this.hitTimer > 0) {
            this.frameIndex = 2; 
            this.hitTimer--;
            this.tickCount = 0; 
        } else {
            let isMoving = (dirX !== 0 || dirY !== 0);
            if (isMoving) {
                this.tickCount++;
                if (this.tickCount > this.ticksPerFrame) {
                    this.tickCount = 0;
                    this.frameIndex = (this.frameIndex + 1) % 2; 
                }
            } else {
                this.frameIndex = 0; 
                this.tickCount = 0;
            }
        }

        if (dirX !== 0 || dirY !== 0) {
            let length = Math.hypot(dirX, dirY);
            dirX /= length; 
            dirY /= length;
        }

        let acceleration = 0.6; 
        this.vx += dirX * acceleration;
        this.vy += dirY * acceleration;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.worldX = Math.max(0, Math.min(WORLD_SIZE, this.worldX + this.vx));
        this.worldY = Math.max(0, Math.min(WORLD_SIZE, this.worldY + this.vy));

        this.angle = Math.atan2(mouse.y - (this.worldY - camera.y), mouse.x - (this.worldX - camera.x));

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

        if (this.currentSprite.complete && this.currentSprite.naturalWidth !== 0) {
            let frameWidth = this.currentSprite.naturalWidth / this.numberOfFrames; 
            let frameHeight = this.currentSprite.naturalHeight;
            let sourceX = this.frameIndex * frameWidth;

            ctx.drawImage(
                this.currentSprite, 
                sourceX, 0, frameWidth, frameHeight, 
                screenX - this.width / 2, screenY - this.height / 2, this.width, this.height 
            );
        } else {
            ctx.fillStyle = '#00aaff';
            ctx.fillRect(screenX - this.width/2, screenY - this.height/2, this.width, this.height);
        }

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.width / 2, -4, 25, 8); 
        ctx.restore();
    }

    takeDamage(amount) {
        this.health -= amount;
        this.hitTimer = 10; 
        healthBar.style.width = Math.max(0, (this.health / this.maxHealth) * 100) + '%';
        if (this.health <= 0) endGame(false);
    }
}

class Projectile {
    constructor(x, y, angle) {
        this.worldX = x; this.worldY = y;
        this.vx = Math.cos(angle) * 12; this.vy = Math.sin(angle) * 12;
        this.radius = 4; 
        this.size = 20; 
        this.color = '#ffff00'; 
        this.life = 100;
    }
    update() { this.worldX += this.vx; this.worldY += this.vy; this.life--; this.draw(); }
    draw() {
        let screenX = this.worldX - camera.x;
        let screenY = this.worldY - camera.y;

        if (imgProjectile.complete && imgProjectile.naturalWidth !== 0) {
            ctx.drawImage(imgProjectile, screenX - this.size/2, screenY - this.size/2, this.size, this.size);
        } else {
            ctx.beginPath(); ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color; ctx.fill();
        }
    }
}

class EnergyCore {
    constructor(x, y) {
        this.worldX = x; this.worldY = y;
        this.size = 40; this.color = '#00ff88'; this.pulse = 0;
    }
    update() { this.pulse += 0.05; this.draw(); }
    draw() {
        let screenX = this.worldX - camera.x; let screenY = this.worldY - camera.y;
        ctx.globalAlpha = 0.3 + Math.abs(Math.sin(this.pulse)) * 0.3;
        ctx.fillStyle = this.color; ctx.fillRect(screenX - this.size/2 - 10, screenY - this.size/2 - 10, this.size + 20, this.size + 20);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#fff'; ctx.fillRect(screenX - this.size/2, screenY - this.size/2, this.size, this.size);
    }
}

class SatelliteProtector {
    constructor(core) {
        this.core = core; this.angle = Math.random() * Math.PI * 2;
        this.orbitRadius = 80 + Math.random() * 40; this.orbitSpeed = 0.02 + Math.random() * 0.03;
        this.attackSpeed = 4 + Math.random() * 1.5; 
        this.size = 60; 
        this.hitboxRadius = 20;
        this.hp = 3; this.isAttacking = false;
    }
    update() {
        if (!this.isAttacking) {
            this.angle += this.orbitSpeed;
            this.worldX = this.core.worldX + Math.cos(this.angle) * this.orbitRadius;
            this.worldY = this.core.worldY + Math.sin(this.angle) * this.orbitRadius;
        } else {
            let angle = Math.atan2(player.worldY - this.worldY, player.worldX - this.worldX);
            this.worldX += Math.cos(angle) * this.attackSpeed; this.worldY += Math.sin(angle) * this.attackSpeed;
        }
        this.draw();
    }
    draw() {
        let screenX = this.worldX - camera.x; let screenY = this.worldY - camera.y;

        if (imgSatellite.complete && imgSatellite.naturalWidth !== 0) {
            let frameWidth = imgSatellite.naturalWidth / 2; 
            let frameHeight = imgSatellite.naturalHeight;
            let sourceX = this.isAttacking ? frameWidth : 0;

            ctx.drawImage(
                imgSatellite,
                sourceX, 0, frameWidth, frameHeight,
                screenX - this.size/2, screenY - this.size/2, this.size, this.size
            );
        } else {
            ctx.fillStyle = this.isAttacking ? '#ff0000' : '#ff6600'; 
            ctx.fillRect(screenX - this.size/2, screenY - this.size/2, this.size, this.size);
        }
    }
}

class Enemy {
    constructor() {
        let angle = Math.random() * Math.PI * 2;
        let dist = Math.max(canvas.width, canvas.height); 
        this.worldX = player.worldX + Math.cos(angle) * dist;
        this.worldY = player.worldY + Math.sin(angle) * dist;
        
        this.isFast = Math.random() < 0.3; 

        if (this.isFast) {
            this.size = 40; 
            this.hitboxRadius = 20; 
            this.color = '#ff0055'; 
            this.speed = 5 + Math.random() * 3; 
            this.hp = 1; 
        } else {
            this.size = 80; 
            this.hitboxRadius = 20; 
            this.color = '#ff3333'; 
            this.speed = 1.5 + Math.random() * 2; 
            this.hp = 2; 
        }
    }
    
    update() {
        let angle = Math.atan2(player.worldY - this.worldY, player.worldX - this.worldX);
        this.worldX += Math.cos(angle) * this.speed; 
        this.worldY += Math.sin(angle) * this.speed;
        this.draw();
    }
    
    draw() {
        let screenX = this.worldX - camera.x; 
        let screenY = this.worldY - camera.y;

        if (this.isFast) {
            // --- CORRECTION : Le code pour dessiner est bien dans la fonction draw() maintenant ! ---
            if (imgEnemyFast.complete && imgEnemyFast.naturalWidth !== 0) {
                ctx.drawImage(
                    imgEnemyFast,
                    screenX - this.size / 2, 
                    screenY - this.size / 2, 
                    this.size, 
                    this.size
                );  
            } else {
                ctx.fillStyle = this.color; 
                ctx.fillRect(screenX - this.size/2, screenY - this.size/2, this.size, this.size);
            }
        } else {
            if (!this.isFast && imgEnemySlow.complete && imgEnemySlow.naturalWidth !== 0) {
                let frameWidth = imgEnemySlow.naturalWidth / 2;
                let frameHeight = imgEnemySlow.naturalHeight;
                
                ctx.drawImage(
                    imgEnemySlow,
                    0, 0, frameWidth, frameHeight,
                    screenX - this.size/2, screenY - this.size/2, this.size, this.size
                );
            } else {
                ctx.fillStyle = this.color; 
                ctx.fillRect(screenX - this.size/2, screenY - this.size/2, this.size, this.size);
            }
        }
    }
}

class StaticDebris {
    constructor() {
        this.worldX = Math.random() * WORLD_SIZE; this.worldY = Math.random() * WORLD_SIZE;
        this.size = 10 + Math.random() * 50; this.color = `rgba(100, 100, 100, ${0.1 + Math.random() * 0.3})`;
    }
    draw() {
        let screenX = this.worldX - camera.x; let screenY = this.worldY - camera.y;
        ctx.fillStyle = this.color; ctx.fillRect(screenX, screenY, this.size, this.size);
    }
}

// --- INSTANCES ---
let player; let projectiles = []; let cores = []; let protectors = []; let enemies = []; let debris = [];

// --- LOGIQUE ---

function initWorld() {
    for(let i=0; i<150; i++) debris.push(new StaticDebris());

    for(let i=0; i<TOTAL_CORES; i++) {
        let cx, cy;
        do {
            cx = Math.random() * WORLD_SIZE; cy = Math.random() * WORLD_SIZE;
        } while (Math.hypot(cx - WORLD_SIZE/2, cy - WORLD_SIZE/2) < 500); 

        let core = new EnergyCore(cx, cy); cores.push(core);

        let numProtectors = 2 + Math.floor(Math.random() * 3);
        for(let j=0; j<numProtectors; j++) protectors.push(new SatelliteProtector(core));
    }
}

function drawRadarIndicators() {
    cores.forEach(core => {
        let dx = core.worldX - player.worldX; let dy = core.worldY - player.worldY;
        let dist = Math.hypot(dx, dy);
        
        if (dist > Math.max(canvas.width, canvas.height) / 2) {
            let angle = Math.atan2(dy, dx);
            let radarRadius = Math.min(canvas.width, canvas.height) / 2 - 40;
            
            let indX = canvas.width/2 + Math.cos(angle) * radarRadius;
            let indY = canvas.height/2 + Math.sin(angle) * radarRadius;

            ctx.save();
            ctx.translate(indX, indY);
            ctx.rotate(angle);
            
            ctx.beginPath();
            ctx.moveTo(10, 0); ctx.lineTo(-5, 5); ctx.lineTo(-5, -5);
            ctx.fillStyle = '#00ff88'; ctx.fill();
            
            ctx.restore();
        }
    });
}

function checkCollisions() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        let hit = false;

        for (let j = protectors.length - 1; j >= 0; j--) {
            let prot = protectors[j];
            if (Math.hypot(p.worldX - prot.worldX, p.worldY - prot.worldY) < prot.hitboxRadius) {
                prot.hp--; hit = true;
                if (prot.hp <= 0) protectors.splice(j, 1);
                break;
            }
        }

        if (!hit) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                let e = enemies[j];
                if (Math.hypot(p.worldX - e.worldX, p.worldY - e.worldY) < e.hitboxRadius) {
                    e.hp--; hit = true;
                    if (e.hp <= 0) enemies.splice(j, 1);
                    break;
                }
            }
        }

        if (hit) projectiles.splice(i, 1);
    }

    for (let i = cores.length - 1; i >= 0; i--) {
        let core = cores[i];
        if (Math.hypot(player.worldX - core.worldX, player.worldY - core.worldY) < (core.size / 2) + player.pickupRadius) {
            
            protectors.forEach(prot => {
                if (prot.core === core) prot.isAttacking = true;
            });

            cores.splice(i, 1); coresCollected++; scoreDisplay.innerText = coresCollected;
            player.health = Math.min(player.maxHealth, player.health + 30);
            healthBar.style.width = (player.health / player.maxHealth) * 100 + '%';

            if (coresCollected >= TOTAL_CORES) endGame(true);
        }
    }

    for (let i = protectors.length - 1; i >= 0; i--) {
        let prot = protectors[i];
        if (Math.hypot(player.worldX - prot.worldX, player.worldY - prot.worldY) < prot.hitboxRadius + player.hitboxRadius) {
            if (prot.isAttacking) {
                player.takeDamage(10); protectors.splice(i, 1);
            } else {
                player.takeDamage(1); 
            }
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (Math.hypot(player.worldX - e.worldX, player.worldY - e.worldY) < e.hitboxRadius + player.hitboxRadius) {
            player.takeDamage(15); enemies.splice(i, 1); 
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
    player = new Player(); projectiles = []; cores = []; protectors = []; enemies = []; debris = [];
    coresCollected = 0; frameCount = 0; scoreDisplay.innerText = coresCollected; healthBar.style.width = '100%';
    
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