class Ghost {
    constructor(player) {
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = Math.floor(Math.random() * canvas.height);
        
        this.dx;
        this.dy;
        
        this.float = 0;
        this.floatInc = 0.2;
        this.floatFrame = 0;

        this.angle;
        this.slowness = 150;
        
        this.size = 16;
        this.scale = 2;
        this.scaledSize = this.size * this.scale;
        
        this.maxHealth = 2;
        this.health = this.maxHealth;
        this.invincible = false;
        
        this.spawning = true;
        this.dying = false;
        this.dead = false;
        
        this.damage = 1/30;
        this.draining = false;
        
        this.ghostSprite = defineImage("res/images/entities/spr_ghost.png");
        this.spawnDeath = defineImage("res/images/entities/spr_ghost_death.png");
        this.ambientSprite = defineImage("res/images/effects/ghostAmb.png");
        this.drainSprite = defineImage("res/images/effects/ghostDrain.png");
        
        this.SDFrames = 5;
        
        this.drainOffset = 37.5;
        
        this.effectOffsetX = 60;
        this.effectOffsetY = 80;
        this.effectSize = 100;
        
        this.effectAmount = 61;
        this.effectFrame = 0;
        this.effectRow = 0;
        this.effectCol = 0;
        this.effectSlice = 0;
        
        this.frame = this.SDFrames;
        this.slice = this.frame * this.size;
        
        this.dropChances = {
            "damage_up": 0,
            "speed_up": 0.2,
            "cherry": 0,
            "cherry-mini": 0
        };
        
        this.randSpawn(player);
    }
    
    randSpawn(plr) {
        while(rectCollision(this.getHurtData(), plr)) {
            this.x = Math.floor(Math.random() * canvas.width);
            this.y = Math.floor(Math.random() * canvas.height);
        }
    }
    
    getHurtData() {
        return {
            x: this.x,
            y: this.y,
            width: this.scaledSize,
            height: this.scaledSize,
            centerX: this.x + this.scaledSize / 2,
            centerY: this.y + this.scaledSize / 2,
            radius: this.scaledSize / 3.5,
            angle: [0, 0],
            damage: this.damage,
            invin: false,
        };
    }
    
    hurtDetection(hit) {
        if(hit !== null) {
            if(!this.invincible && !this.dying) {
                let ghostHurtArea = this.getHurtData();
                if(circleCollision(ghostHurtArea, hit) && rectCollision(ghostHurtArea, hit)) {
                    hit.sound.play();
                    this.invincible = true;
                    
                    for(let i = hit.damage; i > 0 && this.health > 0; i--) {
                        this.health--;
                    }
                    
                    if(this.health <= 0) {
                        this.health = 0;
                        this.dying = true;
                    }
                }
            }
        } else {
            this.invincible = false;
        }
    }
    
    update(target) {
        if(!this.spawning && !this.dying) {
            this.floatFrame += this.floatInc;
            
            this.angle = toDeg(getAngle(target.x, target.y, this.x, this.y));
            
            this.float = Math.sin(this.floatFrame);
            
            this.dx = (target.x - this.x) / this.slowness;
            this.dy = (target.y - this.y) / this.slowness;
            
            this.x += this.dx;
            this.y += this.dy + this.float;
            
            if(this.health < this.maxHealth && this.draining) {
                this.health += this.damage;
            }
        }
    }

    collisionDetection(enemies, index) {
        
    }
    
    animate() {
        if(this.dying) {
            this.frame += 0.2;
            this.slice = Math.floor(this.frame) * this.size;
            
            if(this.frame >= this.SDFrames) {
                this.dead = true;
            }
        } else if(this.spawning) {
            this.frame -= 0.2;
            this.slice = Math.ceil(this.frame) * this.size;

            if(this.slice <= -this.size) {
                this.spawning = false;
                this.slice = 0;
                this.frame = 0;
            }
        } else {
            this.findFacing();
        }

        this.effectFrame++;
        this.effectCol += this.effectSize;
        
        if(this.effectFrame % 8 === 0) {
            this.effectRow += this.effectSize;
            this.effectCol = 0;
        } else if(this.effectFrame >= this.effectAmount) {
            this.effectFrame = 0;
            this.effectCol = 0;
            this.effectRow = 0;
        }
    }
    
