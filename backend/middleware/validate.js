const ApiError = require('../helper/apiError');
const httpStatus = require('../util/httpStatus');

const validate = (schema) => (req, res, next) => {
    console.log("Validating request body:", req.body);
    console.log("Using schema:", schema);
    
    const { error } = schema.body.validate(req.body);
    if (error) {
        console.log("Validation error:", error.details[0].message);
        return next(new ApiError(httpStatus.badRequest, error.details[0].message));
    }
    
    console.log("Validation passed");
    next();
};

module.exports = validate;