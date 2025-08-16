import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Datenverzeichnis und Dateien vorbereiten
const datadir = path.join(process.cwd(), 'data');
if (!fs.existsSync(datadir)) fs.mkdirSync(datadir);

const usersFile = path.join(datadir, 'users.json');
const testsFile = path.join(datadir, 'tests.json');

function loadJson(file, fallback) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (_) {}
  fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
  return fallback;
}

function saveJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Beispielnutzer
let users = loadJson(usersFile, [
  { username: 'admin',   password: 'pass123', role: 'admin',   grade: null, class: null },
  { username: 'teacher', password: 'pass123', role: 'teacher', grade: null, class: null },
  { username: 'student', password: 'pass123', role: 'student', grade: 10,   class: '10a' }
]);

// Testliste
let tests = loadJson(testsFile, []);

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return res.json({ role: user.role, username: user.username });
});

// Test erstellen
app.post('/api/tests', (req, res) => {
  const { title, questions = [], released = false, type = 'mc' } = req.body || {};
  if (!title || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'title and questions required' });
  }
  const id = (tests.length ? Math.max(...tests.map(t => t.id)) + 1 : 1);
  const test = { id, title, questions, released, type };
  tests.push(test);
  saveJson(testsFile, tests);
  res.json(test);
});

// Alle Tests abrufen
app.get('/api/tests', (req, res) => {
  res.json(tests);
});

// Einzelnen Test abrufen
app.get('/api/tests/:id', (req, res) => {
  const id = Number(req.params.id);
  const test = tests.find(t => t.id === id);
  if (!test) return res.status(404).json({ error: 'test not found' });
  res.json(test);
});

// Test freigeben oder sperren
app.post('/api/tests/:id/release', (req, res) => {
  const id = Number(req.params.id);
  const { released } = req.body || {};
  const test = tests.find(t => t.id === id);
  if (!test) return res.status(404).json({ error: 'test not found' });
  test.released = !!released;
  saveJson(testsFile, tests);
  res.json(test);
});

// Test abgeben (Dummy-Auswertung, Platzhalter)
app.post('/api/tests/:id/submit', async (req, res) => {
  const id = Number(req.params.id);
  const test = tests.find(t => t.id === id);
  if (!test) return res.status(404).json({ error: 'test not found' });

  const { answers = [] } = req.body || {};

  // Platzhalter-Score: simple Vergleichslänge
  const score = Math.round((answers.length / Math.max(test.questions.length, 1)) * 100);

  res.json({
    testId: id,
    score,
    feedback: process.env.OPENAI_API_KEY ? 'Evaluation placeholder (OpenAI integration möglich).' : 'Evaluation placeholder (kein API Key).'
  });
});

// Serverstart
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
