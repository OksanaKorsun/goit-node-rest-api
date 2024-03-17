const contactsService = require("../services/contactsServices.js");
const HttpError = require("../helpers/HttpError.js");

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts(req.user._id);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (contact === null) {
      throw HttpError(404);
    }
    if (contact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id);
    if (!contact) {
      throw HttpError(404);
    }
    if (contact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const newContact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      owner: req.user._id,
    };
    const contact = await contactsService.addContact(newContact);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const bodyIsEmpty = Object.keys(req.body).length === 0;

    if (bodyIsEmpty) {
      throw HttpError(400, "Body must have at least one field");
    }

    const result = await contactsService.updateContact(id, contact);

    if (!result) {
      throw HttpError(404);
    }
    if (result.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const favorite = {
      favorite: req.body.favorite,
    };

    const result = await contactsService.updateContact(id, favorite);

    if (result === null) {
      throw HttpError(404);
    }
    if (result.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
};
