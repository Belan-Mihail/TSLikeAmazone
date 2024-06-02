import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { OrderModel } from '../models/orderModel'
import { Product } from '../models/productModel'
import { isAuth } from '../utils'
export const orderRouter = express.Router()


orderRouter.get(
  '/mine',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // return orders where user === current user
    const orders = await OrderModel.find({ user: req.user._id })
    res.json(orders)
  })
)


orderRouter.get(
  // /api/orders/:id
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // we look in DB order by id 
    const order = await OrderModel.findById(req.params.id)
    // if this order exist
    if (order) {
      // we will it return to frontend
      res.json(order)
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)


orderRouter.post(
  '/',
//   only auth users can have acces to order process. so we use middlware before calling asyncHandler
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // before we create a new order we need check cart is not empty. orderItems from order Model
    if (req.body.orderItems.length === 0) {
      res.status(400).json({ message: 'Cart is empty' })
    } else {
        // we create new order with creare function
      const createdOrder = await OrderModel.create({
        // we conver orderItem inside req.body to Order Model (item)
        orderItems: req.body.orderItems.map((x: Product) => ({
            // keep previous value
          ...x,
        //   add new field name product. product value comes from id. cartItem (frontend) has field _id:string
        // Item (backend orderModels) has field public product?: Ref<Product>. so we need to conver _id to product as we doing here
        // we use map method because we need to do the same with all   orderItems inside req.body
          product: x._id,
        })),
        // other fileds come from frontend
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        // this value come from isAuth middleware. this field save current user id inside user
        user: req.user._id,
      })
    //   returned values: message and createdOrder from mongo db 
      res.status(201).json({ message: 'Order Created', order: createdOrder })
    }
  })
)

orderRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // we look in DB order by id 
    const order = await OrderModel.findById(req.params.id)

    if (order) {
      order.isPaid = true
      order.paidAt = new Date(Date.now())
      // this data will be come from frontend
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }
      // the save order with update
      const updatedOrder = await order.save()

      // return updated Order
      res.send({ order: updatedOrder, message: 'Order Paid Successfully' })
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)