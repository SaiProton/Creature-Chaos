class Minotaur {
    constructor() {
        this.x;
        this.y;
        
        this.dx;
        this.dy;
        
        this.direction = [0, 0];
        
        this.angle;
        
        this.speed = 3;
        
        this.damage = 1;
        
        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.invincible = false;
        this.dead = false;
        this.invincible = false;
        
        this.size = 96;
        
        this.minoSheet = defineImage("res/images/entities/spr_minotaur.png");
        
        this.animInfo = {
            "idle": [0, 5, true],
            "move": [1, 8, true],
            "taunt": [2, 5, true],
            "attack1": [3, 9, false],
            "attack2": [4, 5, false],
            "attack3": [5, 6, false],
            "attack4": [6, 9, false],
            "damage1": [7, 3, false],
            "damage2": [8, 3, false],
            "death": [9, 6, false]
        };

        this.currentAnim = this.animInfo.idle; //what animation is currently playing

        this.slice = 0;
        this.frame = 0;
        
        this.dropChances = {
            "damage_up": 1,
            "speed_up": 0,
            "cherry": 0,
            "cherry-mini": 0
        };
        
        this.randomStart();
    }
    
    randomStart() {
        if(Math.random() > 0.5) {
            this.x = Math.random() * (canvas.width - this.size);
            this.y = Math.random() > 0.5 ? -this.size - Math.random() * 50  : canvas.height + Math.random() * 50;
        } else {
            this.x = Math.random() > 0.5 ? -this.size - Math.random() * 50: canvas.width + Math.random() * 50;
            this.y = Math.random() * (canvas.height - this.size);
        }
        
        this.x = 500;
        this.y = 400;
    }

    update() {
        // this.x += this.dx;
        // this.y += this.dy;
    }

    getHurtData() {
        return {
            x: this.x + this.size / 4,
            y: this.y + this.size / 4,
            width: this.size / 2,
            height: this.size / 2,
            centerX: this.x + this.size / 2,
            centerY: this.y + this.size / 2,
            radius: this.size / 4,
            angle: this.direction,
            damage: this.damage,
            invin: true
        };
    }
    
    hurtDetection(hit) {
        if(hit !== null) {
            if(!this.invincible && this.health !== 0) {
                let minoHurtArea = this.getHurtData();

                if(circleCollision(minoHurtArea, hit) && rectCollision(minoHurtArea, hit)) {
                    hit.sound.play();
                    this.currentAnim = Math.random() > 0.5 ? this.animInfo.damage1 : this.animInfo.damage2;
                    this.frame = 0;
                    this.invincible = true;

                    for(let i = hit.damage; i > 0 && this.health > 0; i--) {
                        this.health--;
                    }

                    console.log(`Minotaur HP: ${this.health}`);
                }
            }
        } else {
            this.invincible = false;
        }
    }
    
    animate() {
        this.frame += 0.2;
        this.slice = Math.floor(this.frame) % this.currentAnim[1];

        if(!this.currentAnim[2]) {
            if(this.frame > this.currentAnim[1]) {
                console.info("KONG GONE WRONG. I REPEAT: KONG GONE WRONG");
                this.currentAnim = this.animInfo.idle;
                this.frame = 0;
            }
        }
    }
    
    render(ctx) {
        this.showBoxes(ctx);
        ctx.drawImage(this.minoSheet, this.slice * this.size, this.currentAnim[0] * this.size,
        this.size, this.size, this.x, this.y, this.size, this.size);

        this.showHealthBar(ctx);
    }

    showHealthBar(ctx) {
        ctx.fillStyle = "dimgrey";
        ctx.fillRect(this.x + this.size / 4, this.y + 3 * this.size / 4, this.size / 2, this.size / 16);
        
        ctx.fillStyle = "red";
        ctx.fillRect(this.x + this.size / 4, this.y + 3 * this.size / 4, (this.size / 2) * (this.health / this.maxHealth), this.size / 16);

        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x + this.size / 4, this.y + 3 * this.size / 4, this.size / 2, this.size / 16);
    }

    showBoxes(ctx) {
        ctx.fillStyle = "lime";
        ctx.fillRect(this.x, this.y, this.size, this.size);

        ctx.fillStyle = "green";
        ctx.fillRect(this.x + this.size/4, this.y + this.size/4, this.size/2, this.size/2);

        ctx.fillStyle = 'darkgreen';
        ctx.beginPath();
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 4, 0, 2 * Math.PI);
        ctx.fill();
    }
}