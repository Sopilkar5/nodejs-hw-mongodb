import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody, createContactSchema, updateContactSchema } from '../utils/validate.js';
import { isValidId } from '../utils/isValidId.js';

const router = express.Router();

router.use(authenticate);
router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContact));
router.patch('/:contactId', isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
