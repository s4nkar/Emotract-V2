const express = require("express");
const { connectDB } = require("./database");

const app = express();
const PORT = 5000;

connectDB(); // Connect to MongoDB

app.get("/", (req, res) => {
    res.send("API is running...");
});

// backend api 
app.get('/api/get-users', (req, res) => {
    const data = Users.find();
    res.json(data)
})

app.post('/api/register', (req, res) => {
    const username = req.username
})

// frontend
// data = api/get-users


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
