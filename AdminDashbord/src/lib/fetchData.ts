"use server";
import { productionServer } from "./constant";
// components/dashboard/fetchDashboardData.ts

import axios from "axios";
import { unstable_cache } from "next/cache";

export const fetchDashboardData = unstable_cache(
  async () => {
    const res = await axios.get(`${productionServer}api/product/getDashBoardInfo`); // use full URL
    // console.log(res)
    return res.data;
  },
  [], // no params
  { tags: ["Dashboard"] }
);

export const fetchProductData = unstable_cache(
  async () => {
    try {
      const res = await axios.get(`${productionServer}api/product/getAll`); // use full URL
      // console.log(res)
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
      const res = await axios.get(`${productionServer}api/Category/getAll`); // use full URL
      // console.log(res)
      return res.data;
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  },
  [], // no params
  { tags: ["category"] }
);
