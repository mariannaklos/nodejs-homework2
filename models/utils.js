const Joi = require("joi");
const mongoose = require('mongoose');
const sgMail = require("@sendgrid/mail");
const { Schema } = mongoose;

const createSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
  avatarURL: String,
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Contact = mongoose.model("contacts", contactSchema);

async function sendVerificationEmail(email, verificationLink) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "kyryvova@gmail.com",
    subject: "Verification mail",
    text: `Please click the following link to verify your email: /user/verify/${verificationLink}`,
    html: `<p>Please click the following link to verify your email: <a href="/user/verify/${verificationLink}">/user/verify/${verificationLink}</a></p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = {
  createSchema,
  updateSchema,
  User,
  Contact,
  sendVerificationEmail,
};
