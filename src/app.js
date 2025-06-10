require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('../models'); // Adjust the path as necessary
// Importing the sequelize instance from models/index.js
// This assumes you have a models/index.js that exports sequelize
// and all your models are defined there.
app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    console.log(`🚀 Server running on port ${PORT}`);
    
    await sequelize.authenticate();
    console.log('✅ DB connected');

    // 👇 Sync all models
    await sequelize.sync({ alter: true }); // use { force: true } if needed
    console.log('✅ All models synced to DB');

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
});
module.exports = app; // Export the app for testing or further configuration