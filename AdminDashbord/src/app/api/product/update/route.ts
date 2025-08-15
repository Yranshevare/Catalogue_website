import { deleteCloudinaryImage } from "@/lib/deleteImageFormColudinaru"
import { verifyRefreshToken } from "@/lib/handleToken"
import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { refreshCategory, refreshProduct } from "@/lib/revaldate"
import { uploadOnCloudinary } from "@/lib/uploadImageToCloudinary"
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

        if(!verifyRefreshToken(req.cookies.get("refreshToken")?.value as string)){    // for already logged in user
            return response({message:"unauthorize access",status:400})
        }

        const category = await prisma.category.findFirst({
            where:{
                categoryName:data.category
            }
        })       
        
        let pImage:any = data.primaryImage
        if(!pImage.startsWith("http")){    // for not uploaded image
            const data:any = await uploadOnCloudinary(pImage)
            pImage = data.url 
        }

        

        let image:any = data.images
        await Promise.all(image.map(async(img:any,index:number) => {
            if(!img.startsWith("http")){    // for not uploaded image
                let imgData:any = await uploadOnCloudinary(img)
                image[index] = imgData.url 
            }
        }))

        const pro:any = await prisma.product.findUnique({
            where:{
                id:data.id
            }
        })

        const newImages = [pImage,...image]
        const oldImages = [pro?.primaryImage,...pro?.images]
        //find old images that are not in new images
        const deletedImages = oldImages.filter((img:any) => !newImages.includes(img))

        await Promise.all(deletedImages.map(async(img:any) => {
            if(img.startsWith("http")){    // for not uploaded image
                const res = await deleteCloudinaryImage(img)
                console.log("deleting image from cloudinary",img)
            }
        }))
        
        // console.log(image,pImage)
        const product = await prisma.product.update({
            where:{
                id:data.id
            },
            data:{
                productName:data.productName,
                images:image,
                primaryImage:pImage,
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
        if(pro.productName !== data.productName || pro.primaryImage !== data.primaryImage || pro.category !== data.category || pro.price !== data.price){
            await refreshProduct()
        }
        if(pro.category !== data.category){
            await refreshCategory()
        }
        
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