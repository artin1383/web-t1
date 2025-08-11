import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new sqlite3.Database(path.join(__dirname, 'drawings.db'));

app.use(cors());
app.use(bodyParser.json());

db.run(`
  CREATE TABLE IF NOT EXISTS drawings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    data TEXT NOT NULL,
  )
`);

app.post('/save/drawing', (req, res) => {
  const { username, data } = req.body;
  if (!username || !data) {
    return res.status(400).json({ error: 'username and data required' });
  }
  db.run(
    'INSERT INTO drawings (username, data) VALUES (?, ?)',
    [username, JSON.stringify(data)],
    function (err) {
      if (err) return res.status(404).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.get('/load/drawing/:username', (req, res) => {
  const username = req.params.username;
  db.all(
    'SELECT id, data, timestamp FROM drawings WHERE username = ? ORDER BY timestamp DESC',
    [username],
    (err, rows) => {
      if (err) return res.status(404).json({ error: err.message });
      res.json(
        rows.map(r => ({
          id: r.id,
          data: JSON.parse(r.data),
        }))
      );
    }
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
