const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
    const accessTokenJWT = createJWT({ payload: { user } });
    const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

    // expiration: 1 day
    const oneDay = 1000 * 60 * 60 * 24;

    // expiration: 30 days
    const longerExpiration = 1000 * 60 * 60 * 24 * 30;


    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });

    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        expires: new Date(Date.now() + longerExpiration),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });
};

// const attachSingleCookieToResponse = ({ res, user }) => {
//     const token = createJWT({ payload: user });

//     // expiration: 1 day
//     const oneDay = 1000 * 60 * 60 * 24;

//     // expiration: 5 seconds
//     // const fiveSeconds = 1000 * 5;

//     res.cookie('token', token, {
//         httpOnly: true,
//         expires: new Date(Date.now() + oneDay),
//         // expires: new Date(Date.now() + fiveSeconds),
//         secure: process.env.NODE_ENV === 'production',
//         signed: true,
//     });
// };

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
};
