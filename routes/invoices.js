import Router from "router";
const router = Router()
import { postInvoice, getInvoices, putUpdateState } from "../controllers/invoices.js";


router.post("/", postInvoice)

//facturas
router.get("/invoices", getInvoices)

// update state
router.put("/updateState/:id", putUpdateState)

export default router