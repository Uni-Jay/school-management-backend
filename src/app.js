const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const http = require("http");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const config = require("../config");
const app = express();
const { port, allowedDomains } = config;
const { sequelize } = require('../models'); // Adjust the path as necessary

app.use(cors({ 
  origin: allowedDomains, 
  // origin: "*", 
  credentials: true 
}));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// Your API routes
app.use('/auth', require('./routes/auth'));
app.use('/announcements', require('./routes/announcements'));
app.use('/assignments', require('./routes/assignments'));
app.use('/attendance', require('./routes/attendances'));
app.use('/classes', require('./routes/classes'));
app.use('/exams', require('./routes/exams'));
app.use('/events', require('./routes/events'));
app.use('/lessons', require('./routes/lessons'));
app.use('/gradeSchemes', require('./routes/gradeSchemes'));

// Root test route — place here
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(port, async () => {
  try {
    console.log(`🚀 Server running on http://localhost:${port}`);
    
    await sequelize.authenticate();
    console.log('✅ DB connected');

    // // 👇 Sync all models
    // await sequelize.sync({ alter: true }); // use { force: true } if needed
    // console.log('✅ All models synced to DB');

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
});

module.exports = app; // Export the app for testing or further configuration
