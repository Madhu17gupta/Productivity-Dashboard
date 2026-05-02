const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================= DB CONNECT (PostgreSQL) =================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create table if not exists on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS Tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pending',
    priority TEXT DEFAULT 'Medium',
    "dueDate" TEXT,
    "dueTime" TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT
  )
`).then(() => console.log("DB ready ✅")).catch(err => console.error("DB init error:", err));

// ================= TEST API =================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ================= GET ALL TASKS =================
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET SINGLE TASK =================
app.get("/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Tasks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Task not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADD TASK =================
app.post("/tasks", async (req, res) => {
  const { title, description, status, priority, dueDate, dueTime, createdAt } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Tasks (title, description, status, priority, "dueDate", "dueTime", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, status, priority, dueDate, dueTime, createdAt]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE TASK =================
app.put("/tasks/:id", async (req, res) => {
  const { title, description, status, priority, dueDate, dueTime } = req.body;
  try {
    const result = await pool.query(
      `UPDATE Tasks SET title=$1, description=$2, status=$3, priority=$4,
       "dueDate"=$5, "dueTime"=$6, "updatedAt"=$7 WHERE id=$8 RETURNING *`,
      [title, description, status, priority, dueDate, dueTime, new Date().toISOString(), req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE TASK =================
app.delete("/tasks/:id", async (req, res) => {
  try {
    await pool.query('DELETE FROM Tasks WHERE id = $1', [req.params.id]);
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
