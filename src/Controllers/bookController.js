const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const validation = require("../Middleware/validation");
const mongoose = require("mongoose");


const createBook = async (req, res) => {

    try {

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt,isDeleted } = req.body;

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



        // excerpt Validation  

        if (!validation.isValid(excerpt)) return res.status(400).send({ status: false, message: "enter valid excerpt" });
        if (!validation.isValidName(excerpt)) { return res.status(400).send({ status: false, message: "Excerpt is invalid" }) }


        //userId Validation
        if (!validation.isValid(userId)) return res.status(400).send({ status: false, message: "UserId is required" });
        if (!validation.isValidId(userId)) return res.status(400).send({ status: false, message: "UserId is required" });


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


        // Can't Set deleted true at creation time
        if (isDeleted == true) return res.status(400).send({ status: false, message: "You can't add this key at book creation time." })

        let savedData = await bookModel.create(req.body)
        return res.status(201).send({ status: true, data: savedData })
    }


    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const getBooks = async function (req, res) {
   
       
            try {
        //         const Query = { isDeleted: false, deletedAt: null }
        //         const queryParams = req.query
        //         const { userId, category, subcategory } = queryParams
        //         if (validation.isValid(userId)) {
        //             Query['userId'] = userId                  //crate data in array form
        //         }
        //         if (validation.isValid(category)) {
        //             Query['category'] = category
        //         }
        //         if (validation.isValid(subcategory)) {
        //             Query['subcategory'] = subcategory
        //         }
        //         const books = await bookModel.find(Query).select({ book_id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        //         if (books.length === 0) {
        //             return res.status(404).send({ status: false, msg: "Invalid Data" })
                    
        //         } 
        //         let x = books.length
        //         if (userId || category || subcategory) {
        //             let sortedBooks = await bookModel.find({ $and: [{ isDeleted: false, deletedAt: null }, { $or: [{ userId: userId, isDeleted: false }, { category: category }, { subcategory: subcategory }] }] }).sort({ "title": 1 })
        //             return res.status(200).send({ status: true,total:x, data: sortedBooks, msg: "Sorted Book By Title"})
        //         }
        //         return res.status(200).send({ status: true, total:x,  data: books });

        //     } catch (error) {
        //         return res.status(500).send({ status: "failed", msg: error.message })
        //     }
        
        // }
            












        let data = req.query
        let querrydata = {
            userId: data.userId,
            category: data.category,
            subcategory: data.subcategory
        }

        if (!validation.isValid(querrydata)) return res.status(400).send({ status: false, message: "Invalid filter Keys" });
        //edgeCase - 1 if userId is given then is it valid or not
        if (data.userId) {
            if (!validation.isValidId(data.userId)) return res.status(400).send({ status: false, message: "Not a valid userId" });
        }
        let books = await bookModel.find({ isDeleted: false, ...data }).sort({ title: 1 }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        // Sorting title alphabetically
        books.sort((a, b) => a.title.localeCompare(b.title))
        //edgeCase - 2
        if (books && books.length === 0) return res.status(404).send({ status: false, msg: "No data found for given user" });
        
     
        return res.status(200).send({ status: true, message: "Books list", data: books })
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}





const getBooksById = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        if (!validation.isValidId(bookId)) return res.status(400).send({ status: false, message: "Book Id is Invalid !!!!" })

        const allData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!allData) return res.status(404).send({ status: false, message: "Book doesn't exists...!" })
       
       

        return res.status(200).send({ status: true, message: "Books List", data: allData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}





const updateBooks = async (req,res)=> {
    try {
        let bookId = req.params.bookId
        if(!bookId) res.status(400).send({ status: false, message: "bookId is required" });

        let {title, excerpt,releasedAt,ISBN } = req.body

        let titleExist = await bookModel.findOne({ title: title})
        if (titleExist) return res.status(400).send({ status: false, message: "title exist already" });

        
        if (excerptExist) return res.status(400).send({ status: false, message: "excerpt exist already" });

       
        if (releasedDate) return res.status(400).send({ status: false, message: "releasedAt exist already" });

        let isbnExist = await bookModel.findOne({ ISBN: ISBN})
        if (isbnExist) return res.status(400).send({ status: false, message: "isbn exist already" });

        let data = await bookModel.findById(bookId)
        if (!data.isDeleted == false) {
            return res.status(400).send({ status: false, message: "data is already deleted" });
        }

        let updateBook = await bookModel.findByIdAndUpdate({ _id:bookId, isDeleted:false} ,req.body,{new:true})
        res.status(200).send({ status: true, data: updateBook });




    } catch (error) {
         res.status(500).send({ status: false, message: error.message });
    }
}

const deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!validation.isValidId(bookId)) return res.status(400).send({ status: false, message: "Please provide the valid bookId" });

       
        const findDeletedBook = await bookModel.findById({ _id: bookId, isDeleted: false });
        if (!findDeletedBook||findDeletedBook.isDeleted == true) return res.status(404).send({ status: false, message: "Book not found" });

        const userIdFromToken = req.userId
        if (userIdFromToken !== findDeletedBook.userId.toString()) return res.status(403).send({ status: false, message: "Unauthorized Access." })

       


        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })



        res.status(200).send({ status: true, message: " book are Deleted" });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


























module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBooksById = getBooksById
module.exports.deleteBook = deleteBook
module.exports.updateBooks = updateBooks