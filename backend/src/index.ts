import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'


// connection DB
dotenv.config()
const MONGODB_URI =
     process.env.MONGODB_URI || 'mongodb://localhost/tsmernamazona'
   mongoose.set('strictQuery', true)
   mongoose
     .connect(MONGODB_URI)
     .then(() => {
       console.log('connected to mongodb')
     })
     .catch(() => {
       console.log('error mongodb')
     })

const app = express()
app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:5173']
    })
)

// we need this middleware to be able to check req.body.email in asyncHandler in userRouter.ts
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.get('/api/products', (req: Request, res: Response) => {
//     res.json(sampleProducts)
// })

// app.get('/api/products/:slug', (req: Request, res: Response) => {
//     res.json(sampleProducts.find((x) => x.slug === req.params.slug))
//   })
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/seed', seedRouter)

const PORT = 4000
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`)
})