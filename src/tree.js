class Tree {
    constructor(size, row, xPos, yPos) {
        this.spriteSheet = defineImage("res/images/objects/trees.png");
        this.sheetHeight = 384;
        
        this.spriteWidth;
        this.spriteHeight = this.sheetHeight / 3;
        
        this.xSlice = 0;
        this.ySlice = 0;
        
        this.x = xPos;
        this.y = yPos;
        
        this.changeSprite(size, row);
        //320, 384
    }
    
    changeSprite(size, row) {
        this.size = size;
        this.row = row;
        this.getSprite();
    }
    
    getSprite() {
        switch(this.size) {
            case 0:
                this.xSlice = 0;
                this.spriteWidth = 100;
                break;
            case 1:
                this.xSlice = 100;
                this.spriteWidth = 85;
                break;
            case 2:
                this.xSlice = 185;
                this.spriteWidth = 75;
                break;
            case 3:
                this.xSlice = 260;
                this.spriteWidth = 60;
                break;
        }
        
        this.ySlice = this.spriteHeight * this.row;
    }
    
    render(ctx) {
        ctx.drawImage(this.spriteSheet, this.xSlice, this.ySlice,
        this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth, this.spriteHeight);
    }
}