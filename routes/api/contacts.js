const express = require('express');
const router = express.Router();


const { validateBody, isValidId, validateFavoriteBody, authenticate } = require("../../middlewares");
const schemas = require("../../validator/contacts");

const { listContacts, getContactById, addContact, removeContact, updateContact, updateFavorite } = require("../../controllers/contacts");

router.get('/', authenticate, listContacts);

router.get('/:contactId', authenticate, isValidId, getContactById);

router.post('/', authenticate, validateBody(schemas.addSchema), addContact);

router.delete('/:contactId', authenticate, isValidId, removeContact);

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema),updateContact);

router.patch('/:contactId/favorite', authenticate, isValidId, validateFavoriteBody(schemas.updateFavoriteSchema), updateFavorite);

module.exports = router;
