"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Star,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingDialog } from "@/components/booking-dialog";
import { useCart } from "@/hooks/use-cart";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Product } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  

  async function loadProduct(){
    try {
      const res = await axios.get(`/api/product/getOne?id=${productId}`)
      console.log(res.data.data.products)
      const pro = res.data.data.products
      pro.images = [pro.primaryImage,...pro.images]
      setProduct(pro)
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProduct();
  }, []);


  if(isLoading){
    return (
      <div className="container w-full   mx-auto px-4 py-8">
        <div className="flex h-[80vh] items-center justify-center" >
          <Loader2 className="h-4 w-4 animate-spin" />
          <h1 className="">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }
  const originalPrice = Number.parseFloat(product.price);
  const discount = Number.parseFloat(product.discount || "0");
  const discountedPrice = originalPrice * (1 - discount / 100);

  const handleAddToCart = () => {
    addItem(product, quantity);
    alert(`${quantity} x ${product.productName} has been added to your cart.`)
  };



  return (
    <div className="container mx-auto sm:px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Link>
      <div className="grid lg:grid-cols-2 gap-8 ">
        {/* Product Images */}
        <div className="space-y-4 ">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImageIndex] || "/placeholder.svg"}
              alt={product.productName}
              fill
              className="object-cover "
            />
            {/* {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                -{discount}% OFF
              </Badge>
            )} */}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                  selectedImageIndex === index
                    ? "border-primary"
                    : "border-muted"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.productName} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
            {product.category && (
              <Badge variant="secondary" className="mb-4">
                {product.category}
              </Badge>
            )}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              {/* <span className="text-sm text-muted-foreground">
                (4.0) 128 reviews
              </span> */}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold">
                Rs {originalPrice.toFixed(2)}
              </span>
              {/* {discount > 0 && (
                <span className="text-xl text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )} */}
            </div>
            {product.discount  && (
              <p className="text-sm text-green-600 font-medium">
                {product.discount}
              </p>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          {/* Product Specifications */}
          <Card className="gap-0 py-0">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Product Specifications</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {product.material && (
                  <div>
                    <span className="text-muted-foreground">Material:</span>
                    <span className="ml-2 font-medium">{product.material}</span>
                  </div>
                )}
                {product.size && (
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="ml-2 font-medium">{product.size}</span>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="ml-2 font-medium">{product.weight}</span>
                  </div>
                )}
                {product.otherSpecification && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Other:</span>
                    <span className="ml-2 font-medium">
                      {product.otherSpecification}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity:
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                />
                <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Price:</span>
                <span className="text-2xl font-bold text-primary">Rs {(originalPrice * quantity).toFixed(2)}</span>
              </div>
              {/* {discount > 0 && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Original Total:</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${(originalPrice * quantity).toFixed(2)}
                  </span>
                </div>
              )} */}
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">Price per item:</span>
                <span className="text-sm font-medium">Rs {originalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button onClick={handleAddToCart} className="flex-1 px-4 py-2">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add {quantity} to Cart
              </Button>
              <BookingDialog product={product} Quantity={quantity}>
                <Button variant="outline" className="flex-1 bg-transparent px-4 py-2">
                  <Package className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </BookingDialog>
            </div>
          </div>
          <Separator />
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Delivery</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
             <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">Pay on delivery</p>
              </div>
            </div>
             <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
