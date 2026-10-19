const express = require('express');
const path = require('path'); 
const userRouter = require('./routes/users');

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Add User Router
app.use('/api/v1/user', userRouter);

// Root route to resolve the "Cannot GET /" browser error
app.get('/', (req, res) => {
    res.send('Web Server is running! Visit /home to view the homepage.');
});

// Home route to serve the HTML file
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html')); 
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Web Server is listening at port ${PORT}`);
});