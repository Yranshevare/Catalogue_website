"use client";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Warehouse,
  Calendar,
  Eye,
} from "lucide-react";
import Link from "next/link";

// Mock product data - in a real app, this would come from your database
const productData = {
  id: "1", // Changed to string for consistency with URL params
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
};

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  // In a real app, you would fetch productData based on params.id
  // For now, we're using the mock productData directly.
  const product = productData; // Assuming productData matches the ID for this example

  if (!product) {
    return (
      <div className="text-center py-10 text-gray-600">
        Product not found.{" "}
        <Link
          href="/dashboard/products"
          className="text-blue-600 hover:underline"
        >
          Go back
        </Link>
      </div>
    );
  }

  {
    /* Data fetching */
  }
  /*const [product, setProduct] = useState<any>(null)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${params.id}`)
        setProduct(res.data)
      } catch (err) {
        console.error("Failed to fetch product", err)
        setError("Unable to fetch product data.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])*/

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/products/edit/${product.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square w-full max-w-md mx-auto">
                  <img
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={`${product.name} - Image ${selectedImage + 1}`}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 justify-center flex-wrap">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-16 h-16 rounded-md border-2 overflow-hidden transition-all ${
                          selectedImage === index
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Description */}
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {product.specifications.material && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Material:</span>
                    <span className="text-gray-700">{product.specifications.material}</span>
                  </div>
                )}
                {product.specifications.dimensions && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Dimensions:</span>
                    <span className="text-gray-700">{product.specifications.dimensions}</span>
                  </div>
                )}
                {product.specifications.weight && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Weight:</span>
                    <span className="text-gray-700">{product.specifications.weight}</span>
                  </div>
                )}
                {product.specifications.other && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Other:</span>
                    <span className="text-gray-700">{product.specifications.other}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <Badge
                  variant={product.status === "Active" ? "default" : "destructive"}
                  className={product.status === "Active" ? "bg-green-100 text-green-800" : ""}
                >
                  {product.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Category</span>
                <span className="text-sm text-gray-900">{product.category}</span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Price</span>
                </div>
                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Warehouse className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Stock</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{product.stock}</span>
                  <p className="text-xs text-gray-500">Min: {product.minStock}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">SKU</span>
                </div>
                <span className="text-sm font-mono text-gray-900">{product.sku}</span>
              </div>
            </CardContent>
          </Card>

          {/* Product Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Created</span>
                </div>
                <span className="text-sm text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Edit className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Last Updated</span>
                </div>
                <span className="text-sm text-gray-900">{new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/dashboard/products/edit/${product.id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </Button>
              </Link>
              <Button variant="outline" className="w-full bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                View in Catalog
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700 bg-transparent">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
