import express from "express";
import connectDB from "./config/db.js";
import userRouter from "./routers/users.js";
import taskRouter from "./routers/tasks.js";

const port = process.env.PORT || 3000;
const app = express();
connectDB();

// Middleware to handle maintenance
/* app.use((req, res, next) => {
  res.status(503).send("Page is under maintenance. Please try again later.");
}); */

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
