class Power {
    constructor(xPos, yPos, type) {
        this.x = xPos;
        this.y = yPos;
        
        this.size = 16;
        this.scale = 2;
        
        this.type = type;
        
        this.path = "../res/images/objects/";
        this.sprite = defineImage(this.path + this.type + ".png");
        
        this.decayTimer = 10 * 60;
        this.heal = 0;
        
        if(this.type == "cherry") {
            this.heal = 2;
        } else if(this.type == "cherry-mini") {
            this.heal = 1;
        }
    }
    
    getPowerData() {
        return {
            x: this.x,
            y: this.y,
            width: this.size * this.scale,
            height: this.size * this.scale,
            type: this.type,
            heal: this.heal
        };
    }
    
    decay() {
        this.decayTimer--;
        
        if(this.decayTimer === 0) {
            return true;
        }
        
        return false;
    }
    
    render(ctx) {
        if(this.decayTimer > 3 * 60 || this.decayTimer % 10 <= 5) {
            ctx.drawImage(this.sprite, this.x, this.y, this.size * this.scale, this.size * this.scale);
        }
    }
}