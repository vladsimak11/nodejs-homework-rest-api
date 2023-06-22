const { HttpError } = require("../helpers");

const validateFavoriteBody = (scheme) => {

  const func = (req, res, next) => {

  if(Object.keys(req.body).length == 0) {
    throw HttpError(400, "missing field favorite");
  }
  
  const { error } = scheme.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
  }

    next();
  }

  return func;
};

module.exports = validateFavoriteBody;