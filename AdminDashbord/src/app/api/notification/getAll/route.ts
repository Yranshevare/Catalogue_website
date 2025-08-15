import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
    try {
        const id:any = req.nextUrl.searchParams.get("id")
        const notification = await prisma.notification.findUnique({where:{id:id}}) 

        if(!notification){return response({message:"Notification not found",status:404})}

        const productIds = notification.products.map(p => p.productId);

        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, productName: true },
        });

        const productsMap = Object.fromEntries(products.map(p => [p.id, p.productName]));

        const productsWithNames = notification.products.map(item => ({
            ...item,
            productName: productsMap[item.productId] || null
        }));

        notification.products = productsWithNames


        return response({message:"Notification fetched successfully",status:200,data:{notification}})
        
    } catch (error) {
        return response({message:"error while decoding the refresh token",status:400})
    }
}