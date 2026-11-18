console.log("Frontend script loaded.");

let currentKategoriList = [];

async function getKategori() {
    const res = await fetch("http://localhost:5000/api/kategori", {
        method: "GET",
    });

    const data = await res.json();
    return data;
}

async function refreshKategori() {
    const res = await getKategori();
    currentKategoriList = res.data;
    renderKategori(res.data);

    const kategoriInfo = document.getElementById("kategoriInfo");
    kategoriInfo.innerText = `${res.data.length} records`;
}

async function renderKategori(data) {
    const table = document.getElementById("kategoriTable");

    table.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        table.innerHTML += `
        <tr class="${i % 2 !== 0 ? "bg-blue-50" : ""}">
            <td class="whitespace-nowrap px-6 py-4 text-center">${data[i].id_kategori}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].nama_kategori}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].deskripsi || "-"}</td>
            <td class="whitespace-nowrap px-6 py-4 flex justify-center gap-2">
                <button onclick="openEditModal(${data[i].id_kategori})" class="bg-yellow-300 hover:bg-yellow-400 transition-colors duration-100 cursor-pointer p-2 rounded-lg">Edit</button>
                <button onclick="openDeleteModal(${data[i].id_kategori})" class="bg-red-300 hover:bg-red-400 transition-colors duration-100 cursor-pointer p-2 rounded-lg">Hapus</button>
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
    document.getElementById("idKategori").value = "";
    modalTitle.innerText = "Tambah Kategori Baru";
    modal.showModal();
}

function openEditModal(id) {
    const modal = document.getElementById("formModal");
    const modalTitle = document.getElementById("modalTitle");
    const item = currentKategoriList.find((i) => i.id_kategori == id);

    if (!item) return;

    modalTitle.innerText = "Edit Kategori";

    document.getElementById("idKategori").value = item.id_kategori;
    document.getElementById("namaKategori").value = item.nama_kategori;
    document.getElementById("deskripsiKategori").value = item.deskripsi || "";

    modal.showModal();
}

let deleteTargetId = null;

function openDeleteModal(id) {
    const modal = document.getElementById("deleteModal");
    const item = currentKategoriList.find((i) => i.id_kategori == id);

    if (!item) return;

    deleteTargetId = id;
    document.getElementById("deleteKategoriName").innerText = `"${item.nama_kategori}"`;
    modal.showModal();
}

document.addEventListener("DOMContentLoaded", async () => {
    refreshKategori();

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

        const id = document.getElementById("idKategori").value;
        const isEdit = Boolean(id);

        const payload = {
            nama_kategori: document.getElementById("namaKategori").value,
            deskripsi: document.getElementById("deskripsiKategori").value,
        };

        const url = isEdit
            ? `http://localhost:5000/api/kategori/${id}`
            : `http://localhost:5000/api/kategori`;
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
            await refreshKategori();
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
            `http://localhost:5000/api/kategori/${deleteTargetId}`,
            {
                method: "DELETE",
            },
        );

        const result = await res.json();
        if (result.success) {
            deleteModal.close();
            deleteTargetId = null;
            await refreshKategori();
        } else {
            alert(result.message || "Gagal menghapus data.");
        }
    });
});
