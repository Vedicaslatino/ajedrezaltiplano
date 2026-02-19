const SHEET_ID = '11Sb1mrnFtsthIt2opjYkwh3Z9kSli5nzvA-p5cJiIvk';
const SHEET_TITLE = 'Rating';
const FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_TITLE}`;

let playersData = [];

async function loadData() {
    try {
        const response = await fetch(FULL_URL);
        const text = await response.text();
        const rows = text.split('\n').slice(1);

        playersData = rows.map(row => {
            const col = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/"/g, '').trim());
            return {
                pos: col[0],
                name: col[1],
                rating: col[2]
            };
        }).filter(p => p.name);

        renderTable(playersData);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('chessTable').style.display = 'table';
    } catch (e) {
        document.getElementById('loading').innerText = 'Error de conexión.';
    }
}

function renderTable(data) {
    const tbody = document.querySelector("#chessTable tbody");
    const mexicoFlag = "https://flagcdn.com/w40/mx.png";

    tbody.innerHTML = data.map(player => {
        return `
            <tr data-pos="${player.pos}">
                <td><div class="pos-badge"><span>${player.pos}</span></div></td>
                <td>
                    <div class="name-cell">
                        <img src="${mexicoFlag}" class="flag-icon" alt="MX">
                        <strong>${player.name}</strong>
                    </div>
                </td>
                <td class="rating-cell">${player.rating}</td>
            </tr>
        `;
    }).join('');
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = playersData.filter(p => p.name.toLowerCase().includes(term));
    renderTable(filtered);
    document.getElementById('noResults').style.display = filtered.length ? 'none' : 'block';
});

loadData();