# Snake Game
### Description:
### What is my final project?:

> My final project is a snake game.\
We can press the arrow key or W A S D key to control the snake (the white one) to eat the food (the yellow one).\
The green food is worth 20 points and the purple one is rotten food, it will decrease the points and shorten the snake.
The higher the score, the faster our snake will run.
We can pause the game by pressing the spacebar or clicking the pause button, and the button will be a timer.
We can resume the game by pressing the spacebar again.
If the snake hits the wall or its body, the game is over.
We can click the restart button to start the game again.

### Explanation of my project:

> I made this game using HTML, CSS and JavaScript.\
In the beginning, I used the canvas tag in HTML file to set the field. Then I used `document.getElmentById` in JS to organize HTML document as an object. The page is decorated by CSS file.\
In order to make the snake to move and place the food randomly, I wrote the `draw` function to draw the snake and food on the canvas, and I used the `setTimeout` function to call the `draw` function repeatedly (line 118, snake.js). As a result, the screen will have the appearance that the snake is in motion.\
I created two objects `Food` and `Snake`, the `Food` object contains four methods `.placeFood`, `.placePremiumFood`, `.placePoison`, and `.checkPosition`.
- `.placeFood`: To place the food on the canvas randomly.
- `.placePremiumFood` and `.placePoison`: To place the premium food and rotten food on the canvas randomly.
- `.checkPosition`: To check the snake touches (eats) the food or not.

> `Snake` object would record the scores, and it contains two methods `.changeDirection` and `.direction`.
- `.changeDirection`: To check what key down event is, and change the direction of the snake's movement.
- `.direction`: To keep the snake moving (draw the same direction on the canvas, line 77, snake.js).

> The `isGameOver` function to check if the snake's head has touched its body or the canvas border. If it does, the function return and the program stops drawing, which means game over.\
The `clickPause` function will stop drawing on the canvas. The `resetGame` function will reload the page.

### The problems I met:

1. Why does `getElementById` not work?\
I put the `<script>` tag above the `<body>` tag, which my JS file cannot access the HTML tag because the program would run from the top to bottom (the script runs before the DOM has been loaded). Then I put the `<script>` tag just above the close tag of body (`</body>`).
2. How to make the snake move?\
I use `array` to store the position of the snake and use `unshift()` and `pop()` functions to make the snake move (line 78, snake.js). 
3. `setTimout` or `setInterval`?\
In order to make the snake move, I need to draw the canvas repeatedly. In the beginning, I used the `setInterval` function and the program works well, but when I want to make the snake move faster during the game. I found out that `setInterval` cannot do it and my program cannot work well. Therefor I used the `setTimeout` function.
4. How to check array in an array?\
I could iterate the array of arrays with `Array#some` and then check every item of the inner array with the single array with `Array#every` (line 171, snake.js).
5. `keydown` or `keyup`?\
I first used `keyup` and found that the reaction of the snake was a little slow when I used `keyup`. After that I used `keydown` and the the snake can react immediately.
6. How to let the program know which key the user presses?\
(line 187, snake.js)
7. When I use class method in JavaScript, the value of `this.` is undefined.\
In order to make the snake change direction, I wrote this line `document.addEventListener('keydown', snake.changeDirection);`, but it did not work.\
Then I used the `print` function to find out where went wrong.
When I pressed the up arrow key, the console of the page just printed undefined undefined.\
After that, I realized that maybe there is some specification in JavaScript that I don't know. I tried to find the answer in stackoverflow.\
The answer is that **the `value` of `this` inside the event listener callback will be the HTML element on which the event was triggered**. Therefor I got undefined undefined.\
One of the solution is to use **`.bind` to explicitly bind `this` to a specific value**.
```
// problem
document.addEventListener('keydown', snake.changeDirection);

class Snake:
...
changeDirection(event) {
    if (event.code === 'ArrowUp') {
        console.log(this.velocityX, this.velocityY);
        // >> undefined undefined
    }
}

//solution
document.body.addEventListener('keydown', snake.changeDirection.bind(snake));
```

### App Preview
<table width="100%"> 
<tr>
<td width="50%">      
    &nbsp; 
    <br>
    <p align="center">Game Start</p>
    <img src="">
    </td> 
<td width="50%">
    <br>
    <p align="center">End</p>
    <img src="">  
</td>
</table>