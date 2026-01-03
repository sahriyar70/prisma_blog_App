import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Result } from "pg";
import { date, number } from "better-auth/*";
import { postStatus } from "../../../generated/prisma/enums";


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
   
const getAllpost = async (req : Request,res : Response)=>{

    try {
        const {search} = req.query
        const searchString = typeof search === 'string' ? search : undefined

        const tags = req.query.tags ? ( req.query.tags as string).split(',') :[]
        
        const isFeatured = req.query.isFeatured ? 
         req.query.isFeatured === 'true' ? 
          true :req.query.isFeatured === 'false' ? 
          false : undefined : undefined

         
        
        const status = req.query.status as postStatus | undefined
        const authorId = req.query.authorId  as string |undefined
        const page = Number(req.query.page  ?? 0)
        const limit = Number(req.query.limit ?? 10)

        const skip = (page - 1)*limit
        const sortBy = req.query.sortBy as string | undefined
        const sortOrder = req.query.sortOrder as string | undefined
        


        const result = await PostService.getAllpost({search : searchString, tags, isFeatured, status, authorId, page,limit,skip,sortBy,sortOrder})

        res.status(200).json({
            data : result
        })


    } catch (error) {
        res.status(400).json({
            message : 'fieldss',
            messages: error
        
        })
    }

}



export const PostController = {
    createPost,
    getAllpost
};