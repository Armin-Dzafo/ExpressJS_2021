const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const User = require('../models/User');
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ userCount: users.length, users });
};

const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id ${req.params.id}`);
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
    // console.log(req.user);
    // if (!req.user) {
    //     throw new CustomError.NotFoundError('No user currenty logged in');
    // }
    // still logging previously logged out user
    res.status(StatusCodes.OK).json({ user: req.user });
};

// update user with user.save()
const updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ _id: req.user.userId });

    user.name = name;
    user.email = email;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
    console.log(req.body);
    const { oldPassword, newPassword } = req.body;
    if (!newPassword || !oldPassword) {
        throw new CustomError.BadRequestError('Please provide both values');
    }
    const user = await User.findOne({ _id: req.user.userId });

    const isCorrectPassword = await user.comparePasswords(oldPassword);
    if (!isCorrectPassword) {
        throw new CustomError.UnauthenticatedError('Invalid password');
    }
    // await User.findOne({ password: oldPassword }).update({ password: req.body.newPassword });
    user.password = newPassword;
    // res.send(req.body);
    // save the user
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Password succesfully changed' });
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
};

// update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//     const { name, email } = req.body;
//     if (!name || !email) {
//         throw new CustomError.BadRequestError('Please provide all values');
//     }
//     const user = await User.findOneAndUpdate(
//         { _id: req.user.userId },
//         { email, name },
//         { new: true, runValidators: true },
//     );
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({ res, user: tokenUser });
//     res.status(StatusCodes.OK).json({ user: tokenUser });
// };