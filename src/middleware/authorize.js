require('dotenv').config();
//const jwt = require('jsonwebtoken');
const jwt = require('express-jwt');
const models = require('../database/models');

/**
 * This function is used to verify token with JWT, attach user object into the req and continue.
 * Otherwise, send error.
 */
// const authorize = (req, res, next) => {
//     try{
//         const token = req.header('Authorization').replace('Bearer ', '');
//         if(token) {
//             jwt.verify(token, process.env.JWT_ACC_ACTIVATE, (err, user) => {
//                 if (err) {
//                     res.status(401).send({ success: false, error: 'Token Expired' })
//                 }
//
//                 req.user = user
//                 next();
//             });
//         }
//     } catch (error) {
//         res.status(401).send({success: false, error: 'Please authenticate.'});
//     }
// }
const secret = process.env.JWT_ACC_ACTIVATE
function authorize() {
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256'] }),

        // attach full user record to request object
        async (req, res, next) => {
            // get user with id from token 'sub' (subject) property
            const user = await models.User.findByPk(req.user.sub);

            // check user still exists
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}
module.exports = {
    authorize,
}