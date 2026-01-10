
import { Request, Response } from "express";



export function notFound  ( req : Request,res : Response) {
  
    res.status(404).json({
        Message : "route not fuond",
        path : req.originalUrl,
        date : Date ()
    })


}