// Seleção dos elementos HTML
const playButton = document.getElementById('play-btn');
const pauseButton = document.getElementById('pause-btn');
const stopButton = document.getElementById('stop-btn');
const repeatButton = document.getElementById('repeat-btn');
const shuffleButton = document.getElementById('shuffle-btn');
const themeToggleButton = document.getElementById('theme-toggle-btn');
const previousButton = document.getElementById('previous-btn');
const nextButton = document.getElementById('next-btn');
const audioPlayer = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');
const musicTitle = document.getElementById('music-title');
const playlistItems = document.querySelectorAll('#playlist li');
const musicImage = document.getElementById('music-image');

// Variáveis de controle
let isPlaying = false;
let isRepeating = false;
let isShuffling = false;
let currentIndex = 0; // Índice atual da playlist

// Função para selecionar e tocar uma música
function selectSong(index) {
    playlistItems.forEach(el => el.classList.remove('active'));
    playlistItems[index].classList.add('active');
    audioPlayer.src = playlistItems[index].getAttribute('data-src');
    musicTitle.textContent = ` ${playlistItems[index].textContent}`;
    musicImage.src = playlistItems[index].getAttribute('data-img'); // Atualiza a imagem da música
    audioPlayer.play();
    currentIndex = index;
    isPlaying = true;
}

// Evento para carregar a imagem e detalhes iniciais ao carregar a página
window.addEventListener('load', () => {
    // Definir a primeira música como ativa e carregar sua imagem
    const firstSong = playlistItems[0];
    musicImage.src = firstSong.getAttribute('data-img'); // Carregar a imagem inicial
    musicTitle.textContent = ` ${firstSong.textContent}`; // Definir o título da primeira música
    audioPlayer.src = firstSong.getAttribute('data-src'); // Definir a fonte do áudio
    firstSong.classList.add('active'); // Marcar a primeira música como ativa
});

// Reproduzir música selecionada na playlist
playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        selectSong(index);
    });
});

// Evento para reproduzir a música
playButton.addEventListener('click', () => {
    if (!isPlaying) {
        audioPlayer.play();
        isPlaying = true;
        musicTitle.textContent = `${document.querySelector('#playlist li.active').textContent}`;
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

// Função para reproduzir a próxima música
function nextSong() {
    if (isShuffling) {
        currentIndex = Math.floor(Math.random() * playlistItems.length);
    } else {
        currentIndex = (currentIndex + 1) % playlistItems.length;
    }
    selectSong(currentIndex);
}

// Função para reproduzir a música anterior
function previousSong() {
    if (isShuffling) {
        currentIndex = Math.floor(Math.random() * playlistItems.length);
    } else {
        currentIndex = (currentIndex - 1 + playlistItems.length) % playlistItems.length;
    }
    selectSong(currentIndex);
}

// Eventos para os botões de anterior e próxima
previousButton.addEventListener('click', previousSong);
nextButton.addEventListener('click', nextSong);

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
        nextSong();
    }
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

// Alternar entre tema claro e escuro e alterar o fundo
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.querySelector('.player-card').classList.toggle('dark-theme');
    document.querySelector('.card-header').classList.toggle('dark-theme');
    document.querySelector('canvas').classList.toggle('dark-theme');
});

// Configuração para a visualização de áudio
const canvas = document.getElementById('audio-visualizer');
const canvasContext = canvas.getContext('2d');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioContext.destination);

// Configuração do analisador
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Função para desenhar visualização com barras verticais
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        canvasContext.fillStyle = `rgb(186, 3, 210)`; // Cor das barras
        canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}

// Iniciar visualização quando o áudio for reproduzido
audioPlayer.addEventListener('play', () => {
    audioContext.resume().then(() => {
        drawVisualizer();
    });
});
