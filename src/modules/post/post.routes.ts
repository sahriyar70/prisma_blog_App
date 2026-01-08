import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller"; 
import { UserRole } from "../../medillware/auth";
import auth from "../../medillware/auth";

const router = express.Router();

router.get("/", PostController.getAllpost)


router.get("/stats",
    auth(UserRole.ADMIN),
     PostController.getStats)
 
router.get("/myposts",
    auth(UserRole.ADMIN,UserRole.USER),
    PostController.getMypost)

router.get("/:postId",
    PostController.getpostById
)

router.post("/", auth(UserRole.USER, UserRole.ADMIN), PostController.createPost);
router.patch("/:postId",
    auth(UserRole.ADMIN,UserRole.USER),
    PostController.updatePost)

    router.delete("/:postId",
    auth(UserRole.ADMIN,UserRole.USER),
    PostController.deletePost)


export const postRoutes = router;
