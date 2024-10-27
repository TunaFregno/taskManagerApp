import express from "express";
import User from "../models/User.js";
import { isValidOperation } from "../lib/utils.js";
import { auth } from "../middleware/auth.js";
const router = new express.Router();

// Create/ Signing a new User
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(202).send({ user, token }); // .send is a method that returns a message to the browser
  } catch (err) {
    res.status(400).send(err);
  }
});

// Logging User
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password); // static method
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    const token = await user.generateAuthToken(); // instance method
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ message: "Invalid credentials." });
  }
});

// Logout User
router.post("/users/logout", auth, async (req, res) => {
  try {
    //giving back all the tokens from other devices sessions except from the one the user is logging out of.
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: "User logged out successfully." });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Logout All from all devices sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //Wiping all the tokens from other devices sessions
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: "User logged out of all sessions successfully." });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all Users (/users) to => Get My Profile (users/me ---- > it is not safe to show all users data)
router.get("/users/me", auth, async (req, res) => {
  try {
    //const user = await User.find({});
    //res.send(user);
    res.send(req.user);
  } catch (err) {
    res.status(505).send(err);
  }
});

// Get a single User Comment Out because there is no need to see other users information
/* router.get("/users/:id", async (req, res) => {
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
 */

// Update a User by ID (/users/:id) to => Update User Profile
router.patch("/users/me", auth, async (req, res) => {
  //const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = isValidOperation(updates, [
    "name",
    "age",
    "email",
    "password",
  ]);

  if (!allowedUpdates) {
    return res.status(400).send({ message: "Invalid updates." });
  }

  try {
    /* const updatedUser = req.user;

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    } */

    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Delete a User by ID (/users/:id) to => delete my Profile (/users/me) since you should only be allowed to delete your information.
router.delete("/users/:me", auth, async (req, res) => {
  //const _id = req.params.id; // This is no longer needed because the auth stores the user in the req.
  try {
    // Instead of performing this we can reduce the lines by using .remove() from mongoose
    // We dont need to check if the deletedUser exist because we fetch the user from the database when we did the auth and return it
    /*  const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found." }); 
    } */
    await req.user.deleteOne();
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;
