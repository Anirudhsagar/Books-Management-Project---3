




//value validation
const isValid= function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}


//request validation
const isValidRequest = function (request) {
    return (Object.keys(request).length > 0)
}




//email validation
const isValidEmail = function (email) {
    const emailRegex = /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/
    return emailRegex.test(email)
}
//password validation
const isValidPassword = function (password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    return passwordRegex.test(password)
}
//name validation
const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z , ]{2,30}$/
    return nameRegex.test(name)
}
// mobile validation
const isValidPhone = function (Phone) {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(Phone)
}
// const isValidPin = function (pincode) {
//     const pinRegex = /^[1-9][0-9]{6}*$/
//     return pinRegex.test(pincode)
// }



//title validation
const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}


//Exporting modules
module.exports = { isValidEmail, isValidPassword, isValid, isValidName, isValidTitle, isValidPhone, isValidRequest}