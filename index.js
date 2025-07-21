const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();

app.get('/feed', async (req, res) => {
  const cachePath = './instagram.json';

  // Kalau file belum ada, fetch dulu
  if (!fs.existsSync(cachePath)) {
    await new Promise((resolve, reject) => {
      exec('node fetch.js', (err, stdout, stderr) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  // Return isi file
  const data = fs.readFileSync(cachePath, 'utf-8');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));