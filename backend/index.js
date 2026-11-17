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
        return res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

app.get("/api/kategori", async (req, res) => {
    try {
        const query = `SELECT * FROM kategori_alat;`;
        const result = await pool.query(query);
        return res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

app.get("/api/peminjaman", async (req, res) => {
    try {
        const query = `SELECT * FROM peminjaman;`;
        const result = await pool.query(query);
        return res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

app.delete("/api/alat/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM alat WHERE id_alat = $1`;
        const result = await pool.query(query, [id]);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

app.delete("/api/kategori/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM kategori_alat WHERE id_kategori = $1`;
        const result = await pool.query(query, [id]);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

app.delete("/api/peminjaman/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM peminjaman WHERE id_peminjaman = $1`;
        const result = await pool.query(query, [id]);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

app.post("/api/alat", async (req, res) => {
    try {
        const { id_kategori, nama_alat, kondisi, stok, lokasi } = req.body;
        const query = `INSERT INTO alat (id_kategori, nama_alat, kondisi, stok, lokasi) 
        VALUES ($1, $2, $3, $4, $5)`;
        const result = await pool.query(query, [
            id_kategori,
            nama_alat,
            kondisi,
            stok,
            lokasi,
        ]);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

app.post("/api/kategori", async (req, res) => {
    try {
        const { nama_kategori, deskripsi } = req.body;
        const query = `INSERT INTO kategori_alat (nama_kategori, deskripsi) 
        VALUES ($1, $2)`;
        const result = await pool.query(query, [nama_kategori, deskripsi]);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

app.listen(process.env.PORT, () => {
    try {
        console.log(`Server running in http://localhost:${process.env.PORT}/`);
    } catch (error) {
        return res.status(500).json({ error });
    }
});
