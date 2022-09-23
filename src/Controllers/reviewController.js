const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
//const validation = require("../Middleware/validation");



const createReview = async function (req, res) {

  try {

    
        const reviewData = req.body;
        const bookIdParams = req.params.bookId


        if (!reviewData) return res.status(400).send({ status: false, message: "Please enter review data" });

        if (!bookIdParams) return res.status(400).send({ status: false, message: "not a vaild book id" })


        const findBook = await bookModel.findOne({ _id: bookIdParams, isDeleted: false })
        if(!findBook) return res.status(404).send({ status: false, message: "not a vaild book id" })
  

     let {reviewedBy,rating,review,isDeleted} =reviewData
     if (reviewedBy){
        if (!reviewedBy) return res.status(400).send({ status: false, message: "Please enter reviewBy name" });
     }
     if (rating){
        if (!rating) return res.status(400).send({ status: false, message: "Please enter reviewBy name" });
     }

     if (review){
        if (!review) return res.status(400).send({ status: false, message: "Please enter reviewBy name" });
     }
     
     if (isDeleted == true) return res.status(400).send({ status: false, message: "You can't add this key at book creation time." })

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







































module.exports.createReview = createReview