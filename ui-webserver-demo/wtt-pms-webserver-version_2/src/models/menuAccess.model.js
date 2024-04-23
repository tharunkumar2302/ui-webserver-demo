const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const menuAccessSchema = mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SystemRole',
    required: true,
  },
  screen: {
    type: Array,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

menuAccessSchema.plugin(toJSON);
menuAccessSchema.plugin(paginate);

const MenuAccess = mongoose.model('menuaccess', menuAccessSchema);
module.exports = MenuAccess;
