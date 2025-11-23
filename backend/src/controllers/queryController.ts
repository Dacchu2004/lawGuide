
import { Request,Response } from "express";
import prisma from "../config/db";

export const handleQuery =async(req:Request &{user?:any},res:Response) =>{
    try{
        const {queryText,state,language} =req.body;

        if(!queryText){
            res.status(400).json({message:"Query text is required"})
        }

        // Use default state & language if not provided
        const userState = state || req.user.state;
        const userLanguage = language || req.user.language;

        //store in DB
        const newQuery =await prisma.query.create({
            data:{
                userId:req.user.id,
                queryText,
                state:userState,
                language:userLanguage,
                status:"received"
            }
        });

        res.status(201).json({
            message:"Query received - AI processing will be added late",
            queryId:newQuery.id,
            userState,
            userLanguage
        });
    }
    catch(error){
        console.error("Query Error:",error);
        res.status(500).json({message:"Error handling query",error});
    }
};