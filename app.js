// app.js
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Fail to connect to MySQL:', err);
    } else {
        console.log('Sucess to connect to MySQL');
    }
});

app.get('/', (req, res) => {
    console.log('Request Readme.md');
    const filePath = path.join(__dirname, "Readme.md");
    res.sendFile(filePath);
});

app.get('/meal', (req, res) => {
    const { date, type } = req.query;
    if (!date || !type) {
        console.log('Invalid get request, date:', date, ", type", type);
        return res.status(400).send('Either date or meal type, or both not set.');

    }
    const query = `SELECT * FROM mealplans WHERE date = ? AND type = ?`;
    db.query(query, [date, type], (err, results) => {
        if (err) {
            console.error('Fail to run query:', err);
            return res.status(500).send('Server error occured.');
        }
        if (results.length === 0) {
            console.log("404 request");
            return res.status(404).send('404: no date');
        }
        console.log('response successfully, date:', date, ", type:", type);
        res.json(results[0]); 
    });
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
