import express, { Router }  from  "express"
import { commentController } from "./comment.controller";

import auth, { UserRole } from "../../medillware/auth";

const router = express.Router ();

router.post(
    '/',
    auth(UserRole.USER,UserRole.ADMIN),
    commentController.creatComment
)

export const commentRouter: Router = router;