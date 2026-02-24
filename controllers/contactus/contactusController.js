
const { sendResponse } = require("../../utils/sendResponse");
const { contactAdminDb } = require("../../db/contactus/contactus");

//create login with email and password and jwt token
const contactAdmin = async (req, res) => {
    try {
        const { name, email, phoneNumber, query } = req.body;
        const userData = {
            name : name,
            email : email,
            phoneNumber : phoneNumber,
            query : query
        }
        const info = await contactAdminDb(userData);
        return sendResponse(req, res, info.statusCode, info.clientMessage);
    } catch (e) {
        console.error(e);
        return sendResponse(req, res, 500, { Message: e.message });
    }
};

module.exports = {
    contactAdmin
};
