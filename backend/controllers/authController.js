const userService = require("../services/auth.service");
const httpStatus = require("../util/httpStatus");
const tokenService = require("../services/token.service");

const signUp = async (req, res) => {
  const { name, email, password, username, role } = req.body;

  const user = await userService.createUser({
    name,
    email,
    password,
    username,
    role,
  });

  user.password = undefined;

  return res.status(httpStatus.created).json({
    message: "Account created successfully",
    user,
  });
};



module.exports = { signUp, signIn };
