const jwt = require('jsonwebtoken');

const generateAuthTokens = (user) => {
    const accessToken = jwt.sign(
         { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
  return accessToken;
};

module.exports = {
  generateAuthTokens}