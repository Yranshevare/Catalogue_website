"use client";

import  React, { useCallback } from "react";
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
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import addImageToLocalServer from "@/lib/localImg";
import { refresh } from "../../refreshDashbord";



interface ProductPageProps {
  params: Promise<{ id: string }>; // params is a Promise
}

export default function EditProductPage({params,}: ProductPageProps) {
  const router = useRouter();
  const {id} = React.use(params);
  // const productId = "1";
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    Discount: "",
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
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    console.log(id)
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product/getOne?id=${id}`)
        const response = await axios.get("/api/Category/getName");
        console.log(response.data.data);
        setCategories(response.data.data);
        console.log(res.data.data.products)
        const data = res.data.data.products
        setFormData(
          {
            name: data.productName,
            description: data.description,
            category: data.category,
            price: data.price.toString(),
            Discount: data.discount.toString(),
            isActive: data.status === "Active",
          }
        )

        setSpecifications({
          material: data.material,
          dimensions: data.size,
          weight: data.weight,
          other: data.otherSpecification,
        })

        const primaryImage = [
          {
            preview: data.primaryImage,
            name: `Existing Image 1`,
            size: 0,
          },
        ] 

        const existingImages = data.images.map((imgUrl:any, index: number) => ({
          preview: imgUrl,
          name: `Existing Image ${index + 1}`,
          size: 0, // Size is unknown for mock existing images
        }))
        setImages([...primaryImage, ...existingImages])

        setImages(
          [primaryImage,
          existingImages].flat()
        )

        setName(data.productName)
      } catch (err) {
        console.error("Failed to fetch product", err)
        setError("Product not found.");
        // setError("Unable to fetch product data.")
      }finally{
        setLoading(false)
      }
    }
    fetchProduct()
  }, []);

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

  const removeImage = async(index: number) => {
    
    setImages((prev) => {
      if (prev[index].file) {
        console.log("Revoke URL:", prev[index].preview);
        URL.revokeObjectURL(prev[index].preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeAllImages = useCallback(async() => {
    await Promise.all(images.map(async(img) => {
      if (img.file) {
        console.log("Revoke URL:", img.preview);
        URL.revokeObjectURL(img.preview);
      }
    }))
    setImages([])
  
  },[images]) 

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true)
    // In a real application, you would send this data to your backend to update the product
    console.log("Updating product:", id);
    console.log("Form data:", formData);
    console.log(
      "Images (newly uploaded files and existing image URLs):",
      images.map((img) => (img.file ? img.file : img.preview))
    );
    console.log("Specifications:", specifications);

    try {
      let image:string[] = []
      await Promise.all(images.map(async(img,index) => {
        if  (img.file) {
          console.log("Uploading image:", img.file);
          let path = await addImageToLocalServer(img.file) as string
          image[index] = path
        }else{
          image[index] = img.preview
        }
      }))
      console.log(image)


      const values = {
        id:id,
        productName:formData.name,
        images:image.slice(1),
        primaryImage:image[0],
        category:formData.category,
        description:formData.description,
        price:formData.price,
        material:specifications.material,
        size:specifications.dimensions,
        weight:specifications.weight,
        discount:formData.Discount,
        otherSpecification:specifications.other,
      }
      console.log(values)

      const res = await axios.post("/api/product/update", values);

      if (res.status === 200) {
        console.log(res.data);
        await refresh()
        router.push(`/dashboard/products/${id}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product.");
      
    }finally{
      setIsSaving(false)
    }

    // Simulate successful update and redirect
    // router.push(`/dashboard/products/${productId}`);
  };


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
      <div className={` flex flex-col items-start gap-4`}>
        <Link href={`/dashboard/products/${id}`} className={`${ isSaving && "pointer-events-none opacity-50"}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">
            Modify product details for {name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={`${isSaving && "pointer-events-none opacity-50"}`}>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 ">
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
                      {categories.map((category:any) => (
                        <SelectItem key={category.id} value={category.categoryName}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className={`${isSaving && "pointer-events-none opacity-50"}`}>
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
                    <Label htmlFor="dimensions">Size</Label>
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
            <Card className={`${isSaving && "pointer-events-none opacity-50"}`}> 
              <CardHeader>
                <CardTitle>Pricing & Discount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Rs) *</Label>
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
                    <Label htmlFor="minStock">Discount</Label>
                    <Input
                      id="Discount"
                      type="text"
                      value={formData.Discount}
                      onChange={(e) => handleInputChange("Discount", e.target.value)}
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
            <Card className={`${isSaving && "pointer-events-none opacity-50"}`}>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={` border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors`}>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="images" className="cursor-pointer">
                      <span className="text-sm text-center w-full font-medium text-blue-600 hover:text-blue-500">
                        {images.length === 0 ? "Upload product images" : "Add more images"}
                      </span>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        disabled={isSaving}
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
                        onClick={removeAllImages}
                        disabled={isSaving}
                        className="text-red-600 hover:text-red-700"
                      >
                        {
                          isSaving ? <Loader2 className=" animate-spin"/> : " Clear All"
                        }
                       
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                      {images.map((image:any, index:number) => (
                        <div key={index} className="relative group border rounded-lg p-2 hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt={`Product ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{image.name || ""}</p>
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
                                  disabled={isSaving}
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
                                disabled={isSaving}
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

            

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={ isSaving }
                  >
                    {
                      isSaving ? <Loader2 className=" animate-spin"/> : "Save Changes"
                    }
                    
                  </Button>
                    <Button 
                      type="button" 
                        variant="outline" 
                        className="w-full bg-transparent"
                        disabled={ isSaving}
                        onClick={()=>router.push(`/dashboard/products/${id}`)}
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
  );
}
