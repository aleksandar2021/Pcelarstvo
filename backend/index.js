const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');
const publicRoutes = require('./routes/publicAPIRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/stats', statsRoutes);
app.use('/public', publicRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Komunikacija radi :)' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
