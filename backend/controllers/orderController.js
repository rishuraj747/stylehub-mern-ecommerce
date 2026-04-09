import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import invoiceModel from '../models/invoiceModel.js'
import Stripe from 'stripe'
import axios from "axios";
import nodemailer from 'nodemailer';

//global variables
const currency = 'inr'
const deliveryCharges = 10

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const backendUrl = process.env.BACKEND_URL 

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendOrderConfirmationEmail = async (email, orderDetails, address) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Order Confirmation - StyleHUB',
            html: `
                <h2>Thank you for your order!</h2>
                <p>Hi ${address.firstName} ${address.lastName},</p>
                <p>Your order has been successfully placed. Here are your order details:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Size</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderDetails.items.map(item => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.size || ''}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.price}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p><strong>Total Amount: </strong> ${orderDetails.amount}</p>
                <p><strong>Shipping Address:</strong></p>
                <p>${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}</p>
                <p>Thank you for shopping with us!</p>
                <p>StyleHUB Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent to', email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

//Placing order using COD method

const placOrder = async (req,res)=>{
    try {
        const { userId, items, amount, address} = req.body
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        const invoice = new invoiceModel({
            user: userId,
            order: newOrder._id,
            items: items,
            totalAmount: amount,
            paymentMethod: "COD",
            address: address,
            invoiceNumber: "INV-" + Date.now(),
        });
        await invoice.save();

        await sendOrderConfirmationEmail(address.email, { items, amount }, address);

        res.json({success: true, message: "Order Placed"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//Placing order using Stripe method
const placOrderStripe = async (req,res)=>{
    try {
        
        const { userId, items, amount, address} = req.body
        const {origin} = req.headers

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item)=>({
            price_data:{
                currency:currency,
                product_data:{
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data:{
                currency:currency,
                product_data:{
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharges * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        const invoice = new invoiceModel({
            user: userId,
            order: newOrder._id,
            items: items,
            totalAmount: amount,
            paymentMethod: "Stripe",
            address: address,
            invoiceNumber: "INV-" + Date.now(),
        });
        await invoice.save();

        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//Verify Stripe payment
const verifyStripe = async (req,res) => {
    const {orderId, success, userId} = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}});
            
            const confirmedOrder = await orderModel.findById(orderId);
            await sendOrderConfirmationEmail(confirmedOrder.address.email, confirmedOrder, confirmedOrder.address);

            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId);
            await invoiceModel.findOneAndDelete({order: orderId});
            res.json({success: false});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// Placing order using Razorpay
const placOrderRazorpay = async (req, res) => {

};

const allOrders = async (req,res)=>{
    try{
        const orders = await orderModel.find({})
        res.json({success: true, orders})
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//User order data for frontend
const userOrders = async (req,res)=>{
    try{
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success: true, orders})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//update order status from admin panel
const updateStatus = async (req,res)=>{
    try{
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Order Status Updated"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export {placOrder, placOrderStripe, verifyStripe, placOrderRazorpay, allOrders, userOrders, updateStatus}