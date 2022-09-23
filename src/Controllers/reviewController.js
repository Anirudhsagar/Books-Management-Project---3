const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const validation = require("../Middleware/validation");



const createReview = async function (req, res) {

    try {

        const reviewData = req.body;
        const bookIdParams = req.params.bookId


        if (!validation.isValidRequest(reviewData)) return res.status(400).send({ status: false, messege: "Please enter review data" })

        if (!validation.isValidId(bookIdParams)) return res.status(400).send({ status: false, messege: "Not a valid Book id in url" });


        const findBook = await bookModel.findOne({ _id: bookIdParams, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, message: "No book found" })

        let { reviewedBy, rating, review, isDeleted } = reviewData


        if (reviewedBy) {
            if (!validation.isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Please Enter reviwedBy name" });
            if (!validation.isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewer's Name should contain alphabets only." });
        }


        if (!validation.isValid(rating)) return res.status(400).send({ status: false, messege: "Rating is required" })
        if (((rating < 1) || (rating > 5)) || (!validation.isValidRating(rating)))
            return res.status(400).send({ status: false, message: "Rating must be  1 to 5 numeriacl value" });


        if (review) {
            if (!validation.isValid(review)) return res.status(400).send({ status: false, message: "Please Enter any review" });
        }

        if (isDeleted == true) return res.status(400).send({ status: false, message: "You can't add this key at review creation time." })

        reviewData['bookId'] = bookIdParams
        reviewData['reviewedAt'] = new Date()


        const createReview = await reviewModel.create(reviewData)


        const reviewList = await reviewModel.findOne({ _id: createReview._id }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })


        const updatingReviewCount = await bookModel.findOneAndUpdate({ _id: bookIdParams }, { $inc: { reviews: +1 } }, { new: true }).select({ __v: 0 })


        const bookWithReview = updatingReviewCount.toObject()
        bookWithReview['reviewsData'] = reviewList

        res.status(201).send({ status: true, messege: "Review Successful", data: bookWithReview })
    }
    catch (err) {
        return res.status(500).send({ status: false, messege: err.message })
    }
}






const updateReview = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        let reviewByData = req.body


        if (!bookId || !validation.isValidRequest(bookId)) return res.status(400).send({ status: false, message: "Enter a valid Book Id" })
        if (!reviewId ||!validation.isValidRequest(reviewId)) return res.status(400).send({ status: false, message: "Enter a valid reviewId Id" })

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!validation.isValid(bookId)) return res.status(404).send({ status: false, message: "bookId does't exist" })

        let findReview = await reviewModel.findOne({ _id: reviewId, bookId: book, isDeleted: false })
        if (!validation.isValid(findReview)) return res.status(404).send({ status: false, message: "reviewId does't exist" })


        const bookIdfromreview = findReview.bookId.toObject()
        if (bookId !== bookIdfromreview )return res.status(400).send({ status: false, message: "review you want to delete not belongs to the book provide in URL" })


       
        let { review, rating, reviewedBy } = reviewByData
        if (!validation.isValidRequest(reviewData)) return res.status(400).send({ status: false, message: "provide the data in the body to update the review" })

        if (reviewedBy =="") {return res.status(400).send({ status: false, message: "reviewer name can't be empty" })}
        else if (reviewedBy) {
            if ( !validation.isValid(reviewedBy)|| !validation.isValidName(reviewedBy)) return res.status(400).send({ status: false, message: " ReviewBy should reqiure" })}
            reviewByData['reviewedBy'] = reviewByData



        if (rating) {
            if (!validation.isValidRating.test(rating)) return res.status(400).send({ status: false, message: "Rating  can attain the  value [1-5]" });
        }


        let updateReview = await reviewModel.findOneAndUpdate(
            { _id: reviewId },
            { $set: { review: review, rating: rating, reviewedBy: reviewedBy, reviewedAt: Date.now() } },
            { new: true }
        )

        book.updateReview = updateReview
        res.status(201).send({ status: true, message: "Successful", data: book })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}






const deletedReview = async (req, res)=>{
    try {
        let bookId = req.params.bookId
       
        let reviewId = req.params.reviewId
        
        if(!reviewId ||!validation.isValidId(reviewId))return res.status(400).send({ status: false, message: "Enter a valid reviewId Id" })
        if(!bookId || !validation.isValidId(bookId))return res.status(400).send({ status: false, message: "Enter a valid Book Id" })


        let book = await bookModel.findOne({ _id: bookId, isDeleted: false})
        if (!book) return res.status(404).send({ status: false, message: "bookId does't exist" })

        let reviewDoc = await reviewModel.findOne({ _id: reviewId, bookId:book, isDeleted: false})
        if (!reviewDoc) return res.status(404).send({ status: false, message: "reviewId does't exist" })

        
        const bookIdfromreview = reviewDoc.toObject()
        if (bookId !== bookIdfromreview )return res.status(400).send({ status: false, message: "review you want to delete not belongs to the book provide in URL" })


          //Deleting the review
        await reviewModel.findOneAndUpdate({ _id: reviewId },{ isDeleted: true})
        // Decrease Reviews count of the book 
        await bookModel.findOneAndUpdate({ _id: book},{ $inc: {reviews: -1}})

        return res.status(200).send({ status: true, message: " Review deleted successfully."})

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
















module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deletedReview = deletedReview