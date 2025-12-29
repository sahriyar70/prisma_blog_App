import { post } from "../../../generated/prisma/client";
import { prisma } from "../../prisma";

const createPost = async (data : Omit<post, 'id' | 'createAt '| 'updatedAt'>) =>  {
    const result = await prisma.post.create({ data })
    return result
}

export const PostService = {
    createPost
}; 