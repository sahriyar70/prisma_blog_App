import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

function errorHandler (err:any
    , req: Request
    , res: Response, next: NextFunction) {
   

    let statusCode = 500;
    let errorMessage = ' intarnal server error '    
    let errorDetails = err

    //PrismaClientValidationError 
    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode = 400;
        errorMessage = 'you provide incorect field or missing fields'
        
    }

    else if (err instanceof Prisma.PrismaClientKnownRequestError ){
        if (err.code === "P2025"){
            statusCode = 400
            errorMessage = " operation failds "
        }
        else if  (err.code ===  "P2002"){
             statusCode = 400
             errorMessage = "Duplikcate key error "
        }
        else if (err.code === "P2003"){
             statusCode = 400
            errorMessage = "Foreign key constraint failds"
        }
    
    }

    else if ( err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = 500
        errorMessage = " Eingen is canected to failds "
        }
    else if ( err instanceof Prisma.PrismaClientInitializationError){
        if(err.errorCode === "P1000"){
            statusCode = 401 
            errorMessage = "Authenticatin faildes"
        }
        else if( err.errorCode === "P1001"){
            statusCode = 400
            errorMessage = "can't reach databass server"
        }
    }

  res.status(statusCode)
  res.json({
    message :errorMessage,
    error :errorDetails
  })
}

export default errorHandler