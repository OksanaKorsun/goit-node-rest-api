const express = require("express");
const {
  register,
  login,
  logout,
  current,
} = require("../controllers/usersControllers.js");
const auth = require("../helpers/verifyAuth.js");

const userRouter = express.Router();

const userSchema = require("../schemas/usersSchemas.js");
const validateBody = require("../helpers/validateBody");
userRouter.post("/register", validateBody(userSchema), register);
userRouter.post("/login", validateBody(userSchema), login);
userRouter.post("/logout", auth, logout);
userRouter.get("/current", auth, current);

module.exports = userRouter;
