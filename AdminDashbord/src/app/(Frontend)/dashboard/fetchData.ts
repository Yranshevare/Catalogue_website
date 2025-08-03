"use server";
// components/dashboard/fetchDashboardData.ts

import axios from "axios";
import { unstable_cache } from "next/cache";

export const fetchDashboardData = unstable_cache(
  async () => {
    const res = await axios.get("http://localhost:3000/api/product/getDashBoardInfo"); // use full URL
    return res.data;
  },
  [], // no params
  { tags: ["product"] }
);
