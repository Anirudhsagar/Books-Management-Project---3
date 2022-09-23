const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
//const validation = require("../Middleware/validation");



const createReview = async function (req, res) {
    
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

     const createReview = await reviewModel.create(reviewData)
     return res.status(201).send({ status: true, data: createReview })

    
}






































module.exports.createReview = createReview