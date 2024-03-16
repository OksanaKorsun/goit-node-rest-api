const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "undefined") {
    return res.status(401).json({ message: "Not authorized" });
  }
  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expire" });
      }

      return res.status(401).json({ message: "Not authorized" });
    }
    const user = await User.findById(decode.id);
    if (user === null) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    req.token = token;
    next();
  });
}
module.exports = auth;
