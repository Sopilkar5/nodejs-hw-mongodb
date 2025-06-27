import Contact from '../model/contact.js';
import cloudinary from '../config/cloudinary.js';
import createError from 'http-errors';

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
  } catch {
    throw createError(500, `Error fetching contacts`);
  }
}

export async function getContactById(contactId, userId) {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
    return contact;
  } catch {
    throw createError(500, `Error fetching contact with id ${contactId}`);
  }
}

export async function createContact(data, userId) {
  try {
    const contact = await Contact.create({ ...data, userId });
    return contact;
  } catch {
    throw createError(500, `Error creating contact`);
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
  } catch {
    throw createError(500, `Error updating contact with id ${contactId}`);
  }
}

export async function deleteContact(contactId, userId) {
  try {
    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
    return contact;
  } catch {
    throw createError(500, `Error deleting contact with id ${contactId}`);
  }
}

export async function uploadContactPhoto(file) {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) {
          reject(createError(500, 'Failed to upload image to Cloudinary'));
        } else {
          resolve(result);
        }
      }).end(file.buffer);
    });
    return result.secure_url;
  } catch {
    throw createError(500, `Error uploading photo`);
  }
}
