import invoicesModel from "../models/invoices.js";
import axios from "axios";

const postInvoice = async (req, res) => {
    const authHeader = req.headers.authorization
    let token=""
    try {
        if(authHeader){
            token= authHeader.split(" ")[1];
        }else{
            throw new Error ("no hay token")
        }

        const {
            numbering_range_id,
            reference_code,
            observation,
            payment_form,
            payment_due_date,
            payment_method_code,
            billing_period,
            customer,
            items,
        } = req.body;


        const facturaValidada = await axios.post(
            process.env.URL_API,
            {
                numbering_range_id,
                reference_code,
                observation,
                payment_form,
                payment_due_date,
                payment_method_code,
                billing_period,
                customer,
                items,
            },
            {
                headers: { Authorization: `Bearer ${token}`},
            }
        );

            let response = facturaValidada.data

        const invoice = new invoicesModel ({
            numbering_range_id,
            reference_code,
            observation,
            payment_form,
            payment_due_date,
            payment_method_code,
            billing_period,
            customer,
            items,
            cufe:response.data.bill.cufe,
            url:response.data.bill.public_url,
            qr:response.data.bill.qr,
            qr_image:response.data.bill.qr_image,
            number:response.data.bill.number,
            total:response.data.bill.total
        });
        await invoice.save()
        res.json({facturaValidada: invoice})
        console.log("exito!");


    } catch (error) { 
        res.status(400).json({error:"invoice register failed"})
        console.log("error", error);
    }
};


const getInvoices = async (req,res)=>{
    try {
        const invoices = await invoicesModel.find({state:1});
        res.json({invoices})
    } catch (error) {
        res.status(400).json({error:"invoices search failed"})
        console.log(error);
    }
}


const putUpdateState = async (req,res)=>{
try {
    const {id} = req.params
    const invoice = await invoicesModel.findById(id)
    const newState = invoice.state === 1 ? 0 : 1;
    const updatedInvoice = await invoicesModel.findByIdAndUpdate(id,{state:newState},{new:true})
    res.json({updatedInvoice});
} catch (error) {
    res.status(400).json({error:"Operation failure"})
    console.log(error);
}



}
export { postInvoice , getInvoices,putUpdateState}