import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    //index: true, // Index for faster search by owner ID.
    /* validate: {
      validator: async function (v) {
        const user = await User.findById(v);
        if (!user) {
          throw new Error("Invalid owner ID");
        }
        return true;
      },
      message: "Invalid owner ID",
    }, */
  },
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;

// Usage example
/* const task = new Task({
  description: "Make the lugagge",
});

task.save().then(console.log).catch(console.error); */
