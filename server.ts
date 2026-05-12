import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "data.json");

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to read database
async function readDb() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Initial data structure if file doesn't exist
    return {
      orders: [],
      inventory: [],
      expenses: [],
      users: [{ id: "admin", email: "admin@jerseypro.com", password: "password123" }] // Simple mock auth
    };
  }
}

// Helper to write database
async function writeDb(data: any) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// API Routes
app.get("/api/db", async (req, res) => {
  const db = await readDb();
  res.json(db);
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const db = await readDb();
  const user = db.users.find((u: any) => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, user: { email: user.email, id: user.id } });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Generic CRUD endpoints for simplicity
app.post("/api/:collection", async (req, res) => {
  const { collection } = req.params;
  const newItem = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
  const db = await readDb();
  if (!db[collection]) db[collection] = [];
  db[collection].push(newItem);
  await writeDb(db);
  res.json(newItem);
});

app.put("/api/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  const db = await readDb();
  const index = db[collection].findIndex((item: any) => item.id === id);
  if (index !== -1) {
    db[collection][index] = { ...db[collection][index], ...req.body, updatedAt: new Date().toISOString() };
    await writeDb(db);
    res.json(db[collection][index]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.delete("/api/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  const db = await readDb();
  db[collection] = db[collection].filter((item: any) => item.id !== id);
  await writeDb(db);
  res.json({ success: true });
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
