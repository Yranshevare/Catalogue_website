import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { NextRequest } from "next/server"

export async function POST(req:NextRequest) {
    try {
        const data = await req.json()
        // console.log(data)
        const notification = await prisma.notification.create({data})
        return response({message:"Notification Created Successfully",status:200,data:notification})
    } catch (error:any) {
        console.log(error.message)
        return response({message:"Internal Server Error",status:500})
    }
}