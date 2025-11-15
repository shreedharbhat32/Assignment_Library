import Router from 'express';
import registerUser from '../controllers/user.controller.js';
import {loginuser} from '../controllers/user.controller.js';
import {addBook,BookOp, updateBook,deleteBook}  from  '../controllers/book.controller.js';
import { verifyAccessToken } from "../middlewares/verifyaccess.middlewares.js"; 
import { verifyRole } from "../middlewares/verifyrole.middlewares.js";

const router = Router();

router.route("/register-user").post(registerUser);
router.route("/login-user").post(loginuser);
router.route("/library-main/read-book").get(verifyAccessToken,BookOp);
router.route("/library-main/add-book").post(verifyAccessToken,verifyRole,addBook);
router.route("/library-main/update-book").put(verifyAccessToken,verifyRole,updateBook);
router.route("/library-main/delete-book").delete(verifyAccessToken,verifyRole,deleteBook);

export default router;