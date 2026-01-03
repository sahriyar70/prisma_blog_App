
import { post, postStatus } from "../../../generated/prisma/client";
import { postWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../prisma";

const createPost = async (data : Omit<post, 'id' | 'createAt '| 'updatedAt'>,userId : string ) =>  {
    const result = await prisma.post.create({ 
        data :{
            ...data,
            authorId :userId
        }
    })
    return result
}


const getAllpost = async ({
    search,
    tags,
     isFeatured,
      status,
       authorId,
       page,
       limit,
       skip,
       sortBy,
       sortOrder
    }: {
        search?: string| undefined,
        tags : string [] | [], 
        isFeatured : boolean | undefined,
         status : postStatus | undefined,
         authorId : string | undefined
         page : number,
         limit : number
         skip : number
         sortBy : string | undefined
         sortOrder : string | undefined
        
        })=>{


    const andConditions :  postWhereInput[] = []

    if(search){
        andConditions.push({ OR : [
                {titel :{
                contains : search as string,
                mode : 'insensitive'
            }},
            {content :{
                contains : search as string,
                mode : 'insensitive'
            }},
 
            {
                tags : {
                    has : search as string,
                }
            }
            ]})
    }

    if( tags.length > 0){
        andConditions.push( {tags : {
                hasEvery : tags 
            }})
    }

    if(typeof isFeatured === 'boolean'){
        andConditions.push({
            isFeatured 
        })
    }

    if(status){
        andConditions.push({
            status
        })
    }

    if(authorId){
        andConditions.push({
            authorId
        })
    }
    
    const allpost = await prisma.post.findMany({

        take : limit,
        skip,
        where :{
           AND : andConditions
        },
        orderBy : sortBy && sortOrder ?{
            [sortBy] :sortOrder 
        } : {createAt : 'desc'}
    })
    return allpost;
}

export const PostService = {
    createPost,
    getAllpost
}; 