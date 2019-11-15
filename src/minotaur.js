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
        
        this.size = 96;
        
        this.minoSheet = defineImage("res/images/entities/spr_minotaur.png");
        
        this.animInfo = {
            "idle": [0, 5],
            "move": [1, 8],
            "taunt": [2, 5],
            "attack1": [3, 9],
            "attack2": [4, 5],
            "attack3": [5, 6],
            "attack4": [6, 9],
            "damage1": [7, 3],
            "damage2": [8, 3],
            "death": [9, 6]
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

    }
    
    hurtDetection() {
        
    }
    
    animate() {
        this.frame++;
        // this.slice = 
    }
    
    render(ctx) {
        // this.showBoxes(ctx);
        ctx.drawImage(this.minoSheet, this.slice * this.size, this.currentAnim[0] * this.size,
        this.size, this.size, this.x, this.y, this.size, this.size);
    }
    
    showBoxes(ctx) {
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}