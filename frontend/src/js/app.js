console.log("Frontend script loaded.");

async function getAlat() {
    const res = await fetch("http://localhost:5000/api/alat", {
        method: "GET",
    });

    const data = await res.json();

    return data;
}

async function renderAlat(data) {
    const table = document.getElementById("alat-table");

    table.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        table.innerHTML += `
        <tr class="${i % 2 !== 0 ? "bg-neutral-200" : ""}">
            <td class="whitespace-nowrap px-6 py-4">${data[i].id_alat}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].nama_kategori}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].nama_alat}</td>
            <td class="whitespace-nowrap px-6 py-4">
                <span class="p-2 rounded-lg ${data[i].kondisi === "Baik" ? "bg-green-400" : "bg-red-400"}">${data[i].kondisi}</span>
            </td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].stok}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].lokasi}</td>
            <td class="whitespace-nowrap px-6 py-4">
                <button class="bg-amber-400 hover:bg-amber-500 transition-colors duration-100 cursor-pointer p-2 rounded-lg">Edit</button>
                <button class="bg-red-400 hover:bg-red-500 transition-colors duration-100 cursor-pointer p-2 rounded-lg">Delete</button>
            </td>
        </tr>
        `;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const alat = await getAlat();
    renderAlat(alat.data);

    const alat_info = document.getElementById("alat-info");
    alat_info.innerText = `${alat.data.length} records`;

    const alat_add = document.getElementById("alat-add");
    alat_add.addEventListener("click", addAlat);
});
