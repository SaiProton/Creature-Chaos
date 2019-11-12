let ctx;

let waveTitle;
let waveDesc;

let soundtrack = {};
let songs = ["Calamity", "Court", "Jaxi"];

let keys = {};
let menuState = true;

let player;

let enemies = {
    "blobs": [],
    "ghosts": []
};

let waveCount = 0;
let spawnTimer = 0;
let blobsSpawn = 0;
let ghostSpawn = 0;

let powers = [];
let tree;

window.onload = () => {
    canvas = document.getElementById("grassland");
    ctx = canvas.getContext("2d");

    waveTitle = document.getElementById("waveTitle");
    waveDesc = document.getElementById("waveDesc");
    
    powerBar = document.getElementById("powerBar");
    powerTimeBar = document.getElementById("powerTime");
    powerName = document.getElementById("powerName");

    waves = JSON.parse(waves);
    console.log(waves);
    
    player = new Player();
    tree = new Tree(0, 0, 0, 0);
    
    soundtrack = initSounds("res/audio/music/", songs, ".mp3");

    window.addEventListener("keydown", e => keys[e.keyCode] = true);
    window.addEventListener("keyup", e => keys[e.keyCode] = false);
    
    tree.spriteSheet.onload = () => {
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
    player.controls(keys);
    player.update();

    let waveName = "wave" + waveCount;

    if(!menuState) {
        if(spawnTimer >= waves[0][waveName].enemies.delay * 60) {
            if(spawn(waveName)) {
                spawnTimer = 0;
            }
        } else {
            spawnTimer++;
        }
    }
    
    for(let i = 0; i < powers.length; i++) {
        (powers[i].decay() || player.powerDetection(powers[i].getPowerData())) && powers.splice(i, 1);
    }
    
    for(let e in enemies) {
        for(let i = 0; i < enemies[e].length; i++) {
            enemies[e][i].update(player.getHurtData());
            enemies[e][i].hurtDetection(player.getHitData());
            
            if(enemies[e][i].dead) {
                if(enemies[e][i] instanceof BigBlob) {
                    enemies.blobs.push(new Blob(enemies[e][i].getHurtData()));
                    enemies.blobs.push(new Blob(enemies[e][i].getHurtData()));
                }
                
                let drop = enemies[e][i].determineDrop();
                
                drop && powers.push(new Power(enemies[e][i].x, enemies[e][i].y, drop));
                
                enemies[e].splice(i, 1);
            }
        }
    }
    
    for(let b of enemies.blobs) {
        player.hurtDetection(b.getHurtData());
    }

    for(let g of enemies.ghosts) {
        g.draining = player.hurtDetection(g.getHurtData()) && !g.dying;
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(let e in enemies) {
        for(let i of enemies[e]) {
            i.animate();
            i.render(ctx);
        }
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
    menuState = false;
    startWave();
    playRandom();
}

function spawn() {
    let waveName = "wave" + waveCount;
    let randPick = Math.random();
    
    let blobData = waves[0][waveName].enemies.blobs;
    let ghostData = waves[0][waveName].enemies.ghosts;

    if(blobsSpawn < blobData.amount && enemies.blobs.length < blobData.max &&
    randPick < blobData.chance) {
        let newBlob = Math.random() < blobData.big ? new BigBlob() : new Blob();
        enemies.blobs.push(newBlob);
        blobsSpawn++;
        return true;
    } else {
        randPick -= blobData.chance;
    }

    if(ghostSpawn < ghostData.amount && enemies.ghosts.length < ghostData.max &&
    randPick < ghostData.chance) {
        let newGhost = Math.random() < ghostData.hard ?
        new GhostHard(player.getHurtData()) : new Ghost(player.getHurtData());
        enemies.ghosts.push(newGhost);
        ghostSpawn++;
        return true;
    } else {
        randPick -= ghostData.chance;
    }
    
    if(blobsSpawn >= blobData.amount && ghostSpawn >= ghostData.amount) {
        let enems = 0;
        for(let i in enemies) {
            enems += enemies[i].length;
        }
        
        enems === 0 && startWave();
    }

    return false;
}

function startWave() {
    waveCount++;
    let waveName = "wave" + waveCount;
    waveTitle.innerHTML = waves[0][waveName].info.name;
    waveDesc.innerHTML = waves[0][waveName].info.desc;
    waveBar.style.animation = "none";
    waveBar.offsetHeight;
    waveBar.style.animation = "waveIntro 4s linear";
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