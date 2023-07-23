const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { uid } = require("uid");

const { User } = require("../models/user-model");

const {
  ctrlWrapper,
  HttpError,
  sendEmail,
  createVerifyEmail,
  cloudinary,
} = require("../helpers");

const { SECRET_KEY } = process.env;

let registrationBaseURL;

const register = async (req, res) => {
  const { baseURL, user } = req.body;
  const { name, email, password } = user;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uid();
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "identicon" });
  const normalizedAvatarUrl = avatarURL.replace(/^\/\//, "https://");

  await User.create({
    name,
    email,
    password: hashPassword,
    avatarURL: normalizedAvatarUrl,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail(email, baseURL, verificationToken);

  await sendEmail(verifyEmail);

  res.status(201).json({ message: "Success registration" });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, {
    token,
    verify: true,
    verificationToken: null,
  });

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      createdAt: user.createdAt,
    },
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  let verificationToken = user.verificationToken;

  if (!verificationToken) {
    verificationToken = uid();
    user.verificationToken = verificationToken;
    await user.save();
  }

  const verifyEmail = createVerifyEmail(
    email,
    registrationBaseURL,
    verificationToken
  );

  const payload = { id: user.id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await sendEmail(verifyEmail);
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      createdAt: user.createdAt,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      createdAt: user.createdAt,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(200).send({ message: "Success log out" });
};

const getCurrent = async (req, res) => {
  const user = req.user;

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      createdAt: user.createdAt,
    },
  });
};

const updateUserProfile = async (req, res) => {
  const { _id } = req.user;
  const { name } = req.body;

  let updatedUser = {};

  if (!name && !req.file) {
    throw HttpError(400, "There must be at least 1 field to update");
  }

  if (name) {
    updatedUser = await User.findByIdAndUpdate(_id, { name }, { new: true });
  }

  if (req.file) {
    const { path: tempFilePath, mimetype } = req.file;

    if (
      !["image/bmp", "image/jpeg", "image/png", "image/jpg"].includes(mimetype)
    ) {
      throw HttpError(400, "Format of the image must me JPEG, PNG, BMP");
    }

    if (!tempFilePath) {
      throw HttpError(400, "No file uploaded");
    }

    const avatar = await Jimp.read(tempFilePath);
    const resizedAvatar = avatar.cover(250, 250);
    const avatarPath = `temp/${_id}_${Date.now()}.jpg`;
    await resizedAvatar.writeAsync(avatarPath);

    const avatarFileData = await cloudinary.uploader.upload(avatarPath, {
      folder: "avatars",
    });

    updatedUser = await User.findByIdAndUpdate(
      _id,
      { avatarURL: avatarFileData.secure_url },
      { new: true }
    );

    await Promise.allSettled([
      fs.unlink(tempFilePath, function (err) {
        if (err) console.log(err);
      }),
      fs.unlink(avatarPath, function (err) {
        if (err) console.log(err);
      }),
    ]);
  }

  res.json({
    message: "User profile updated successfully",
    user: {
      name: updatedUser.name,
      avatarURL: updatedUser.avatarURL,
    },
  });
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateUserProfile: ctrlWrapper(updateUserProfile),
};
