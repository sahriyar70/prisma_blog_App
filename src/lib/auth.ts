import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";
import nodemailer from 'nodemailer'
import { triggerAsyncId } from "node:async_hooks";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins :[process.env.APP_URL!],
    user :{

        additionalFields :{
            role : {
                type : "string",
                defaultValue : "USER",
                required: false
            },
            phone : {
                type : "string",
                required : false
            },
            status : {
                type : "string",
                defaultValue : "ACTIVE",
                required : false
            }
        }
    },

    emailAndPassword: { 
    enabled: true,
    autoSignIn : false,
    requireEmailVerification : true 
  }, 
emailVerification: {
    sendOnSignUp : true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {

        try {
            const verificationUrl = `${process.env.APP_URL}/verification?token=${token}`

      const info = await transporter.sendMail({
    from: '"prisma blog" <maddison53@ethereal.email>',
    to: user.email,
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;margin-top:30px;border-radius:10px;overflow:hidden;">
          
          <tr>
            <td style="padding:25px 30px;background:#4f46e5;color:#ffffff;font-size:22px;font-weight:bold;">
              Prisma Blog — Email Verification
            </td>
          </tr>

          <tr>
            <td style="padding:30px 30px 10px 30px;color:#111827;font-size:16px;line-height:1.6;">
              <p>Hi ${user.name} </p>
              <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:10px 30px 25px 30px;">
              <a href="${verificationUrl}" 
                style="background:#4f46e5;color:#ffffff;padding:12px 22px;
                       border-radius:8px;text-decoration:none;
                       font-size:16px;display:inline-block;">
                Verify Email
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 25px 30px;color:#374151;font-size:14px;line-height:1.6;">
              <p>If the button doesn’t work, copy and paste this link into your browser:</p>
              <p style="word-break:break-all;">
                <a href="${verificationUrl}" style="color:#2563eb;">{${verificationUrl}}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 30px;background:#f3f4f6;color:#6b7280;font-size:12px;text-align:center;">
              If you didn’t create this account, you can safely ignore this email.
              <br><br>
              © 2025 Prisma Blog
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
  });

  console.log("Message sent:", info.messageId);
        } catch (error) {
            console.log(error)
            throw error
        }
        
    },
  },

  socialProviders: {
        google: { 
            promot : "select_account consent",
            accessType : "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

});