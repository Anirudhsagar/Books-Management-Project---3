const express = require('express');
const router = express.Router();

const userController = require("../Controllers/userController")
const bookController = require("../Controllers/bookController")
const reviewController = require("../Controllers/reviewController")
const middleware = require("../Middleware/auth")

//User & Login API
router.post("/register", userController.userData);
router.post("/login", userController.loginUser);

//Book API
router.post("/books", middleware.auth,bookController.createBook)



module.exports = router