import express from "express";
import {
  createInvoice,
  downloadInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/:id/download", downloadInvoice);

export default router;