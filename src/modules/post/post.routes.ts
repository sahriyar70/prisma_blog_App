import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import { auth as betterauth } from "../../lib/auth";

const router = express.Router();

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    const session = await betterauth.api.getSession({
      headers: req.headers as any,   // ✔️ এইটা লাগবে
    });

    console.log("SESSION:", session);

    
  };
};

router.post("/", auth("USER", "ADMIN"), PostController.createPost);

export const postRoutes = router;
