import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    section:{
        type:String,
        required:true,
        default:"general"
    },
    author:{
        type:String,
        required:true,
    },
    bookId:{
        type:String,
        required:true,
        unique:true
    },
    content:{
        type:String,
        required:true
    },
    edition:{
        type:Number,
    }
},{timestamps:true});



export const Book = mongoose.model("Book",bookSchema);
