let ctx;

let soundtrack = {};
let songs = ["Calamity", "Court", "Jaxi"];

let keys = {};
let menuState = true;

let player;
let blobs = [];
let ghosts = [];

let powers = [];
let tree;

window.onload = function() {
    canvas = document.getElementById("grassland");
    ctx = canvas.getContext("2d");
    
    powerBar = document.getElementById("powerBar");
    powerTimeBar = document.getElementById("powerTime");
    powerName = document.getElementById("powerName");
    
    player = new Player();
    tree = new Tree(0, 0, 0, 0);
    
    soundtrack = initSounds("../res/audio/music/", songs, ".mp3");

    window.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true; 
    });
    
    window.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false; 
    });
    
    tree.spriteSheet.onload = function() {
        let back = document.getElementById("background").getContext("2d");
        let fore = document.getElementById("foreground").getContext("2d");
        showTrees(back, fore);
    };

    // canvas.addEventListener("mousedown", function(e) {
    //   let rect = canvas.getBoundingClientRect();
    //   console.log((e.clientX - rect.left) + ", " + (e.clientY - rect.top));
    // });
    
    requestAnimationFrame(gameLoop);
};

function gameLoop() {
    requestAnimationFrame(gameLoop);
    
    update();
    render();
}

function update() {
    while(blobs.length < 1) {
        blobs.push(new BigBlob());
    }
    
    player.controls(keys);
    player.update();
    
    while(ghosts.length < 1) {
        ghosts.push(new Ghost(player.getHurtData()));
        // ghosts.push(new GhostHard(player.getHurtData()));
    }
    
    for(let i = 0; i < powers.length; i++) {
        if(powers[i].decay() || player.powerDetection(powers[i].getPowerData())) {
            powers.splice(i, 1);
        }
    }
    
    for(let i = 0; i < blobs.length; i++) {
        blobs[i].update(player.getHurtData());
        blobs[i].hurtDetection(player.getHitData());
        
        if(blobs[i].dead) {
            if(blobs[i] instanceof BigBlob) {
                blobs.push(new Blob(blobs[i].getHurtData()));
                blobs.push(new Blob(blobs[i].getHurtData()));
            }
            
            let drop = blobs[i].determineDrop();
            
            if(drop) {
                powers.push(new Power(blobs[i].x, blobs[i].y, drop));
            }
            
            blobs.splice(i, 1);
        }
    }
    
    for(let i = 0; i < ghosts.length; i++) {
        ghosts[i].update(player.getHurtData());
        ghosts[i].hurtDetection(player.getHitData());
        
        if(ghosts[i].dead) {
            let drop = ghosts[i].determineDrop();
            
            if(drop) {
                powers.push(new Power(ghosts[i].x, ghosts[i].y, drop));
            }
            
            ghosts.splice(i, 1);
        }
    }
    
    for(let b of blobs) {
        player.hurtDetection(b.getHurtData());
    }

    for(let g of ghosts) {
        g.draining = player.hurtDetection(g.getHurtData()) && !g.dying;
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(let b of blobs) {
        b.animate();
        b.render(ctx);
    }
    
    for(let g of ghosts) {
        g.animate();
        g.render(ctx);
    }
    
    for(let p of powers) {
        p.render(ctx);
    }
    
    player.animate();
    player.render(ctx);
}

function start() {
    let scroll = document.getElementById("startup");
    scroll.classList.add("exit");
    playRandom();
}

function showTrees(background, foreground) {
    for(let i = 0; i < 2; i++) {
        tree.y = -70 + 50 * i;
        for(let j = -50; j < canvas.width; j += tree.spriteWidth - 10) {
            tree.changeSprite(Math.round(Math.random()), i);
            tree.x = j + 50 * i;
            tree.render(background);
        }
    }
    
    tree.y = canvas.height - tree.spriteHeight / 1.2;
    
    for(let j = -50; j < canvas.width; j += tree.spriteWidth) {
        tree.changeSprite(Math.round(Math.random() + 2), 2);
        tree.x = j;
        tree.render(foreground);
    }
}

function playRandom() {
    let randSong = songs[Math.floor(Math.random() * songs.length)];
    soundtrack[randSong].volume = 0.4;
    soundtrack[randSong].play();
}