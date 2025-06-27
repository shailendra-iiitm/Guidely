const userService = require("../services/auth.service");
const httpStatus = require("../util/httpStatus");
const tokenService = require("../services/token.service");

const signUp = async (req, res) => {
  try {
    const { name, email, password, username, role } = req.body;

    console.log("SignUp request:", { name, email, username, role });

    const user = await userService.createUser({
      name,
      email,
      password,
      username,
      role,
    });

    user.password = undefined;

    console.log("User created successfully:", user);

    return res.status(httpStatus.created).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error("SignUp error:", error);
    throw error;
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("SignIn request for email:", email);

    const user = await userService.loginUserWithEmailAndPassword(email, password);

    console.log("User authenticated:", user.email);

    const token = await tokenService.generateAuthTokens(user);
    user.password = undefined;

    console.log("Token generated successfully");

    res.status(httpStatus.ok).json({
      message: "User signed in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("SignIn error:", error);
    throw error;
  }
};

module.exports = { signUp, signIn };
