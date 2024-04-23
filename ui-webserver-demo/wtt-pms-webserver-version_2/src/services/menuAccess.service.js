const httpStatus = require('http-status');
const { MenuAccess } = require('../models');
const ApiError = require('../utils/ApiError');

const createMenuAccess = async (menuAccessBody) => {
  const menuAccess = await MenuAccess.create(menuAccessBody);
  return MenuAccess.findById(menuAccess.id).populate('role');
};

const getmenuAccessById = async (id) => {
  return MenuAccess.findById(id).populate('role');
};

const getmenuAccessByRole = async (id) => {
  return MenuAccess.findOne({ role: id }).populate('role');
};

const updateMenuAccessById = async (menuAccessId, updateBody) => {
  const roleItem = await getmenuAccessByRole(menuAccessId);
  if (!roleItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(roleItem, updateBody);
  await roleItem.save();

  return getmenuAccessByRole(menuAccessId);
};

const deleteMenuAccessById = async (MenuAccessId) => {
  const roleItem = await getmenuAccessById(MenuAccessId);
  if (!roleItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
  }

  await roleItem.remove();
  return roleItem;
};

module.exports = { createMenuAccess, updateMenuAccessById, getmenuAccessById, deleteMenuAccessById };
