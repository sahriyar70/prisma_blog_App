
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


const getAllpost = async ({search,tags, isFeatured, status}: {search?: string| undefined,tags : string [] | [], isFeatured : boolean | undefined, status : postStatus | undefined})=>{
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
    
    const allpost = await prisma.post.findMany({
        where :{
           AND : andConditions
        }
    })
    return allpost;
}

export const PostService = {
    createPost,
    getAllpost
}; 