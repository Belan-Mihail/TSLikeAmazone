import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { User, UserModel } from '../models/userModel'
import { generateToken } from '../utils'

export const userRouter = express.Router()
// POST /api/users/signin
userRouter.post(
  '/signin',
  asyncHandler(async (req: Request, res: Response) => {
    // we looking for a user according to email
    const user = await UserModel.findOne({ email: req.body.email })
    // if user (with this email) exist
    if (user) {
        // we compare passwords (req.body.password = input password; user.password = password in DB)
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // if check pass we return data
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        //   we passt user as parametr to generateToken() from utils.ts
          token: generateToken(user),
        })
        // else we return nothing
        return
      } else {
        res.status(401).json({ message: 'Invalid email or password!!!' })
      }
    }
    // if user (with this email) doesnt exist we return error.message
    res.status(401).json({ message: 'Invalid email or password!' })
  })
)

userRouter.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    // we create new user
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      // we use bcrypt.hashSync to crypted password
      password: bcrypt.hashSync(req.body.password),
      // we use as User to convert new object to User object that accepted UserModel
    } as User)
    // to send user back to frontend
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    })
  })
)