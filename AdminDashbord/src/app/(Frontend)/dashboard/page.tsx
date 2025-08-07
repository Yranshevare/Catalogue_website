"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Tag,
  Upload,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import AddCategoryForm from "@/components/category/addCategoryForm";
import { fetchDashboardData } from "../../../lib/fetchData";
import { set } from "zod";

// Mock data
let stats = [
  {
    title: "Total Products",
    change: "+12%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Categories",
    change: "+2",
    changeType: "positive" ,
    icon: Tag,
  },
  
];

const recentProducts = [
  {
    id: 1,
    name: "Industrial Steel Pipes",
    category: "Construction Materials",
    status: "Active",
    price: "$45.99",
    stock: 150,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Heavy Duty Bolts Set",
    category: "Hardware",
    status: "Active",
    price: "$12.50",
    stock: 300,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Safety Helmets",
    category: "Safety Equipment",
    status: "Low Stock",
    price: "$25.00",
    stock: 15,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Welding Electrodes",
    category: "Welding Supplies",
    status: "Active",
    price: "$8.75",
    stock: 200,
    image: "/placeholder.svg?height=40&width=40",
  },
];

type stats = {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: any
}

type recentProducts = {
  id: number
  name: string
  category: string
  status: string
  price: string
  stock: number
  image: string
}




export default function Dashboard() {

  
  const [productCount, setProductCount] = useState([0,0]);
  const [recentProduct, setRecentProduct] = useState<recentProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadInfo = async () => {
      try {
        const res:any = await fetchDashboardData(); 
        console.log(res.data)
        setProductCount(res.data.count); 
        setRecentProduct(res.data.recentProduct); 
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadInfo();
  }, []);

  return (
    <div className="space-y-6">
       {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 ">
         {stats.map((stat,index)=>(
            <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                   <div className="text-2xl font-bold text-gray-900">{productCount[index]}</div> 
                   <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-gray-500"
                }`}
              >{stat.change}</p>
                </CardContent>
            </Card>
         ))} 
      </div> 

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>  
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/products/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
            </Button>
            </Link>
            {/* <Link href="/dashboard/categories/new">
            <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
            </Button>
            </Link> */}
            <AddCategoryForm />
            <Link href="/dashboard/products">
              <Button variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
            </Link>
          </div>  
        </CardContent>
      </Card>

      {/* Recent Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle>Recent Products</CardTitle>
            <Link href="/dashboard/products">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
             {
                isLoading ? 
                <div className="text-center flex items-center justify-center w-full h-[40vh]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div> 
                :
                recentProduct.map((product:any)=>(
                 <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                      <img
                      src={product.primaryImage || "/placeholder.svg"}
                      alt={product.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{product?.productName}</h4>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                      <div className="text-right">
                      <p className="font-medium text-gray-900">{product.price} Rs</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/products/"+product.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div> 
                ))
             } 
           </div> 
        </CardContent>
      </Card>
    </div>
  )
}
