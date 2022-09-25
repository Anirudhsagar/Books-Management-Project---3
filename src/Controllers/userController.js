const userModel = require("../Models/userModel")
const validation = require("../Middleware/validation")
const jwt = require("jsonwebtoken");

//---------------------------------------------------------Create User Api------------------------------------------------------------------------------------//
const userData = async (req, res) => {
    try {
    let { title, name, phone, email, password, address } = req.body;

    // If empty request body
    if (!validation.isValidRequest(req.body)) return res.status(400).send({ status: false, message: "Please enter User data" });

    // Title Validation
    if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "Title is required." });
    if (!validation.isValidTitle(title)) return res.status(400).send({ status: false, message: "Not a valid Title. Title should contain only ['Mr', 'Mrs', 'Miss']" });

    // Name Validation
    if (!validation.isValid(name)) return res.status(400).send({ status: false, message: "Name is required" });
    if (!validation.isValidName(name)) return res.status(400).send({ status: false, message: "Name should contain on alphabets" });

    //Phone Validation
    if (!validation.isValid(phone)) return res.status(400).send({ status: false, message: "Phone Number is required" });
    if (!validation.isValidPhone(phone)) return res.status(400).send({ status: false, message: "Phone should be only 10 digit number, starts with 6-9." });

    const uniquePhone = await userModel.findOne({ phone: phone });
    if (uniquePhone) return res.status(400).send({ status: false, message: "Phone Number already exists" });

    //Email Validation
    if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "Email is Required." });
    if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "Not a valid emailId. e.g: abc@xyz.com" });

    const uniqueEmail = await userModel.findOne({ email: email });
    if (uniqueEmail) return res.status(400).send({ status: false, message: "emailId already exists" });

    //Password Validation
    if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Password is required" });
    if (!validation.isValidPassword(password)) return res.status(400).send({ status: false, message: "Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & ] and length should be min of 8-15 charachaters" });


    //Address Validation
    const isValidPin = /^[0-9]{6}$/

    //If address is present
    if (address) {
        if (typeof address !== 'object') return res.status(400).send({ status: false, message: "'address' is not an object" })
        if (!validation.isValidRequest(address)) return res.status(400).send({ status: false, message: "'address' is empty" })


        // In address the street is present
        if (address.street) {
            if (!validation.isValid(address.street)) return res.status(400).send({ status: false, message: "'Please Enter street" })
        }
        // In address the city is present
        if (address.city) {
            if (!validation.isValid(address.city)) return res.status(400).send({ status: false, message: "'Please Enter city" })
            // if (!validation.isValidName(address.city)) return res.status(400).send({ status: false, message: "city is invalid" })
        }
        // In address the pincode is present
        if (address.pincode) {
            if (!validation.isValid(address.pincode)) return res.status(400).send({ status: false, message: "'Please Enter pincode" })
            if (!isValidPin.test(address.pincode)) return res.status(400).send({ status: false, message: "pincode should be 6 digit" })
        }

        // Create User
        const result = await userModel.create({ title, name, phone, email, password, address });
        res.status(201).send({ status: true, data: result });
    }
}
catch (error) {
    return res.status(500).send({ status: false, message: "Error", error: error.message })
}
}

//----------------------------------------------------------------------Login User Api------------------------------------------------------------------------//
const loginUser = async function (req, res) {
    try {
        const requestBody = req.body
        // Validation of Request Body
        if (!validation.isValidRequest(requestBody)) return res.status(400).send({ status: false, message: "Please enter the required credentials(email, password)." })
        const { email, password } = requestBody

        // Input Credential Validation
        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "Please enter the emailId" })
        if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Please enter the password" })

        // Validation email & password 
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "Not a valid emailId" })
        if (!validation.isValidPassword(password)) return res.status(400).send({ status: false, message: "Not a valid password" })

        // Finding the user
        const checkData = await userModel.findOne({ email })
        if (!checkData) return res.status(404).send({ status: false, message: "User email id not found." })

        // Verifying the password
        const actualPassWord = checkData.password
        if (password !== actualPassWord) return res.status(401).send({ status: false, message: "Incorrect password" })

        //token generate
        let token = jwt.sign(
            {
                userId: checkData._id.toString(),  // PAYLOAD
                iat: Math.floor(Date.now() / 1000), //issued at
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 //expiration time
            },
            "plutonium-project-key"  //SECRET KEY
        );
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: "Author login successful", data: { token } })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
};
//Exporting Modules

module.exports.userData = userData
module.exports.loginUser = loginUser