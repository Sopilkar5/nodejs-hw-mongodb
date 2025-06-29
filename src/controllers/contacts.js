import createError from 'http-errors';
import { getAllContacts as getAllContactsService, getContactById as getContactByIdService, createContact as createContactService, updateContact as updateContactService, deleteContact as deleteContactService, uploadContactPhoto } from '../services/contacts.js';

export async function getAllContacts(req, res) {
  if (!req.user || !req.user._id) {
    throw createError(401, 'Unauthorized: User not authenticated');
  }
  const userId = req.user._id;
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
  const pageNum = parseInt(page, 10);
  const perPageNum = parseInt(perPage, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    throw createError(400, 'Page must be a positive integer');
  }
  if (isNaN(perPageNum) || perPageNum < 1) {
    throw createError(400, 'PerPage must be a positive integer');
  }
  if (!['name'].includes(sortBy)) {
    throw createError(400, 'SortBy must be "name"');
  }
  if (!['asc', 'desc'].includes(sortOrder)) {
    throw createError(400, 'SortOrder must be "asc" or "desc"');
  }
  if (type && !['work', 'home', 'personal'].includes(type)) {
    throw createError(400, 'Type must be one of: work, home, personal');
  }
  if (isFavourite && !['true', 'false'].includes(isFavourite)) {
    throw createError(400, 'isFavourite must be true or false');
  }

  const filters = {};
  if (type) filters.contactType = type;
  if (isFavourite) filters.isFavourite = isFavourite === 'true';

  const { contacts, totalItems } = await getAllContactsService(pageNum, perPageNum, sortBy, sortOrder, filters, userId);
  const totalPages = Math.ceil(totalItems / perPageNum);
  const hasPreviousPage = pageNum > 1;
  const hasNextPage = pageNum < totalPages;

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: pageNum,
      perPage: perPageNum,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
}

export async function getContactById(req, res) {
  const { contactId } = req.params;
  if (!req.user || !req.user._id) {
    throw createError(401, 'Unauthorized: User not authenticated');
  }
  const userId = req.user._id;
  const contact = await getContactByIdService(contactId, userId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContact(req, res) {
  if (!req.user || !req.user._id) {
    throw createError(401, 'Unauthorized: User not authenticated');
  }
  const userId = req.user._id;
  const data = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email || undefined,
    isFavourite: req.body.isFavourite === 'true' || req.body.isFavourite === true,
    contactType: req.body.contactType,
  };

  if (req.file) {
    data.photo = await uploadContactPhoto(req.file);
  }

  const contact = await createContactService(data, userId);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContact(req, res) {
  const { contactId } = req.params;
  if (!req.user || !req.user._id) {
    throw createError(401, 'Unauthorized: User not authenticated');
  }
  const userId = req.user._id;
  const updates = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email || undefined,
    isFavourite: req.body.isFavourite === 'true' || req.body.isFavourite === true,
    contactType: req.body.contactType,
  };

  if (req.file) {
    updates.photo = await uploadContactPhoto(req.file);
  }

  const hasUpdates = Object.keys(updates).some(key => updates[key] !== undefined) || req.file;
  if (!hasUpdates) {
    throw createError(400, 'At least one field or photo must be provided for update');
  }

  const contact = await updateContactService(contactId, updates, userId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
}

export async function deleteContact(req, res) {
  const { contactId } = req.params;
  if (!req.user || !req.user._id) {
    throw createError(401, 'Unauthorized: User not authenticated');
  }
  const userId = req.user._id;
  const contact = await deleteContactService(contactId, userId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
}
