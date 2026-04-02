const express = require('express');
const cors = require('cors');
const searchRoute = require('./routes/search');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'bizzyb server is running!' });
});

// Search endpoint
app.use('/api/search', searchRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
