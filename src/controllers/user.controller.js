const express = require('express');
const router = express.Router();
const Joi = require('joi');
const userService = require('../services/user.service');
const validateRequest = require('../middleware/validateRequest')
const {authorize} = require('../middleware/authorize');

/**
 *  This function is used to validate schema for user registration
 */
const registerSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            // Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character
            .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,10}$'))
            .min(8)
            .max(15)
            .required()
    });
    validateRequest(req, next, schema);
};

/**
 *  This function is used for user registration
 */
const register = (req, res, next) => {
    userService.create(req.body)
        .then(() => res.json({ status: true, message: 'Registration successful' }))
        .catch(next);
};

/**
 * This function is used to validate schema for user authentication
 */
const authenticateSchema = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
            // Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character
            .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,10}$'))
            .min(8)
            .max(15)
            .required()
    });
    validateRequest(req, next, schema);
};

/**
 * This function is used to authenticate user.
 */
const authenticate = (req, res, next) => {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
};

/**
 * This function is used to get all users.
 */
const getAll = (req, res, next) => {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
};

/**
 * This function is used to get user by id.
 */
const getById = (req, res, next) => {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
};

/**
 * This function is used validate update user schema.
 */
const updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            // Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character
            .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,10}$'))
            .min(8)
            .max(15)
            .required()
    });
    validateRequest(req, next, schema);
};

/**
 * This function is used to update user.
 */
const update = (req, res, next) => {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
};

/**
 * This function is used to delete user.
 */
const _delete = (req, res, next) => {
    userService.delete(req.params.id)
        .then(() => res.json({message: 'User deleted successfully'}))
        .catch(next);
};

// routes
router.post('/register', registerSchema, register);
router.post('/authenticate', authenticateSchema, authenticate);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;