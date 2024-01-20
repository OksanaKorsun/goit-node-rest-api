const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");
//get
async function listContacts() {
  try {
    const list = await fs.readFile(contactsPath);
    return JSON.parse(list);
  } catch (error) {
    throw error;
  }
}
//get
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
  } catch (error) {
    throw error;
  }
}
// delete
async function removeContact(contactId) {
  try {
    const allContacts = await listContacts();
    const index = allContacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    const [result] = allContacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return result;
  } catch (error) {
    throw error;
  }
}
//post
async function addContact({ name, email, phone }) {
  try {
    const allContacts = await listContacts();
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    allContacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return newContact;
  } catch (error) {
    throw error;
  }
}
//put - повністю!, patch - частково
async function updateContact({ contactId, name, email, phone }) {
  try {
    const allContacts = await listContacts();
    const index = allContacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) return null;
    allContacts[index] = { contactId, name, email, phone };
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return allContacts[index];
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
