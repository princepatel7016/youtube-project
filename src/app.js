import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    //origin → Kaunsi website ko backend access karne ki permission deni hai.
    credentials:true                // browser send Cookies allow 
}))

app.use(express.json({limit:"16kb"}))  //json data acsept
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import useRouter from './routes/user.routes.js'
import videoRouter from "./routes/video.routes.js"



app.use("/api/v1/users",useRouter)
app.use("/api/v1/videos",videoRouter)







//  http://localhost:8000/api/v1/users/register
//  http://localhost:8000/api/v1/users/loginuser

export { app }








// Middleware	        Kaam
// cors()	            Frontend ko backend access karne deta hai
// express.json()	    JSON data ko req.body me convert karta hai
// express.urlencoded()	HTML form data ko req.body me convert karta hai
// express.static("public")   	Public folder ki files browser ko serve karta hai
// cookieParser()	             Browser se aayi cookies ko req.cookies me convert karta hai