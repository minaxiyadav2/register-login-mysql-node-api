const models = require('../database/models');

/**
 * This function is used to create new user
 */
const create = async (params) => {
    await models.User.create(params);
};

/**
 * @param params: email= string, password= alphanumeric
 * @returns {Promise<{user: void, token: *}>}
 */
const authenticate = async (params) => {
    const user = await models.User.authenticate(params);
    const token = user.authToken(user.id);
    return {user, token};
}

/**
 *  This function is used to get all users.
 * @returns {Promise<User[]>}
 */
const getAll = async () => await models.User.findAll();

/**
 * This function is used to get user by id.
 * @param id: GUID
 * @returns {Promise<User<any, User>>}
 */
const getById = async (id) => {
    return await getUser(id);
};

/**
 *  This function is used to update user values.
 * @param id: GUID
 * @param params
 * @returns {Promise<User>}
 */
const update = async (id, params) => {
    const user = await getUser(id);

    // copy params to user and save
    Object.assign(user, params);
    await user.save();
    return user;
};

const _delete = async (id) => {
    const user = await getUser(id);
    await user.destroy();
};

// helper functions

const getUser = async (id) => {
    const user = await models.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
};

module.exports = {
    create,
    authenticate,
    getAll,
    getById,
    update,
    delete: _delete
}