import newsletterModel from '../models/newsletterModel.js'

// Subscribe to newsletter
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email is required" })
        }
        
        // Check if already subscribed
        const existing = await newsletterModel.findOne({ email });
        if (existing) {
            return res.json({ success: false, message: "You are already subscribed to the newsletter" })
        }

        const newSubscriber = new newsletterModel({ email, date: Date.now() })
        await newSubscriber.save()
        res.json({ success: true, message: "Subscribed successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get all subscribers for admin
const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await newsletterModel.find({}).sort({date:-1})
        res.json({ success: true, subscribers })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Delete subscriber
const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.body;
        await newsletterModel.findByIdAndDelete(id)
        res.json({ success: true, message: "Subscriber removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { subscribe, getAllSubscribers, deleteSubscriber }
