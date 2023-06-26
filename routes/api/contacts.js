const express = require('express');
const router = express.Router();


const { validateBody, isValidId, validateFavoriteBody } = require("../../middlewares");
const schemas = require("../../validator/contacts");

const { listContacts, getContactById, addContact, removeContact, updateContact, updateFavorite } = require("../../controllers/contacts");

router.get('/', listContacts);

router.get('/:contactId', isValidId, getContactById);

router.post('/', validateBody(schemas.addSchema), addContact);

router.delete('/:contactId', isValidId, removeContact);

router.put('/:contactId', isValidId, validateBody(schemas.addSchema),updateContact);

router.patch('/:contactId/favorite', isValidId, validateFavoriteBody(schemas.updateFavoriteSchema), updateFavorite);

module.exports = router;
