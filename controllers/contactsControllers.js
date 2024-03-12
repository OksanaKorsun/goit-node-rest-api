const contactsService = require("../services/contactsServices.js");
const HttpError = require("../helpers/HttpError.js");
const mongoose = require("mongoose");

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw HttpError(400, "Invalid contact ID");
    }
    const contact = await contactsService.getContactById(id);
    if (!contact) {
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw HttpError(400, "Invalid contact ID");
    }
    const contact = await contactsService.removeContact(id);
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const contact = await contactsService.addContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw HttpError(400, "Invalid contact ID");
    }
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

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw HttpError(400, "Invalid contact ID");
    }
    const favorite = {
      favorite: req.body.favorite,
    };
    const result = await contactsService.updateContact(id, favorite);
    if (result === null) {
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
