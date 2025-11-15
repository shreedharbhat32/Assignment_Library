import Router from 'express';
import registerUser from '../controllers/user.controller.js';
import {loginuser} from '../controllers/user.controller.js';
import {BookOp, updateBook}  from  '../controllers/book.controller.js';
import { addBook } from '../controllers/book.controller.js';

const router = Router();

router.route("/register-user").post(registerUser);
router.route("/login-user").post(loginuser);
router.route("/library-main").get(BookOp);
router.route("/library-main/add-book").post(addBook);
router.route("/library-main/update-book").put(updateBook);

export default router;