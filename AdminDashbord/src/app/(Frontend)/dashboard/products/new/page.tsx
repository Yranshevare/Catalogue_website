"use client";

import type React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const categories = [
  "Construction Materials",
  "Hardware",
  "Safety Equipment",
  "Welding Supplies",
  "Machinery",
  "Tools",
  "Electrical",
  "Plumbing",
];

const mockCategories = [
  { id: "1", name: "Construction Materials" },
  { id: "2", name: "Hardware" },
  { id: "3", name: "Safety Equipment" },
  { id: "4", name: "Welding Supplies" },
  { id: "5", name: "Machinery" },
  { id: "6", name: "Tools" },
  { id: "7", name: "Electrical" },
  { id: "8", name: "Plumbing" },
];

export default function NewProductPage() {
  const searchParams = useSearchParams();
  const preselectedCategoryId = searchParams.get("categoryId");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    minStock: "",
    isActive: true,
  });
  const [images, setImages] = useState<
    Array<{ file: File; preview: string; name: string; size: number }>
  >([]);
  const [specifications, setSpecifications] = useState({
    material: "",
    dimensions: "",
    weight: "",
    other: "",
  });

  useEffect(() => {
    if (preselectedCategoryId) {
      const categoryName = mockCategories.find(
        (cat) => cat.id === preselectedCategoryId
      )?.name;
      if (categoryName) {
        setFormData((prev) => ({ ...prev, category: categoryName }));
      }
    }
  }, [preselectedCategoryId]);

  /*useEffect(() => {
  async function fetchCategoryName() {
    if (preselectedCategoryId) {
      try {
        const res = await axios.get(`/api/categories/${preselectedCategoryId}`)
        const categoryName = res.data.name

        if (categoryName) {
          setFormData((prev) => ({ ...prev, category: categoryName }))
        }
      } catch (err) {
        console.error("Category fetch error:", err)
      }
    }
  }

  fetchCategoryName()
}, [preselectedCategoryId])*/

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty specifications

    console.log("Form data:", formData);
    console.log(
      "Images:",
      images.map((img) => img.file)
    );
    console.log("Specifications:", specifications);

    window.location.href = "/dashboard/products";
  };

  /*const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const formPayload = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value as string)
    })

    formPayload.append("specifications", JSON.stringify(specifications))

    images.forEach((img, i) => {
      formPayload.append("images", img.file)
    })

    const res = await axios.post("/api/products", formPayload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (res.status === 200 || res.status === 201) {
      window.location.href = "/dashboard/products"
    } else {
      console.error("Error:", res.statusText)
    }
  } catch (error) {
    console.error("Submit failed:", error)
  }
}*/

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product in your catalog</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="e.g., ISP-001"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={specifications.material}
                      onChange={(e) =>
                        setSpecifications((prev) => ({
                          ...prev,
                          material: e.target.value,
                        }))
                      }
                      placeholder="e.g., Steel, Aluminum, Plastic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={specifications.dimensions}
                      onChange={(e) =>
                        setSpecifications((prev) => ({
                          ...prev,
                          dimensions: e.target.value,
                        }))
                      }
                      placeholder="e.g., L x W x H (cm)"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={specifications.weight}
                      onChange={(e) =>
                        setSpecifications((prev) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }
                      placeholder="e.g., 2.5 kg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="other">Other</Label>
                    <Input
                      id="other"
                      value={specifications.other}
                      onChange={(e) =>
                        setSpecifications((prev) => ({
                          ...prev,
                          other: e.target.value,
                        }))
                      }
                      placeholder="e.g., Color, Brand, Model"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        handleInputChange("stock", e.target.value)
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Minimum Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={(e) =>
                        handleInputChange("minStock", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="images" className="cursor-pointer">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        {images.length === 0 ? "Upload product images" : "Add more images"}
                      </span>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                    <p className="text-xs text-gray-400">You can select multiple files at once</p>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Uploaded Images ({images.length})</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setImages([])}
                        className="text-red-600 hover:text-red-700"
                      >
                        Clear All
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                      {images.map((image, index) => (
                        <div key={index} className="relative group border rounded-lg p-2 hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt={`Product ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{image.name}</p>
                              <p className="text-xs text-gray-500">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                              {index === 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                  Primary Image
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              {index !== 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newImages = [...images]
                                    const [movedImage] = newImages.splice(index, 1)
                                    newImages.unshift(movedImage)
                                    setImages(newImages)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Set as primary"
                                >
                                  <span className="text-xs">★</span>
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeImage(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                      💡 Tip: The first image will be used as the primary product image. Click ★ to reorder.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive">Active Product</Label>
                    <p className="text-sm text-gray-500">Product will be visible in catalog</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
             <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Product
                  </Button>
                  <Link href="/dashboard/products" className="block">
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
  );
}
