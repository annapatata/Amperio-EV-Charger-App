const express = require('express');
const cors = require('cors');
const https = require('https'); 
const fs = require('fs');       // insert 'FileSystem'

//import error-handling middleware
const errorHandler = require('./middleware/errorHandler');

//import routes
const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
//const adminRoutes = require('./routes/adminRoutes'); 

const app = express();

app.use(cors()); // React-server comm
app.use(express.json()); // JSON format data
app.use(express.urlencoded({ extended: true })); // data parsing

// mount Routes
app.use('/api/users', userRoutes); 
app.use('/api/auth', authRoutes); 
//app.use('/api/admin', adminRoutes);

// error 404 (Not Found) 
app.use((req, res, next) => {
    const error = new Error('Not Found');
    res.status(404);
    next(error);
});

// --- GLOBAL ERROR HANDLER ---
// Must be the last middleware used
app.use(errorHandler);
const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

const PORT = 9876;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Secure Server is running on https://localhost:${PORT}`);
});
