import express from "express";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Task from "./models/Task.js";

const port = process.env.PORT || 3000;
const app = express();
connectDB();

app.use(express.json());
// Create a new User
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(202).send(user); // .send is a method that returns a message to postman console
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all Users
app.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(505).send(err);
  }
});

// Get a single User by ID
app.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new Task
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(202).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (err) {
    res.status(505).send(err);
  }
});

// Get a single Task by ID
app.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send({ message: "Task not found." });
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