    findFacing() {
        if(this.angle > 337.5 || this.angle < 22.5) {this.slice = 2} else 
        if(this.angle > 22.5 && this.angle < 67.5) {this.slice = 3} else
        if(this.angle > 67.5 && this.angle < 112.5) {this.slice = 4} else
        if(this.angle > 112.5 && this.angle < 157.5) {this.slice = 5} else
        if(this.angle > 157.5 && this.angle < 202.5) {this.slice = 6} else 
        if(this.angle > 202.5 && this.angle < 247.5) {this.slice = 7} else
        if(this.angle > 247.5 && this.angle < 292.5) {this.slice = 0} else
        if(this.angle > 292.5 && this.angle < 337.5) {this.slice = 1}
    }
    
    determineDrop() {
        let count = 0;
        let rand = Math.random();
        
        for(let key in this.dropChances) {
            if(rand < this.dropChances[key] + count) {
                return key;
            } else {
                count += this.dropChances[key];
            }
        }
        
        return false;
    }
    
    render(ctx) {
        // ctx.fillStyle = "red";
        // ctx.strokeStyle = "black";
        
        // ctx.fillRect(this.x, this.y, this.scaledSize, this.scaledSize);
        // ctx.strokeRect(this.x, this.y, this.scaledSize, this.scaledSize);
        if(this.draining) {
            ctx.drawImage(this.drainSprite, this.effectCol, this.effectRow,
            this.effectSize, this.effectSize, this.x - this.drainOffset, this.y - this.drainOffset,
            this.effectSize, this.effectSize);
        }

        // ctx.fillStyle = "red";
        // ctx.beginPath();
        // ctx.arc(this.x + this.scaledSize / 2, this.y + this.scaledSize / 2, this.scaledSize / 3.5, 0, 2 * Math.PI);
        // ctx.fill();
        
        // ctx.drawImage(this.ambientSprite, this.effectCol, this.effectRow,
        // this.effectSize, this.effectSize, this.x - this.effectOffsetX, this.y - this.effectOffsetY,
        // this.effectSize, this.effectSize);
        
        if(this.spawning || this.dying) {
            ctx.drawImage(this.spawnDeath, this.slice, 0,
            this.size, this.size, this.x, this.y, this.scaledSize, this.scaledSize);
        } else {
            ctx.drawImage(this.ghostSprite, this.slice * this.size, 0,
            this.size, this.size, this.x, this.y, this.scaledSize, this.scaledSize);
        }
        
        if(this.health < this.maxHealth) {
            this.showHealthBar();
        }
    }
    
    showHealthBar() {
        ctx.fillStyle = "dimgrey";
        ctx.fillRect(this.x, this.y + this.scaledSize * 1.1, this.scaledSize, this.scaledSize / 8);
        
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y + this.scaledSize * 1.1, this.scaledSize * this.health / this.maxHealth, this.scaledSize/8);

        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y + this.scaledSize * 1.1, this.scaledSize, this.scaledSize / 8);
    }
}

class GhostHard extends Ghost {
    constructor(player) {
        super(player);
        
        this.floatInc = 0.3;
        
        this.slowness = 80;
        
        this.maxHealth = 3;
        this.health = this.maxHealth;
        
        this.damage *= 2;
        
        this.ghostSprite = defineImage("res/images/entities/spr_ghost_hard.png");
        this.spawnDeath = defineImage("res/images/entities/spr_ghost_hard_death.png");
        this.ambientSprite = defineImage("res/images/effects/ghostHardAmb.png");
        
        this.effectOffsetX = 35;
        this.effectOffsetY = 35;
        
        this.dropChances.speed_up = 0.4;
    }
}