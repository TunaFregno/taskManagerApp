import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    unique: true,
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
    //select: false, // Don't return password in the response
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// middlewares for logging
UserSchema.methods.generateAuthToken = async function () {
  // We dont want to use arrow function because we need to bind with "this"
  // "methods" are accessible on the instances, sometimes called "instance methods"
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "secretKey", {
    expiresIn: "1h",
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  // "statics" methods are accessible on the model, sometimes called "model methods"
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return user;
};

//middleware for password hashing
UserSchema.pre("save", async function (next) {
  // We dont want to use arrow function because we need to bind with "this"
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(8); // is a random string added to the password before hashing it.
    user.password = await bcrypt.hash(user.password, salt);
  }
  next(); // it allows the function to know the process is finished
});

const User = mongoose.model("User", UserSchema);
export default User;

// Usage example
/* const user = new User({
  name: "       test user   ",
  age: 100,
  email: "",
  password: "23553319Joel.",
});
user.save(); */
