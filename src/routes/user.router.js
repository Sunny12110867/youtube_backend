import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'

const router = Router()

router.route("/register").post(            // router.route(path).post(middelware,controller_that_help_to_register)
    upload.fields([{
        name: 'avtar',
        maxCount: 1
    },{
        name: 'coverImage',
        maxCount: 1
    }]),
    registerUser
    )


export default router

