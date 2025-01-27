const mongoose = require("mongoose");
const { Contact } = require("./utils");
require('dotenv').config();


mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', () => {
  console.log('Database connection successful');
});
``
async function addContact(contact) {
  try {
    const newContact = new Contact(contact);
    await newContact.save();
    console.log('Contact added successfully');
    return contact;
  } catch (error) {
    console.error('Error adding contact:', error.message);
  }
}

async function listContacts() {
  try {
    return await Contact.find();
  } catch (error) {
    console.error('Error retrieving contacts:', error.message);
  }
}

async function getById(id) {
  try {
    const contact = await Contact.findById(id);
    if (contact) {
      return await Contact.findById(id);
    } else {
      return;
    }
  } catch (error) {
    console.error('Error retrieving contact:', error.message);
  }
}

async function removeContact(id) {
  try {
    const result = await Contact.findByIdAndDelete(id);
    console.log(result)
    if (result) {
      return result;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error deleting contact:', error.message);
  }
}

async function updateContact(id, updatedContact) {
  try {
    const result = await Contact.findByIdAndUpdate(id, updatedContact, {
      new: true,
    });
    if (result) {
      return updatedContact;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error updating contact:', error.message);
  }
}

async function updateStatusContact(contactId, favorite) {
  try {
    const contact = await Contact.findByIdAndUpdate(contactId, {favorite}, { new: true });
    if (!contact) {
      return;
    }
    return contact;
  } catch (error) {
    throw new Error('Failed to update contact: ' + error.message);
  }
}


module.exports = { listContacts, getById, addContact, removeContact, updateContact, updateStatusContact };
