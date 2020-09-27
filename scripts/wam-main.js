const malletCursor = document.querySelector('.mallet-cursor');
const welcomeScreen = document.querySelector('.welcome-screen');
const gameTitle = document.getElementById('game-title');
const overlay = document.querySelector('.overlay');
const credit = document.getElementById('credit');
const gamemode = document.querySelector('.gamemode');

const startButton = document.querySelector('.startButton');
const musicButton = document.querySelector('.musicButton');
const soundButton = document.querySelector('.soundButton');
const replayButton = document.querySelector('.replayButton');
const partyButton = document.querySelector('.partyButton');

const holes = document.querySelectorAll('.hole');
const scoreboard = document.querySelector('.scoreboard');
const gameboard = document.querySelector('.gameboard-wp');
const moles = document.querySelectorAll('.mole');
const countdownBoard = document.querySelector('.countdown');

const audio = 
    [new Audio("../assets/audio/smack.mp3"),
    new Audio("../assets/audio/crazy-frog.mp3"),
    new Audio("../assets/audio/crazy-frog-nightcore.mp3")];
let musicon = true, soundon = true;

const TIMELIMIT = 15000;
let lastHole;
let timeUp = false;
let difficulty= false;
let score = 0;
let timesplayed = 0;

// UI Module

const strikethroughToggle = element => element.classList.toggle('line-through');

const musicToggle = () => {
    malletAnimation();
    musicon = !musicon;
    if (!musicon) stopMusic();
    strikethroughToggle(musicButton);
}
const soundToggle = () => {
    malletAnimation();
    soundon = !soundon;
    strikethroughToggle(soundButton);
}
const berzerkToggle = () => {
    malletAnimation();
    difficulty = !difficulty;
    partyButton.classList.toggle('berzerk-deco')
}

const displayToggle = (...elements) => {
    [...elements].map(ele => {
        ele.classList.toggle('hideit');
    });
}
const opacityToggle = (...element) => {
    [...element].map(ele => {
        ele.classList.toggle('fade-in');
        ele.classList.toggle('fade-out');
    });
}
const cdText = (string = '', extra = '') => {
    (string) ? countdownBoard.textContent += (' ' + extra) 
    : countdownBoard.textContent = string; 
}

const cursor = e => {
    malletCursor.style.top = e.pageY + "px";
    malletCursor.style.left = e.pageX + "px";
}
const malletAnimation = () => {
    if (soundon) {audio[0].currentTime = 0; audio[0].play()};
    malletCursor.classList.add('mallet-move');
    setTimeout( () => {malletCursor.classList.remove('mallet-move')}, 500);
}
const moleAnimation = mole => {mole.classList.toggle('mole-animate');}
    
//Sound Module
const stopMusic = () => {
    for (let i = 1; i < audio.length; i++) {
        audio[i].pause();
        audio[i].currentTime = 0;
        };
}
const playTheme = (music,track) => {if (musicon) {
    stopMusic();
    music[track].play();
    }
}

// Main Game module
const gameStart = () => {
    malletAnimation();
    timeUp = false;
    score = 0;
    timesplayed++;

    let i = (difficulty) ? 2 : 1; playTheme(audio[i]);

    opacityToggle(welcomeScreen,overlay,gameboard,credit);
    displayToggle(gameboard);
    if (timesplayed > 0) {
        opacityToggle(gamemode,scoreboard);
        displayToggle(gamemode,scoreboard);
    } else startButton.classList.add('hideit');

    let offset = 0;
    setTimeout(cdText, offset, 'Wait For It!!');
    setTimeout(cdText, offset += 1000, '3');
    setTimeout(cdText, offset += 1000, '', '2');
    setTimeout(cdText, offset += 1000, '', '1');
    setTimeout(cdText, offset += 500, '', 'SMACK THEM!!');
    setTimeout(() => {(difficulty) ? berzerkGame() : normalGame()}, offset += 500);
}
function gameOver() {
    timeUp = true;
    cdText('Game Over!!');    
    scoreboard.textContent = score;
    opacityToggle(welcomeScreen,overlay,gameboard,scoreboard,gamemode,credit);
    displayToggle(gameboard,scoreboard,gamemode);
}

function normalGame(){
    popOut();
    countingDown();
}
function berzerkGame(){
    crazyPopOut();
    countingDown();
}
function popOut() {
    const time = Math.random() * 1300 + 400;
    const hole = pickRandomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) popOut();
    }, time);
}
function crazyPopOut() {
    const time = Math.random() * 900 + 200;
    const hole1 = pickRandomHole(holes);
    const hole2 = pickRandomHole(holes);
    hole1.classList.add('up');
    hole2.classList.add('up');
    setTimeout(() => {
        hole1.classList.remove('up');
        hole2.classList.remove('up');
        if (!timeUp) crazyPopOut();
    }, time);
}
function pickRandomHole(holes) {
    const randomHole = Math.floor(Math.random()*holes.length);
    const hole = holes[randomHole];
    if (hole === lastHole) {
        return pickRandomHole(holes);
    }
    lastHole = hole;
    return hole;
}
function whack() {
    score++;
    malletAnimation();
    moleAnimation();
    setTimeout(moleAnimation, Math.random() * 700 + 300);
}

function countingDown() {
    let countdown = TIMELIMIT/1000;
    let tick = setInterval(() => {
        cdText(countdown);
        countdown--;
        if (countdown < 0) {
            clearInterval(tick);
            gameOver()};
    }, 1000);
}

startButton.addEventListener('click', gameStart);
musicButton.addEventListener('click', musicToggle);
soundButton.addEventListener('click', soundToggle);
replayButton.addEventListener('click', gameStart);
partyButton.addEventListener('click', berzerkToggle);

window.addEventListener('mousemove', cursor);
moles.forEach(mole => mole.addEventListener('click',whack));