import app from "./app"
import { prisma } from "./prisma"

const PORT = process.env.PORT 
async function main() {
    try {
        await prisma.$connect()
        console.log('conected to data succesfull')

        app.listen(PORT,()=>{
            console.log(`'server runing ', ${PORT}`)
        })
    } catch (error) {
        console.error('error', error)
        await prisma.$disconnect()
        process.exit(1)
    }
}

main()