const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
          throw new Error('Invalid mobile number');
        }
      },
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'resumes', required: false },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    pricingPlan: {
      type: mongoose.Schema.Types.ObjectId,
       ref: 'pricingplan',
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'SystemRole', required: true },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    createdByUserId: {
      type: String,
      ref: 'User',
      required: false,
    },

    modifiedByUserId: {
      type: String,
      ref: 'User',
      required: false,
    },
    createdByUserRole: {
      type: String,
      ref: 'User',
      required: false,
    },

    modifiedByUserRole: {
      type: String,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if user exist
 * @param {ObjectId} [userId] - The id of the user
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUserExists = async function (userId) {
  const user = await this.findById(userId);
  return !!user;
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (emailAddress, excludeUserId) {
  const user = await this.findOne({ emailAddress, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 6);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
