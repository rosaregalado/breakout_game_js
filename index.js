const canvas = document.getElementById('myCanvas');
// create variable to store the 2D rendering context -- tool to paint on canvas
const ctx = canvas.getContext('2d');
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
// define paddle to hit the ball
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
// control the paddle
let rightPressed = false;
let leftPressed = false;
// brick variables
const brickRowCount = 4;
const brickColumnCount = 10;
const brickWidth = 35;
const brickHeight = 20;
const brickPadding = 7;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// keep track of score:
let score = 0;
let lives = 3;

// paint each brick on the screen
const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    if (c % 2 === 0) {
      bricks[c][r] = {
        x: 0, y: 0, status: 1, color: 'red',
      };
    } else {
      bricks[c][r] = {
        x: 0, y: 0, status: 1, color: 'green',
      };
    }
  }
}
//-----------------------------------------------------------------
// event listeners

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  // make the paddle follow the position of the mouse cursor
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
// ---------------------------------------------------------------------------
// functions

// detect brick collisions
function collisionDetection() {
  // loop through brick rows & columns
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      // track & update the brick status
      if (b.status === 1) {
        // make sure the center of the ball is inside the coordinates of one of our bricks
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            alert('You win, Congratulations!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Score:  ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Lives: + ${lives}`, canvas.width - 65, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
}

function drawBackground() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  // loop through brick rows & columns to set (x, y) position of each brick
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      // check the value of each brick's status
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        // draw bricks
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // bounce off the walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  // create collision between ball and paddle
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    // if ball misses paddle, remove lives until game over
    } else {
      lives -= 1;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
        requestAnimationFrame(draw);
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // move the paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

// draw() function will be executed over and over within a requestAnimationFrame() loop
draw();
