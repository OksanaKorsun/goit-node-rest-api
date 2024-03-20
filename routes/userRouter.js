import express from "express";
import {
  register,
  login,
  logout,
  current,
  getAvatar,
  uploadAvatar,
} from "../controllers/usersControllers.js";
import upload from "../middleware/upload.js";
import auth from "../middleware/verifyAuth.js";
import userSchema from "../schemas/usersSchemas.js";
import validateBody from "../middleware/validateBody.js";
const userRouter = express.Router();
userRouter.post("/register", validateBody(userSchema), register);
userRouter.post("/login", validateBody(userSchema), login);
userRouter.post("/logout", auth, logout);
userRouter.get("/current", auth, current);
userRouter.get("/avatars", auth, getAvatar);
userRouter.patch("/avatars", upload.single("avatarURL"), auth, uploadAvatar);

export default userRouter;
