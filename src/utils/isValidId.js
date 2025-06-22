import createError from 'http-errors';
   import mongoose from 'mongoose';

   export const isValidId = (req, res, next) => {
     const { contactId } = req.params;
     if (!mongoose.isValidObjectId(contactId)) {
       throw createError(400, 'Invalid contact ID');
     }
     next();
   };
