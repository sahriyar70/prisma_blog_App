import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Result } from "pg";
import { date, number } from "better-auth/*";
import { postStatus } from "../../../generated/prisma/enums";
import pagenationSortingHelpars from "../../helpers/pagenationSortingHelpers";
import { prisma } from "../../prisma";
import { UserRole } from "../../medillware/auth";


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


        

        const {page,limit,skip,sortBy,sortOrder} = pagenationSortingHelpars(req.query)

        console.log(page,limit,skip,sortBy,sortOrder)



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

const getpostById = async(req:Request,res:Response)=>{
    try {

        const {postId} = req.params
        if(!postId){
            throw Error('post id is requered')
        }
        
        const result =   await PostService.getpostById(postId)
        return res.status(200).json(result)

    } catch (error) {
        res.status(400).json({
            message : 'fieldss',
            messages: error
        
        })
    }
}

const getMypost = async (req:Request,res:Response)=>{
    try {

        const user = req.user
       if(!user){
        throw new Error('unauthorazid')
       }
        
        const result =   await PostService.getMypost(user?.id as string   )
        return res.status(200).json(result)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message : 'fieldss',
            messages: error
        
        })
    }
} 

const updatePost = async (req:Request,res:Response)=>{
    try {

        const user = req.user
       if(!user){
        throw new Error('unauthorazid')
       }
        const {postId} = req.params
        const isAdmin = user.role === UserRole.ADMIN
        console.log(user)
        const result =   await PostService.updatePost(postId as string,req.body,user.id, isAdmin)
        return res.status(200).json(result)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message : 'post up date fileds',
            messages: error
        
        })
    }
}

const deletePost = async (req:Request,res:Response)=>{
    try {

        const user = req.user
       if(!user){
        throw new Error('unauthorazid')
       }
        const {postId} = req.params
        const isAdmin = user.role === UserRole.ADMIN
        console.log(user)
        const result =   await PostService.deletePost(postId as string,user.id, isAdmin)
        return res.status(200).json(result)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message : 'post delete fileds',
            messages: error
        
        })
    }
}

const getStats = async (req:Request,res:Response)=>{
    try {

      
        const result =   await PostService.getStats()
        return res.status(200).json(result)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message : 'stats fatch   fileds',
            messages: error
        
        })
    }
}



export const PostController = {
    createPost,
    getAllpost,
    getpostById,
    getMypost,
    updatePost,
    deletePost,
    getStats
};