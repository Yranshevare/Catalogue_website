import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { NextRequest } from "next/server"

type DataType = {
    productName:string
    images:string[]
    primaryImage:string
    category?:string
    description:string
    price:string
    material?:string
    size?:string
    weight?:string
    discount?:string
    otherSpecification?:string
}


export async function POST(req:NextRequest){
    try {

        const data:DataType = await req.json()

        const category = await prisma.category.findFirst({
            where:{
                categoryName:data.category
            }
        })       
        
        
        const product = await prisma.product.create({
            data:{
                productName:data.productName,
                images:data.images,
                primaryImage:data.primaryImage,
                category:category?.categoryName,
                description:data.description,
                price:data.price,
                material:data.material,
                size:data.size,
                weight:data.weight,
                discount:data.discount,
                otherSpecification:data.otherSpecification
            }
        })
        
        return response({
            message:"product added successfully",
            status:200,
            data:product
        })
    } catch (error:any) {
        return response({
            message:"error while adding the product",
            status:400,
            error:error.message
        })
    }
}