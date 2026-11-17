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
    const query = `SELECT * FROM alat;`;
    const result = await pool.query(query);
    return res.json(result.rows);
});

app.get("/api/kategori", async (req, res) => {
    const query = `SELECT * FROM kategori_alat;`;
    const result = await pool.query(query);
    return res.json(result.rows);
});

app.get("/api/peminjaman", async (req, res) => {
    const query = `SELECT * FROM peminjaman;`;
    const result = await pool.query(query);
    return res.json(result.rows);
});

app.delete("/api/alat/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const query = `DELETE FROM alat WHERE id_alat = ${id}`;
    const result = await pool.query(query);
    return res.json(result);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running in http://localhost:${process.env.PORT}/`);
});
