document.addEventListener('DOMContentLoaded', () => {
    const startOverlay = document.getElementById('startOverlay');
    const levelOverlay = document.getElementById('levelOverlay');
    const btnStartGame = document.getElementById('btnStartGame');
    const btnBackToStart = document.getElementById('btnBackToStart');
    const btnLevels = document.querySelectorAll('.btn-level');
    const playArea = document.getElementById('playArea');
    const scoreElement = document.querySelector('.score');
    const btnRestart = document.querySelector('.btn-red');
    const btnPause = document.querySelector('.btn-dark');
    const width = 15;
    const height = 20;
    let squares = [];
    let timerId;
    let score = 0;
    let currentPosition = 4;
    let currentRotation = 0;
    let isGameOver = false;
    let isPaused = false;
    let currentSpeed = 800;
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];
    const zTetromino = [
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ];
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    const colors = ['#e67e22', '#e74c3c', '#9b59b6', '#f1c40f', '#00ffd5'];
    let random = 0;
    let current = [];
    function draw() {
        current.forEach(index => {
            if(squares[currentPosition + index]) {
                squares[currentPosition + index].classList.add('tetromino');
                squares[currentPosition + index].style.backgroundColor = colors[random];
            }
        });
    }
    function undraw() {
        current.forEach(index => {
            if(squares[currentPosition + index]) {
                squares[currentPosition + index].classList.remove('tetromino');
                squares[currentPosition + index].style.backgroundColor = '';
            }
        });
    }
    function control(e) {
        if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
        if (isPaused || isGameOver) return;
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keydown', control);
    function moveDown() {
        if(isPaused || isGameOver) return;
        undraw();
        if(!current.some(index => {
            const nextPos = currentPosition + index + width;
            return nextPos >= width * height || (squares[nextPos] && squares[nextPos].classList.contains('taken'));
        })) {
            currentPosition += width;
        } else {
            draw(); 
            freeze();
            return;
        }
        draw();
    }
    function freeze() {
        current.forEach(index => {
            if(squares[currentPosition + index]) {
                squares[currentPosition + index].classList.add('taken');
            }
        });
        addScore();
        random = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        gameOver();
        if(!isGameOver) {
            draw();
        }
    }
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if(!isAtLeftEdge) currentPosition -= 1;
        if(current.some(index => squares[currentPosition + index] && squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if(!isAtRightEdge) currentPosition += 1;
        if(current.some(index => squares[currentPosition + index] && squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }
    function rotate() {
        undraw();
        let nextRotation = currentRotation + 1;
        if(nextRotation === current.length) nextRotation = 0;
        const nextTetromino = theTetrominoes[random][nextRotation];
        const isAtRightEdge = nextTetromino.some(index => (currentPosition + index) % width === width - 1);
        const isAtLeftEdge = nextTetromino.some(index => (currentPosition + index) % width === 0);
        if(!(isAtLeftEdge && isAtRightEdge) && !nextTetromino.some(index => squares[currentPosition + index] && squares[currentPosition + index].classList.contains('taken'))) {
            currentRotation = nextRotation;
            current = nextTetromino;
        }
        draw();
    }
    function addScore() {
        for (let i = 0; i < width * height; i += width) {
            const row = [];
            for (let j = 0; j < width; j++) {
                row.push(i + j);
            }
            if(row.every(index => squares[index] && squares[index].classList.contains('taken'))) {
                score += 10;
                scoreElement.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => playArea.appendChild(cell));
            }
        }
    }
    function gameOver() {
        if(current.some(index => squares[currentPosition + index] && squares[currentPosition + index].classList.contains('taken'))) {
            scoreElement.innerHTML = score + ' - HẾT';
            clearInterval(timerId);
            isGameOver = true;
        }
    }
    function startGame(level) {
        playArea.innerHTML = '';
        squares = Array.from({length: width * height}, () => {
            const div = document.createElement('div');
            playArea.appendChild(div);
            return div;
        });
        score = 0;
        scoreElement.innerHTML = score;
        isGameOver = false;
        isPaused = false;
        btnPause.innerText = "Tạm Dừng";
        clearInterval(timerId);
        currentSpeed = 800;
        currentPosition = 4;
        currentRotation = 0;
        random = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        draw();
        timerId = setInterval(moveDown, currentSpeed);
    }
    btnStartGame.addEventListener('click', () => {
        startOverlay.style.display = 'none';
        levelOverlay.style.display = 'flex';
    });
    btnBackToStart.addEventListener('click', () => {
        levelOverlay.style.display = 'none';
        startOverlay.style.display = 'flex';
    });
    btnLevels.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLevel = parseInt(button.innerText);
            if (selectedLevel === 1) {
                levelOverlay.style.display = 'none';
                startGame(selectedLevel);
            } else {
                alert("Bạn yêu cầu làm Level 1 nên game hiện tại chỉ hoạt động ở Level 1 nhé!");
            }
        });
    });
    btnPause.addEventListener('click', () => {
        if(!isGameOver && startOverlay.style.display === 'none' && levelOverlay.style.display === 'none') {
            if(isPaused) {
                isPaused = false;
                timerId = setInterval(moveDown, currentSpeed);
                btnPause.innerText = "Tạm Dừng";
            } else {
                isPaused = true;
                clearInterval(timerId);
                btnPause.innerText = "Tiếp Tục";
            }
        }
    });
    btnRestart.addEventListener('click', () => {
        startOverlay.style.display = 'flex';
        levelOverlay.style.display = 'none';
        clearInterval(timerId);
        playArea.innerHTML = '';
        scoreElement.innerHTML = '0';
    });
});