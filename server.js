import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.use(express.json());
app.use(express.static('public'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

function loadJson(file, defaultData) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content);
  } catch {
    fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

function saveJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const usersFile = path.join(dataDir, 'users.json');
const testsFile = path.join(dataDir, 'tests.json');

const users = loadJson(usersFile, [
  { username: 'teacher1', password: 'pass123', role: 'teacher', grade: null, class: null },
  { username: 'student1', password: 'pass123', role: 'student', grade: 10, class: '10A' }
]);

let tests = loadJson(testsFile, []);
let testId = tests.length ? Math.max(...tests.map(t => t.id)) + 1 : 1;

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ username: ADMIN_USERNAME, role: 'admin', grade: null, class: null });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const { password: _, ...info } = user;
    return res.json(info);
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

function generateTestWithAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return [{ question: `AI not configured for prompt: ${prompt}`, type: 'info' }];
  }
  const client = new OpenAI({ apiKey });
  // Placeholder: generate a single question using AI
  return [{ question: `Frage basierend auf: ${prompt}?`, type: 'short' }];
}

app.post('/api/tests', (req, res) => {
  const { title, questions, releaseAt, useAI, prompt } = req.body;
  let q = questions || [];
  if (useAI) {
    q = generateTestWithAI(prompt);
  }
  const test = { id: testId++, title, questions: q, releaseAt: releaseAt ? new Date(releaseAt) : null };
  tests.push(test);
  saveJson(testsFile, tests);
  res.json(test);
});

app.get('/api/tests', (req, res) => {
  const now = new Date();
  const available = tests.filter(t => !t.releaseAt || t.releaseAt <= now);
  res.json(available);
});

async function evaluateTestWithAI(questions, answers) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { score: 0, feedback: 'No API key configured' };
  }
  const client = new OpenAI({ apiKey });
  // Placeholder evaluation logic
  return { score: 100, feedback: 'Evaluation placeholder' };
}

app.post('/api/tests/:id/submit', async (req, res) => {
  const id = Number(req.params.id);
  const { answers } = req.body;
  const test = tests.find(t => t.id === id);
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  const result = await evaluateTestWithAI(test.questions, answers);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
