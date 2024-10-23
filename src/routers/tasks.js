import express from "express";
import Task from "../models/Task.js";
import { isValidOperation } from "../lib/utils.js";
const router = new express.Router();

// Create a new Task
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(202).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all Tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (err) {
    res.status(505).send(err);
  }
});

// Get a single Task by ID
router.get("/tasks/:id", async (req, res) => {
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

// Update a Task by ID
router.patch("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = isValidOperation(updates, [
    "description",
    "completed",
  ]);

  if (!allowedUpdates) {
    return res.status(400).send({ message: "Invalid updates." });
  }

  try {
    const updatedTask = await Task.findById(_id);

    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found." });
    }

    updates.forEach((update) => (updatedTask[update] = req.body[update]));
    await updatedTask.save();
    res.send(updatedTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a Task by ID
router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete(_id);
    if (!deletedTask) {
      return res.status(404).send({ message: "Task not found." });
    }
    res.send(deletedTask);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
