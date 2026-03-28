import Invoice from "../models/invoiceModel.js";
import { generateInvoicePDF } from "../utils/generateInvoice.js";

// CREATE INVOICE
export const createInvoice = async (req, res) => {
  try {
    const { order } = req.body;

    const invoice = new Invoice({
      user: order.userId || order.user,
      order: order._id,
      items: order.items || order.orderItems || [],
      totalAmount: order.amount || order.totalPrice || 0,
      paymentMethod: order.paymentMethod,
      address: order.address || order.shippingAddress,
      invoiceNumber: "INV-" + Date.now(),
    });

    await invoice.save();

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DOWNLOAD INVOICE PDF
export const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ order: req.params.id });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    generateInvoicePDF(invoice, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};