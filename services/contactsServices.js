import Contact from "../models/contact.js";

async function listContacts(userId) {
  try {
    const result = await Contact.find({ owner: userId });
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

async function addContact({ name, email, phone, owner }) {
  try {
    const newContact = {
      name,
      email,
      phone,
      owner,
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

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
