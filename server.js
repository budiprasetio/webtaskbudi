const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dayjs = require("dayjs");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "webtask",
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/notes", (req, res) => {
  const sql = "SELECT * FROM notes";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

const formatDate = () => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
};

app.post("/notes", (req, res) => {
  const { title, note } = req.body;
  const createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const sql = "INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)";
  const values = [title, createdAt, note];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(201).json({ id: result.insertId, title, createdAt, note });
  });
});

app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, note } = req.body;
  const updatedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const sql = "UPDATE notes SET title = ?, note = ?, datetime = ? WHERE id = ?";
  const values = [title, note, updatedAt, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ id, title, updatedAt, note });
  });
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM notes WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ message: "Note deleted successfully" });
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`https://localhost:${process.env.APP_PORT}`);
});
