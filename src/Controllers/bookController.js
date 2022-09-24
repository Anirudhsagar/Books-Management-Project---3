const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const validation = require("../Middleware/validation");
const mongoose = require("mongoose");

//-----------------------------------------------------------------------Create Book Api----------------------------------------------------------------------//
const createBook = async (req, res) => {
    try {
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, isDeleted } = req.body;
        // If empty request body
        if (!validation.isValidRequest(req.body)) return res.status(400).send({ status: false, message: "Please enter User data" });

        // Title Validation
        if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "Title is required" })
        if (!validation.isValidName(title)) { return res.status(400).send({ status: false, msg: "Title is invalid" }) }

        let checkTitle = await bookModel.findOne({ title })
        if (checkTitle) return res.status(400).send({ status: false, message: "Title has been already used please choose different" })

        // excerpt Validation  
        if (!validation.isValid(excerpt)) return res.status(400).send({ status: false, message: "enter valid excerpt" });
        if (!validation.isValidName(excerpt)) { return res.status(400).send({ status: false, message: "Excerpt is invalid" }) }

        //userId Validation
        if (!validation.isValid(userId)) return res.status(400).send({ status: false, message: "UserId is required" });
        if (!validation.isValidId(userId)) return res.status(400).send({ status: false, message: "UserId is required" });

        let checkUerId = await userModel.findById({ _id: userId });
        if (!checkUerId) return res.status(404).send({ status: false, message: "User Id not found" });

        //Authorization
        const userIdFromToken = req.userId
        if (userIdFromToken !== userId) return res.status(403).send({ status: false, message: "Unauthorized Access." })

        //ISBN Validation
        if (!validation.isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN Number  is Required." });
        if (!validation.isValidISBN(ISBN)) { return res.status(400).send({ status: false, message: "Please provide a valid ISBN!" }) }

        let isbnData = await bookModel.findOne({ ISBN });
        if (isbnData) { return res.status(400).send({ status: false, message: "ISBN already exists" }) }

        //category Validation
        if (!validation.isValid(category)) return res.status(400).send({ status: false, message: "Category is required" });
 
        // subcategory Validation
        if (!validation.isValid(subcategory)) return res.status(400).send({ status: false, message: "SubCategory is required." });

        // releasedAt
        if (!validation.isValid(releasedAt)) return res.status(400).send({ status: false, message: "ReleasedAt is required." });
        if (!validation.isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "please provide releasedAt in correct format" })

        // Can't Set deleted true at creation time
        if (isDeleted == true) return res.status(400).send({ status: false, message: "You can't add this key at book creation time." })

        let savedData = await bookModel.create(req.body)
        return res.status(201).send({ status: true, data: savedData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// ------------------------------------------------------ GET ALL BOOKS ---------------------------------------------------------
const getBooks = async function (req, res) {
    try {
        let data = req.query
        let querrydata = {
            userId: data.userId,
            category: data.category,
            subcategory: data.subcategory
        }
        if (!validation.isValid(querrydata)) return res.status(400).send({ status: false, message: "Invalid filter Keys" });
        // if userId is given then is it valid or not
        if (data.userId) {
            if (!validation.isValidId(data.userId)) return res.status(400).send({ status: false, message: "Not a valid userId" });
        }
        let books = await bookModel.find({ isDeleted: false, ...data }).sort({ title: 1 }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        // Sorting title alphabetically
        books.sort((a, b) => a.title.localeCompare(b.title))

        if (books && books.length === 0) return res.status(404).send({ status: false, msg: "No data found for given user" });
        return res.status(200).send({ status: true, message: "Books list", data: books })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}


// ----------------------------------------------------- GET /books/:bookId -----------------------------------------------------
const getBooksById = async function (req, res) {
    try {
        const bookId = req.params.bookId;

        // Book id validation
        if (!validation.isValidId(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        // Find Book
        const allData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!allData) return res.status(404).send({ status: false, message: "Book doesn't exists...!" })

        // Find Books Reviews
        const reviews = await reviewModel.find({ bookId: allData._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        //Assigning reviewdata key
        const data = allData.toObject()  //to change mongoose document into objects (.toObject() is a function in mongoose)
        data["reviewsData"] = reviews

        return res.status(200).send({ status: true, message: "Books List", data: allData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//  ---------------------------------------------------- PUT /books/:bookId -----------------------------------------------------


const updateBooks = async (req, res) => {
    try {
        const bookIdParams = req.params.bookId
        const dataToUpdate = req.body
        const loggedUserId = req.userId

        // Id Validation
        if (!validation.isValidId(bookIdParams)) return res.status(400).send({ status: false, message: "Not a valid Book Id" })
        if (!validation.isValidId(loggedUserId)) return res.status(400).send({ status: false, message: "Not a valid User Id in token." })

        // Finding Books
        const findBook = await bookModel.findOne({ _id: bookIdParams, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, message: "No book found." })

        // Authorization
        const requestUserId = findBook.userId
        if (loggedUserId !== requestUserId.toString()) return res.status(403).send({ status: false, message: "Unauthorized access" })

        // Destructuring
        const { title, excerpt, releasedAt, ISBN } = dataToUpdate
        if (!validation.isValidRequest(dataToUpdate)) return res.status(400).send({ status: false, message: "Please enter details you want to update." })

        // If title is present 
        if (title){
        if (!validation.isValid(title))
            return res.status(400).send({ status: false, message: "Title is invalid (Should Contain Alphabets, numbers, quotation marks  & [@ , . ; : ? & ! _ - $]." })

        const uniqueTitle = await bookModel.findOne({ title })
        if (uniqueTitle) return res.status(400).send({ status: false, message: "Title is already present." })
        dataToUpdate['title'] = title
        }

        // If ISBN is present  
        if (ISBN){
        if (!validation.isValid(ISBN) || !validation.isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "Not a Valid ISBN. (Only 10 or 13 digit number.)" })

        const uniqueISBN = await bookModel.findOne({ ISBN })
        if (uniqueISBN) return res.status(400).send({ status: false, message: "ISBN is already present." })
        dataToUpdate['ISBN'] = ISBN
        }

        // If Releaded date is present
        if (releasedAt){
        if (!validation.isValidDate(releasedAt) || !validation.isValid(releasedAt))
            return res.status(400).send({ status: false, message: "Date should be valid & format will YYYY-MM-DD" })
        dataToUpdate['releasedAt'] = releasedAt
        }
        
        // If excerpt is present
        if (excerpt){
        if (!validation.isValid(excerpt)) return res.status(400).send({ status: false, message: "Please enter a valid excerpt." })
        dataToUpdate['excerpt'] = excerpt
        }

        // Final data Updation
        const updatedDetails = await bookModel.findByIdAndUpdate({ _id: bookIdParams }, dataToUpdate, { new: true })
        res.status(200).send({ status: true, message: "Book details updated successfully", data: updatedDetails })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


// --------------------------------------------------- DELETE /books/:booksId ---------------------------------------------------

const deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        // Id validation
        if (!validation.isValidId(bookId)) return res.status(400).send({ status: false, message: "Please provide the valid bookId" });

        // Finding the book
        const findDeletedBook = await bookModel.findById({ _id: bookId, isDeleted: false });
        if (!findDeletedBook || findDeletedBook.isDeleted == true) return res.status(404).send({ status: false, message: "Book not found" });

        // Authorization
        const userIdFromToken = req.userId
        if (userIdFromToken !== findDeletedBook.userId.toString()) return res.status(403).send({ status: false, message: "Unauthorized Access." })

        // Book delete
        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        res.status(200).send({ status: true, message: " book are Deleted" });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// Exporting Modules

module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.updateBooks = updateBooks
module.exports.getBooksById = getBooksById
module.exports.deleteBook = deleteBook