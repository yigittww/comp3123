const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/NoteRoutes');

// MongoDB Atlas Bağlantı Linki (Kendi cluster linkin ve şifrenle güncellendi)
const DB_URL = "mongodb://yigitalkoc09_db_user:ya89501177@ac-k7nvan3-shard-00-00.eibp5op.mongodb.net:27017,ac-k7nvan3-shard-00-01.eibp5op.mongodb.net:27017,ac-k7nvan3-shard-00-02.eibp5op.mongodb.net:27017/note_db?ssl=true&replicaSet=atlas-6jv4nr-shard-0&authSource=admin";
const PORT = process.env.PORT || 8081;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Note taking application - Week06 Exercise</h1>");
});

app.use('/api', noteRoutes);

// Connect to the database
mongoose.connect(DB_URL)
.then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server");
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});