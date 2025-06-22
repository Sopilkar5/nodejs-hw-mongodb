import Contact from '../model/modlcontact.js';

   export async function getAllContacts(page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filters = {}) {
       try {
           const totalItems = await Contact.countDocuments(filters);
           const sortOption = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
           const contacts = await Contact.find(filters)
               .sort(sortOption)
               .skip((page - 1) * perPage)
               .limit(perPage);
           return { contacts, totalItems };
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
