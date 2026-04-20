import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  console.log('Health endpoint called');
  res.json({ status: 'ok' });
});

app.listen(5003, () => {
  console.log('Server running on port 5003');
});
