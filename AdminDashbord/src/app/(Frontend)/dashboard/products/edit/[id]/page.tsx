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
import { useRouter } from "next/navigation";

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

// Mock product data (same as in product detail page, but as an array for lookup)
const mockProducts = [
  {
    id: "1",
    name: "Industrial Steel Pipes",
    sku: "ISP-001",
    description:
      "High-quality industrial steel pipes suitable for construction and plumbing applications. These pipes are manufactured using premium grade steel and undergo rigorous quality testing to ensure durability and reliability.",
    category: "Construction Materials",
    price: 45.99,
    stock: 150,
    minStock: 50,
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    images: [
      "/placeholder.svg?height=400&width=400&text=Steel+Pipe+1",
      "/placeholder.svg?height=400&width=400&text=Steel+Pipe+2",
      "/placeholder.svg?height=400&width=400&text=Steel+Pipe+3",
      "/placeholder.svg?height=400&width=400&text=Steel+Pipe+4",
    ],
    specifications: {
      material: "High-grade Steel",
      dimensions: "50cm x 10cm diameter",
      weight: "2.5 kg per piece",
      other: "Galvanized finish, suitable for outdoor use",
    },
  },
  // Add more mock products here if needed for testing different IDs
];

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const productId = params.id;

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
    Array<{ file?: File; preview: string; name: string; size: number }>
  >([]);
  const [specifications, setSpecifications] = useState({
    material: "",
    dimensions: "",
    weight: "",
    other: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching product data
    const productToEdit = mockProducts.find((p) => p.id === productId);

    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        sku: productToEdit.sku,
        description: productToEdit.description,
        category: productToEdit.category,
        price: productToEdit.price.toString(),
        stock: productToEdit.stock.toString(),
        minStock: productToEdit.minStock.toString(),
        isActive: productToEdit.status === "Active",
      });
      // For images, we'll just use the preview URLs for existing images
      setImages(
        productToEdit.images.map((imgUrl, index) => ({
          preview: imgUrl,
          name: `Existing Image ${index + 1}`,
          size: 0, // Size is unknown for mock existing images
        }))
      );
      setSpecifications(productToEdit.specifications);
      setLoading(false);
    } else {
      setError("Product not found.");
      setLoading(false);
    }
  }, [productId]);

  /*useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`)
      const product = response.data

      setFormData({
        name: product.name,
        sku: product.sku,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        minStock: product.minStock.toString(),
        isActive: product.status === "Active",
      })

      setImages(
        product.images.map((imgUrl: string, index: number) => ({
          preview: imgUrl,
          name: `Existing Image ${index + 1}`,
          size: 0,
        }))
      )

      setSpecifications(product.specifications)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching product:", err)
      setError("Failed to load product.")
      setLoading(false)
    }
  }

  fetchProduct()
}, [productId])*/

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
      // Revoke URL only if it's a newly uploaded image (has a file object)
      if (prev[index].file) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend to update the product
    console.log("Updating product:", productId);
    console.log("Form data:", formData);
    console.log(
      "Images (newly uploaded files and existing image URLs):",
      images.map((img) => (img.file ? img.file : img.preview))
    );
    console.log("Specifications:", specifications);

    // Simulate successful update and redirect
    router.push(`/dashboard/products/${productId}`);
  };

  /*const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const form = new FormData()
    form.append("name", formData.name)
    form.append("sku", formData.sku)
    form.append("description", formData.description)
    form.append("category", formData.category)
    form.append("price", formData.price)
    form.append("stock", formData.stock)
    form.append("minStock", formData.minStock)
    form.append("status", formData.isActive ? "Active" : "Inactive")

    form.append("specifications", JSON.stringify(specifications))

    // Only upload new files (images with file)
    images.forEach((img) => {
      if (img.file) {
        form.append("images", img.file)
      }
    })

    await axios.put(`/api/products/${productId}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    router.push(`/dashboard/products/${productId}`)
  } catch (err) {
    console.error("Error updating product:", err)
    alert("Failed to update product.")
  }
}*/

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading product data...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/products/${productId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">
            Modify product details for {formData.name}
          </p>
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
                      onChange={(e) => setSpecifications((prev) => ({ ...prev, material: e.target.value }))}
                      placeholder="e.g., Steel, Aluminum, Plastic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={specifications.dimensions}
                      onChange={(e) => setSpecifications((prev) => ({ ...prev, dimensions: e.target.value }))}
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
                      onChange={(e) => setSpecifications((prev) => ({ ...prev, weight: e.target.value }))}
                      placeholder="e.g., 2.5 kg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="other">Other</Label>
                    <Input
                      id="other"
                      value={specifications.other}
                      onChange={(e) => setSpecifications((prev) => ({ ...prev, other: e.target.value }))}
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
                      onChange={(e) => handleInputChange("price", e.target.value)}
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
                      onChange={(e) => handleInputChange("stock", e.target.value)}
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
                      onChange={(e) => handleInputChange("minStock", e.target.value)}
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
                              <p className="text-xs text-gray-500">
                                {image.size ? (image.size / 1024 / 1024).toFixed(2) + " MB" : "Existing"}
                              </p>
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
                    Save Changes
                  </Button>
                  <Link href={`/dashboard/products/${productId}`} className="block">
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
