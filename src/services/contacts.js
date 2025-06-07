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
