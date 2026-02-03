// ==================================================
// Variáveis globais
// ==================================================
let albumData = [];
let filteredData = [];

let currentGenre = "TUDO";
let currentFormat = "TUDO";

let sortState = {
    artist: "asc",
    year: "asc"
};

// ==================================================
// Carregar Excel (sem cabeçalhos)
// ==================================================
async function loadExcel() {
    try {
        const response = await fetch("albums.xlsx");
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        // Transformar array de arrays em array de objetos com colunas fixas
        albumData = json.map(a => ({
            Image: a[0],
            Artist: a[1],
            Album: a[2],
            Label: a[3],
            Year: a[4],
            Genre: a[5],
            Format: a[6],
        }));

        filteredData = albumData.slice();

        populateFilters(albumData);
        renderGrid(filteredData);
    } catch (err) {
        console.error("Erro ao carregar o Excel:", err);
    }
}

// ==================================================
// Renderizar grid
// ==================================================
function renderGrid(data) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    data.forEach(a => {
        let img = a.Image || "";
        if (img && !img.includes(".")) img += ".jpg";

        const item = document.createElement("div");
        item.className = "grid-item";

        item.innerHTML = `
            <img src="images/${img}" alt="${a.Album}">
            <p class="small"><u>${a.Artist}</u></p>
            <p class="small"><strong>${a.Album}</strong></p>
            <p class="small">${a.Label}</p>
            <p class="small">${a.Year}</p>
        `;

        grid.appendChild(item);
    });

    document.getElementById("totalAlbums").innerHTML =
        `<p class="small">${data.length} álbuns</p>`;
}

// ==================================================
// Criar filtros dinâmicos
// ==================================================
function populateFilters(data) {
    const genreSet = new Set();
    const formatSet = new Set();

    data.forEach(a => {
        // Separar múltiplos géneros por vírgula e adicionar individualmente
        if (a.Genre) {
            a.Genre.split(",").forEach(g => {
                const genre = g.trim(); // remove espaços antes/depois
                if (genre) genreSet.add(genre);
            });
        }

        // Separar múltiplos formatos por vírgula (opcional)
        if (a.Format) {
            a.Format.split(",").forEach(f => {
                const format = f.trim();
                if (format) formatSet.add(format);
            });
        }
    });

    const genreFilter = document.getElementById("genreFilter");
    const formatFilter = document.getElementById("formatFilter");

    genreFilter.innerHTML = `<option value="TUDO">TODOS</option>`;
    formatFilter.innerHTML = `<option value="TUDO">TODOS</option>`;

    genreSet.forEach(g => genreFilter.innerHTML += `<option value="${g}">${g}</option>`);
    formatSet.forEach(f => formatFilter.innerHTML += `<option value="${f}">${f}</option>`);
}

// ==================================================
// Aplicar filtros
// ==================================================
function applyFilters() {
    filteredData = albumData.filter(a => {
        const genreMatch = currentGenre === "TUDO" || a.Genre === currentGenre;
        const formatMatch = currentFormat === "TUDO" || a.Format === currentFormat;
        return genreMatch && formatMatch;
    });
    renderGrid(filteredData);
}

// ==================================================
// Listeners filtros
// ==================================================
document.getElementById("genreFilter").addEventListener("change", e => {
    currentGenre = e.target.value;
    applyFilters();
});

document.getElementById("formatFilter").addEventListener("change", e => {
    currentFormat = e.target.value;
    applyFilters();
});

// ==================================================
// Ordenação
// ==================================================
document.getElementById("sortArtist").addEventListener("click", () => {
    const dir = sortState.artist === "asc" ? 1 : -1;
    filteredData.sort((a, b) => a.Artist.localeCompare(b.Artist) * dir);
    sortState.artist = sortState.artist === "asc" ? "desc" : "asc";
    renderGrid(filteredData);
});

document.getElementById("sortYear").addEventListener("click", () => {
    const dir = sortState.year === "asc" ? 1 : -1;
    filteredData.sort((a, b) => (a.Year - b.Year) * dir);
    sortState.year = sortState.year === "asc" ? "desc" : "asc";
    renderGrid(filteredData);
});

// ==================================================
// Init
// ==================================================
loadExcel();
