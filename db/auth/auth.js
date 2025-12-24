const { Responses } = require("../../utils/responses");
const { executeQuery } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

const signupDB = async (data) => {
    try {
        let { fullName, email, password } = data;
        password = bcrypt.hashSync(password, 10);
        const user = new User({ fullName, email, password});
        await user.save();
        return Responses.success;
    } catch (error) {
        console.error(error);
        return Responses.tryAgain;
    }
};

const loginDB = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return Responses.notFound;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return Responses.validPassword;
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { token, email, id: user.id };
    } catch (error) {
        console.error(error);
        return Responses.tryAgain;
    }
};

module.exports = {
    loginDB,
    signupDB
};
