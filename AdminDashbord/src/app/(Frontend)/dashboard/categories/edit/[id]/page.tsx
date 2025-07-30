"use client";

import type React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const categoryId = params.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active", // Assuming status can be edited
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching category data
    const categoryToEdit = mockCategories.find((c) => c.id === categoryId);

    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        description: categoryToEdit.description,
        status: categoryToEdit.status,
      });
      setLoading(false);
    } else {
      setError("Category not found.");
      setLoading(false);
    }
  }, [categoryId]);


  /*useEffect(() => {
  const fetchCategory = async () => {
    try {
      const res = await axios.get(`/api/categories/${categoryId}`)
      const data = res.data

      setFormData({
        name: data.name || "",
        description: data.description || "",
        status: data.status || "Active",
      })
    } catch (err) {
      setError("Failed to load category.")
    } finally {
      setLoading(false)
    }
  }

  fetchCategory()
}, [categoryId])*/

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend to update the category
    console.log("Updating category:", categoryId);
    console.log("Form data:", formData);

    // Simulate successful update and redirect
    router.push(`/dashboard/categories/${categoryId}`);
  };

  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
    await axios.put(`/api/categories/${categoryId}`, formData)
    router.push(`/dashboard/categories/${categoryId}`)
    } catch (err) {
    console.error("Update failed:", err)
    setError("Failed to update category. Please try again.")
}*/

if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading category data...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>
  }
  
return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
        <Link href={`/dashboard/categories/${categoryId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Category
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-600">Modify details for {formData.name}</p>
        </div>
      </div>
       <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter category description"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                  <Link href={`/dashboard/categories/${categoryId}`} className="block">
                    <Button type="button" variant="outline" className="w-full bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>

)
}
