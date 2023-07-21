const { ctrlWrapper, sendEmail, HttpError } = require("../helpers");

const { Subscription } = require("../models/subscription-model");

const sendSubscriptionEmail = async (req, res, next) => {
  const { email } = req.body;
  const { _id: user } = req.user;

  const isUserExist = await Subscription.findOne({ user });

  if (!isUserExist) {
    await Subscription.create({ user, emails: [email] });
  }

  if (isUserExist) {
    const isEmailDoubled = isUserExist.emails.includes(email);

    if (isEmailDoubled) {
      throw HttpError(
        400,
        "This email is already subscribed to the newsletter"
      );
    }

    await Subscription.findOneAndUpdate(
      { user },
      { $push: { emails: email } },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  const subscriptionEmail = {
    to: email,
    subject: "Subscription Confirmation",
    html: "Thank you for subscribing to the So Yummy newsletter!",
  };

  await sendEmail(subscriptionEmail);
  res.json({ message: "Subscription email sent successfully" });
};

module.exports = {
  sendSubscriptionEmail: ctrlWrapper(sendSubscriptionEmail),
};
