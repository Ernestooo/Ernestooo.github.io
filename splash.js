// Seleciona elementos
const splash = document.getElementById("splash");
const mainContent = document.getElementById("mainContent");
const splashImage = document.getElementById("splashImage");

// Caminho da segunda imagem
const secondImage = "images/splash2.png";

splashImage.addEventListener("click", () => {
    // Troca de imagem
    splashImage.src = secondImage;

    // Pequena animação de zoom
    splashImage.style.transform = "scale(1.2)";

    // Espera 0.5s e faz fade out da splash
    setTimeout(() => {
        splash.style.opacity = 0;
        splash.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            splash.style.display = "none";
            mainContent.style.display = "block";
        }, 500);
    }, 500);
});
