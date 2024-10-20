import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"], // Custom error message for required fields
    trim: true, // Automatically removes surrounding whitespace
  },
  age: {
    type: Number,
    min: [0, "Age must be a positive number"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true, // Removes whitespace
    lowercase: true,
    validate: [validator.isEmail, "Email must be valid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    validate: {
      validator(password) {
        if (password.toLowerCase().includes("password")) {
          throw new Error('Password must not contain the word "password"');
        }
        return validator.isStrongPassword(password);
      },
      message: "Password must be strong",
    },
    // select: false, // Don't return password in the response
  },
});

const User = mongoose.model("User", UserSchema);
export default User;

// Usage example
const user = new User({
  name: "       test user   ",
  age: 100,
  email: "",
  password: "23553319Joel.",
});
user.save().then(console.log).catch(console.error);
