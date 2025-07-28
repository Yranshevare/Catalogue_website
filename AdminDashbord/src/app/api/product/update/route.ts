import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { NextRequest } from "next/server"

type DataType = {
    id:string
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

        if(!data.id){        // for empty email or password
            return response({message:"id is missing",status:400})
        }

        if(!req.cookies.get("refreshToken")){    // for already logged in user
            return response({error:"unauthorize access",status:400})
        }

        const category = await prisma.category.findFirst({
            where:{
                categoryName:data.category
            }
        })       
        
        
        const product = await prisma.product.update({
            where:{
                id:data.id
            },
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