import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from './models/userModel'

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'verybigsecret',
    {
      expiresIn: '30d',
    }
  )
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  // we checck req.headers to check is user auth or not. if it does authorization will have data
  const { authorization } = req.headers
  // if authorization will have data == user auth
  if (authorization) {
    // token format is Bearer xxxxx. To take token without (Bearer' ') we need to slice authorization value
    const token = authorization.slice(7, authorization.length) 
    // verify function take 2 parametr: token and secret key. return decrypted value and assign to decode const
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret'
    )
    // we assign new value to req.user by converting decoder value from jwt.verify as userInfo object. we dont have error
    //  because we use Request type
    req.user = decode as {
      _id: string
      name: string
      email: string
      isAdmin: boolean
      token: string
    }
    // go to next step (end middlware). 
    next()
  } else {
    res.status(401).json({ message: 'No Token' })
  }
}