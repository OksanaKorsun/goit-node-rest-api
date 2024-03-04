const fs = require("node:fs/promises");
const { nanoid } = require("nanoid");

const path = require("node:path");

const contactsPath = path.resolve(__dirname, "..", "db", "contacts.json");

async function listContacts() {
  try {
    const list = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(list);
  } catch (error) {
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
  } catch (error) {
    throw error;
  }
}
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
    console.log(newContact);
    return newContact;
  } catch (error) {
    throw error;
  }
}

async function updateContact(contactId, updatedFields) {
  try {
    const allContacts = await listContacts();
    const index = allContacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) return null;
    const updatedContact = { ...allContacts[index], ...updatedFields };
    allContacts[index] = updatedContact;
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
