console.log("Frontend script loaded.");

let currentAlatList = [];

async function getAlat() {
    const res = await fetch("http://localhost:5000/api/alat", {
        method: "GET",
    });

    const data = await res.json();
    return data;
}

async function refreshAlat() {
    const res = await getAlat();
    currentAlatList = res.data;
    renderAlat(res.data);

    const alatInfo = document.getElementById("alatInfo");
    alatInfo.innerText = `${res.data.length} records`;
}

async function renderAlat(data) {
    const table = document.getElementById("alatTable");

    table.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        table.innerHTML += `
        <tr class="${i % 2 !== 0 ? "bg-blue-50" : ""}">
            <td class="whitespace-nowrap px-6 py-4 text-center">${data[i].id_alat}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].nama_kategori}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].nama_alat}</td>
            <td class="whitespace-nowrap px-6 py-4">
                <span class="p-2 rounded-lg ${data[i].kondisi === "Baik" ? "bg-green-300" : "bg-amber-300"}">${data[i].kondisi}</span>
            </td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].stok}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].lokasi}</td>
            <td class="whitespace-nowrap px-6 py-4 flex justify-center gap-2">
                <button onclick="openEditModal(${data[i].id_alat})" class="bg-yellow-300 hover:bg-yellow-400 transition-colors duration-100 cursor-pointer p-2 rounded-lg">Edit</button>
                <button onclick="openDeleteModal(${data[i].id_alat})" class="bg-red-300 hover:bg-red-400 transition-colors duration-100 cursor-pointer p-2 rounded-lg">Hapus</button>
            </td>
        </tr>
        `;
    }
}

function openAddModal() {
    const modal = document.getElementById("formModal");
    const form = document.getElementById("form");
    const modalTitle = document.getElementById("modalTitle");

    form.reset();
    document.getElementById("idAlat").value = "";
    modalTitle.innerText = "Tambah Alat Baru";
    modal.showModal();
}

function openEditModal(id) {
    const modal = document.getElementById("formModal");
    const modalTitle = document.getElementById("modalTitle");
    const item = currentAlatList.find((i) => i.id_alat == id);

    if (!item) return;

    modalTitle.innerText = "Edit Alat";

    document.getElementById("idAlat").value = item.id_alat;
    document.getElementById("namaAlat").value = item.nama_alat;
    document.getElementById("kategoriAlat").value = item.id_kategori;
    document.getElementById("kondisiAlat").value = item.kondisi;
    document.getElementById("stokAlat").value = item.stok;
    document.getElementById("lokasiAlat").value = item.lokasi;

    modal.showModal();
}

async function getKategori() {
    const res = await fetch("http://localhost:5000/api/kategori", {
        method: "GET",
    });

    const data = await res.json();

    return data;
}

async function renderKategori(data) {
    const kategoriDropdown = document.getElementById("kategoriAlat");

    data.forEach((i) => {
        kategoriDropdown.innerHTML += `<option value="${i.id_kategori}">${i.nama_kategori}</option>`;
    });
}

let deleteTargetId = null;

function openDeleteModal(id) {
    const modal = document.getElementById("deleteModal");
    const item = currentAlatList.find((i) => i.id_alat == id);

    if (!item) return;

    deleteTargetId = id;
    document.getElementById("deleteAlatName").innerText = `"${item.nama_alat}"`;
    modal.showModal();
}

document.addEventListener("DOMContentLoaded", async () => {
    refreshAlat();

    const kategori = await getKategori();
    renderKategori(kategori.data);

    const openAdd = document.getElementById("openAddModalBtn");
    openAdd.addEventListener("click", openAddModal);

    const modal = document.getElementById("formModal");
    const closeBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const form = document.getElementById("form");

    closeBtn.addEventListener("click", () => modal.close());
    cancelBtn.addEventListener("click", () => modal.close());

    modal.addEventListener("mousedown", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("idAlat").value;
        const isEdit = Boolean(id);

        const payload = {
            id_kategori: document.getElementById("kategoriAlat").value,
            nama_alat: document.getElementById("namaAlat").value,
            kondisi: document.getElementById("kondisiAlat").value,
            stok: Number(document.getElementById("stokAlat").value),
            lokasi: document.getElementById("lokasiAlat").value,
        };

        const url = isEdit
            ? `http://localhost:5000/api/alat/${id}`
            : `http://localhost:5000/api/alat`;
        const method = isEdit ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (result.success) {
            modal.close();
            form.reset();
            await refreshAlat();
        } else {
            alert(result.message || "Gagal menyimpan data.");
        }
    });

    const deleteModal = document.getElementById("deleteModal");
    const closeDeleteBtn = document.getElementById("closeDeleteModalBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

    closeDeleteBtn.addEventListener("click", () => deleteModal.close());
    cancelDeleteBtn.addEventListener("click", () => deleteModal.close());
    deleteModal.addEventListener("mousedown", (event) => {
        if (event.target === deleteModal) {
            deleteModal.close();
        }
    });

    confirmDeleteBtn.addEventListener("click", async () => {
        if (!deleteTargetId) return;

        const res = await fetch(
            `http://localhost:5000/api/alat/${deleteTargetId}`,
            {
                method: "DELETE",
            },
        );

        const result = await res.json();
        if (result.success) {
            deleteModal.close();
            deleteTargetId = null;
            await refreshAlat();
        } else {
            alert(result.message || "Gagal menghapus data.");
        }
    });
});
