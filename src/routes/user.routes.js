import Router from 'express';
import registerUser from '../controllers/user.controller.js';
import {loginuser} from '../controllers/user.controller.js';
import {BookOp, updateBook,deleteBook}  from  '../controllers/book.controller.js';
import { addBook } from '../controllers/book.controller.js';

const router = Router();

router.route("/register-user").post(registerUser);
router.route("/login-user").post(loginuser);
router.route("/library-main/read-book").get(BookOp);
router.route("/library-main/add-book").post(addBook);
router.route("/library-main/update-book").put(updateBook);
router.route("/library-main/delete-book").delete(deleteBook);

export default router;