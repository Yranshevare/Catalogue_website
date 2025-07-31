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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Tag,
  Eye,
} from "lucide-react";
import Link from "next/link";
import {useForm} from 'react-hook-form'
import {set, z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';

// Mock data
const categories = [
  {
    id: "1", // Changed to string for consistency with URL params
    name: "Construction Materials",
    description: "Materials used in construction and building projects",
    productCount: 45,
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Hardware",
    description: "Bolts, screws, nuts, and other hardware items",
    productCount: 78,
    status: "Active",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Safety Equipment",
    description: "Personal protective equipment and safety gear",
    productCount: 32,
    status: "Active",
    createdAt: "2024-01-08",
  },
  {
    id: "4",
    name: "Welding Supplies",
    description: "Welding equipment, electrodes, and accessories",
    productCount: 25,
    status: "Active",
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    name: "Machinery",
    description: "Industrial machinery and equipment",
    productCount: 12,
    status: "Active",
    createdAt: "2024-01-03",
  },
];

/*type CategoryType = {
  id: string
  name: string
  description: string
  productCount: number
  status: string
  createdAt: string
}*/

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const {register, handleSubmit,formState: { errors,isSubmitting }, setError} = useForm();

   

  const loadCategory = async() => {
    const category = await axios.get("/api/Category/getAll");
    console.log(category);
    setCategories(category.data.data)
  }

  useEffect(() => {
    loadCategory()
  },[])



  if(categories?.length < 0) return <div>Loading...</div>

  const filteredCategories = categories?.filter(
    (category:any) =>
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async(data:any) => {
    // Handle adding new category
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data)
    try {
      const res = await axios.post("/api/Category/create", data);
      console.log(res)
      if(res.status === 200) loadCategory()
    } catch (error:any) {
      alert(error.response.data.message || `Something went wrong please try again \n${error.message}`);
    }finally{
      setIsAddDialogOpen(false)
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">
            Organize your products into categories
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category to organize your products.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleAddCategory)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  required
                  {...register("name")}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryDescription">Description</Label>
                <Textarea
                  id="categoryDescription"
                  {...register("description")}
                  required
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button className={`${isSubmitting ? 'bg-blue-700':'bg-blue-600'} hover:bg-blue-700`}>
                  {isSubmitting ? "Adding..." : "Add Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category:any) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-blue-600" />
                </div>
                <Link href={`/dashboard/categories/${category.id}`}>
                  <CardTitle className="text-lg hover:text-blue-600 cursor-pointer">
                    {category.categoryName}
                  </CardTitle>
                </Link>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/categories/${category.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/categories/${category.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    /*onClick={() => handleDelete(category.id)}*/
                    className="text-red-600 cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {category.productCount} products
                </div>
                
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories Table (Alternative view) */}
    </div>
  );
}
