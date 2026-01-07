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

const getCommentById = async (req:Request,res:Response)=>{
    try {
        const {id} = req.params
        const result = await commentService.getCommentById (id as string)
        res.status(200).json(result)
        
    } catch (error) {
        res.status(400).json({
            error: 'comment fatch field',
            details : error
        })
    }
}

const getCommentByAuthor = async (req:Request,res:Response)=>{
    try {
        const {authorId} = req.params
        const result = await commentService.getCommentByAuthor (authorId as string)
        res.status(200).json(result)
        
    } catch (error) {
        res.status(400).json({
            error: 'comment fatch field',
            details : error
        })
    }
}
const deleteComment = async (req:Request,res:Response)=>{
    try {
        const user = req.user     
        const {commentId} = req.params
        const result = await commentService.deleteComment (commentId as string,user?.id as string)
        res.status(200).json(result)
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: 'comment delete field',
            details : error
        })
    }
}
const updateComment = async (req:Request,res:Response)=>{
    try {
        const user = req.user     
        const {commentId} = req.params
        const result = await commentService. updateComment (commentId as string,req.body,user?.id as string)
        res.status(200).json(result)
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: 'comment update field',
            details : error
        })
    }
}

export const commentController = {
    creatComment,
    getCommentById  ,
    getCommentByAuthor,
    deleteComment,
    updateComment
}