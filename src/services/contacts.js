import Contact from '../model/contact.js';

export async function getAllContacts(page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filters = {}, userId) {
  try {
    const query = { userId, ...filters };
    const totalItems = await Contact.countDocuments(query);
    const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const contacts = await Contact.find(query)
      .sort(sortOption)
      .skip((page - 1) * perPage)
      .limit(perPage);
    return { contacts, totalItems };
  } catch (error) {
    throw new Error(`Error fetching contacts: ${error.message}`);
  }
}

export async function getContactById(contactId, userId) {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
    return contact;
  } catch (error) {
    throw new Error(`Error fetching contact with id ${contactId}: ${error.message}`);
  }
}

export async function createContact(data, userId) {
  try {
    const contact = await Contact.create({ ...data, userId });
    return contact;
  } catch (error) {
    throw new Error(`Error creating contact: ${error.message}`);
  }
}

export async function updateContact(contactId, updates, userId) {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      updates,
      { new: true }
    );
    return contact;
  } catch (error) {
    throw new Error(`Error updating contact with id ${contactId}: ${error.message}`);
  }
}

export async function deleteContact(contactId, userId) {
  try {
    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
    return contact;
  } catch (error) {
    throw new Error(`Error deleting contact with id ${contactId}: ${error.message}`);
  }
}
