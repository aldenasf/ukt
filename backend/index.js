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
        console.log(id);
        const query = `DELETE FROM alat WHERE id_alat = ${id}`;
        const result = await pool.query(query);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

app.delete("/api/kategori/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const query = `DELETE FROM kategori_alat WHERE id_kategori = ${id}`;
        const result = await pool.query(query);
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
