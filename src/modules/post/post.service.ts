
import { date, promise } from "better-auth/*";
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
const getMypost = async ( authorId : string)=>{

    const userInfo = await prisma.user.findUniqueOrThrow({
        where:{
            id: authorId,
            status: 'ACTIVE'
        },
        select:{
            id: true
            
        }
    })
    const result = await prisma.post.findMany({
        where:{
            authorId
        },
        orderBy:{
            createAt:'desc'
        },
        include :{
        _count:{
            select:{    
                comments : true
            }
        }
        }
    })

        // const total = await prisma.post.aggregate({
        //     _count:{
        //         id:true
        //     },
        //     where:{
        //         authorId
        //     }
        // })
    return {
        date:result,
        // total
    }
}


const updatePost = async ( postId : string, data: Partial<post>, authorId: string,isAdmin:boolean)=>{
    const postData = await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        },
        select:{
            id:true,
            authorId:true
        }
    })

    if(!isAdmin &&   (postData.authorId!==authorId)){
        throw Error ("you are not creator of this post")
    }
    if(!isAdmin){
        delete data.isFeatured
    }

    const result = await prisma.post.update({
        where:{
            id:postData.id
        },
        data

    })
    return result

}

const deletePost = async (postId : string, authorId : string, isAdmin : boolean)=>{
     const postData = await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        },
        select:{
            id:true,
            authorId:true
        }
    })

    if(!isAdmin &&   (postData.authorId!==authorId)){
        throw Error ("you are not creator of this post")
    }

    return await prisma.post.delete({
        where:{
            id: postId
        }
    })
}

const getStats = async ()=>{

    return await prisma.$transaction(async(tx)=>{

        const [tolalPost,
            publlishedPost,
            archivedPost,
            draftPost,
           totalComments,
           approvedComment,
            rejectComment,
            totalUser,
            adminCount,
            userCount,
            totalViews,


        ]= 
            await Promise.all ([ 
            await tx.post.count(),
            await tx.post.count({ where :{status : postStatus.PUBLISHED} }),
            await tx.post.count({ where :{ status : postStatus.DRAFT }}),
            await tx.post.count({ where :{status : postStatus.ARCHIVED }}),
            await tx.comment.count(),
            await tx.comment.count({where: { status: CommentStatus.APPROVED}}),
            await tx.comment.count({where:{status: CommentStatus.REJECT}}),
            await tx.user.count(),
            await tx.user.count({where:{role:"ADMIN"}}),
            await tx.user.count({where:{role: "USER"}}),
            await tx.post.aggregate({
                _sum : {views: true}
            })

                               ])
        return {
            tolalPost,
            publlishedPost,
            archivedPost,
            draftPost,
            totalComments,
            approvedComment,
            rejectComment,
            totalUser,
            adminCount,
            userCount,
            totalViews : totalViews._sum.views 
        } 


        
    })

}


export const PostService = {
    createPost,
    getAllpost,
    getpostById,
    getMypost,
    updatePost,
    deletePost,
    getStats
}; 