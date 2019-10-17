let canvas;

let powerTimeBar;
let powerBar;
let powerName;

function initAnimations(pathTo, names) {
    let sheets = {};
    
    for(let i = 0; i < names.length; i++) {
        sheets[names[i]] = defineImage(pathTo + names[i] + ".png");
    }
    
    return sheets;
}

function initSounds(pathTo, names, ext) {
    let sounds = {};
    
    for(let i = 0; i < names.length; i++) {
        sounds[names[i]] = new Audio(pathTo + names[i] + ext);
    }
    
    return sounds;
}

function defineImage(path) {
    let newImg = new Image();
    newImg.src = path;
    return newImg;
}

function rectCollision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
        return true;
    }
    
    return false;
}

function circleCollision(circle1, circle2) {
    let distX = circle1.centerY - circle2.centerY;
    let distY = circle1.centerX - circle2.centerX;
    let centerDist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
                
    let radialDist = centerDist - circle1.radius - circle2.radius;
    
    if(Math.round(radialDist) <= 0) {
        return true;
    }
    
    return false;
}

function toDeg(rad) {
    return rad * 180/Math.PI;
}

function toRad(deg) {
    return deg * Math.PI/180;
}

function getAngle(x1, y1, x2, y2) {
    let angle = -Math.atan2(y1 - y2, x1 - x2);
    angle = angle < 0 ? angle + Math.PI*2 : angle;

    return angle;
}


