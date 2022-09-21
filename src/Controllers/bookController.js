const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const validation = require("../Middleware/validation");
const mongoose = require("mongoose");


const createBook = async (req, res) => {

    try {

        let { title, excerpt, userId, ISBN, category,bookCover, subcategory, releasedAt } = req.body;

        // If empty request body
        if (!validation.isValidRequest(req.body)) return res.status(400).send({ status: false, message: "Please enter User data" });


        //Authorization
        const userIdFromToken = req.userId
        if (userIdFromToken !== userId) return res.status(403).send({ status: false, message: "Unauthorized Access." })

        // Title Validation

        if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "Title is required" })
        if (!validation.isValidName(title)) { return res.status(400).send({ status: false, msg: "Title is invalid" }) }

        let checkTitle = await bookModel.findOne({ title })
        if (checkTitle) return res.status(400).send({ status: false, message: "Title has been already used please choose different" })
  


        if (!validation.isValid(bookCover)) return res.status(400).send({ status: false, message: "bookCover is required" })
        if (!validation.isValidName(bookCover)) { return res.status(400).send({ status: false, msg: "bookCover  is invalid" }) }
        // excerpt Validation

        if (!validation.isValid(excerpt)) return res.status(400).send({ status: false, message: "enter valid excerpt" });
        //if (!isValidName(excerpt)) { return res.status(400).send({ status: false, message: "Excerpt is invalid" }) }


        //userId Validation
        if (!validation.isValid(userId)) return res.status(400).send({ status: false, message: "UserId is required" });
        if(!validation.isValidId(userId))return res.status(400).send({ status: false, message: "UserId is required" });
       
       
        let checkUerId = await userModel.findById({ _id: userId });
        if (!checkUerId) return res.status(404).send({ status: false, message: "User Id not found" });


        //ISBN Validation
        if (!validation.isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN Number  is Required." });
        if (!validation.isValidISBN(ISBN)) { return res.status(400).send({ status: false, message: "Please provide a valid ISBN!" }) }

        let isbnData = await bookModel.findOne({ ISBN });
        if (isbnData) { return res.status(400).send({ status: false, message: "ISBN already exists" }) }

        //category Validation
        if (!validation.isValid(category)) return res.status(400).send({ status: false, message: "Category is required" });
        if (!validation.isValid(category)) { return res.status(400).send({ status: false, message: "Please provide valid category" }) }

        // subcategory Validation
        if (!validation.isValid(subcategory)) return res.status(400).send({ status: false, message: "SubCategory is required." });
        if (!validation.isValid(subcategory)) { return res.status(400).send({ status: false, message: "Please provide valid subcategory" }) }


        // releasedAt
        if (!validation.isValid(releasedAt)) return res.status(400).send({ status: false, message: "ReleasedAt is required." });
        if (!validation.isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "please provide releasedAt in correct format" })


        let savedData = await bookModel.create(req.body)
        return res.status(201).send({ status: true, data: savedData })
    }


    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

module.exports.createBook = createBook