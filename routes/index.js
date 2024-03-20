import express from "express";
import contactsRouter from "./contactsRouter.js";
import userRouter from "./userRouter.js";
import auth from "../middleware/verifyAuth.js";

const router = express.Router();
router.use("/users", userRouter);
router.use("/contacts", auth, contactsRouter);

export default router;
