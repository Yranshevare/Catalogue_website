"use server"
import { revalidateTag } from "next/cache";

export async function refreshDashboard() {
   revalidateTag('Dashboard')
}
export async function refreshProduct() {
   revalidateTag('product')
}