const ApiError= require('../helper/apiErrors');

const vlaidate= (schema) => (req, res, next) => {
    const{ error } = schema.validate(req.body);
    if (error) return next(new ApiError(httpStatus.badRequest, error.details[0].message));
    
    next();
};

module.exports = vlaidate;