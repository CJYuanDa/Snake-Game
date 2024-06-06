// The script runs before the DOM has been loaded.
// To fix this you can place your code in the window.onload function.
// or put your script at the bottom of the body, so it will execute at the end.
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const pauseEl = document.getElementById('pause');
const resetEl = document.getElementById('reset');
const playEl = document.getElementById('play-descript');
let pause = false;
let pauseTrack = 0; // avoid repeated execute the timer function.

// canvas: 500 500
const blockSize = 20, columns = 25, rows = 25;
let snakeSpeed = 10;
let score = 0;

function setScore() {
    scoreEl.innerHTML = `${score}`;
}

function clickPause() {
    if (pause == true) {
        pause = false;
    } else if (pause == false && snake.len !== 3) {
        pause = true;
    }
}

function timer(time = 60) {
    if (time == 0) {
        pause = false;
        pauseEl.innerHTML = 'PAUSE';
        pauseTrack = 0;
        return;
    }
    if (pause == false) {
        pauseEl.innerHTML = 'PAUSE';
        pauseTrack = 0;
        return;
    }
    pauseEl.innerHTML = `${time}`;
    time--;
    setTimeout(timer, 1000, time);
}

function resetGame() {
    location.reload();
}

function draw() {
    if (score > 150) snakeSpeed = 16;
    else if (score > 100) snakeSpeed = 14;
    else if (score > 50) snakeSpeed = 12;

    let result = isGameOver();
    if (result) {
        playEl.innerHTML = 'Game Over';
        playEl.style.display = 'block';
        return;
    }

    setScore();

    context.fillStyle = '#1a1a1a';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = food.color;
    context.fillRect(food.x, food.y, blockSize, blockSize);

    context.fillStyle = food.poison;
    context.fillRect(food.poisonX, food.poisonY, blockSize, blockSize);

    // snake moving
    context.fillStyle = '#DCDCDC';
    if (!pause) {
        snake.direction();
        // moving: [12,0], [11, 0], [10, 0] -> [13, 0], [12, 0], [11, 0]
        snake.body.unshift([snake.x, snake.y]);
        if (snake.body.length > snake.len) snake.body.pop();
    } else if (pause && pauseTrack == 0) {
        pauseTrack = 1;
        timer();
    }
    
    // draw the snake
    for (let i = 0; i < snake.body.length; i++) {
        context.fillRect(snake.body[i][0], snake.body[i][1], blockSize, blockSize);
    }

    if (snake.x === food.x && snake.y === food.y) {
        snake.len += food.nutrition;
        score += food.score;
        // change poison status
        if (food.poison) {
            food.poison = undefined;
            food.poisonX = undefined;
            food.poisonY = undefined;
        }
        if (food.rounds % 5 === 0) {
            do {food.placePoison()} while (food.checkPosition(food.poisonX, food.poisonY));
            do {food.placePremiumFood()} while (food.checkPosition(food.x, food.y));
        } else {
            do {food.placeFood()} while (food.checkPosition(food.x, food.y));
        }
    }
    if (snake.x === food.poisonX && snake.y === food.poisonY) {
        // when snake eats poison reduce the length of snake
        snake.body.splice(snake.body.length - 2, 2); 
        snake.len -= 2;
        score -= 20;
        do {food.placeFood()} while (food.checkPosition(food.x, food.y));
        food.poison = undefined;
        food.poisonX = undefined;
        food.poisonY = undefined;
    }

    setTimeout(draw, 1000 / snakeSpeed);
}

function isGameOver() {
    if (snake.velocityX === 0 && snake.velocityY === 0) return false;
    if (snake.x < 0 || snake.y < 0 || snake.x === canvas.width || snake.y === canvas.height) {
        return true;
    };
    for (let i = 3; i < snake.body.length; i++) {
        if (snake.x === snake.body[i][0] && snake.y === snake.body[i][1]) return true;
    }
}

class Food {
    constructor() {
        this.color;
        this.poison;
        this.x;
        this.y;
        this.poisonX;
        this.posionY;
        this.rounds = 0;
        this.nutrition = 1;
        this.score = 10;
    }
    
    placeFood() {
        this.color = '#ffcc66';
        this.x = Math.floor(Math.random() * columns) * blockSize;
        this.y = Math.floor(Math.random() * columns) * blockSize;
        this.rounds += 1;
        this.nutrition = 1;
        this.score = 10;
    }
    
    placePremiumFood() {
        this.color = '#90EE90';
        this.x = Math.floor(Math.random() * columns) * blockSize;
        this.y = Math.floor(Math.random() * rows) * blockSize;
        this.rounds += 1;
        this.nutrition = 2;
        this.score = 20;
    }
    
    placePoison() {
        this.poison = '#9370DB';
        this.poisonX = Math.floor(Math.random() * columns) * blockSize;
        this.poisonY = Math.floor(Math.random() * rows) * blockSize;
    }

    // prevent snake from overlapping the food
    checkPosition(x, y) {
        // check array in an array
        // https://stackoverflow.com/questions/19543514/check-whether-an-array-exists-in-an-array-of-arrays
        let check = [x, y];
        return snake.body.some(s_element => check.every((c_element, index) => c_element == s_element[index]));
    }
}

class Snake {
    constructor() {
        this.x = Math.floor(Math.random() * columns) * blockSize;
        this.y = Math.floor(Math.random() * rows) * blockSize;
        this.body = [[this.x, this.y], [this.x, this.y], [this.x, this.y]]; // snake length
        this.velocityX = 0;
        this.velocityY = 0;
        this.len = 3; // track the length
    }
    
    // https://www.toptal.com/developers/keycode
    changeDirection(event) {
        if ((event.code === 'ArrowUp' || event.code === 'KeyW') && this.velocityY !== 1) {
            playEl.style.display = "none";
            this.velocityX = 0;
            this.velocityY = -1;
        } else if ((event.code === 'ArrowDown' || event.code === 'KeyS') && this.velocityY !== -1) {
            playEl.style.display = "none";
            this.velocityX = 0;
            this.velocityY = 1;
        } else if ((event.code === 'ArrowRight' || event.code === 'KeyD') && this.velocityX !== -1) {
            playEl.style.display = "none";
            this.velocityX = 1;
            this.velocityY = 0;
        } else if ((event.code === 'ArrowLeft' || event.code === 'KeyA') && this.velocityX !== 1) {
            playEl.style.display = "none";
            this.velocityX = -1;
            this.velocityY = 0;
        }
    }
    
    direction() {
        this.x += this.velocityX * blockSize;
        this.y += this.velocityY * blockSize;
    }
}

let food = new Food;
let snake = new Snake;
food.placeFood();

// https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback
// Value of this inside event listener callback will be the HTML element on which the event was triggered.
// Alternate solution to the above comments: save the value of this inside the constructor: myClassThis = this and then use myClassThis wherever you want this inside the class.
document.body.addEventListener('keydown', snake.changeDirection.bind(snake));
document.body.addEventListener('keydown', (event) => event.code === "Space" ? clickPause() : null);
pauseEl.addEventListener('click', clickPause);
resetEl.addEventListener('click', resetGame);
draw();