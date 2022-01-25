const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const CustomError = require('../errors');
const { attachCookiesToResponse } = require('../utils');

const register = async (req, res) => {
    // console.log(req.body.email);
    const { name, email, password } = req.body;
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new CustomError.BadRequestError('Email already exists');
    }
    // only the first user on database can be admin
    const isFirstUser = await User.countDocuments({}) === 0;
    const role = isFirstUser ? 'admin' : 'user';
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    // issue token
    // eslint-disable-next-line no-underscore-dangle
    const tokenUser = { name: user.name, userId: user._id, role: user.role };
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Enter valid email and password');
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid email and/or password - email wrong');
    }
    const isCorrectPassword = await user.comparePasswords(password);
    if (!isCorrectPassword) {
        throw new CustomError.UnauthenticatedError('Invalid email and/or password - password wrong');
    }
    // eslint-disable-next-line no-underscore-dangle
    const tokenUser = { name: user.name, userId: user._id, role: user.role };
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const logout = async (req, res) => {
    // sset value of token to 'logout' (or any string) to delete it
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 1000),
        // expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

module.exports = {
    register,
    login,
    logout,
};
