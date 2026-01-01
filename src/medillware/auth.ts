
import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  USER  = "USER",
  ADMIN = "ADMIN"
}

declare global {
  namespace Express{
    interface Request {
      user? : {
         id : string,
         email : string,
         name : string,
         role : string,
         emailVerified : boolean
      }
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    try {
        const session = await betterAuth.api.getSession({
      headers: req.headers as any,   // ✔️ এইটা লাগবে
    });

    if(!session){
    return  res.status(400).json({
        success : false,
        message : " you are not authoraz "
      })
    }
    if(!session?.user.emailVerified){
     return res.status(403).json({
        success : false,
        message : " email veeification requaere  "
      })
    }

    req.user = {
      id : session.user.id,
      email : session?.user.email as string,
      name :session?.user.name as string,
      role : session?.user.role as string,
      emailVerified : session?.user.emailVerified as boolean

    }

    if(roles.length && !roles.includes(req.user.role as UserRole)){
      return res.status(403).json({
        success : false,
        message : " Forbidden you don't have acces this resorsuces "
      })
    }
    next()
    } catch (error) {
        next(error  )
    }
  };
};

export default auth