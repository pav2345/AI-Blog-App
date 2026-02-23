import express from 'express'
import 'dotenv/config'
import connectDB from './config/db.js'
import adminRouter from './routes/adminRoutes.js'
import blogRouter from './routes/blogRoutes.js'
import cors from 'cors'

const app = express()


// Database connection
await connectDB()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/admin", adminRouter)
app.use("/api/blog", blogRouter)



export default app