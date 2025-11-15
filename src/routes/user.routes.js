import Router from 'express';
import registerUser from '../controllers/user.controller.js';
import {loginuser} from '../controllers/user.controller.js';
import {BookOp}  from  '../controllers/book.controller.js';
import { Book } from '../models/book.models.js';

const router = Router();

router.route("/register-user").post(registerUser);
router.route("/login-user").post(loginuser);
router.route("/library-main").get(BookOp);

export default router;