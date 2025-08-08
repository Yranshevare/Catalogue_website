import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
    try {
        return(response({message:"Product Fetched Successfully",status:200}))
    } catch (error) {
        return response({message:"Internal Server Error",status:500})
    }
}