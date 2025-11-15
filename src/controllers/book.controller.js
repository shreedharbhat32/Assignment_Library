import {Book} from "../models/book.models.js";
import {User} from "../models/user.models.js";
import { verifyAccessToken } from "../middlewares/verifyaccess.middlewares.js"; 
import { verifyRole } from "../middlewares/verifyrole.middlewares.js";


const addBook = (verifyAccessToken,verifyRole,async(req,res)=>{
    const {title,bookId,section,author,content,edition} = req.body;
    if(!title || !bookId ||!section||!author||!content||!edition){
        throw Error("All fields are required!");
    }

    const existingbook = Book.findOne(bookId);
    if(existingbook){
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
    const book = Book.findOne(bookId);
    if(!book){
        throw Error("That book doesnot exists!");
    }
    book.content +=updation;
})

const BookOp = (verifyAccessToken,async(req,res)=>{
    
    const {title,bookId} = req.body;

    const isBook = await Book.findOne({bookId});
    if(!isBook){
        throw Error("This Book is not present"); 
    }
})

export {BookOp};
export {addBook};