const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    const result = pool.query("SELECT * FROM peminjaman;");
    res.send(result);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running in http://localhost:${process.env.PORT}/`);
});
