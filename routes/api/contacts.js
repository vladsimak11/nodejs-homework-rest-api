const express = require('express');
const router = express.Router();

const { validateBody } = require("../../middlewares");
const schemas = require("../../validator/contacts");

const { listContacts, getContactById, addContact, removeContact, updateContact } = require("../../controllers/contacts");

router.get('/', listContacts);

router.get('/:contactId', getContactById);

router.post('/', validateBody(schemas.addSchema), addContact)

router.delete('/:contactId', removeContact)

router.put('/:contactId', validateBody(schemas.addSchema),updateContact)

module.exports = router
