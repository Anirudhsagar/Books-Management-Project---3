const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const ReviewSchema = new mongoose.Schema({
    
        bookId: {type :ObjectId, required: true, ref :'Book'},
        reviewedBy: {type:String, required: true, default :'Guest'},
        reviewedAt: {type:Date,required:true},
        rating: {type:Number, min :1, max: 5,required: true},
        review: {type:String},
        isDeleted: {type:Boolean, default: false}
      }
      ,{timestamps :true})

      
      
module.exports =mongoose.model("Review",ReviewSchema)
