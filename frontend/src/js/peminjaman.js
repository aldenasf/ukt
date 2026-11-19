console.log("Frontend script loaded.");

let currentPeminjamanList = [];
let currentAlatList = [];
let deleteTargetId = null;

function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

async function getPeminjaman() {
    const res = await fetch("http://localhost:5000/api/peminjaman", {
        method: "GET",
    });

    const data = await res.json();
    return data;
}

async function getAlat() {
    const res = await fetch("http://localhost:5000/api/alat", {
        method: "GET",
    });

    const data = await res.json();
    return data;
}

async function refreshPeminjaman() {
    const alatRes = await getAlat();
    currentAlatList = alatRes.data || [];
    renderAlatDropdown(currentAlatList);

    const res = await getPeminjaman();
    currentPeminjamanList = res.data || [];
    renderPeminjaman(currentPeminjamanList);

    const peminjamanInfo = document.getElementById("peminjamanInfo");
    peminjamanInfo.innerText = `${currentPeminjamanList.length} records`;
}

function renderAlatDropdown(data) {
    const select = document.getElementById("idAlat");
    select.innerHTML = `<option value="" disabled selected>Pilih Alat</option>`;

    data.forEach((i) => {
        select.innerHTML += `<option value="${i.id_alat}">${i.nama_alat} (Stok: ${i.stok})</option>`;
    });
}

async function renderPeminjaman(data) {
    const table = document.getElementById("peminjamanTable");

    table.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const itemAlat = currentAlatList.find(
            (a) => a.id_alat == data[i].id_alat,
        );
        const namaAlat = itemAlat
            ? itemAlat.nama_alat
            : `Alat #${data[i].id_alat}`;

        let statusBadgeClass = "bg-amber-300";
        if (data[i].status === "Dikembalikan") {
            statusBadgeClass = "bg-green-300";
        } else if (data[i].status === "Terlambat") {
            statusBadgeClass = "bg-red-300";
        }

        table.innerHTML += `
        <tr class="${i % 2 !== 0 ? "bg-blue-50" : ""}">
            <td class="whitespace-nowrap px-6 py-4 text-center">${data[i].id_peminjaman}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].nama_peminjam}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].kelas}</td>
            <td class="whitespace-nowrap px-6 py-4">${namaAlat}</td>
            <td class="whitespace-nowrap px-6 py-4">${formatDate(data[i].tanggal_pinjam)}</td>
            <td class="whitespace-nowrap px-6 py-4">${formatDate(data[i].tanggal_kembali)}</td>
            <td class="whitespace-nowrap px-6 py-4">${data[i].jumlah}</td>
            <td class="whitespace-nowrap px-6 py-4">
                <span class="p-2 rounded-lg ${statusBadgeClass}">${data[i].status}</span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 flex justify-center gap-2">
                <button onclick="openEditModal(${data[i].id_peminjaman})" class="bg-yellow-300 hover:bg-yellow-400 transition-colors duration-100 cursor-pointer p-2 rounded-lg">Edit</button>
                <button onclick="openDeleteModal(${data[i].id_peminjaman})" class="bg-red-300 hover:bg-red-400 transition-colors duration-100 cursor-pointer p-2 rounded-lg">Hapus</button>
            </td>
        </tr>
        `;
    }
}

function openAddModal() {
    const modal = document.getElementById("formModal");
    const form = document.getElementById("form");
    const modalTitle = document.getElementById("modalTitle");
    const tanggalPinjam = document.getElementById("tanggalPinjam");

    tanggalPinjam.setAttribute("value", new Date().toISOString().split("T")[0]);

    console.log(tanggalPinjam);
    console.log(new Date().toISOString().split("T")[0]);
    console.log(tanggalPinjam.value);

    form.reset();
    document.getElementById("idPeminjaman").value = "";
    document.getElementById("status").value = "Dipinjam";
    modalTitle.innerText = "Tambah Peminjaman Baru";
    modal.showModal();
}

function openEditModal(id) {
    const modal = document.getElementById("formModal");
    const modalTitle = document.getElementById("modalTitle");
    const item = currentPeminjamanList.find((i) => i.id_peminjaman == id);

    if (!item) return;

    modalTitle.innerText = "Edit Peminjaman";

    document.getElementById("idPeminjaman").value = item.id_peminjaman;
    document.getElementById("namaPeminjam").value = item.nama_peminjam;
    document.getElementById("kelas").value = item.kelas;
    document.getElementById("idAlat").value = item.id_alat;
    document.getElementById("jumlah").value = item.jumlah;
    document.getElementById("tanggalPinjam").value = formatDate(
        item.tanggal_pinjam,
    );
    document.getElementById("tanggalKembali").value = formatDate(
        item.tanggal_kembali,
    );
    document.getElementById("status").value = item.status;

    modal.showModal();
}

function openDeleteModal(id) {
    const modal = document.getElementById("deleteModal");
    const item = currentPeminjamanList.find((i) => i.id_peminjaman == id);

    if (!item) return;

    deleteTargetId = id;
    document.getElementById("deletePeminjamName").innerText =
        `"${item.nama_peminjam}"`;
    modal.showModal();
}

document.addEventListener("DOMContentLoaded", async () => {
    refreshPeminjaman();

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

        const id = document.getElementById("idPeminjaman").value;
        const isEdit = Boolean(id);

        const payload = {
            id_alat: Number(document.getElementById("idAlat").value),
            nama_peminjam: document.getElementById("namaPeminjam").value,
            kelas: document.getElementById("kelas").value,
            tanggal_pinjam: document.getElementById("tanggalPinjam").value,
            tanggal_kembali: document.getElementById("tanggalKembali").value,
            jumlah: Number(document.getElementById("jumlah").value),
            status: document.getElementById("status").value,
        };

        const url = isEdit
            ? `http://localhost:5000/api/peminjaman/${id}`
            : `http://localhost:5000/api/peminjaman`;
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
            await refreshPeminjaman();
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
            `http://localhost:5000/api/peminjaman/${deleteTargetId}`,
            {
                method: "DELETE",
            },
        );

        const result = await res.json();
        if (result.success) {
            deleteModal.close();
            deleteTargetId = null;
            await refreshPeminjaman();
        } else {
            alert(result.message || "Gagal menghapus data.");
        }
    });
});
