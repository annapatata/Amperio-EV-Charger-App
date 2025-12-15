const express = require('express');
const cors = require('cors');
const https = require('https'); 
const fs = require('fs');       // insert 'FileSystem'

//import routes
const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/authRoutes'); 

const app = express();

app.use(cors()); // React-server comm
app.use(express.json()); // JSON format data

// mount Routes
app.use('/api/users', userRoutes); 
app.use('/api/auth', authRoutes); 

const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

const PORT = 9876;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Secure Server is running on https://localhost:${PORT}`);
});
