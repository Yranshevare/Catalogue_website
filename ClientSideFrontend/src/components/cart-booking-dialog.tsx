import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/lib/types";

interface CartBookingDialogProps {
  cartItems: CartItem[];
  totalPrice: number;
  children: React.ReactNode;
}

export function CartBookingDialog({
  cartItems,
  totalPrice,
  children,
}: CartBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    contactInfo: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically send the booking data to your backend
    console.log("Cart booking submitted:", {
      ...formData,
      cartItems: cartItems.map((item) => ({
        productId: item.id,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
      })),
      totalAmount: totalPrice,
    })

    setOpen(false)
    setFormData({
      customerName: "",
      contactInfo: "",
      address: "",
    })
  }

  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Fill in your details to place your order. Payment will be collected on delivery.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Customer Information */}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.customerName}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                placeholder="Phone number or email"
                value={formData.contactInfo}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactInfo: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                required
                rows={3}
              />
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Order Summary</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cartItems.map((item) => {
                  const originalPrice = Number.parseFloat(item.price)
                  const discount = Number.parseFloat(item.discount || "0")
                  const discountedPrice = originalPrice * (1 - discount / 100)
                  const itemTotal = discountedPrice * item.quantity

                  return (
                    <div key={item.id} className="flex justify-between items-start text-sm border-b pb-2">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{item.productName}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>${discountedPrice.toFixed(2)} each</span>
                          {discount > 0 && (
                            <>
                              <span>•</span>
                              <span className="line-through">${originalPrice.toFixed(2)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                        {discount > 0 && <p className="text-xs text-green-600">-{discount}% off</p>}
                      </div>
                    </div>
                  )
                })}
              </div>

              <Separator />

              {/* Total Calculation */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">Payment will be collected on delivery</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" size="lg">
              Confirm Order - ${totalPrice.toFixed(2)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
