import Router from 'express';
import registerUser from '../controllers/user.controller.js';
import {loginuser} from '../controllers/user.controller.js';

const router = Router();

router.route("/register-user").post(registerUser);
router.route("/login-user").post(loginuser);

export default router;