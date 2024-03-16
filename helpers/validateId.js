const HttpError = require("./HttpError.js");
const mongoose = require("mongoose");

const validateIdMiddleware = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next(HttpError(400, "Invalid contact ID"));
    } else {
        next();
    }
};

module.exports = validateIdMiddleware;
