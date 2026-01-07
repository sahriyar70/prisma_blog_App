import express, { Application } from 'express'
import { postRoutes } from './modules/post/post.routes'
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
import { commentRouter } from './modules/comment/commet.route';

const app : Application = express()

app.use(cors({
    origin : process.env.APP_URL || "http://localhost4000",
    credentials : true 
}))

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json())

app.use('/posts', postRoutes)
app.use('/comments', commentRouter)

app.get('/', (req, res) => {
    res.send('Hello World!')
} )

export default app 