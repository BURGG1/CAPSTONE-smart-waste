const express = require('express');
const mongoose  = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// mongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('MongoDB is Connected Successfully!'))
    .catch(err => console.error("MongoDB connection failed, ", err));

//sample route
app.get('/', (req, res) => res.send('API is running...'));
app.listen(5000, () => console.log('Server started on port 5000'));
    
//Start Server
const PORT = process.env.PORT||5000
app.listen(PORT, () => console.log('Server started on port', PORT));

