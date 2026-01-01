import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import { UserRole } from "../../medillware/auth";
import auth from "../../medillware/auth";

const router = express.Router();


router.post("/", auth(UserRole.USER, UserRole.ADMIN), PostController.createPost);

export const postRoutes = router;
