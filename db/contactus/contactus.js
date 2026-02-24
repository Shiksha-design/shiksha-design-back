const { Responses } = require("../../utils/responses");
const ContactUs = require("../../models/conatactUsModel");

const contactAdminDb = async (contactUsData) => {
    try {
        const { name, email, phoneNumber, query } = contactUsData;
        const newContactUs = new ContactUs(contactUsData);
        await newContactUs.save();
        return { ...Responses.success, data: newContactUs };
    } catch (error) {
        console.error('Error creating contact:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

module.exports = {
    contactAdminDb
};
