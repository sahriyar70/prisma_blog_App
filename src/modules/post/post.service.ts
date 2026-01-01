import { post } from "../../../generated/prisma/client";
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

export const PostService = {
    createPost
}; 