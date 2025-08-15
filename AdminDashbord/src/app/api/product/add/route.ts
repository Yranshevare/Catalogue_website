import { verifyRefreshToken } from "@/lib/handleToken"
import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { uploadOnCloudinary } from "@/lib/uploadImageToCloudinary"
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

        if(!req.cookies.get("refreshToken")){    // for already logged in user
            return response({error:"unauthorize access",status:400})
        }

        if(!verifyRefreshToken(req.cookies.get("refreshToken")?.value as string)){    // for already logged in user
            return response({message:"unauthorize access",status:400})
        }

        const data:DataType = await req.json()

        const category = await prisma.category.findFirst({
            where:{
                categoryName:data.category
            }
        })       
        
        console.log(data);
        const pImage = await uploadOnCloudinary(data.primaryImage)

        const img = []
        for await (const i of data.images) {
            img.push(await uploadOnCloudinary(i))
        } 
        let images:any = await Promise.all(img)
        images = images.filter((i:any) => i !== null).map((i:any) => i.url)

        const product = await prisma.product.create({
            data:{
                productName:data.productName,
                images:images || data.images,
                primaryImage:pImage?.url || data.primaryImage,
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