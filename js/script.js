// Seleção dos elementos HTML
const playButton = document.getElementById('play-btn');
const pauseButton = document.getElementById('pause-btn');
const stopButton = document.getElementById('stop-btn');
const repeatButton = document.getElementById('repeat-btn');
const shuffleButton = document.getElementById('shuffle-btn');
const audioPlayer = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');
const musicTitle = document.getElementById('music-title');
const playlistItems = document.querySelectorAll('#playlist li');

// Variável para verificar o status da reprodução
let isPlaying = false;
let isRepeating = false;
let isShuffling = false;

// Variável de controle para playlist e índice atual
let currentIndex = 0;

// Reproduzir música selecionada na playlist
playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        playlistItems.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        audioPlayer.src = item.getAttribute('data-src');
        musicTitle.textContent = `Tocando: ${item.textContent}`;
        audioPlayer.play();
        currentIndex = index;
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

// Ativar/Desativar repetição
repeatButton.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatButton.classList.toggle('btn-primary', isRepeating);
    repeatButton.classList.toggle('btn-outline-primary', !isRepeating);
});

// Ativar/Desativar reprodução aleatória
shuffleButton.addEventListener('click', () => {
    isShuffling = !isShuffling;
    shuffleButton.classList.toggle('btn-secondary', isShuffling);
    shuffleButton.classList.toggle('btn-outline-secondary', !isShuffling);
});

// Reproduzir a próxima música ao terminar a atual
audioPlayer.addEventListener('ended', () => {
    if (isRepeating) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNextSong();
    }
});

// Reproduzir a próxima música, considerando modo aleatório
function playNextSong() {
    if (isShuffling) {
        currentIndex = Math.floor(Math.random() * playlistItems.length);
    } else {
        currentIndex = (currentIndex + 1) % playlistItems.length;
    }
    const nextSong = playlistItems[currentIndex];
    playlistItems.forEach(el => el.classList.remove('active'));
    nextSong.classList.add('active');
    audioPlayer.src = nextSong.getAttribute('data-src');
    musicTitle.textContent = `Tocando: ${nextSong.textContent}`;
    audioPlayer.play();
    isPlaying = true;
}

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
