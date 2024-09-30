const obstacle = document.getElementById('obstacle');
let gameArea = document.querySelector('.game-area');
const gameOverMessage = document.getElementById('gameOverMessage');
const gameWonMessage = document.getElementById('gameWonMessage');
const player = document.getElementById('player');
const obstacle1 = document.getElementById('obstacle1');
const obstacle2 = document.getElementById('obstacle2');
const obstacle3 = document.getElementById('obstacle3');
const obstacleTop = document.getElementById('obstacleTop');
const obstacleBottom = document.getElementById('obstacleBottom');

const obstacleTop2 = document.getElementById('obstacleTop2');
const obstacleBottom2 = document.getElementById('obstacleBottom2');
const restartButton = document.getElementById('restartButton');


document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        jump();
    } else if (event.code === 'ArrowRight') {
        moveRight();
    } else if (event.code === 'ArrowLeft') {
        moveLeft();
    }
});

// Suporte para toque em dispositivos móveis
document.addEventListener('touchstart', function(event) {
    // Verifica a posição do toque para determinar a ação
    const touchX = event.touches[0].clientX;

    if (touchX < window.innerWidth / 2) {
        moveLeft(); // Tocar no lado esquerdo da tela move o jogador para a esquerda
    } else {
        moveRight(); // Tocar no lado direito da tela move o jogador para a direita
    }
});

gameArea.addEventListener('touchstart', function() {
    jump(); // Tocar na tela faz o jogador pular
});






document.getElementById('leftButton').addEventListener('click', moveLeft);
document.getElementById('rightButton').addEventListener('click', moveRight);
document.getElementById('jumpButton').addEventListener('click', jump);


let isJumping = false;
let playerPositionLeft = 50;
let gameWidth = window.innerWidth;
let playerWidth = 50;
let currentPhase = 1;
let maxPhases = 4; // Adiciona a quarta fase
let obstacles = [obstacle1];

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        jump();
    } else if (event.code === 'ArrowRight') {
        moveRight();
    } else if (event.code === 'ArrowLeft') {
        moveLeft();
    }
});

function jump() {
    if (!isJumping) {
        isJumping = true;
        let jumpHeight = 0;
        let upInterval = setInterval(() => {
            if (jumpHeight >= 150) {
                clearInterval(upInterval);
                let downInterval = setInterval(() => {
                    if (jumpHeight <= 0) {
                        clearInterval(downInterval);
                        isJumping = false;
                    } else {
                        jumpHeight -= 10;
                        player.style.bottom = jumpHeight + 'px';
                    }
                }, 20);
            } else {
                jumpHeight += 10;
                player.style.bottom = jumpHeight + 'px';
            }
        }, 20);
    }
}

function moveRight() {
    if (playerPositionLeft + playerWidth < gameWidth) {
        playerPositionLeft += 10;
        player.style.left = playerPositionLeft + 'px';
    }
    checkPhaseProgress();
}

function moveLeft() {
    if (playerPositionLeft > 0) {
        playerPositionLeft -= 10;
        player.style.left = playerPositionLeft + 'px';
    }
}

function checkPhaseProgress() {
    if (playerPositionLeft + playerWidth >= gameWidth && currentPhase < maxPhases) {
        advanceToNextPhase();
    } else if (playerPositionLeft + playerWidth >= gameWidth && currentPhase === maxPhases) {
        showGameWonMessage();
    }
}

//function advanceToNextPhase() {
    //currentPhase++;
    //playerPositionLeft = 50;
    //player.style.left = playerPositionLeft + 'px';

    //if (currentPhase === 2) {
        //obstacle1.style.display = 'none';
        //obstacle2.style.display = 'block';
        //obstacles = [obstacle2];
    //} else if (currentPhase === 3) {
        //obstacle2.style.display = 'none';
        //obstacle3.style.display = 'block';
        //obstacles = [obstacle3];
    //} else if (currentPhase === 4) {
        //obstacle3.style.display = 'none';
        //obstacleTop.style.display = 'block';
        //obstacleBottom.style.display = 'block';
        //obstacles = [obstacleTop, obstacleBottom]; // Obstáculos de cima e de baixo
    //}
