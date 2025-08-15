"use server";
// components/dashboard/fetchDashboardData.ts

import axios from "axios";
import { unstable_cache } from "next/cache";

export const fetchDashboardData = unstable_cache(
  async () => {
    const res = await axios.get("http://localhost:3000/api/product/getDashBoardInfo"); // use full URL
    console.log(res)
    return res.data;
  },
  [], // no params
  { tags: ["Dashboard"] }
);

export const fetchProductData = unstable_cache(
  async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/product/getAll"); // use full URL
      console.log(res)
      return res.data;
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  },
  [], // no params
  { tags: ["product"] }
);

export const fetchCategoryData = unstable_cache(
  async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/Category/getAll"); // use full URL
      console.log(res)
      return res.data;
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  },
  [], // no params
  { tags: ["category"] }
);
