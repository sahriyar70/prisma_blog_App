import { email } from "better-auth/*"
import { prisma } from "../prisma"
import { UserRole } from "../medillware/auth"

async function seedAdmin() {
    try {

        const adminData = {
            name : 'admin2 boy ',
            email : 'admin2@admin.com',
            role : UserRole.ADMIN,
            password : 'admin1234',
            
        }

        const existingUser = await prisma.user.findUnique({
            where : {
                email : adminData.email
            }
        })

        if(existingUser){
            throw new Error('alrady exist')
        }

        const singUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email",{
            method : "POST",
            headers : {
                "content-type": "application/json"
            },
            body : JSON.stringify(adminData)
        })


        if(singUpAdmin.ok){
            await prisma.user.update({
                where : {
                    email : adminData.email
                },
                data: {
                    emailVerified : true
                }
            })
        }

    } catch (error) {
        console.log(error)
    }
}

seedAdmin()