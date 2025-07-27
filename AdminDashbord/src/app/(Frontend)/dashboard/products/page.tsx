"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// Mock data
const products = [
  {
    id: "1", // Changed to string for consistency with URL params
    name: "Industrial Steel Pipes",
    category: "Construction Materials",
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
    price: 299.99,
    stock: 25,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
    sku: "HP-005",
  },
];

type products = {
  id: number;
  name: string;
  category: string;
  status: string;
  price: string;
  stock: number;
  image: string;
  sku: string;
};

export default function ProductsPage() {
  
    {/* Data Handling */}
  /*const [products, setProducts] = useState<products[]>([]);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get("/api/products");
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData()
    },[])*/

   {/* product deletion */}
  /*const handleDelete = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;
  try {
    // Delete from backend
    await axios.delete(`/api/products/${id}`);
    fetchData()
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete product.");
  }
};*/


  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      product.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <Link href={`/dashboard/products/${product.id}`}>
                            <div className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                              {product.name}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                             <DropdownMenuItem asChild>
                            <Link href={`/dashboard/products/${product.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/products/edit/${product.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                          //onClick={() => handleDelete(product.id)}
                          className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
