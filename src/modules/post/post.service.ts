
import { date } from "better-auth/*";
import { CommentStatus, post, postStatus } from "../../../generated/prisma/client";
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
         sortBy : string 
         sortOrder : string 
        
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
        orderBy :{
            [sortBy] :sortOrder 
        },
        include:{
            _count:{
                select: {comments:true}
            }
        }
    })

    const total = await prisma.post.count({
        where :{
           AND : andConditions
        }
    })

    return {
        date : allpost,
        pagenation : {
            total,
            page,
            limit,
            tolalPage : Math.ceil(total/limit)
        }
    };
}

const getpostById = async (postId:string)=>{

    const result = await prisma.$transaction(async(tx)=>{
         await tx.post.update({
        where  : {
            id : postId
        },
        data:{
            views : {
                increment : 1
            }
        }
    })

    const postdata = await tx.post.findUnique({
        where : {
            id : postId
        },
        include :{
            comments:{
                where :{
                    parentId:null,
                    status:CommentStatus.APPROVED
                },

                orderBy: {createAt:"desc"},
                include:{
                    replys:{
                        where:{
                             status:CommentStatus.APPROVED
                        },
                        orderBy:{createAt: "asc"},
                        include:{
                            replys:{
                                where:{
                                     status:CommentStatus.APPROVED
                                },
                                orderBy: {
                                    createAt:"asc"
                                }
                            }
                        }
                    }
                }
            },
            _count:{
                select:{comments:true}
            }
        }
    })
    return postdata
    })
    
    return result;  
}


export const PostService = {
    createPost,
    getAllpost,
    getpostById
}; 