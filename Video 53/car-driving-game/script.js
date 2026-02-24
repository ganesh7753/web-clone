const road = document.querySelector('.road');
const scoreDisplay = document.querySelector('.score');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
let carPosition = 50; // Percentage of the road width
let score = 0;
let obstacleSpeed = 3;
let obstacleCreationInterval;
let obstacles = [];
let gameOver = false; // Flag to check if the game is over

// Create the car element
const car = document.createElement('div');
car.classList.add('car');
road.appendChild(car);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

document.addEventListener('keydown', (e) => {
    if (gameOver) return; // Prevent car movement if the game is over
    const roadWidth = road.clientWidth;
    const carWidth = car.clientWidth;

    if (e.key === 'ArrowLeft' && carPosition > 0) {
        carPosition -= 10;
        if (carPosition < 0) carPosition = 0; // Prevent moving beyond the left boundary
    } else if (e.key === 'ArrowRight' && carPosition < 100 - (carWidth / roadWidth) * 100) {
        carPosition += 10;
        if (carPosition > 100 - (carWidth / roadWidth) * 100) {
            carPosition = 100 - (carWidth / roadWidth) * 100; // Prevent moving beyond the right boundary
        }
    }
    car.style.left = carPosition + '%';
});
function startGame() {
    gameOver = false; // Reset game over flag
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';

    road.innerHTML = ''; // Clear any existing obstacles

    // Re-add the car to the road and reset its position and state
    road.appendChild(car);
    car.style.left = '50%'; // Reset car position
    carPosition = 50; // Reset car position variable
    car.classList.remove('crash'); // Remove crash effect to restore the car

    obstacles = []; // Reset obstacles array
    obstacleCreationInterval = setInterval(createObstacle, 2000); // Create new obstacles every 2 seconds
    gameLoop(); // Start the game loop
}

function restartGame() {
    clearInterval(obstacleCreationInterval); // Stop the obstacle creation
    startGame(); // Restart the game
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.random() * (road.clientWidth - 50) + 'px'; 
    obstacle.style.top = '-100px'; 
    road.appendChild(obstacle);
    obstacles.push(obstacle); 
}

function gameLoop() {
    if (gameOver) return; 

    obstacles.forEach((obstacle, index) => {
        let obstacleTop = parseInt(obstacle.style.top);
        obstacleTop += obstacleSpeed;

       
        if (obstacleTop > road.clientHeight) {
            obstacle.remove();
            obstacles.splice(index, 1); 
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        } else if (isCollision(obstacle)) {
            endGame(); 
        } else {
            obstacle.style.top = obstacleTop + 'px';
        }
    });

    requestAnimationFrame(gameLoop); 
}

function isCollision(obstacle) {
    const carRect = car.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return !(
        carRect.right < obstacleRect.left ||
        carRect.left > obstacleRect.right ||
        carRect.bottom < obstacleRect.top ||
        carRect.top > obstacleRect.bottom
    );
}
function endGame() {
    clearInterval(obstacleCreationInterval); 
    gameOver = true; 

   
    car.classList.add('crash');

    
    setTimeout(() => {
        alert(`Game Over! Score: ${score}`);
        restartBtn.style.display = 'block'; 
    }, 500); 
}


document.addEventListener('touchstart', (e) => {
    if (gameOver) return;

    const touchX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;
    const roadWidth = road.clientWidth;
    const carWidth = car.clientWidth;

    if (touchX < screenWidth / 2 && carPosition > 0) {
        // Left side tap
        carPosition -= 10;
        if (carPosition < 0) carPosition = 0;
    } else if (touchX >= screenWidth / 2 && carPosition < 100 - (carWidth / roadWidth) * 100) {
        // Right side tap
        carPosition += 10;
        if (carPosition > 100 - (carWidth / roadWidth) * 100) {
            carPosition = 100 - (carWidth / roadWidth) * 100;
        }
    }

    car.style.left = carPosition + '%';
});
