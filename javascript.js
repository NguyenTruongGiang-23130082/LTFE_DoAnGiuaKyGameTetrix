document.addEventListener('DOMContentLoaded', () => {
    const startOverlay = document.getElementById('startOverlay');
    const levelOverlay = document.getElementById('levelOverlay');
    const btnStartGame = document.getElementById('btnStartGame');
    const btnBackToStart = document.getElementById('btnBackToStart');
    const btnLevels = document.querySelectorAll('.btn-level');
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
            levelOverlay.style.display = 'none';
            const selectedLevel = button.innerText;
            console.log("Game bắt đầu ở Cấp độ: " + selectedLevel);
        });
    });
});