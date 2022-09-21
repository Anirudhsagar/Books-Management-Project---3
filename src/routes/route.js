const express = require('express');
const router = express.Router();

const userController = require("../Controllers/userController")
// const bookController = require("../Controllers/bookController")
// const reviewController = require("../Controllers/reviewController")


//User & Login API
router.post("/register", userController.userData);
router.post("/login", userController.loginUser);





module.exports = router