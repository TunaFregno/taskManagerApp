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
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;

// Usage example
const task = new Task({
  description: "Make the lugagge",
});

task.save().then(console.log).catch(console.error);
