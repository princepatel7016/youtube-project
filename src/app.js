import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true                // browser send Cookies allow 
}))

app.use(express.json({limit:"16kb"}))  //json data acsept
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import useRouter from './routes/user.routes.js'

//routes declaration

app.use("/api/v1/users",useRouter)

//  http://localhost:8000/api/v1/users/register
//  http://localhost:8000/api/v1/users/login

export { app }








// Middleware	        Kaam
// cors()	            Frontend ko backend access karne deta hai
// express.json()	    JSON data ko req.body me convert karta hai
// express.urlencoded()	HTML form data ko req.body me convert karta hai
// express.static("public")   	Public folder ki files browser ko serve karta hai
// cookieParser()	             Browser se aayi cookies ko req.cookies me convert karta hai