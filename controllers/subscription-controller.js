const { ctrlWrapper, sendEmail } = require("../helpers");

const { Subscription } = require("../models/subscription-model");

const sendSubscriptionEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    let subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription) {
      subscription = new Subscription({ user: req.user._id });
    }

    if (!subscription.emails.includes(email)) {
      subscription.emails.push(email);
      await subscription.save();

      const subscriptionEmail = {
        to: email,
        subject: "Subscription Confirmation",
        html: "Thank you for subscribing to the So Yummy newsletter!",
      };

      await sendEmail(subscriptionEmail);
      res.json({ message: "Subscription email sent successfully" });
    } else {
      res.status(400).json({ error: "This email is already subscribed to the newsletter" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendSubscriptionEmail: ctrlWrapper(sendSubscriptionEmail),
};