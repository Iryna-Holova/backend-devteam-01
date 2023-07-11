const { ctrlWrapper, sendEmail } = require("../helpers");

const { Subscription } = require("../models/subscription-model");

const sendSubscriptionEmail = async (req, res, next) => {
    const { email } = req.body;
  
    try {
      const subscription = new Subscription({
        user: req.user._id,
        email,
      });
  
      await subscription.save();
  
      const subscriptionEmail = {
        to: email,
        subject: "Subscription Confirmation",
        html: "Thank you for subscribing to the So Yummy newsletter!",
      };
  
      await sendEmail(subscriptionEmail);
      res.json({ message: "Subscription email sent successfully" });
    } catch (error) {
      if (error.code === 11000 && error.keyValue && error.keyValue.email) {
        res.status(400).json({ error: "This email is already subscribed to the newsletter" });
      } else {
        next(error);
      }
    }
  };

module.exports = {
    sendSubscriptionEmail: ctrlWrapper(sendSubscriptionEmail),
};