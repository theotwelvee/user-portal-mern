const express = require('express');
const connectDB = require('./config/db');
const config = require('./config/config');
const cors = require('cors');
const authRoutes = require('./routes/auth.route');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

const PORT = config.port;

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port : ', PORT);
});

module.exports = app;
