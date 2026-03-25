import express from 'express'
import { addToCart, getCart, updateCart } from '../controllers/cartController.js'
import userAuth from '../middleware/userAuth.js'

const cartRouter = express.Router()

cartRouter.post('/get', userAuth, getCart)
cartRouter.post('/add', userAuth, addToCart)
cartRouter.post('/update', userAuth, updateCart)

export default cartRouter