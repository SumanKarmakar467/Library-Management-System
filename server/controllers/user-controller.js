const { UserModel } = require('../models');

const SUB_DAYS = {
  Basic: 90,
  Standard: 180,
  Premium: 365,
};

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d;
  const parts = String(value).split('/');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map(Number);
    const parsed = new Date(yyyy, mm - 1, dd);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

function calcFine(user) {
  const now = new Date();
  const returnDate = parseDate(user.returnDate);
  const subDate = parseDate(user.subscriptionDate);
  const membership = user.membership || user.subscriptionType;

  const overdue = returnDate ? returnDate < now : false;
  const subExpired = subDate && membership
    ? new Date(subDate.getTime() + (SUB_DAYS[membership] || 0) * 24 * 60 * 60 * 1000) < now
    : false;

  if (overdue && subExpired) return 200;
  if (overdue || subExpired) return 100;
  return 0;
}

exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().sort({ createdAt: -1 }).lean();
  return res.status(200).json({ success: true, data: users });
};

exports.getSingleUserById = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ id }).lean();

  if (!user) {
    return res.status(404).json({ success: false, message: `User Not Found for id: ${id}` });
  }

  return res.status(200).json({ success: true, data: user });
};

exports.createUser = async (req, res) => {
  const { id, name, email, role, membership, subscriptionDate } = req.body;

  if (!id || !name || !email || !role || !membership || !subscriptionDate) {
    return res.status(400).json({ success: false, message: 'Please provide all the required fields' });
  }

  const existing = await UserModel.findOne({ id }).lean();
  if (existing) {
    return res.status(409).json({ success: false, message: `User Already Exists with id:${id}` });
  }

  await UserModel.create({ id, name, email, role, membership, subscriptionDate });

  return res.status(201).json({ success: true, message: 'User Created Successfully' });
};

exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide the data to update the user' });
  }

  const updatedUser = await UserModel.findOneAndUpdate({ id }, { $set: data }, { new: true }).lean();

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: `User Not Found for id: ${id}` });
  }

  return res.status(200).json({ success: true, data: updatedUser, message: 'User Updated Successfully' });
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findOne({ id }).lean();
  if (!user) {
    return res.status(404).json({ success: false, message: `User Not Found for id: ${id}` });
  }

  if (user.issueBook) {
    return res.status(400).json({ success: false, message: 'Cannot delete user. User has an issued book.' });
  }

  await UserModel.deleteOne({ id });

  return res.status(200).json({ success: true, message: 'User Deleted Successfully' });
};

exports.getSubscriptionDetailsById = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ id }).lean();

  if (!user) {
    return res.status(404).json({ success: false, message: `User Not Found for id: ${id}` });
  }

  const membership = user.membership || user.subscriptionType || 'Basic';
  const subDate = parseDate(user.subscriptionDate);
  const validTill = subDate
    ? new Date(subDate.getTime() + (SUB_DAYS[membership] || 0) * 24 * 60 * 60 * 1000).toISOString()
    : null;

  return res.status(200).json({
    success: true,
    data: {
      ...user,
      subscriptionType: membership,
      subscriptionDate: user.subscriptionDate || null,
      validTill,
      fine: calcFine(user),
    },
  });
};
