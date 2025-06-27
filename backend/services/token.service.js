const jwt = require('jsonwebtoken');

const generateAuthTokens = (user) => {
    const accessToken = jwt.sign(
         { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
  return accessToken;
};

const verifyToken = (token, tokenType = 'accessToken') => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = {
  generateAuthTokens,
  verifyToken
}