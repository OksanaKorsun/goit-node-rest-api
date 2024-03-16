const express = require("express");
const {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} = require("../controllers/contactsControllers.js");
const validateBody = require("../helpers/validateBody");
const shema = require("../schemas/contactsSchemas");
const validateId = require("../helpers/validateId");

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
module.exports = contactsRouter;
