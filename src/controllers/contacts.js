import createError from 'http-errors';
import { getAllContacts as getAllContactsService, getContactById as getContactByIdService, createContact as createContactService, updateContact as updateContactService, deleteContact as deleteContactService } from '../services/contacts.js';

export async function getAllContacts(req, res) {
    const contacts = await getAllContactsService();
    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts
    });
}

export async function getContactById(req, res) {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
    });
}

export async function createContact(req, res) {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const contact = await createContactService({ name, phoneNumber, email, isFavourite, contactType });
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact
    });
}

export async function updateContact(req, res) {
    const { contactId } = req.params;
    const updates = req.body;
    const contact = await updateContactService(contactId, updates);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: contact
    });
}

export async function deleteContact(req, res) {
    const { contactId } = req.params;
    const contact = await deleteContactService(contactId);
    if (!contact) {
        throw createError(404, 'Contact not found');
    }
    res.status(204).send();
}
