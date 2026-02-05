
const { sendResponse } = require("../../utils/sendResponse");
const { loginDB, signupDB } = require("../../db/auth/auth");

//create login with email and password and jwt token
const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const userData = {
            fullName : fullName,
            email : email,
            password : password
        }
        const info = await signupDB(userData);
        return sendResponse(req, res, info.statusCode, info.clientMessage);
    } catch (e) {
        console.error(e);
        return sendResponse(req, res, 500, { Message: e.message });
    }
};

//create login with email and password and jwt token
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const info = await loginDB(email, password);
        return sendResponse(req, res, 200, info);
    } catch (e) {
        console.error(e);
        return sendResponse(req, res, 500, { Message: e.message });
    }
};

module.exports = {
    login,
    signup
};
