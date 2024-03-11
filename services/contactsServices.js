const Contact = require("../models/contact.js");

async function listContacts() {
  try {
    const result = await Contact.find();
    return result;
  } catch (error) {
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const result = Contact.findById(contactId);
    return result || null;
  } catch (error) {
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const result = await Contact.findByIdAndDelete(contactId);
    return result;
  } catch (error) {
    throw error;
  }
}

async function addContact({ name, email, phone }) {
  try {
    const newContact = {
      name,
      email,
      phone,
    };
    const result = await Contact.create(newContact);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateContact(contactId, updatedFields) {
  try {
    const result = await Contact.findByIdAndUpdate(contactId, updatedFields, {
      new: true,
    });
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
