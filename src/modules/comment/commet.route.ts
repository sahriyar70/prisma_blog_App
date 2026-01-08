import express, { Router }  from  "express"
import { commentController } from "./comment.controller";

import auth, { UserRole } from "../../medillware/auth";

const router = express.Router ();
router.get("/author/:authorId", commentController.getCommentByAuthor)

router.get("/:id",
    commentController.getCommentById
)

router.post(
    '/',
    auth(UserRole.USER,UserRole.ADMIN),
    commentController.creatComment
)

router.delete("/:commentId",
    auth(UserRole.USER,UserRole.ADMIN),
    commentController.deleteComment
)
router.patch("/:commentId",
    auth(UserRole.USER,UserRole.ADMIN),
    commentController.updateComment
)

router.patch('/:id/modaret',
    auth(UserRole.ADMIN),
    commentController.modaretComment
)

export const commentRouter: Router = router;