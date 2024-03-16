const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email: normalizedEmail,
      password: passwordHash,
    });
    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}
async function login(req, res, next) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    console.log(req.user.id);
    const customer = await User.findById(req.user.id);
    if (!customer) {
      return res.status(401).json({ message: "Not authorized" });
    }
    customer.token = null;
    res.status(204).json({ message: "No content" });
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  try {
    const currentUser = req.user;
    console.log(currentUser);
    res.status(200).json({
      email: currentUser.email,
      subscription: currentUser.subscription,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = { register, login, logout, current };
