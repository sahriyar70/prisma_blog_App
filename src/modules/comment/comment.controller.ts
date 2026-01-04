import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { commentService } from "./comment.service";

const creatComment = async (req:Request,res:Response)=>{
    try {
        const user = req.user
        req.body.authorId = user?.id
        const result = await commentService.createComment(req.body)
        res.status(201).json(result)
        
    } catch (error) {
        res.status(400).json({
            error: 'comment creat field',
            details : error
        })
    }
}

export const commentController = {
    creatComment
}