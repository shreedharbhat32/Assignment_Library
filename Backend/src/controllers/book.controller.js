import {Book} from "../models/book.models.js";
import {User} from "../models/user.models.js";


const addBook = (async(req,res)=>{
    const {title,bookId,section,author,content,edition} = req.body;
    if(!title || !bookId ||!section||!author||!content||!edition){
        res.send({
            status:401,
            message:"All fields are required!"
        })
    }

    const existingbook = await Book.findOne({bookId});
    if(existingbook){
        return res.send({
            status:401,
            message:"This Book already exists!",
        })
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

const updateBook = (async(req,res)=>{
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

const deleteBook = (async(req,res)=>{
    const {title,bookId} = req.body;
    const isbook = await Book.findOne({bookId});
    if(!isbook){
        throw Error("This Book is not present or Id is wrong!");
    }
    const del = await Book.deleteOne({ bookId: isbook.bookId });
    if(!del){
        throw Error("Error happened in Book deletion!")
    }
    res.send({
        status:200,
        message:"Book deleted Successfully!"
    })

})


const BookOp = (async(req,res)=>{
    try {
        // Accept bookId from query params (preferred) or body (for backward compatibility)
        let bookId = req.query.bookId || (req.body && req.body.bookId);
        
        // Validate bookId
        if (!bookId) {
            return res.status(400).json({
                message: "Book ID is required. Provide it as a query parameter: ?bookId=YOUR_BOOK_ID"
            });
        }

        // Normalize bookId
        bookId = String(bookId).trim();
        
        if (!bookId) {
            return res.status(400).json({
                message: "Book ID cannot be empty"
            });
        }

        const isBook = await Book.findOne({ bookId: bookId });
        
        if(!isBook){
            return res.status(404).json({
                message: "This Book is not present"
            });
        }
        
        // Convert Mongoose document to plain object
        const bookData = isBook.toObject();
        
        return res.status(200).json({
            isBook: bookData
        });
    } catch(error) {
        console.error('BookOp - Error:', error);
        return res.status(500).json({
            message: "An error occurred while reading the book",
            error: error.message
        });
    }
})

const getAllBooks = (async(req,res)=>{
    try {
        // Get all books but exclude content to save bandwidth
        const books = await Book.find({}).select('-content').sort({ createdAt: -1 });
        
        return res.status(200).json({
            books: books
        });
    } catch(error) {
        console.error('getAllBooks - Error:', error);
        return res.status(500).json({
            message: "An error occurred while fetching books",
            error: error.message
        });
    }
})

export {BookOp,deleteBook};
export {addBook};
export {updateBook};
export {getAllBooks};