const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
var Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { HttpError, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async(req, res, next) => {
  
  try {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    
    if(user) {
      throw HttpError(409, "Email in use");
    };
    
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken });

    const verifyEmail = {
      to: email, 
      subject: 'Verify email',
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);
  
    res.status(201).json({
      user: {
        email: newUser .email,
        subscription: newUser .subscription
      }
    });
  } catch (error) {
    next(error);
  }

};

const verifyEmail = async(req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({verificationToken});
    if(!user){
        throw HttpError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});

    res.status(200).json({
        message: "Verification successful"
    })
  } catch (error) {
    next(error);
  }
}

const resendVerifyEmail = async(req, res, next) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email not found");
    }
    if(user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(200).json({
        message: "Verification email sent"
    });

  } catch (error) {
    next(error);
  }
}

const login = async(req, res, next) => {
  try {
    const { email, password} = req.body;
  
    const user = await User.findOne({email});

    if(!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if(!user.verify) {
      throw HttpError(401, "Email not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if(!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token})
    res.json({  
      token,
      user: {
        email: user.email,
        subscription: user.subscription
      }
    })

  } catch (error) {
    next(error);
  }
};

const getCurrent = async(req, res, next) => {
  try {
    const {email, subscription} = req.user

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
}

const logout = async(req, res, next) => {
  try {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json({ 
      message: "No Content" 
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async(req, res, next) => {
  try {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    
    Jimp.read(tempUpload, (err, img) => {
      if (err) throw err;
      img.resize(250, 250).quality(90).write(resultUpload);
    });

    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({ 
      avatarURL,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
}