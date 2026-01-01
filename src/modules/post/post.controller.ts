import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Result } from "pg";


const createPost = async (req: Request, res: Response) => {

    try {

        const user = req.user
        if (!user){
           return  res.status(400).json({
            message : 'unauthoraized',
           
        
        })
        }


        const result = await PostService.createPost(req.body,user.id as string)
        // console.log(result)
        res.status(201).json(result)

        
    } catch (error) {
        res.status(400).json({
            message : 'fieldss',
            messages: error
        
        })
    }
}
   




export const PostController = {
    createPost
};