const audio = document.getElementById("audio_player");
const playBtn = document.getElementById("player_play_btn");
const progressSlider = document.getElementById("player_progress");
const volumeSlider = document.getElementById("player_volume");

const artistEl = document.getElementById("player_artist");
const trackEl = document.getElementById("player_track");
const timeCurrent = document.getElementById("player_time_current");
const timeTotal = document.getElementById("player_time_total");

// Formata tempo em mm:ss
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// Atualiza o fundo dos sliders (preenchido branco / vazio preto)
function updateSliderFill(slider) {
    const max = slider.max || 1;
    const val = slider.value || 0;
    const pct = (val / max) * 100;
    slider.style.background = `linear-gradient(to right, white ${pct}%, black ${pct}%)`;
}

// Quando metadados estão prontos
audio.addEventListener("loadedmetadata", () => {
    progressSlider.max = Math.floor(audio.duration);
    timeTotal.textContent = formatTime(audio.duration);
    timeCurrent.textContent = "0:00";

    // Extrair artista e título do nome do ficheiro
    const fileName = decodeURIComponent(audio.src.split("/").pop()).replace(".mp3","");
    if (fileName.includes(" - ")) {
        const [artist, track] = fileName.split(" - ");
        artistEl.textContent = artist.trim();
        trackEl.textContent = track.trim();
    } else {
        artistEl.textContent = fileName;
        trackEl.textContent = "";
    }

    updateSliderFill(progressSlider);
    updateSliderFill(volumeSlider);
});

// Atualização do tempo
audio.addEventListener("timeupdate", () => {
    progressSlider.value = Math.floor(audio.currentTime);
    timeCurrent.textContent = formatTime(audio.currentTime);
    updateSliderFill(progressSlider);
});

// Play/Pause com botão triangular
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playBtn.style.borderLeftColor = "white"; // mantém visual
    } else {
        audio.pause();
        playBtn.style.borderLeftColor = "gray"; // indica pause
    }
});

// Slider de progresso
progressSlider.addEventListener("input", () => {
    audio.currentTime = progressSlider.value;
    updateSliderFill(progressSlider);
});

// Slider de volume
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
    updateSliderFill(volumeSlider);
});

// Inicializa slider de volume
updateSliderFill(volumeSlider);
updateSliderFill(progressSlider);
