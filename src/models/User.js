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

// We are gonna set up a virtual property, that is not actual data stored in the database, is a relationship between two entities, in this case Task and User.
// With this we dont need to modify the userSchema to store an array of tasks the the user creates.
// It is virtual because we are not actually changing what we store in the user document, it is just a way for mongoose to figure out how these two things are related.
UserSchema.virtual("tasks", {
  // the name 'tasks' here is a name for a virtual field, just to understand what are we making this for.
  ref: "Task", // refers to the model Task
  localField: "_id", // refers to the local field (User._id)
  foreignField: "owner", // refers to the foreign field (Task.owner)
});

// Hidding private data from the user information returned
// for every ".res.send" function made the method "stringify" is called and that also calls ".toJSON" method that allow us to change the information that is returned
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

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
