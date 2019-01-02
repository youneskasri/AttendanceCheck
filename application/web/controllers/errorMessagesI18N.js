/* Wrap Mongoose Exception with My I18N Custom Error Messages */
module.exports = function getErrorMessageI18N(e) {
    let errorMessage = "ERROR_WHILE_PROCESSING";
    if (e.code === 11000) {
        if (e.message.includes("CIN")) {
            errorMessage = "CIN_ALREADY_USED";
        } else if (e.message.includes("username")) {
            errorMessage = "USERNAME_ALREADY_USED";
        } else if (e.message.includes("email")) {
            errorMessage = "EMAIL_ALREADY_USED";
        }            
    }
    return errorMessage; 
}