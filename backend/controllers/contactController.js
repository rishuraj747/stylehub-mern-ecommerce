import contactModel from '../models/contactModel.js'

// Submit a new contact form
const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.json({ success: false, message: "Missing required fields" })
        }
        const newContact = new contactModel({ name, email, message, date: Date.now() })
        await newContact.save()
        res.json({ success: true, message: "Message sent successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get all contact forms for admin
const allContactForms = async (req, res) => {
    try {
        const forms = await contactModel.find({}).sort({date:-1})
        res.json({ success: true, forms })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Delete contact form
const deleteContactForm = async (req, res) => {
    try {
        const { id } = req.body;
        await contactModel.findByIdAndDelete(id)
        res.json({ success: true, message: "Message deleted" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { submitContactForm, allContactForms, deleteContactForm }
