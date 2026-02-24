import express from 'express'
import 'dotenv/config'
import connectDB from './config/db.js'
import adminRouter from './routes/adminRoutes.js'
import blogRouter from './routes/blogRoutes.js'
import cors from 'cors'

const app = express()

await connectDB()

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://your-frontend-domain.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.options("*", cors())

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend Running 🚀")
})

app.use("/api/admin", adminRouter)
app.use("/api/blog", blogRouter)

export default app