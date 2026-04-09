import express from 'express'
import { subscribe, getAllSubscribers, deleteSubscriber } from '../controllers/newsletterController.js'
import adminAuth from '../middleware/adminAuth.js'

const newsletterRouter = express.Router()

newsletterRouter.post('/subscribe', subscribe)
newsletterRouter.get('/all', adminAuth, getAllSubscribers)
newsletterRouter.post('/delete', adminAuth, deleteSubscriber)

export default newsletterRouter
