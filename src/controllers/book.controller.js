import {Book} from "../models/book.models.js";
import {User} from "../models/user.models.js";
import { verifyAccessToken } from "../middlewares/verifyaccess.middlewares.js"; 
import { verifyRole } from "../middlewares/verifyrole.middlewares.js";


const addBook = (verifyAccessToken,verifyRole,async(req,res)=>{
    const {title,bookId,section,author,content,edition} = req.body;
    if(!title || !bookId ||!section||!author||!content||!edition){
        throw Error("All fields are required!");
    }

    const existingbook = Book.find(bookId);
    if(!existingbook){
        throw Error("Book with same Id already exists!");
    }

    const book = Book.create({
        title,
        bookId,
        section,
        author,
        content,
        edition
    })
    return res.status(201).json({message:"Book created succesfully!"},book);
})

const updateBook = (verifyAccessToken,verifyRole,async(req,res)=>{
    const {bookId,updation} = req.body;
    if(!bookId ){
        throw Error("BookId not provided!");
    }
    const existingbook = await Book.findOne({bookId});
    if(!existingbook){
        throw Error("That book doesnot exists!");
    }
    existingbook.content +=updation;
    await existingbook.save();
    res.send({
        status:200,
        message:"Book Updated Successfully!"
    })
})

const BookOp = (verifyAccessToken,async(req,res)=>{
    
    const {title,bookId} = req.body;

    const isBook = await Book.findOne({bookId});
    if(!isBook){
        throw Error("This Book is not present"); 
    }
    res.status(200).json({
        message:"all ok!"
    })
})

export {BookOp};
export {addBook};
export {updateBook};