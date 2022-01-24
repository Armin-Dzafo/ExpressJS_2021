const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
    const { token } = req.signedCookies;

    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication invalid');
    }

    try {
        const payload = isTokenValid({ token });
        // eslint-disable-next-line no-underscore-dangle
        req.user = { name: payload.name, userId: payload.userId, role: payload.role };
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication invalid');
    }
};

const authorizePermissions = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        throw new CustomError.UnauthorizedError('Unauthorized to access this route');
    }
    next();
};

module.exports = {
    authenticateUser,
    authorizePermissions,
};
