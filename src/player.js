class Player {
    constructor() {
        this.x = 700;
        this.y = 300;
        
        this.dx;
        this.dy;
        
        this.direction = [0, 0];
        this.facing = [0, 1];
        
        this.speed = 3;
        this.speedFactor = 1;
        this.slowRate = 0.2;
        
        this.maxHealth = 5;
        this.health = this.maxHealth;
        this.invincible = false;
        this.invinCount = 0;
        this.invinLimit = 90;
        
        this.maxPowerTime = 10 * 60;
        this.powerTimer = 0;

        this.playerPath = "res/images/player/character/Character_";
        this.weaponPath = "res/images/player/weapon/Sword_";
        
        this.playerNames = ["Down", "DownLeft", "DownRight", "Left", "Right", "RollDown", "RollDownLeft", "RollDownRight", "RollLeft", "RollRight", "RollUp", "RollUpLeft", "RollUpRight", "SlashDownLeft", "SlashDownRight", "SlashUpLeft", "SlashUpRight", "Up", "UpLeft", "UpRight"];
        
        this.weaponNames = ["UpRight", "UpLeft", "DownRight", "DownLeft"];
        
        this.playerSheets = initAnimations(this.playerPath, this.playerNames);
        this.weaponSheets = initAnimations(this.weaponPath, this.weaponNames);
        
        this.currentPlayer = "Down";
        this.currentWeapon = "";
        
        this.sounds = {
            slash: [
                new Audio("res/audio/sfx/slash1.wav"),
                new Audio("res/audio/sfx/slash2.wav"),
                new Audio("res/audio/sfx/slash3.wav")
            ],
            
            hit: {
                hit1: new Audio("res/audio/sfx/hit1.wav"),
                hit2: new Audio("res/audio/sfx/hit2.wav")
            },
            
            hurt: new Audio("res/audio/sfx/hurt.wav"),
            
            powers: {
                damage_up: new Audio("res/audio/sfx/damage_up.wav"),
                speed_up: new Audio("res/audio/sfx/speed_up.wav"),
                cherry: new Audio("res/audio/sfx/cherry.wav"),
                "cherry-mini": new Audio("res/audio/sfx/cherry-mini.wav")
            }
        };
        
        this.sounds.hurt.volume = 0.5;

        this.rolling = false;
        this.attacking = false;
        
        this.canStartRoll = true;
        this.canStartAttack = true;
        
        this.animFrames = 4;
        
        this.size = 32;
        this.weaponSize = 64;
        this.scale = 1.75;
        
        this.hurtBox = 12;
        this.hurtPosX = this.x + this.hurtBox;
        this.hurtPosY = this.y + this.hurtBox;
        
        this.launchX = 0;
        this.launchY = 0;
        
        this.slashRad = 40;
        this.hitPosX = 0;
        this.hitPosY = 0;
        this.hitWidth;
        this.hitHeight;
        this.damage = 1;
        
        this.slice = 0;
        this.frame = 0;
    }
    
    controls(keys) {
        if(!this.rolling && !this.attacking) {
            if(keys[77]) {
                if(this.canStartRoll) {
                    this.currentPlayer = "Roll" + this.getPlayerAnim(this.facing[0], this.facing[1]);
                    this.animFrames = this.playerSheets[this.currentPlayer].width / this.size;
                    this.frame = 0;
                    this.rolling = true;  
                    this.canStartRoll = false;
                }
            } else {
                this.canStartRoll = true;
            }
            
            if(keys[78]) {
                if(this.canStartAttack) {
                    this.currentPlayer = "Slash" + this.getAttackAnim(this.facing[0], this.facing[1]);
                    this.currentWeapon = this.getAttackAnim(this.facing[0], this.facing[1]);
                    this.animFrames = this.playerSheets[this.currentPlayer].width / this.size;
                    this.frame = 0;
                    this.attacking = true;
                    this.canStartAttack = false;
                    
                    this.sounds.slash[Math.floor(Math.random() * this.sounds.slash.length)].play();
                }
            } else {
                this.canStartAttack = true;
            }
        }
        
        if(!this.rolling && !this.attacking) {
            if(keys[87]) {
                this.direction[1] -= 1;
            }
            
            if(keys[65]) {
                this.direction[0] -= 1;
            }
            
            if(keys[83]) {
                this.direction[1] += 1;
            }
            
            if(keys[68]) {
                this.direction[0] += 1;
            }
        } else {
            this.direction = this.facing;
        }
    }
    
    launch(angle) {
        this.launchX = angle[0] * Math.sin(45 * Math.PI / 180) * 4;
        this.launchY = angle[1] * Math.sin(45 * Math.PI / 180) * 4;
    }
    
    update() {
        if(this.powerTimer > 0) {
            this.powerTimer--;
            
            powerTimeBar.style.width = (this.powerTimer / this.maxPowerTime * 100) + "%";
            // powerTimeBar.style.opacity = (this.powerTimer / this.maxPowerTime + 0.25);
            
            if(this.powerTimer === 0) {
                powerBar.classList.remove("enter");
                powerBar.classList.add("exit");
                
                this.resetPowers();
            }
        }
        
        this.speed = this.rolling ? 6 : 3;
        this.speed = this.attacking ? 0 : this.speed;
        
        this.speed *= this.speedFactor;
        
        if(this.direction[0] && this.direction[1]) {
            this.dx = this.direction[0] * Math.sin(45 * Math.PI / 180) * this.speed;
            this.dy = this.direction[1] * Math.sin(45 * Math.PI / 180) * this.speed;
        } else {
            this.dx = this.direction[0] * this.speed;
            this.dy = this.direction[1] * this.speed;
        }
        
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
        
        this.launchX = Math.abs(this.launchX) < 0.1 ? 0 : this.launchX;
        this.launchY = Math.abs(this.launchY) < 0.1 ? 0 : this.launchY;
        
        if(this.attacking) {
            this.calcHitBox();
        }
        
        if(this.invincible) {
            if(this.invinCount >= this.invinLimit) {
                this.invincible = false;
                this.invinCount = 0;
            }
            this.invinCount++;
        }
        
        this.hurtPosX = this.x + this.hurtBox;
        this.hurtPosY = this.y + this.hurtBox;
        
        this.collisionDetection();
    }
    
    collisionDetection() {
        if(this.hurtPosX < 0) {
            this.x = -this.hurtBox;
            this.hurtPosX = 0;
        } else if(this.hurtPosX + this.size >= canvas.width) {
            this.x = canvas.width - this.hurtBox - this.size;
            this.hurtPosX = canvas.width - this.size;
        }
        
        if(this.hurtPosY < 70) {
            this.y = 70 - this.hurtBox;
            this.hurtPosY = 70;
        } else if(this.hurtPosY + this.size >= canvas.height) {
            this.y = canvas.height - this.hurtBox - this.size;
            this.hurtPosY = canvas.height - this.size;
        }
    }
    
    hurtDetection(hit) {
        if(circleCollision(this.getHurtData(), hit) && !this.invincible) {
            this.sounds.hurt.play();
            
            this.health -= hit.damage;
            this.health = this.health < 0 ? 0 : this.health;
            
            this.launch(hit.angle);
            this.invincible = hit.invin;
            return true;
        }

        return false;
    }
    
    powerDetection(box) {
        if(rectCollision(this.getHurtData(), box)) {
            this.sounds.powers[box.type].play();
            
            if(box.type == "cherry" || box.type == "cherry-mini") {
                this.health += box.heal;
                
                if(this.health > this.maxHealth) {
                    this.health = this.maxHealth;
                }
            } else {
                this.resetPowers();
                
                powerBar.classList.remove("exit");
                powerBar.classList.add("enter");
                
                this.powerTimer = this.maxPowerTime;
                
                switch(box.type) {
                    case "speed_up":
                        powerName.innerHTML = "SUPER SPEED";
                        this.speedFactor = 2;
                        break;
                    case "damage_up":
                        powerName.innerHTML = "SUPER SLASH";
                        this.damage = 2;
                        break;
                }
            }
            
            return true;
        }
        
        return false;
    }
    
    resetPowers() {
        this.speedFactor = 1;
        this.damage = 1;
    }
    
    calcHitBox() {
        this.hitWidth = (this.currentWeapon == "UpLeft" || this.currentWeapon == "DownRight")
        ? this.size + 8 : this.size + 24;
        
        this.hitHeight = (this.currentWeapon == "UpLeft" || this.currentWeapon == "DownRight")
        ? this.size + 24 : this.size + 8;
        
        if(this.hitHeight > this.hitWidth) {
            if(this.facing[0] == 1) {
                this.hitPosX = this.hurtPosX + 16;
                this.hitPosY = this.hurtPosY;
            } else {
                this.hitPosX = this.hurtPosX - 24;
                this.hitPosY = this.hurtPosY - 24;
            }
        } else {
            if(this.facing[1] == 1) {
                this.hitPosX = this.hurtPosX - 24;
                this.hitPosY = this.hurtPosY + 16;
            } else {
                this.hitPosX = this.hurtPosX;
                this.hitPosY = this.hurtPosY - 24;
            }
        }
    }
    
    getHitData() {
        if(this.attacking) {
            return {
                x: this.hitPosX,
                y: this.hitPosY,
                width: this.hitWidth,
                height: this.hitHeight,
                centerX: this.hurtPosX + this.size / 2,
                centerY: this.hurtPosY + this.size / 2,
                radius: this.slashRad,
                angle: this.facing,
                damage: this.damage,
                sound: this.sounds.hit["hit" + this.damage]
            };
        }
        
        return null;
    }
    
    getHurtData() {
        return {
            x: this.hurtPosX,
            y: this.hurtPosY,
            width: this.size,
            height: this.size,
            centerX: this.hurtPosX + this.size / 2,
            centerY: this.hurtPosY + this.size / 2,
            radius: this.size / 2
        };
    }
    
    animate() {
        let lastPlayer = this.currentPlayer;
        
        if(this.dx || this.dy || this.rolling) {
            this.frame += 0.2 * this.speedFactor;
            this.facing = (this.dx || this.dy) ? this.direction : this.facing;
        } else if(this.attacking) {
            this.frame += 0.4;
        } else {
            this.frame = 0;
        }
        
        if(!this.rolling && !this.attacking) {
            this.currentPlayer = this.getPlayerAnim(this.facing[0], this.facing[1]);
        } else if(this.frame > this.animFrames){
            this.rolling = false;
            this.attacking = false;
            this.currentPlayer = this.getPlayerAnim(this.facing[0], this.facing[1]);
            this.currentWeapon = "";
        }
        
        this.animFrames = this.playerSheets[this.currentPlayer].width / this.size;
        this.slice = Math.floor(this.frame) % this.animFrames;
        
        this.frame = lastPlayer != this.currentPlayer ? 0 : this.frame;
        this.slice = Math.floor(this.frame) % this.animFrames;
        
        this.direction = [0, 0];
    }
    
    getPlayerAnim(xDir, yDir) {
        switch(xDir) {
            case -1:
                switch(yDir) {
                    case -1:
                        return "UpLeft";
                    case 0:
                        return "Left";
                    case 1:
                        return "DownLeft";
                }
                break;
            case 0:
                switch(yDir) {
                    case -1:
                        return "Up";
                    case 0:
                        return this.currentPlayer;
                    case 1:
                        return"Down";
                }
                break;
            case 1:
                switch(yDir) {
                    case -1:
                        return "UpRight";
                    case 0:
                        return "Right";
                    case 1:
                        return "DownRight";
                }
                break;
        }
    }
    
    getAttackAnim(xDir, yDir) {
        if(xDir < 1 && yDir == 1) {
            return "DownLeft";
        } else if(xDir == 1 && yDir > -1) {
            return "DownRight";
        } else if(xDir == -1 && yDir < 1) {
            return "UpLeft";
        } else if(xDir > -1 && yDir == -1) {
            return "UpRight";
        }
    }
    
    render(ctx) {
        let scaledSize = this.size * this.scale;
        let weaponScaled = this.weaponSize * this.scale;
        
        // this.showBoxes(scaledSize, weaponScaled);
        
        if(this.invinCount === 0 || this.invinCount % 10 <= 5) {
            if(this.attacking) {
                ctx.drawImage(this.weaponSheets[this.currentWeapon],
                this.slice * this.weaponSize, 0, this.weaponSize, this.weaponSize,
                this.x - scaledSize / 2, this.y - scaledSize / 2,
                weaponScaled, weaponScaled);
            }
            
            ctx.drawImage(this.playerSheets[this.currentPlayer], this.slice * this.size, 0,
            this.size, this.size, this.x, this.y, scaledSize, scaledSize);
        }
        
        
        this.showHealthBar(ctx);
    }
    
    showHealthBar(ctx) {
        ctx.fillStyle = "dimgrey";
        ctx.fillRect(this.hurtPosX, this.hurtPosY + this.size * 1.2, this.size, this.size / 8);

        ctx.fillStyle = "lime";
        ctx.fillRect(this.hurtPosX, this.hurtPosY + this.size * 1.2, this.size * this.health / this.maxHealth, this.size / 8);
        
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.hurtPosX, this.hurtPosY + this.size * 1.2, this.size, this.size / 8);
    }
    
    showBoxes(scaled, weapScaled) {
        // SLASHIMAGEBOX
        // ctx.fillStyle = "green";
        // ctx.fillRect(this.x - scaled / 2, this.y - scaled / 2,
        // weapScaled, weapScaled);
        
        // IMAGEBOX
        // ctx.fillStyle = "blue";
        // ctx.fillRect(this.x, this.y, scaled, scaled);
        
        
        // SLASHHITBOX
        ctx.fillStyle = "green";
        if(this.attacking) {
            ctx.fillRect(this.hitPosX, this.hitPosY, this.hitWidth, this.hitHeight);
        }
        
        ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
        ctx.beginPath();
        ctx.arc(this.hurtPosX + this.size / 2, this.hurtPosY + this.size / 2, this.slashRad, 0, 2 * Math.PI);
        ctx.fill();
        
        // PLAYERHITBOX
        ctx.fillStyle = "red";
        ctx.fillRect(this.hurtPosX, this.hurtPosY, this.size, this.size);
    }
}