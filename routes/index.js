const express = require("express");
const contactsRouter = require("./contactsRouter.js");
const userRouter = require("./userRouter.js");
const auth = require("../helpers/verifyAuth.js");

const router = express.Router();
router.use("/users", userRouter);
router.use("/contacts", auth, contactsRouter);

module.exports = router;
