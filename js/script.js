// Seleção dos elementos HTML
const playButton = document.getElementById('play-btn');
const pauseButton = document.getElementById('pause-btn');
const stopButton = document.getElementById('stop-btn');
const audioPlayer = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');
const musicTitle = document.getElementById('music-title');
const playlistItems = document.querySelectorAll('#playlist li');

// Variável para verificar o status da reprodução
let isPlaying = false;

// Reproduzir música selecionada na playlist
playlistItems.forEach(item => {
    item.addEventListener('click', () => {
        playlistItems.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        audioPlayer.src = item.getAttribute('data-src');
        musicTitle.textContent = `Tocando: ${item.textContent}`;
        audioPlayer.play();
        isPlaying = true;
    });
});

// Evento para reproduzir a música
playButton.addEventListener('click', () => {
    if (!isPlaying) {
        audioPlayer.play();
        isPlaying = true;
        musicTitle.textContent = `Tocando: ${document.querySelector('#playlist li.active').textContent}`;
    }
});

// Evento para pausar a música
pauseButton.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        musicTitle.textContent = 'Pausado';
    }
});

// Evento para parar a música
stopButton.addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    progressBar.style.width = '0%';
    musicTitle.textContent = 'Parado';
});

// Atualizar barra de progresso em tempo real
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

// Permitir que a barra de progresso seja interativa
progressBar.parentElement.addEventListener('click', (e) => {
    const clickX = e.offsetX;
    const totalWidth = progressBar.parentElement.clientWidth;
    const clickPosition = (clickX / totalWidth) * audioPlayer.duration;
    audioPlayer.currentTime = clickPosition;
});
