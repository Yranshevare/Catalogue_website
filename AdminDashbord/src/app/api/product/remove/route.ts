import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function DELETE(req:NextRequest) {
    try {
        const {searchParams} = new URL(req.url)         // http://localhost:3000/api/product/remove?id=123

        const id = searchParams.get("id")

        if(!id){        // for empty email or password
            return response({message:"id is missing",status:400})
        }

        if(!req.cookies.get("refreshToken")){    // for already logged in user
            return response({error:"unauthorize access",status:400})
        }

        const product = await prisma.product.delete({
            where:{
                id:id
            }
        })

        return response({
            message:"product removed successfully",
            status:200,
            data:product
        })
    } catch (error:any) {
        return response({message:"error while decoding the refresh token",status:400,error:error.message})
    }
}