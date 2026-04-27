let songs = [];
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCSV();

    document.getElementById("filter-genre").addEventListener("change", filterData);
    document.getElementById("filter-artist").addEventListener("change", filterData);
    document.getElementById("filter-year").addEventListener("input", filterData);
    document.getElementById("filter-bpm").addEventListener("input", e => {
        document.getElementById("bpm-value").textContent = e.target.value;
        filterData();
    });
});

document.getElementById("confirm-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Košarica je prazna!");
        return;
    }

    alert(`Uspješno ste dodali ${cart.length} pjesama u košaricu!`);

    cart = [];
    renderCart();
});

function loadCSV() {
    fetch("glazba.csv")
        .then(res => res.text())
        .then(data => {

            const rows = data.split(/\r?\n/).slice(1);

            songs = rows
                .filter(row => row.trim() !== "")
                .map(row => {
                
                    const cols = row.split(",");
                
                    console.log(cols);
                
                    return {
                        naslov: cols[1]?.trim(),
                        izvodac: cols[2]?.trim(),
                        zanr: cols[3]?.trim(),
                        bpm: parseInt(cols[4]),
                        godina: parseInt(cols[5]),
                        raspolozenje: cols[7]?.trim()
                    };
                });

            populateGenreFilter();
            populateArtistFilter();
            renderTable(songs);
        })
        .catch(err => console.error("Greška:", err));
}

function renderTable(data) {
    const tableBody = document.getElementById("music-table-body");
    tableBody.innerHTML = "";

    data.forEach((song, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${song.naslov}</td>
            <td>${song.izvodac}</td>
            <td>${song.zanr}</td>
            <td>${song.godina}</td>
            <td>${song.bpm} BPM (${song.raspolozenje})</td>
            <td><button onclick='addToCart(${JSON.stringify(song)})'>Dodaj</button></td>
        `;

        tableBody.appendChild(tr);
    });
}

function populateGenreFilter() {
    const select = document.getElementById("filter-genre");

    const genres = [...new Set(songs.map(s => s.zanr))];

    genres.forEach(g => {
        const option = document.createElement("option");
        option.value = g;
        option.textContent = g;
        select.appendChild(option);
    });
}

function populateArtistFilter() {
    const select = document.getElementById("filter-artist");

    const artists = [...new Set(songs.map(s => s.izvodac))];

    artists.forEach(g => {
        const option = document.createElement("option");
        option.value = g;
        option.textContent = g;
        select.appendChild(option);
    });
}

function filterData() {
    const genre = document.getElementById("filter-genre").value;
    const artist = document.getElementById("filter-artist").value;
    const year = document.getElementById("filter-year").value;
    const bpm = document.getElementById("filter-bpm").value;

    let filtered = songs;

    if (genre) {
        filtered = filtered.filter(s => s.zanr === genre);
    }

    if (artist) {
        filtered = filtered.filter(s => s.izvodac === artist);
    }

    if (year) {
        filtered = filtered.filter(s => s.godina >= parseInt(year));
    }

    if (bpm) {
        filtered = filtered.filter(s => s.bpm <= parseInt(bpm));
    }

    renderTable(filtered);
}


function addToCart(song) {
    // spriječi duplikate (opcionalno)
    if (cart.some(s => s.naslov === song.naslov && s.izvodac === song.izvodac)) {
        alert("Već je u košarici!");
        return;
    }

    cart.push(song);
    renderCart();
}

function renderCart() {
    const cartBody = document.getElementById("cart-body");
    const count = document.getElementById("cart-count");

    cartBody.innerHTML = "";
    count.textContent = cart.length;

    cart.forEach((song, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${song.naslov}</td>
            <td>${song.izvodac}</td>
            <td><button onclick="removeFromCart(${index})">Ukloni</button></td>
        `;

        cartBody.appendChild(tr);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}