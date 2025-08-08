"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartBookingDialog } from "@/components/cart-booking-dialog"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId)
      
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId)
    
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700 bg-transparent">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const originalPrice = Number.parseFloat(item.price)
            // const discount = Number.parseFloat(item.discount || "0")
            // const discountedPrice = originalPrice * (1 - discount / 100)
            const itemTotal = originalPrice * item.quantity

            return (
              <Card className="py-0" key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      <Image
                        src={item.primaryImage || "/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3  className="font-semibold text-lg">{item.productName}</h3>
                          {item.category && <p className="text-sm text-muted-foreground">{item.category}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, item.productName)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">Rs {originalPrice.toFixed(2)}</span>
                          {/* {discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${originalPrice.toFixed(2)}
                            </span>
                          )} */}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 text-right">
                        <span className="font-semibold">Total: Rs {itemTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold leading-none tracking-tight">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Detailed Product List */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Items in your cart:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const originalPrice = Number.parseFloat(item.price)
                    const discount = Number.parseFloat(item.discount || "0")
                    const discountedPrice = originalPrice * (1 - discount / 100)
                    const itemTotal = originalPrice * item.quantity

                    return (
                      <div key={item.id} className="flex justify-between items-start text-sm border-b pb-2">
                        <div className="flex-1 pr-2">
                          <p className="font-medium line-clamp-2">{item.productName}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                            <span>Qty: {item.quantity}</span>
                            <span>×</span>
                            <span>Rs {originalPrice.toFixed(2)}</span>
                            {/* {discount > 0 && (
                              <>
                                <span className="line-through text-red-500">${originalPrice.toFixed(2)}</span>
                                <span className="text-green-600">(-{discount}%)</span>
                              </>
                            )} */}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">Rs {itemTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />
              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>Rs {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>Rs 0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">Rs {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <CartBookingDialog cartItems={items} totalPrice={totalPrice}>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </CartBookingDialog>
                <p className="text-xs text-muted-foreground text-center">Payment will be collected on delivery</p>
              </div>    
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
