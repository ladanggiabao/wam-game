const holes = document.querySelectorAll('.hole');
const scoreboard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const countdownBoard = document.querySelector('.countdown');
const startButton = document.querySelector('.startButton');

let lastHole;
let timeUp = false;
let timeLimit = 30000;
let score = 0;
let countdown;

function pickRandomHole(holes) {
    const randomHole = Math.floor(Math.random()*holes.length);
    const hole = holes[randomHole];
    if (hole === lastHole) {
        return pickRandomHole(holes);
    }
    lastHole = hole;
    return hole;
}
function popOut(){
    const time = Math.random() * 1300 + 400;
    const hole = pickRandomHole(holes);
    hole.classList.add('up');
    setTimeout(function(){
        hole.classList.remove('up');
        if (!timeUp) popOut();
    }, time);
}

function startGame(){
    startButton.classList.add('hideit');
    countdown = timeLimit/1000;
    scoreboard.textContent = 0;
    scoreboard.style.display = 'block';
    countdownBoard.textContent = countdown;
    timeUp = false;
    score = 0;
    popOut();
    setTimeout(function(){
        timeUp = true;
    }, timeLimit);

    let startCountdown = setInterval(function(){
        countdown -= 1;
        countdownBoard.textContent = countdown;
        if (countdown < 0) {
            clearInterval(startCountdown);
            startButton.classList.remove('hideit');
            countdownBoard.textContent = 'Game Over!!'
            countdown = 0;
        }
    }, 1000)
}
startButton.addEventListener('click',startGame);

function whack() {
    score++;
    this.style.backgroundImage = 'url("image/yoda2.png")';
    this.style.pointerEvents = 'none';
    setTimeout(() => {
        this.style.backgroundImage = 'url("image/yoda1.png")';
        this.style.pointerEvents = 'all';
    }, 800);
    scoreboard.textContent = score;
}
moles.forEach(mole => mole.addEventListener('click',whack));
