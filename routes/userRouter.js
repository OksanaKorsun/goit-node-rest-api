import express from "express";
import {
  register,
  login,
  logout,
  current,
  getAvatar,
  uploadAvatar,
  verify,
  reVerify,
} from "../controllers/usersControllers.js";
import upload from "../middleware/upload.js";
import auth from "../middleware/verifyAuth.js";
import { userSchema, emailUserSchema } from "../schemas/usersSchemas.js";
import validateBody from "../middleware/validateBody.js";
const userRouter = express.Router();
userRouter.post("/register", validateBody(userSchema), register);
userRouter.post("/login", validateBody(userSchema), login);
userRouter.post("/logout", auth, logout);
userRouter.get("/current", auth, current);
userRouter.get("/avatars", auth, getAvatar);
userRouter.patch("/avatars", upload.single("avatarURL"), auth, uploadAvatar);
userRouter.get("/verify/:verificationToken", verify);
userRouter.post("/verify", validateBody(emailUserSchema), reVerify);

export default userRouter;
