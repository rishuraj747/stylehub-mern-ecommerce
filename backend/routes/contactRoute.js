import express from 'express'
import { submitContactForm, allContactForms, deleteContactForm } from '../controllers/contactController.js'
import adminAuth from '../middleware/adminAuth.js'

const contactRouter = express.Router()

contactRouter.post('/submit', submitContactForm)
contactRouter.get('/all', adminAuth, allContactForms)
contactRouter.post('/delete', adminAuth, deleteContactForm)

export default contactRouter
