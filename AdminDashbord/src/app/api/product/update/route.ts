import { deleteCloudinaryImage } from "@/lib/deleteImageFormColudinaru";
import { verifyRefreshToken } from "@/lib/handleToken";
import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { refreshCategory, refreshProduct } from "@/lib/revaldate";
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

    // --- Parse form data ---
    const formData = await req.formData();

    const id = formData.get("id") as string;
    if (!id) {
      return response({ message: "id is missing", status: 400 });
    }

    const productName = formData.get("productName") as string;
    const categoryName = formData.get("category") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const material = formData.get("material") as string | null;
    const size = formData.get("size") as string | null;
    const weight = formData.get("weight") as string | null;
    const discount = formData.get("discount") as string | null;
    const otherSpecification = formData.get("otherSpecification") as string | null;

    // --- Primary image ---
    let pImage: string | null = null;
    const primaryImage = formData.get("primaryImage");

    if (primaryImage instanceof File) {
      // New upload
      pImage = await uploadOnCloudinary(primaryImage);
    } else if (typeof primaryImage === "string") {
      // Existing URL
      pImage = primaryImage;
    }

    // --- Secondary images ---
    const imageEntries = formData.getAll("images");
    let images: string[] = [];

    for (const entry of imageEntries) {
      if (entry instanceof File) {
        const uploaded = await uploadOnCloudinary(entry);
        if (uploaded) images.push(uploaded);
      } else if (typeof entry === "string") {
        images.push(entry);
      }
    }

    // --- Existing product for diff ---
    const pro: any = await prisma.product.findUnique({
      where: { id },
    });

    // Compare new vs old images
    const newImages = [pImage, ...images];
    const oldImages = [pro?.primaryImage, ...(pro?.images || [])];
    const deletedImages = oldImages.filter((img: string) => img && !newImages.includes(img));

    // Delete unused images from Cloudinary
    await Promise.all(
      deletedImages.map(async (img: string) => {
        if (img.startsWith("http")) {
          await deleteCloudinaryImage(img);
          console.log("Deleted from Cloudinary:", img);
        }
      })
    );

    // --- Category check ---
    const category = await prisma.category.findFirst({
      where: { categoryName },
    });

    // --- Update product ---
    const product = await prisma.product.update({
      where: { id },
      data: {
        productName,
        images,
        primaryImage: pImage || "",
        category: category?.categoryName,
        description,
        price,
        material: material || undefined,
        size: size || undefined,
        weight: weight || undefined,
        discount: discount || undefined,
        otherSpecification: otherSpecification || undefined,
      },
    });

    // --- Revalidation ---
    if (
      pro.productName !== productName ||
      pro.primaryImage !== pImage ||
      pro.category !== category?.categoryName ||
      pro.price !== price
    ) {
      await refreshProduct();
    }
    if (pro.category !== category?.categoryName) {
      await refreshCategory();
    }

    return response({
      message: "product updated successfully",
      status: 200,
      data: product,
    });
  } catch (error: any) {
    console.error("Update error:", error.message);
    return response({
      message: "error while updating the product",
      status: 400,
      error: error.message,
    });
  }
}
