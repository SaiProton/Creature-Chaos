class Blob {
    constructor(bigData) {
        this.x;
        this.y;
        
        this.dx;
        this.dy;
        
        this.direction = [0, 0];
        
        this.angle;

        this.speed = 0;
        this.slowRate = 0.1;
        
        this.launchX = 0;
        this.launchY = 0;
        
        this.idleTimer = 0;
        this.waitTime = Math.floor(Math.random() * 30) + 30;
        
        this.size = 16;
        this.scale = 2;
        this.scaledSize = this.size * this.scale;
        
        this.damage = 1;
        this.maxHealth = 2;
        this.health = this.maxHealth;
        this.invincible = false;
        this.dead = false;
        
        this.path = "res/images/entities/spr_";
        this.animNames = ["blob", "blob_death"];
        this.blobSheets = initAnimations(this.path, this.animNames);
        
        this.eyes = defineImage("res/images/entities/eyes.png");
        this.eyesX = 0;
        this.eyesY = 0;
        this.eyeOffset = 3;
        
        this.currentAnim = this.animNames[0];
        this.animFrames = this.blobSheets[this.currentAnim].width / this.size;
        
        this.slice = 0;
        this.frame = 0;
        
        this.dropChances = {
            "damage_up": 0,
            "speed_up": 0,
            "cherry": 0,
            "cherry-mini": 0.2
        };
        
        this.randomStart(bigData);
    }
    
    randomStart(bData) {
        if(bData) {
            this.x = bData.x + Math.floor(Math.random() * bData.width);
            this.y = bData.y + Math.floor(Math.random() * bData.height);
        } else {
            if(Math.random() > 0.5) {
                this.x = Math.random() * (canvas.width - this.scaledSize);
                this.y = Math.random() > 0.5 ? -this.scaledSize - Math.random() * 50  : canvas.height + Math.random() * 50;
            } else {
                this.x = Math.random() > 0.5 ? -this.scaledSize - Math.random() * 50: canvas.width + Math.random() * 50;
                this.y = Math.random() * (canvas.height - this.scaledSize);
            }
        }
        
    }
    
    bound() {
        this.speed = this.slowRate * 30;
    }
    
    launch(angle, power) {
        this.launchX = angle[0] * Math.sin(45 * Math.PI / 180) * 4 * power;
        this.launchY = angle[1] * Math.sin(45 * Math.PI / 180) * 4 * power;
    }
    
    update(target) {
        let halfSizeDif = (target.width - this.scaledSize) / 2;
        
        let idealX = target.x + halfSizeDif;
        let idealY = target.y + halfSizeDif;
        
        if(this.slice === 0 && this.speed < this.slowRate) {
            this.speed = 0;
            this.idleTimer++;
            if(this.idleTimer % this.waitTime === 0) {
                this.idleTimer = 0;
                this.direction[0] = this.x < idealX ? 1 : -1;
                this.direction[1] = this.y < idealY ? 1 : -1;
                this.bound();
            }
        } else {
            this.speed -= this.speed - this.slowRate < 0 ? 0 : this.slowRate;
        }

        this.angle = -getAngle(idealX, idealY, this.x, this.y);
        
        this.eyesX = Math.cos(this.angle) * this.eyeOffset;
        this.eyesY = Math.sin(this.angle) * this.eyeOffset;
        
        this.dx = this.direction[0] * Math.sin(45 * Math.PI / 180) * this.speed;
        this.dy = this.direction[1] * Math.sin(45 * Math.PI / 180) * this.speed;
        
        this.x += (this.launchX !== 0) ? this.launchX : this.dx;
        this.y += (this.launchY !== 0) ? this.launchY : this.dy;
        
        if(this.launchX > 0) {
            this.launchX = this.launchX - this.slowRate;
        } else if(this.launchX < 0) {
            this.launchX = this.launchX + this.slowRate;
        }
        
        if(this.launchY > 0) {
            this.launchY = this.launchY - this.slowRate;
        } else if(this.launchY < 0) {
            this.launchY = this.launchY + this.slowRate;
        }
        
        this.launchX = Math.abs(this.launchX) < this.slowRate ? 0 : this.launchX;
        this.launchY = Math.abs(this.launchY) < this.slowRate ? 0 : this.launchY;
    }

    collisionDetection(enemies, index) {
        let blobHurtArea = this.getHurtData();

        for(let e in enemies) {
            for(let i = index+1; i < enemies[e].length; i++) {
                let enemyHurtArea = enemies[e][i].getHurtData();
                if(circleCollision(blobHurtArea, enemyHurtArea)) {
                    console.log("Hello, operator. I'd like to report a bruh moment");
                }
            }
        }
    }
    
    hurtDetection(hit) {
        if(hit !== null) {
            if(!this.invincible && this.health !== 0) {
                let blobHurtArea = this.getHurtData();
                
                if(circleCollision(blobHurtArea, hit) && rectCollision(blobHurtArea, hit)) {
                    hit.sound.play();
                    this.invincible = true;
                    
                    for(let i = hit.damage; i > 0 && this.health > 0; i--) {
                        this.health--;
                    }
                    
                    this.launch(hit.angle, hit.damage);
                }
            }
        } else {
            this.invincible = false;
        }
    }
    
    getHurtData() {
        return {
            x: this.x + this.scaledSize/6,
            y: this.y + this.scaledSize/6,
            width: this.scaledSize * 2/3,
            height: this.scaledSize * 2/3,
            centerX: this.x + this.scaledSize / 2,
            centerY: this.y + this.scaledSize / 2,
            radius: this.scaledSize/3.5,
            angle: this.direction,
            damage: this.damage,
            invin: true
        };
    }
    
    animate() {
        let current = this.currentAnim;
        
        if(this.idleTimer === 0 || this.health === 0) {
            this.frame += 0.2;
        }
        
        this.currentAnim = this.health === 0 ? this.animNames[1] : this.animNames[0];
        this.animFrames = this.blobSheets[this.currentAnim].width / this.size;
        
        this.frame = this.currentAnim != current ? 0 : this.frame;
        this.slice = Math.floor(this.frame) % this.animFrames;
        
        if(this.health === 0 && this.slice == this.animFrames - 1) {
            this.dead = true;
        }
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
        // ctx.fillRect(this.x, this.y, this.scaledSize, this.scaledSize);
        // ctx.fillStyle = "blue";
        // ctx.fillRect(this.x + this.scaledSize/6, this.y + this.scaledSize/6, this.scaledSize * 2/3, this.scaledSize * 2/3);
        
        // ctx.fillStyle = "red";
        // ctx.beginPath();
        // ctx.arc(this.x + this.scaledSize / 2, this.y + this.scaledSize / 2, this.scaledSize / 3.5, 0, 2 * Math.PI);
        // ctx.fill();
        
        ctx.drawImage(this.blobSheets[this.currentAnim], this.slice * this.size, 0,
        this.size, this.size, this.x, this.y, this.scaledSize, this.scaledSize);
        
        ctx.drawImage(this.eyes, this.x + this.eyesX, this.y + this.eyesY, 
        this.eyes.width * this.scale, this.eyes.height * this.scale);
        
        if(this.health < this.maxHealth) {
            this.showHealthBar(ctx);
        }
    }
    
    showHealthBar(ctx) {
        let hb = this.getHurtData();
        
        ctx.fillStyle = "dimgrey";
        ctx.fillRect(hb.x, this.y + this.scaledSize, hb.width, hb.height/8);
        
        ctx.fillStyle = "red";
        ctx.fillRect(hb.x, this.y + this.scaledSize, hb.width * this.health/this.maxHealth, hb.height/8);

        ctx.strokeStyle = "black";
        ctx.strokeRect(hb.x, this.y + this.scaledSize, hb.width, hb.height / 8);
    }
}

class BigBlob extends Blob {
    constructor() {
        super();
        
        this.size = 32;
        this.scaledSize = this.size * this.scale;
        
        this.maxHealth = 4;
        this.health = this.maxHealth;
        
        this.animNames = ["blob_big", "blob_big_death"];
        this.blobSheets = initAnimations(this.path, this.animNames);
        
        this.eyes = defineImage("res/images/entities/eyes_big.png");
        this.eyeOffset = 6;
        
        this.currentAnim = this.animNames[0];
        this.animFrames = this.blobSheets[this.currentAnim].width / this.size;
        
        this.dropChances = {
            "damage_up": 0,
            "speed_up": 0,
            "cherry": 0.2,
            "cherry-mini": 0
        };

        this.randomStart();
    }
}