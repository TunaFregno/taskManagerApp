import express from "express";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Task from "./models/Task.js";

const port = process.env.PORT || 3000;
const app = express();
connectDB();

app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
