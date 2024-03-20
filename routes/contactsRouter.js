import express from "express";
import {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsControllers.js";
import validateBody from "../middleware/validateBody.js";
import shema from "../schemas/contactsSchemas.js";
import validateId from "../middleware/validateId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", validateId, getContactById);

contactsRouter.delete("/:id", validateId, deleteContact);

contactsRouter.post(
  "/",
  validateBody(shema.createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  validateId,
  validateBody(shema.updateContactSchema),
  updateContact
);
contactsRouter.patch(
  "/:id/favorite",
  validateId,
  validateBody(shema.updateFavoriteSchema),
  updateFavorite
);
export default contactsRouter;
