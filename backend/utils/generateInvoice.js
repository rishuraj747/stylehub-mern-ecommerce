import PDFDocument from "pdfkit";

export const generateInvoicePDF = (invoice, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("Invoice", { align: "center" });

  doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${new Date(invoice.issuedDate).toLocaleDateString()}`);

  doc.moveDown();

  if (invoice.address) {
    doc.text(`Billed To: ${invoice.address.firstName} ${invoice.address.lastName}`);
    doc.text(`${invoice.address.street}`);
    doc.text(`${invoice.address.city}, ${invoice.address.state} ${invoice.address.zipcode}`);
    doc.text(`${invoice.address.country}`);
    doc.text(`Phone: ${invoice.address.phone}`);
    doc.moveDown();
  }

  invoice.items.forEach((item) => {
    doc.text(`${item.name} - ${item.quantity} x ₹${item.price}`);
  });

  doc.moveDown();
  doc.text(`Total: ₹${invoice.totalAmount}`);

  doc.end();
};