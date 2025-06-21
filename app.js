const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const { Server } = require('socket.io');

const { Op } = require('sequelize');
const { School, Student, Teacher,Parent, Event, } = require('./models'); // Adjust the path as necessary
const http = require("http");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const config = require("./config");
const app = express();
const { port, allowedDomains } = config;
const { sequelize } = require('./models'); // Adjust the path as necessary

app.use(cors({ 
  origin: allowedDomains, 
  // origin: "*", 
  credentials: true 
}));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Your API routes
app.use('/auth', require('./src/routes/auth'));
app.use('/announcements', require('./src/routes/announcements'));
app.use('/assignments', require('./src/routes/assignments'));
app.use('/attendance', require('./src/routes/attendances'));
app.use('/classes', require('./src/routes/classes'));
app.use('/exams', require('./src/routes/exams'));
app.use('/events', require('./src/routes/events'));
app.use('/lessons', require('./src/routes/lessons'));
app.use('/gradeSchemes', require('./src/routes/gradeSchemes'));
app.use('/parents', require('./src/routes/parents'));
app.use('/students', require('./src/routes/students'));
app.use('/teachers', require('./src/routes/teachers'));
app.use('/subjects', require('./src/routes/subjects'));
app.use('/superAdmins', require('./src/routes/superAdmins'));
app.use('/schoolSuperAdmins', require('./src/routes/schoolSuperAdmins'));
app.use('/schoolAdmins', require('./src/routes/schoolAdmins'));
app.use('/schools', require('./src/routes/schools'));
app.use('users', require('./src/routes/users'));
app.use('/chat', require('./src/routes/chat'));
// const { serverClient } = require('./utils/stream');


// Search route
app.get('/search', async (req, res) => {

  const { query } = req.query;
  const results = {
    schools: [],
    students: [],
    teachers: [],
    admins: [],
    events: [],
    parents: []
  };

  try {
    // Assuming Sequelize and LIKE searches
    results.schools = await School.findAll({ where: { name: { [Op.like]: `%${query}%` } } });
    results.students = await Student.findAll({ where: { full_name: { [Op.like]: `%${query}%` } } });
    results.teachers = await Teacher.findAll({ where: { full_name: { [Op.like]: `%${query}%` } } });
    results.admins = await Admin.findAll({ where: { full_name: { [Op.like]: `%${query}%` } } });
    results.events = await Event.findAll({ where: { title: { [Op.like]: `%${query}%` } } });
    results.parents = await Parent.findAll({ where: { full_name: { [Op.like]: `%${query}%` } } });

    return res.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Search failed" });
  }
});

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));
// Serve static files from the 'uploads' directory



// Root test route — place here
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(port, async () => {
  try {
    // 1. Create HTTP server from your app
const server = http.createServer(app);

// 2. Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend origin in production
    methods: ['GET', 'POST'],
  },
});

// 3. Make io available in all routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 4. Listen
server.listen(process.env.PORT || 5000, () => {
  console.log('🚀 Server with Socket.IO running');
});

    
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
