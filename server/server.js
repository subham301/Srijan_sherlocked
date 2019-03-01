const express = require('express');
const app = express();
const mongoose = require('mongoose');
const privateRoutes = require('./routes/allRoutes');
const auth = require('./routes/auth');

mongoose.connect("mongodb://localhost:27017/Sherlocked")
    .then(() => console.log("mongodb connected..."))
    .catch(err => {
        console.log("mongodb error : " + err);
        process.exit(1);
    });

app.use(express.json());
app.use('/me', privateRoutes);
app.use('/auth', auth);

app.listen(5000, () => console.log("Listening on port 5000..."));