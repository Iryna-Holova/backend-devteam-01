const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");
const { User } = require("./user-model");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const subscriptionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [emailRegexp, "Invalid email"],
        required: [true, "Email is required"],
        unique: true,
    },
}, { versionKey: false, timestamps: true });

subscriptionSchema.post("save", handleMongooseError);

const Subscription = model("Subscription", subscriptionSchema)

module.exports = { Subscription };
