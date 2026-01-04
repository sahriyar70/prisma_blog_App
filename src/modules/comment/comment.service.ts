import { prisma } from "../../prisma"

const createComment = async (paylode : {
    content : string,
    authorId : string,
    postId : string,
    parentId?: string

})=>{

     await prisma.post.findUniqueOrThrow({
        where :{
            id : paylode.postId
        }
    
    })
    const result = await prisma.comment.create({
        data : paylode
    })
    if(paylode.parentId){
         await prisma.comment.findUniqueOrThrow({
            where :{
                id :paylode.parentId
            }
        })
    }
    return result
}

export const commentService = {
    createComment
}