import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secretKey");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error(); // no need to throw an error,because will trigger the catch
    }

    req.user = user; // string the user so the router doesnt need to fetch it again
    next();
  } catch (err) {
    res.status(401).send("Please authenticate.");
  }
};
