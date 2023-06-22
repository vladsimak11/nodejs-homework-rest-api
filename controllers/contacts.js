const { Contact } = require("../models/contacts");

const { HttpError } = require("../helpers");

const listContacts = async (req, res, next) => {
  try {
    const result = await Contact.find({}, "-createdAt -updatedAt");
    res.json(result);
  } catch (error) {
    next(error);
  }
}

const getContactById = async (req, res, next) => {
  try {

    const { contactId } = req.params;
    const result = await Contact.findById(contactId);

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
    const result = await Contact.create(req.body);
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
}

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json({
      message: "contact deleted"
    });

  } catch (error) {
    next(error);
  }
}

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});

    if(!result) {
      throw HttpError(404, "Not found");
    }

    res.json(result);

  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});

    if(!result) {
      throw HttpError(404, "Not found");
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
  updateContact,
  updateFavorite,
}