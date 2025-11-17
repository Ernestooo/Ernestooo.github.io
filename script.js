// ==================================================
// Variáveis globais
// ==================================================
let albumData = []; // dados do Excel
let sortState = {
    artist: 'asc', // 'asc' = crescente, 'desc' = decrescente
    year: 'asc'
};

// ==================================================
// Função para carregar o Excel interno
// ==================================================
async function loadExcel() {
    const response = await fetch('albums.xlsx'); // ficheiro Excel na pasta
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    albumData = json; // guarda globalmente
    renderGrid(albumData); // renderiza a grid
}

// ==================================================
// Renderiza a grid
// ==================================================
function renderGrid(data) {
    const grid = document.getElementById("grid");
    grid.innerHTML = ""; // limpa a grid

    data.forEach(row => {
        const item = document.createElement("div");
        item.className = "grid-item";

        let imgSrc = row[0];
        if (!imgSrc.includes('.')) {
            imgSrc = `${imgSrc}.jpg`;
        }

        item.innerHTML = `
            <img src="images/${imgSrc}">
            <p class="small"><u>${row[1]}</u></p>
            <p class="small"><strong>${row[2]}</strong></p>
            <p class="small">${row[3]}</p>
            <p class="small">${row[4]}</p>
        `;
        grid.appendChild(item);
    });

    // Atualiza o número total de álbuns fora da grid
    const totalDiv = document.getElementById("totalAlbums");
    totalDiv.innerHTML = `<p class="small">${data.length} álbuns</p>`;
}

// ==================================================
// Event listeners dos botões de ordenação
// ==================================================
document.getElementById("sortArtist").addEventListener("click", () => {
    const direction = sortState.artist === 'asc' ? 1 : -1;
    const sorted = [...albumData].sort((a, b) => a[1].localeCompare(b[1]) * direction);
    renderGrid(sorted);

    // alterna estado e atualiza seta
    sortState.artist = sortState.artist === 'asc' ? 'desc' : 'asc';
    document.getElementById("sortArtist").textContent = `Ordenar por Artista ${sortState.artist === 'asc' ? '▲' : '▼'}`;
});

document.getElementById("sortYear").addEventListener("click", () => {
    const direction = sortState.year === 'asc' ? 1 : -1;
    const sorted = [...albumData].sort((a, b) => (a[4] - b[4]) * direction);
    renderGrid(sorted);

    // alterna estado e atualiza seta
    sortState.year = sortState.year === 'asc' ? 'desc' : 'asc';
    document.getElementById("sortYear").textContent = `Ordenar por Ano ${sortState.year === 'asc' ? '▲' : '▼'}`;
});

// ==================================================
// Inicializa
// ==================================================
loadExcel();

