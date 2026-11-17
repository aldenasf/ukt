const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/api/alat", async (req, res) => {
    try {
        const query = `SELECT * FROM alat;`;
        const result = await pool.query(query);
        return res.json({
            success: true,
            message: "Data berhasil diambil.",
            data: result.rows,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Terjadi kesalahan server.",
        });
    }
});

app.get("/api/kategori", async (req, res) => {
    try {
        const query = `SELECT * FROM kategori_alat;`;
        const result = await pool.query(query);
        return res.json({
            success: true,
            message: "Data berhasil diambil.",
            data: result.rows,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Terjadi kesalahan server.",
        });
    }
});

app.get("/api/peminjaman", async (req, res) => {
    try {
        const query = `SELECT * FROM peminjaman;`;
        const result = await pool.query(query);
        return res.json({
            success: true,
            message: "Data berhasil diambil.",
            data: result.rows,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Terjadi kesalahan server.",
        });
    }
});

app.delete("/api/alat/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM alat WHERE id_alat = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Data tidak ditemukan." });
        }

        return res.json({
            success: true,
            message: "Data berhasil dihapus.",
            data: result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Terjadi kesalahan server.",
        });
    }
});

app.delete("/api/kategori/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM kategori_alat WHERE id_kategori = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Data tidak ditemukan." });
        }

        return res.json({
            success: true,
            message: "Data berhasil dihapus.",
            data: result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Terjadi kesalahan server.",
        });
    }
});

app.delete("/api/peminjaman/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM peminjaman WHERE id_peminjaman = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Data tidak ditemukan." });
        }

        return res.json({
            success: true,
            message: "Data berhasil dihapus.",
            data: result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Terjadi kesalahan server.",
        });
    }
});

app.post("/api/alat", async (req, res) => {
    try {
        const { id_kategori, nama_alat, kondisi, stok, lokasi } = req.body;
        const query = `INSERT INTO alat (id_kategori, nama_alat, kondisi, stok, lokasi) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
        const result = await pool.query(query, [
            id_kategori,
            nama_alat,
            kondisi,
            stok,
            lokasi,
        ]);
        return res.status(201).json({
            success: true,
            message: "Data berhasil ditambahkan.",
            data: result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Terjadi kesalahan server.",
        });
    }
});

app.post("/api/kategori", async (req, res) => {
    try {
        const { nama_kategori, deskripsi } = req.body;
        const query = `INSERT INTO kategori_alat (nama_kategori, deskripsi) 
        VALUES ($1, $2) RETURNING *;`;
        const result = await pool.query(query, [nama_kategori, deskripsi]);
        return res.status(201).json({
            success: true,
            message: "Data berhasil ditambahkan.",
            data: result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Terjadi kesalahan server.",
        });
    }
});

app.post("/api/peminjaman", async (req, res) => {
    try {
        const {
            id_alat,
            nama_peminjam,
            kelas,
            tanggal_kembali,
            jumlah,
            status,
        } = req.body;
        const query = `INSERT INTO peminjaman (id_alat, nama_peminjam, kelas, 
        tanggal_kembali, jumlah, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
        const result = await pool.query(query, [
            id_alat,
            nama_peminjam,
            kelas,
            tanggal_kembali,
            jumlah,
            status,
        ]);

        return res.status(201).json({
            success: true,
            message: "Data berhasil ditambahkan.",
            data: result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Terjadi kesalahan server.",
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}/`);
});
