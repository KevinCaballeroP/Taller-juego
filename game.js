const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
const playerPosition = {
    x: undefined,
    y: undefined,
};

const gitPosition = {
    x: undefined,
    y: undefined,
};

let enemiesPositions = [];
let timeStart;
let timePlayer;
let timeInterval;
let level = 0;
let lives = 3;

let canvasSize;
let elementsSiza;
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize(){
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.7;
    } else{
        canvasSize = window.innerHeight * 0.7;
    }
      
    canvasSize = Number(canvasSize.toFixed(0));
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    elementsSiza = (canvasSize / 10);
    elementsSiza = Number(elementsSiza.toFixed(0));

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    starGame();
}

function starGame(){
    console.log({canvasSize, elementsSiza})
    game.font = elementsSiza + 'px Verdana';
    game.textAlign = 'end';
    const map = maps[level];
    if(!map){
        gameWin();
        rebootGame();
        return;
    }
    if(!timeStart){
        timeStart= Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split('')); 
    console.log({map, mapRows, mapRowCols});
    showLives();
    enemiesPositions = [];
    game.clearRect(0,0, canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSiza * (colI + 1);
            const posY = elementsSiza * (rowI + 1);

            if(col == 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log({playerPosition});
                }
            } else if(col == 'I'){
                gitPosition.x = posX;
                gitPosition.y = posY;
            }else if(col == 'X'){
                enemiesPositions.push({
                    x: posX,
                    y: posY,
                });
            }
            game.fillText(emoji, posX, posY);
        });
    });

    //for (let row = 1; row <= 10; row++) {
    //   for(let col = 1; col <= 10; col++){
    //        game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementsSiza * col, elementsSiza * row);
    //    }
  //}
  movePlayer();
}

function movePlayer(){
    const gitCollisionX= playerPosition.x.toFixed(0) == gitPosition.x.toFixed(0);
    const gitCollisionY= playerPosition.y.toFixed(0) == gitPosition.y.toFixed(0);
    const gitCollision = gitCollisionX && gitCollisionY;

    if (gitCollision) {
       levelWin();
    }
    const enemyCollision = enemiesPositions.find(enemy =>{
        const enemyCollisionX = enemy.x.toFixed(0) == playerPosition.x.toFixed(0);
        const enemyCollisionY = enemy.y.toFixed(0) == playerPosition.y.toFixed(0);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        showCollision()
        setTimeout(levelFail, 2000);
    }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}
function showCollision() {
    game.clearRect(0, 0, canvasSize, canvasSize);
    game.font = '10px Verdana';
    game.textAlign = 'center';
    if(lives > 1) {
        game.fillText(emojis['BOMB_COLLISION'], canvasSize/2, canvasSize/2);
    }
    else {
        game.fillText(emojis['GAME_OVER'], canvasSize/2, canvasSize/2);
        console.log('perdiste todas las vidas')
    } 
}

function levelWin(){
    console.log('subiste de nivel');
    level++;
    starGame();
}

function levelFail(){
    console.log('perdiste');
    lives--;
  
    console.log(lives);
    if(lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    starGame();
}

function gameWin(){
    console.log('terminaste el juego');
    clearInterval(timeInterval);

    game.fillText(emojis['WIN'],canvasSize/2, canvasSize/2);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    if(recordTime){  
        if(recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'nuevo record';
        }else{
            pResult.innerHTML = 'los siento no supuro el record';
        }
    } else{
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'primer record';

    }
    console.log({recordTime, playerTime});
}

function showLives(){
   const heatArray = Array(lives).fill(emojis['HEART']) // [1,2,3]
    console.log(heatArray);
    spanLives.innerHTML = "";
    heatArray.forEach(heart => spanLives.append(heart));
}
function showTime(){
    spanTime.innerHTML = Date.now() - timeStart; 
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time'); 
}
function rebootGame(){
    const reboot = confirm("¿Jugar de nuevo?"); 
    if(reboot){
        alert('Reinicio de juego');
        document.location.reload();
    }else{
        alert('Gracias por jugar');
    }
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click',moveUP);
btnLeft.addEventListener('click',moveLeft);
btnRight.addEventListener('click',moveRight);
btnDown.addEventListener('click',moveDown);

function moveByKeys(event){
    if(event.key == 'ArrowUp'){
        moveUP();
    } else if(event.key == 'ArrowLeft'){
        moveLeft();
    }else if(event.key == 'ArrowRight'){
        moveRight();
    }else if(event.key == 'ArrowDown'){
        moveDown();
    }
}

function moveUP(){
    console.log('quiero mover arriba');
    if((playerPosition.y - elementsSiza) < elementsSiza){
        console.log('se salio');
    }else{
        playerPosition.y -= elementsSiza;
        starGame();
    }
}

function moveLeft(){
    console.log('quiero mover izquierda');
    if((playerPosition.x - elementsSiza) < elementsSiza){
        console.log('se salio');
    }else{
        playerPosition.x -= elementsSiza;
        starGame();
    }
}

function moveRight(){
    console.log('quiero mover derecha');
    if((playerPosition.x + elementsSiza) > canvasSize){
        console.log('se salio');
    }else{
        playerPosition.x += elementsSiza;
        starGame();
    }
}

function moveDown(){
    console.log('quiero mover abajo');
    if((playerPosition.y + elementsSiza) > canvasSize){
        console.log('se salio');
    }else{
        playerPosition.y += elementsSiza;
        starGame();
    }
}