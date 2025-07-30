"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  Eye,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

// Mock data for categories (expanded to include more details)
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

// Mock data for products (same as in products page, but with categoryId for filtering)
const mockProducts = [
  {
    id: "1",
    name: "Industrial Steel Pipes",
    category: "Construction Materials",
    categoryId: "1",
    price: 45.99,
    stock: 150,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
    sku: "ISP-001",
  },
  {
    id: "2",
    name: "Heavy Duty Bolts Set",
    category: "Hardware",
    categoryId: "2",
    price: 12.5,
    stock: 300,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
    sku: "HDB-002",
  },
  {
    id: "3",
    name: "Safety Helmets",
    category: "Safety Equipment",
    categoryId: "3",
    price: 25.0,
    stock: 15,
    status: "Low Stock",
    image: "/placeholder.svg?height=50&width=50",
    sku: "SH-003",
  },
  {
    id: "4",
    name: "Welding Electrodes",
    category: "Welding Supplies",
    categoryId: "4",
    price: 8.75,
    stock: 200,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
    sku: "WE-004",
  },
  {
    id: "5",
    name: "Hydraulic Pumps",
    category: "Machinery",
    categoryId: "5",
    price: 299.99,
    stock: 25,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
    sku: "HP-005",
  },
  {
    id: "6",
    name: "Cement Bags (50kg)",
    category: "Construction Materials",
    categoryId: "1",
    price: 8.5,
    stock: 500,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
    sku: "CM-006",
  },
  {
    id: "7",
    name: "Work Gloves",
    category: "Safety Equipment",
    categoryId: "3",
    price: 7.99,
    stock: 120,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
    sku: "SG-007",
  },
  {
    id: "8",
    name: "Steel Beams",
    category: "Construction Materials",
    categoryId: "1",
    price: 120.0,
    stock: 80,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
    sku: "CM-008",
  },
  {
    id: "9",
    name: "Drill Bits Set",
    category: "Hardware",
    categoryId: "2",
    price: 29.99,
    stock: 180,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
    sku: "HDB-009",
  },
];

