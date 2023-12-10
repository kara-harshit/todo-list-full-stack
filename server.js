const express = require("express");
const app = express();
const mongoose = require("mongoose");
const tasks = require("./modals/task");
const dotenv = require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', "ejs");
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Routes
app.get('/', async (req, res) => {
  try {
    const task = await tasks.find();
    res.render("index", { tasks: task });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
});

app.post("/", async (req, res) => {
  try {
    const task = new tasks({
      title: req.body.title,
      description: req.body.description
    });

    await task.save();
    res.redirect('/');
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
});

app.post('/editTask/:id', async (req, res) => {
  try {
    const task = await tasks.findById(req.params.id);
    res.render("edit", { task: task });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
});

app.post('/deleteTask/:id', async (req, res) => {
  try {
    await tasks.deleteOne({ _id: req.params.id });
    res.redirect('/');
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
});

app.post('/update/:id', async (req, res) => {
  try {
    await tasks.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description: req.body.description,
    });

    res.redirect('/');
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
});

app.post('/status/:id', async (req, res) => {
  try {
    const task = await tasks.findById(req.params.id);
    task.status = (task.status === "Not Completed") ? "Completed" : "Not Completed";
    await task.save();
    res.redirect('/');
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
