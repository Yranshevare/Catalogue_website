"use client";

import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { promise } from "zod";

// Mock category data (same as in category detail page, but as an array for lookup)
const mockCategories = [
  {
    id: "1",
    name: "Construction Materials",
    description:
      "Materials used in construction and building projects, including steel, cement, and timber.",
    productCount: 45,
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-07-20",
  },
  {
    id: "2",
    name: "Hardware",
    description:
      "Bolts, screws, nuts, washers, and other small hardware items essential for assembly and fastening.",
    productCount: 78,
    status: "Active",
    createdAt: "2024-01-10",
    updatedAt: "2024-07-18",
  },
  {
    id: "3",
    name: "Safety Equipment",
    description:
      "Personal protective equipment (PPE) and safety gear for industrial environments, such as helmets, gloves, and safety glasses.",
    productCount: 32,
    status: "Active",
    createdAt: "2024-01-08",
    updatedAt: "2024-07-19",
  },
  {
    id: "4",
    name: "Welding Supplies",
    description:
      "Equipment and consumables for welding processes, including electrodes, welding machines, and protective gear.",
    productCount: 25,
    status: "Active",
    createdAt: "2024-01-05",
    updatedAt: "2024-07-17",
  },
  {
    id: "5",
    name: "Machinery",
    description:
      "Industrial machinery and heavy equipment used in manufacturing and construction.",
    productCount: 12,
    status: "Active",
    createdAt: "2024-01-03",
    updatedAt: "2024-07-15",
  },
];


interface ProductPageProps {
  params: Promise<{ id: string }>; // params is a Promise
}


export default function EditCategoryPage({params,}: ProductPageProps) {
  const router = useRouter();
  const {id} = React.use(params);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");

   const {register, handleSubmit,formState: { errors,isSubmitting }} = useForm();



  useEffect(() => {
  const fetchCategory = async () => {
    try {
      const res = await axios.get(`/api/Category/getOne?id=${id}`)
      console.log(res.data)
      const data = {
        name: res.data.data.category.categoryName,
        description: res.data.data.category.description,
      }
      console.log(data)

      setFormData({
        name: data.name || "",
        description: data.description || "",
      })
      setCategoryName(data.name || "")
    } catch (err) {
      setError("Failed to load category.")
    } finally {
      setLoading(false)
    }
  }
  fetchCategory()
}, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onsubmit = async(data:any) => {
    console.log("Updating category:", id);
    console.log("Form data:", formData);

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    // Simulate successful update and redirect
    try {
      const res = await axios.post(`/api/Category/update/`, {formData, id});
      console.log(res.data)
      if(res.status === 200){
        router.push(`/dashboard/categories/${id}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      
    }
    
  };



if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading category data...</div>
  }

if (error) {
  return <div className="text-center py-10 text-red-600">{error}</div>
}
  
return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col  items-start gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            disabled={isSubmitting}
            onClick={()=> router.push(`/dashboard/categories/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Category
          </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-600">Modify details for {categoryName}</p>
        </div>
      </div>
       <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                  disabled={isSubmitting}
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter category description"
                    rows={4}
                  />
                </div>
                
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {
                      isSubmitting ? <Loader2 className=" h-4 w-4 animate-spin"/> : "Save Changes"
                    }
                    
                  </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={isSubmitting}
                      onClick={() => router.push(`/dashboard/categories/${id}`)}
                      className="w-full bg-transparent"
                    >
                      Cancel
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>

)
}
