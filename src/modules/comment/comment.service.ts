import { error } from "node:console"
import { prisma } from "../../prisma"
import { CommentStatus } from "../../../generated/prisma/enums"

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

const getCommentById = async (id : string) =>{
    return await prisma.comment.findUnique({
        where:{
            id   
        },
        include:{
            post:{
                select:{
                    id:true,
                    titel:true,
                    views:true
                }
            }
        }
    })
    
}

const getCommentByAuthor = async (authorId:string)=>{
    return await prisma.comment.findMany({
        where :{
            authorId
        },
        orderBy :{createAt:"desc"},
        include:{
            post:{
                select:{
                    id: true,
                    titel:true
                }
            }
        }
    })
}
const deleteComment = async (commentId:string,authorId : string)=>{
   const commentData = await prisma.comment.findFirst({
    where :{
        id:  commentId,
        authorId
    },
    select:{
        id:true
    }
   })
   if(!commentData){
    throw new Error("your provaided input is not invalid")
   }
   
  return await prisma.comment.delete({
    where:{
        id: commentData.id
    }
   })
}

const  updateComment = async (commentId :string,data:{content?:string,status?:CommentStatus},authorId:string)=>{
    const commentData = await prisma.comment.findFirst({
    where :{
        id:  commentId,
        authorId
    },
    select:{
        id:true
    }
   })
   if(!commentData){
    throw new Error("your provaided input is not invalid")
   }
   
  return await prisma.comment.update({
    where:{
        id: commentId,
        authorId
    },
    data
   })
   
}

export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment ,
    updateComment
}