export default function CategoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const categoryId = params.id;
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProductsToAdd, setSelectedProductsToAdd] = useState<string[]>(
    []
  );

  // In a real app, fetch category and products based on categoryId
  const category = mockCategories.find((cat) => cat.id === categoryId);
  const productsInCategory = mockProducts.filter(
    (product) => product.categoryId === categoryId
  );
  const otherProducts = mockProducts.filter(
    (product) => product.categoryId !== categoryId
  );

  /*const [category, setCategory] = useState(null);
  const [productsInCategory, setProductsInCategory] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productsRes, otherProductsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/categories/${params.id}`),
          axios.get(`http://localhost:5000/api/products?categoryId=${params.id}`),
          axios.get(`http://localhost:5000/api/products?excludeCategoryId=${params.id}`),
        ]);

        setCategory(categoryRes.data);
        setProductsInCategory(productsRes.data);
        setOtherProducts(otherProductsRes.data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, [params.Id]);*/

  const filteredOtherProducts = otherProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const handleSelectProductToAdd = (productId: string) => {
    setSelectedProductsToAdd((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddExistingProducts = () => {
    console.log(
      `Adding products ${selectedProductsToAdd.join(", ")} to category ${
        category?.name
      }`
    );
    // In a real app, send this data to your backend to update product categories
    setIsAddProductDialogOpen(false);
    setSelectedProductsToAdd([]);
    setProductSearchTerm("");
  };

  /* const handleAddExistingProducts = async () => {
  try {
    await axios.post("http://localhost:5000/api/categories/add-products", {
      categoryId: category.id,
      productIds: selectedProductsToAdd,
    })

    // Refresh data after successful update
    const productsRes = await axios.get(PRODUCTS_API_URL)
    setProductsInCategory(productsRes.data)

    setIsAddProductDialogOpen(false)
    setSelectedProductsToAdd([])
    setProductSearchTerm("")
  } catch (error) {
    console.error("Error adding products:", error)
  }
}*/

  /*const handleDeleteCategory = async () => {
  const confirmDelete = confirm(`Are you sure you want to delete "${category.name}"?`);
  if (!confirmDelete) return;

  try {
    await axios.delete(`/api/categories/${category.id}`);
    toast({ title: "Category deleted successfully!" });
    router.push("/dashboard/categories"); // Redirect to categories list
  } catch (error) {
    console.error("Delete failed:", error);
    toast({ title: "Failed to delete category", variant: "destructive" });
  }
};*/

  if (!category) {
    return (
      <div className="text-center py-10 text-gray-600">
        Category not found.{" "}
        <Link
          href="/dashboard/categories"
          className="text-blue-600 hover:underline"
        >
          Go back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/categories">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-gray-600">{category.productCount} products</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/categories/edit/${category.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {category.description}
                </p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Status
                  </span>
                  <Badge
                    variant={
                      category.status === "Active" ? "default" : "destructive"
                    }
                    className={
                      category.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {category.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Products
                  </span>
                  <span className="text-sm text-gray-900">
                    {category.productCount}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      Created
                    </span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Edit className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      Last Updated
                    </span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products in this Category */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Products in "{category.name}" ({productsInCategory.length})
              </CardTitle>
              <Dialog
                open={isAddProductDialogOpen}
                onOpenChange={setIsAddProductDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Product to "{category.name}"</DialogTitle>
                    <DialogDescription>
                      Add existing products or create a new one for this
                      category.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Option 1: Add Existing Product */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">
                        Add Existing Product(s)
                      </h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search products to add..."
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-1">
                        {filteredOtherProducts.length > 0 ? (
                          filteredOtherProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                              onClick={() =>
                                handleSelectProductToAdd(product.id)
                              }
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={selectedProductsToAdd.includes(
                                    product.id
                                  )}
                                  onChange={() =>
                                    handleSelectProductToAdd(product.id)
                                  }
                                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                />
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-8 h-8 rounded-md object-cover"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    SKU: {product.sku}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline">
                                {product.category}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 py-4">
                            No other products found.
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handleAddExistingProducts}
                        disabled={selectedProductsToAdd.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Add Selected Products ({selectedProductsToAdd.length})
                      </Button>
                    </div>

                    <Separator />

                    {/* Option 2: Create New Product */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">
                        Create New Product
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create a brand new product and automatically assign it
                        to this category.
                      </p>
                      <Link
                        href={`/dashboard/products/new?categoryId=${category.id}`}
                      >
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Product
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAddProductDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {productsInCategory.length > 0 ? (
                <div className="space-y-4">
                  {productsInCategory.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <Link href={`/dashboard/products/${product.id}`}>
                            <h4 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                              {product.name}
                            </h4>
                          </Link>
                          <p className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </p>
                        </div>
                        <Badge
                          variant={
                            product.status === "Active"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            product.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {product.status}
                        </Badge>
                        <Link href={`/dashboard/products/${product.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No products found in this category.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/dashboard/categories/edit/${category.id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Category
                </Button>
              </Link>

              <Dialog
                open={isAddProductDialogOpen}
                onOpenChange={setIsAddProductDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Package className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Product to "{category.name}"</DialogTitle>
                    <DialogDescription>
                      Add existing products or create a new one for this
                      category.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Option 1: Add Existing Product */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">
                        Add Existing Product(s)
                      </h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search products to add..."
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-1">
                        {filteredOtherProducts.length > 0 ? (
                          filteredOtherProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                              onClick={() =>
                                handleSelectProductToAdd(product.id)
                              }
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={selectedProductsToAdd.includes(
                                    product.id
                                  )}
                                  onChange={() =>
                                    handleSelectProductToAdd(product.id)
                                  }
                                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                />
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-8 h-8 rounded-md object-cover"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    SKU: {product.sku}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline">
                                {product.category}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 py-4">
                            No other products found.
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handleAddExistingProducts}
                        disabled={selectedProductsToAdd.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Add Selected Products ({selectedProductsToAdd.length})
                      </Button>
                    </div>

                    <Separator />

                    {/* Option 2: Create New Product */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">
                        Create New Product
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create a brand new product and automatically assign it
                        to this category.
                      </p>
                      <Link
                        href={`/dashboard/products/new?categoryId=${category.id}`}
                      >
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Product
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAddProductDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 bg-transparent"
               // onClick={handleDeleteCategory()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
