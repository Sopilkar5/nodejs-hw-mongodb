import Contact from '../model/modlcontact.js';

export async function getAllContacts() {
    try {
        const contacts = await Contact.find();
        return contacts;
    } catch (error) {
        throw new Error(`Error fetching contacts: ${error.message}`);
    }
}

export async function getContactById(contactId) {
    try {
        const contact = await Contact.findById(contactId);
        return contact;
    } catch (error) {
        throw new Error(`Error fetching contact with id ${contactId}: ${error.message}`);
    }
}

export async function createContact(data) {
    try {
        const contact = await Contact.create(data);
        return contact;
    } catch (error) {
        throw new Error(`Error creating contact: ${error.message}`);
    }
}

export async function updateContact(contactId, updates) {
    try {
        const contact = await Contact.findByIdAndUpdate(contactId, updates, { new: true });
        return contact;
    } catch (error) {
        throw new Error(`Error updating contact with id ${contactId}: ${error.message}`);
    }
}

export async function deleteContact(contactId) {
    try {
        const contact = await Contact.findByIdAndDelete(contactId);
        return contact;
    } catch (error) {
        throw new Error(`Error deleting contact with id ${contactId}: ${error.message}`);
    }
}
