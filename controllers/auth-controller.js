const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { uid } = require("uid");

const { User } = require("../models/user-model");

const { ctrlWrapper, HttpError, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uid();
  const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });
  const normalizedAvatarUrl = avatarURL.replace(/^\/\//, 'https://');


  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: normalizedAvatarUrl,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Email verification",
    html: `<a target="_blank" href="${BASE_URL}users/verify/${verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      avatarURL: normalizedAvatarUrl
      // subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
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

  const verifyEmail = {
    to: email,
    subject: "Email verification",
    html: `<a target="_blank" href="${BASE_URL}users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);
  res.status(200).json({ message: "Verification email sent" });
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

  res.status(201).json({
    token,
    user: {
      email: user.email,
      avatarURL: user.avatarURL,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).send();
};

const getCurrent = async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  const { name, avatarURL, verify } = user;

  res.status(200).json({
    email,
    name,
    avatarURL: avatarURL,
    verify,
  });
};

// const updateSubscription = async (req, res) => {
//   const { _id } = req.user;
//   const result = await User.findByIdAndUpdate(_id, req.body, { new: true });

//   res.json(result);
// };

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newName = `${_id}_${filename}`;
  const newPath = path.join(avatarDir, newName);

  await Jimp.read(oldPath)
    .then((image) => {
      image.cover(250, 250).write(newPath);
    })
    .catch((err) => {
      fs.unlink(oldPath);
      throw HttpError(400, err.message);
    });

  fs.unlink(oldPath);
  const avatarURL = path.join("avatars", newName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  // updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
