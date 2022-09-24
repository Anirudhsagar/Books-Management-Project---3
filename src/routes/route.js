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
router.post("/books", middleware.auth, bookController.createBook)
router.get("/books", middleware.auth, bookController.getBooks)
router.get("/books/:bookId", middleware.auth, bookController.getBooksById)
router.put("/books/:bookId", middleware.auth, bookController.updateBooks)
router.delete("/books/:bookId", middleware.auth, bookController.deleteBook)

//Review API
router.post("/books/:bookId/review", reviewController.createReview)
router.put("/books/:bookId/review/:reviewId", reviewController.createReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deletedReview)

//Error Handing
router.all('/*', (req, res) => {
    res.status(404).send({ status: false, message: "URL Not Found" })
})
module.exports = router