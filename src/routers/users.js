import express from "express";
import User from "../models/User.js";
import { isValidOperation } from "../lib/utils.js";
const router = new express.Router();

// Create a new User
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(202).send(user); // .send is a method that returns a message to the browser
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all Users
router.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(505).send(err);
  }
});

// Get a single User by ID
router.get("/users/:id", async (req, res) => {
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

// Update a User by ID
router.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const allowedUpdates = isValidOperation(req.body, [
    "name",
    "age",
    "email",
    "password",
  ]);

  if (!allowedUpdates) {
    return res.status(400).send({ message: "Invalid updates." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a User by ID
router.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found." });
    }
    res.send(deletedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;