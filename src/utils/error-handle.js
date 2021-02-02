/**
 * This function is used as a global error handler that catch all errors and
 * remove the need for duplicated error handling code throughout the application.
 * @param err: object, default as 500, string as 400 or 404, Unauthorized as 401
 * @returns {status: boolean, message: string, object}
 */
const errorHandler = (err, req, res, next) => {
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ status: false, message: err });
        case typeof err === 'object':
            return res.status(500).json({ status: false, message: err.message || err });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        default:
            return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = errorHandler;
