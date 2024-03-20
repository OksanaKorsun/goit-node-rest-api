import HttpError from "../helpers/HttpError.js";
import mongoose from "mongoose";

const validateIdMiddleware = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(HttpError(400, "Invalid contact ID"));
  } else {
    next();
  }
};

export default validateIdMiddleware;
