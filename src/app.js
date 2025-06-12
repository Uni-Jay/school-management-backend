require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require('../models'); // Adjust the path as necessary

app.use(cors());
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

app.listen(PORT, async () => {
  try {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
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
