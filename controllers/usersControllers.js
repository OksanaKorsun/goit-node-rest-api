// import crypto from "node:crypto";
import { nanoid } from "nanoid";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import gravatar from "gravatar";
import Jimp from "jimp";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export async function register(req, res, next) {
  const { email, password, subscription } = req.body;
  const normalizedEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
    const verificationToken = nanoid();
    await transporter.sendMail({
      to: email,
      from: "oksana2081989@gmail.com",
      subject: "Welcome to Contact Book",
      html: `To confirm your registration, please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your registration, please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });
    const newUser = await User.create({
      verificationToken,
      email: normalizedEmail,
      password: passwordHash,
      subscription,
      avatarURL,
    });

    await newUser.save();
    if (!newUser) {
      throw HttpError(400, "Bad request");
    }
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function login(req, res, next) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }
    if (user.verify === false) {
      throw HttpError(401, "Your account is not verified");
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

export async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });
    res.status(204).json({ message: "No content" });
  } catch (error) {
    next(error);
  }
}

export async function current(req, res, next) {
  try {
    const currentUser = req.user;
    res.status(200).json({
      email: currentUser.email,
      subscription: currentUser.subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (user === null) {
      throw HttpError(404, "User not found");
    }
    if (user.avatarURL === null) {
      throw HttpError(404, "Avatar not found");
    }

    if (user.avatarURL.includes("gravatar.com")) {
      return res.redirect(user.avatarURL);
    } else {
      return res.sendFile(
        path.join(process.cwd(), "public/avatars", user.avatarURL)
      );
    }
  } catch (error) {
    next(error);
  }
}
export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      throw HttpError(400, "No file uploaded");
    }

    const image = await Jimp.read(req.file.path);

    image.resize(250, 250).greyscale().write(req.file.path);
    await fs.rename(
      req.file.path,
      path.join(process.cwd(), "public/avatars", req.file.filename)
    );

    const avatarURL = path.join("/avatars", req.file.filename);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarURL },
      { new: true }
    );

    if (user === null) {
      throw HttpError(404, "User not found");
    }
    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

export async function verify(req, res, next) {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (user === null) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

export async function reVerify(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user === null) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verificationToken = nanoid();

    user.verificationToken = verificationToken;
    await user.save();

    await transporter.sendMail({
      to: email,
      from: "oksana2081989@gmail.com",
      subject: "Welcome to Contact Book",
      html: `To confirm your registration, please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your registration, please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}
