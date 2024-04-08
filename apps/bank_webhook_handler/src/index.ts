import express from "express";
import db from "@repo/db/client"
const app=express();

app.use(express.json());

app.post("/hdfcWebhook",async (req,res)=>{
    const paymentInformation:{
        token:string,
        userId:string,
        amount:string
    }={
        token:req.body.token,
        userId:req.body.user_identifier,
        amount:req.body.amount
    }

    
    const txn= await db.onRampTransaction.findFirst({
        where:{
            token:paymentInformation.token
        }
    })

    if(txn?.status==="Success"){
        return res.json(
            {
                message:"Transaction already completed"
            }
        )
    }

    try{
       db.$transaction(
        [
            db.balance.update({
                where:{
                    userId:Number(paymentInformation.userId)
                },
                data:{
                    amount:{
                        increment:Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]
       ) 
       res.json({
        message: "Captured"
    })
    }
    catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})

app.listen(3003);