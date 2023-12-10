const express = require("express");
const app = express();
const mongoose = require("mongoose");
const tasks = require("./modals/task");
const dotenv = require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', "ejs");
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    let task = await tasks.find();
    res.render("index", { tasks: task });
});

app.post("/", async (req, res) => {
    let task = new tasks({
        title: req.body.title,
        description: req.body.description
    });

    try {
        task = await task.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/editTask/:id', async (req, res) => {
    try {
        let task = await tasks.findById(req.params.id);
        res.render("edit", { task: task });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/deleteTask/:id', async (req, res) => {
    try {
        await tasks.deleteOne({ _id: req.params.id });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/update/:id', async (req, res) => {
    try {
        await tasks.findOneAndUpdate({ _id: req.params.id }, {
            title: req.body.title,
            description: req.body.description,
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/status/:id', async (req, res) => {
    try {
        let task = await tasks.findById(req.params.id);
        task.status = (task.status === "Not Completed") ? "Completed" : "Not Completed";
        await task.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
