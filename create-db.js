const mysql = require('mysql2/promise');

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS school_mgmt`);
  console.log('✅ Database created or already exists!');
  await connection.end();
}

createDatabase().catch(console.error);
