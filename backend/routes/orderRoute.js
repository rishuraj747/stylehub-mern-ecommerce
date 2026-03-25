import express from 'express'
import {placOrder, placOrderStripe, verifyStripe, placOrderRazorpay, allOrders, userOrders, updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import userAuth from '../middleware/userAuth.js'

const orderRouter = express.Router()

//admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//payment features
orderRouter.post('/place',userAuth,placOrder)
orderRouter.post('/stripe',userAuth,placOrderStripe)
orderRouter.post('/razorpay',userAuth,placOrderRazorpay)

//user feature
orderRouter.post('/userorders',userAuth,userOrders)

//verify payment
orderRouter.post('/verifyStripe',userAuth,verifyStripe)

export default orderRouter;
