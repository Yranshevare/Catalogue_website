import { verifyRefreshToken } from "@/lib/handleToken";
import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { uploadOnCloudinary } from "@/lib/uploadImageToCloudinary";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // --- Auth check ---
    const token = req.cookies.get("refreshToken")?.value;
    if (!token) {
      return response({ error: "unauthorize access", status: 400 });
    }
    if (!verifyRefreshToken(token)) {
      return response({ message: "unauthorize access", status: 400 });
    }

    // --- Parse FormData ---
    const formData = await req.formData();

    const productName = formData.get("productName") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const material = formData.get("material") as string | null;
    const size = formData.get("size") as string | null;
    const weight = formData.get("weight") as string | null;
    const discount = formData.get("discount") as string | null;
    const otherSpecification = formData.get("otherSpecification") as string | null;

    const primaryImageFile = formData.get("primaryImage") as File | null;
    const imageFiles = formData.getAll("images") as File[];

    // --- Upload to Cloudinary ---
    let pImage: any = null;
    if (primaryImageFile) {
      pImage = await uploadOnCloudinary(primaryImageFile);
    }

    const img: string[] = [];
    for await (const file of imageFiles) {
      const uploaded = await uploadOnCloudinary(file);
      if (uploaded) img.push(uploaded);
    }

    // --- Save to DB ---
    const product = await prisma.product.create({
      data: {
        productName,
        primaryImage: pImage || "",
        images: img,
        category: category || null,
        description,
        price,
        material: material || undefined,
        size: size || undefined,
        weight: weight || undefined,
        discount: discount || undefined,
        otherSpecification: otherSpecification || undefined,
      },
    });

    return response({
      message: "product added successfully",
      status: 200,
      data: product,
    });
  } catch (error: any) {
    console.log(error.message);
    return response({
      message: "error while adding the product",
      status: 400,
      error: error.message,
    });
  }
}
