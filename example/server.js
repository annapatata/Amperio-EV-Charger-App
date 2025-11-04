const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();
app.use(express.json());
const port = 3001;

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

//get all chargers
app.get('/api/chargers', (req,res) => {
	const sql = `
	SELECT * FROM Charger
	`;

	db.query(sql, (err,results) => {
		if(err) {
			return res.status(500).json({ error: err.message });
		}
		res.json({ chargers: results });
	});
});


app.listen(port, () => {
	console.log(`🚀 Server running on http://localhost:${port}`);
});
