import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'
import { keyRouter } from './routers/keyRouter'
import path from 'path'


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
app.use('/api/orders', orderRouter)
app.use('/api/seed', seedRouter)
app.use('/api/keys', keyRouter)

// url
app.use(express.static(path.join(__dirname, '../../frontend/dist')))


app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
)

const PORT: number = parseInt((process.env.PORT || '4000') as string, 10)

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`)
})

