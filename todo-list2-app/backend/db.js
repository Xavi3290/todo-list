// backend/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Crear la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
  } else {
    console.log('Connected to MySQL database');

    // Create the 'users' table if it doesn't exist
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    db.query(createUsersTable, (err, result) => {
      if (err) {
        console.error('Error creating "users" table:', err.message);
      } else {
        console.log('Table "users" ready');
      }
    });

    // Create the 'games' table if it doesn't exist
    const createGamesTable = `
      CREATE TABLE IF NOT EXISTS games (
        id INT AUTO_INCREMENT PRIMARY KEY,
        player1_id INT,
        player2_id INT,
        board VARCHAR(9) NOT NULL,  -- Board represented as a string (9 positions)
        turn INT NOT NULL,          -- ID of the player whose turn it is
        winner_id INT,              -- ID of the player who won
        status VARCHAR(50) DEFAULT 'in progress', -- Status of the game
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player1_id) REFERENCES users(id),
        FOREIGN KEY (player2_id) REFERENCES users(id)
      );
    `;
    db.query(createGamesTable, (err, result) => {
      if (err) {
        console.error('Error creating "games" table:', err.message);
      } else {
        console.log('Table "games" ready');
      }
    });

    // Create the 'messages' table if it doesn't exist
    const createMessagesTable = `
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        game_id INT,
        user_id INT,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES games(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;
    db.query(createMessagesTable, (err, result) => {
      if (err) {
        console.error('Error creating "messages" table:', err.message);
      } else {
        console.log('Table "messages" ready');
      }
    });
  }
});


module.exports = db;
