import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getAllContacts, getContactById } from './services/contacts.js';

function setupServer() {
    const app = express();

    app.use(cors());
    app.use(pino());

    app.get('/contacts', async (req, res) => {
        try {
            const contacts = await getAllContacts();
            res.status(200).json({
                status: 200,
                message: 'Successfully found contacts!',
                data: contacts
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Failed to fetch contacts',
                error: error.message
            });
        }
    });

    app.get('/contacts/:contactId', async (req, res) => {
        try {
            const { contactId } = req.params;
            const contact = await getContactById(contactId);

            if (!contact) {
                return res.status(404).json({
                    message: 'Contact not found'
                });
            }

            res.status(200).json({
                status: 200,
                message: `Successfully found contact with id ${contactId}!`,
                data: contact
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Failed to fetch contact',
                error: error.message
            });
        }
    });

    app.use((req, res) => {
        res.status(404).json({
            message: 'Не знайдено'
        });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Сервер запущено на порту ${PORT}`);
    });
}

export { setupServer };
