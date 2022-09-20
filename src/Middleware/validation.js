const userModel = require("../Models/userModel")



const isValid = function(value) {
    if(typeof (value) == "undefined" || typeof (value) == null) return false
    if(typeof (value) == "string" && (value).trim().length == 0)return false
    return true
} 

const isValidName = /^[A-Z a-z]+$/
const isValidMobile= /^[6-9]{10}$/;
const isValidEmail =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/

module.exports = {isValid,isValidName,isValidMobile,isValidEmail,isValidPassword}