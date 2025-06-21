import express from 'express';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody, createContactSchema, updateContactSchema } from '../utils/validate.js';
import { isValidId } from '../utils/isValidId.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
