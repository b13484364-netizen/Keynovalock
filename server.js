const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const sessions = {};

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/enter-room', (req, res) => {
  const { imageId, password } = req.body;
  const roomKey = crypto.createHash('sha256').update(imageId + password).digest('hex');

  if (!sessions[roomKey]) {
    sessions[roomKey] = { users: 1 };
    res.json({ status: 'waiting', roomId: roomKey });
  } else {
    sessions[roomKey].users += 1;
    res.json({ status: 'matched', roomId: roomKey });
  }
});

app.get('/chat-room/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ status: 'uploaded', filename: req.file.filename });
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
