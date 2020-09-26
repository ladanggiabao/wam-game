const welcomeScreen = document.querySelector('.welcome-screen');
const gameTitle = document.getElementById('game-title');
const overlay = document.querySelector('.overlay');
const credit = document.getElementById('credit');
const startButton = document.querySelector('.startButton');
const musicButton = document.querySelector('.musicButton');
const soundButton = document.querySelector('.soundButton');
const gamemode = document.querySelector('.gamemode');
const replayButton = document.querySelector('.replayButton');
const partyButton = document.querySelector('.partyButton');
const soundfx = new Audio("D:/Work/3.whack-a-mole-gam/smack.mp3")
const bgtheme = new Audio("D:/Work/3.whack-a-mole-gam/crazy-frog.mp3")
const malletCursor = document.querySelector('.mallet-cursor');

const holes = document.querySelectorAll('.hole');
const scoreboard = document.querySelector('.scoreboard');
const gameboard = document.querySelector('.gameboard-wp');
const moles = document.querySelectorAll('.mole');
const countdownBoard = document.querySelector('.countdown');

let musicon = true;
let soundon = true;
let lastHole;
let timeUp = false;
let difficulty = false;
let timeLimit = 15000;
let score = 0;
let timesplayed = 0;
// Menu Module
const musicToggle = () => {
    malletAnimation();
    musicon = !musicon;
    if (!musicon) {bgtheme.pause(); bgtheme.currentTime = 0;}
    musicon 
    ? musicButton.style.setProperty("text-decoration", "none") 
    : musicButton.style.setProperty("text-decoration", "line-through")
}

const soundToggle = () => {
    malletAnimation();
    soundon = !soundon;
    soundon 
    ? soundButton.style.setProperty("text-decoration", "none")
    : soundButton.style.setProperty("text-decoration", "line-through")
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

// Cursor Module

const cursor = e => {
    malletCursor.style.top = e.pageY + "px";
    malletCursor.style.left = e.pageX + "px";
}
function malletAnimation() {
    if (soundon) {soundfx.play()};
    malletCursor.classList.add('mallet-move');
    setTimeout( () => {malletCursor.classList.remove('mallet-move')}, 500);
}

// Main Game module
const startGame = () => {
    malletAnimation();
    gameInit();
    timesplayed++;
    setTimeout(() => countdownBoard.textContent = 'SMACK THEM!!', 2800);
    (difficulty) ? setTimeout(berzerkGame,3500) : setTimeout(normalGame,3500)
}
function normalGame(){
    popOut();
    countingDown();
}
function berzerkGame(){
    crazyPopOut();
    countingDown();
}
function berzerkToggle(){
    difficulty = !difficulty;
    partyButton.classList.toggle('berzerk-deco')
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
function whack() {
    score++;
    malletAnimation();
    this.style.backgroundImage = 'url("D:/Work/3.whack-a-mole-gam/images/mole-stunned.png")';
    this.style.pointerEvents = 'none';
    setTimeout(() => {
        this.style.backgroundImage = 'url("D:/Work/3.whack-a-mole-gam/images/mole.png")';
        this.style.pointerEvents = 'all';
    }, 1000);
    scoreboard.textContent = score;
}

function gameInit(){
    if (musicon) {bgtheme.play()};
    opacityToggle(welcomeScreen,overlay,gameboard,credit);
    displayToggle(gameboard);
    startButton.classList.add('hideit');
    if (timesplayed > 0) {
        opacityToggle(gamemode,scoreboard);
        displayToggle(gamemode,scoreboard)}
    scoreboard.textContent = 0;
    countdownBoard.textContent = 'Wait For It!!';
    timeUp = false;
    score = 0;
}

function countingDown() {
    let countdown = timeLimit/1000;
    let tick = setInterval(() => {
        countdownBoard.textContent = countdown;
        countdown--;
        if (countdown < 0) {
            clearInterval(tick);
            gameOver()};
    }, 1000);
}
function gameOver() {
    timeUp = true;
    countdownBoard.textContent = 'Game Over!!';
    opacityToggle(welcomeScreen,overlay,gameboard,scoreboard,gamemode,credit);
    displayToggle(gameboard,scoreboard,gamemode);
}

startButton.addEventListener('click', startGame);
musicButton.addEventListener('click', musicToggle);
soundButton.addEventListener('click', soundToggle);
replayButton.addEventListener('click', startGame);
partyButton.addEventListener('click', berzerkToggle);

window.addEventListener('mousemove', cursor);
moles.forEach(mole => mole.addEventListener('click',whack));