//}

// Quando chegar na quarta fase, exiba os novos obstáculos
function advanceToNextPhase() {
    currentPhase++;
    playerPositionLeft = 50;
    player.style.left = playerPositionLeft + 'px';

    if (currentPhase === 2) {
        obstacle1.style.display = 'none';
        obstacle2.style.display = 'block';
        obstacles = [obstacle2];
    } else if (currentPhase === 3) {
        obstacle2.style.display = 'none';
        obstacle3.style.display = 'block';
        obstacles = [obstacle3];
    } else if (currentPhase === 4) {
        obstacle3.style.display = 'none';
        obstacleTop.style.display = 'block';
        obstacleBottom.style.display = 'block';
        obstacleTop2.style.display = 'block'; // Exibe o novo obstáculo
        obstacleBottom2.style.display = 'block'; // Exibe o novo obstáculo
        // Adiciona todos os obstáculos da fase 4 ao array
        obstacles = [obstacleTop, obstacleBottom, obstacleTop2, obstacleBottom2];
    }
}

let checkCollision = setInterval(() => {
    let playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue('bottom'));
    let playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    let playerRight = playerLeft + playerWidth; // Borda direita do jogador
    let playerTop = playerBottom + 50; // Altura do jogador (50px)

    obstacles.forEach(obstacle => {
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
        let obstacleWidth = parseInt(window.getComputedStyle(obstacle).getPropertyValue('width'));
        let obstacleRight = obstacleLeft + obstacleWidth;

        if (obstacle.classList.contains('from-bottom') || obstacle.classList.contains('from-top')) {
            let obstacleBottom = parseInt(window.getComputedStyle(obstacle).getPropertyValue('bottom'));
            let obstacleTop = obstacleBottom + parseInt(window.getComputedStyle(obstacle).getPropertyValue('height'));

            if (playerRight >= obstacleLeft && playerLeft <= obstacleRight) { // Colisão horizontal
                if (playerBottom <= obstacleTop && playerTop >= obstacleBottom) { // Colisão vertical
                    triggerGameOver(obstacle, playerLeft, playerBottom, playerRight, playerTop);
                }
            }
        } else {
            if (playerRight >= obstacleLeft && playerLeft <= obstacleRight && playerBottom <= 50) {
                triggerGameOver(obstacle, playerLeft, playerBottom, playerRight, playerTop);
            }
        }
    });
}, 10);

function triggerGameOver(obstacle, playerLeft, playerBottom, playerRight, playerTop) {
    const obstacleRect = obstacle.getBoundingClientRect();
    const gameAreaRect = document.querySelector('.game-area').getBoundingClientRect();

    // Cálculo da posição da colisão (centro do jogador e obstáculo)
    const collisionX = (Math.max(playerLeft, obstacleRect.left) + Math.min(playerRight, obstacleRect.right)) / 3;
    const collisionY = (Math.max(playerBottom, obstacleRect.bottom) + Math.min(playerTop, obstacleRect.top)) / 3;

    // Convertendo as coordenadas relativas à game area
    const explosionX = collisionX - gameAreaRect.left;
    const explosionY = gameAreaRect.bottom - collisionY;

    createExplosion(explosionX, explosionY);
    player.style.display = 'none';
    obstacle.style.display = 'none';
    obstacle.style.animation = 'none';
    showGameOverMessage();
    clearInterval(checkCollision);
}





function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.classList.add('explode');
    explosion.style.left = x + '30px';
    explosion.style.top = y + '30px';
    gameArea.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 1000);
}

function showGameOverMessage() {
    gameOverMessage.style.display = 'block';
    showRestartButton();
}

function showGameWonMessage() {
    gameWonMessage.style.display = 'block';
    showRestartButton();
    launchConfetti();
}

function launchConfetti() {
    let duration = 5 * 1000;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    let interval = setInterval(() => {
        let timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
        }

        let particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// Função para mostrar o botão de reiniciar
function showRestartButton() {
    restartButton.style.display = 'block';
}

// Evento de clique para reiniciar o jogo
restartButton.addEventListener('click', function() {
    window.location.reload();
});
