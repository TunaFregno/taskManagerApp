import express from "express";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Task from "./models/Task.js";

const port = process.env.PORT || 3000;
const app = express();
connectDB();

app.use(express.json());
// Create a new User
app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(202).send(user); // .send is a method that returns a message to postman console
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Get all Users
app.get("/users", (req, res) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(505).send(err);
    });
});

// Get a single User by ID
app.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Create a new Task
app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(202).send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Get all Tasks
app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch(() => {
      res.status(500).send();
    });
});

// Get a single Task by ID
app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((task) => {
      if (!task) {
        return res.status(404).send({ message: "Task not found." });
      }
      res.send(task);
    })
    .catch((err) => {
      res.status(505).send();
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
