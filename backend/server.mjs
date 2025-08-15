
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import serviceAccount from './serviceAccountKey.json' assert { type: "json" };

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://ema-data-267e0-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getDatabase();

// Home route
app.get('/', (req, res) => {
  res.send('✅ EMA Firebase Backend is running');
});

// Add new report
app.post('/addReport', async (req, res) => {
  const data = req.body;

  try {
    const ref = db.ref('reports');
    const newRef = ref.push();
    await newRef.set(data);
    res.status(200).send({ success: true, id: newRef.key });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Get all reports
app.get('/getReports', async (req, res) => {
  const ref = db.ref('reports');
  ref.once('value', snapshot => {
    res.send(snapshot.val());
  }, error => {
    res.status(500).send({ success: false, message: error.message });
  });
});

app.listen(PORT, () => {
  console.log(`✅ EMA Server running at http://localhost:${PORT}`);
});
