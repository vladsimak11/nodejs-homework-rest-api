const contacts = require("../models/contacts");

const { addSchema } = require("../validator/contacts");

const { HttpError } = require("../helpers");

const listContacts = async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

const getContactById = async (req, res, next) => {
  try {

    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if(!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);

  } catch (error) {
    next(error);
  }
}

const addContact = async (req, res, next) => {
  try {
    const {error, value} = addSchema.validate(req.body);
    if(error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
}

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);

    if(!result) {
      throw HttpError(404, "Not found");
    }

    res.json({
      message: "contact deleted"
    })
  } catch (error) {
    next(error);
  }
}

const updateContact = async (req, res, next) => {
  try {
    const {error} = addSchema.validate(req.body);
    if(error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if(!result) {
      throw HttpError(404, "missing fields");
    }
    res.json(result);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact

}