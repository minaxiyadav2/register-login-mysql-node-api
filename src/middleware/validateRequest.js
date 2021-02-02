module.exports = validateRequest;

/**
 * This function is used to validate the body of a request against a Joi schema.
 * @param schema: The request body schema
 */
function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        let errResult = [];
        for(let e of error.details) {
            let key = e.path;
            let value = e.message;
            let msg = {[key]: value};

            switch (e.type) {
                case 'string.pattern.base':
                    msg = {[key]: `"${e.context.label}" must have atleast one uppercase letter, one lowercase letter, one number and one special character`};
                    errResult.push(msg);
                    break;
                default:
                    errResult.push(msg);
                    break;
            }
        }
        next(errResult);
    } else {
        req.body = value;
        next();
    }
}