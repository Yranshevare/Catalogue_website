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
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";

interface CartBookingDialogProps {
  cartItems: CartItem[];
  totalPrice: number;
  children: React.ReactNode;
}

export function CartBookingDialog({cartItems,totalPrice,children,}: CartBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    contactInfo: "",
    address: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

    const { clearCart } = useCart()

  const handleSubmit = async (e: React.FormEvent) => {
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

    setSubmitting(true)
    try {
      const data = {
        fromName: formData.customerName,
        fromPhone: formData.contactInfo,
        fromAddress: formData.address,
        products: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: String(totalPrice),
      }
      console.log(data)

      const res = await axios.post("/api/notification/create", data)
      console.log(res)
      if(res.status ===200){
        alert("Order Placed Successfully, Thank You For Shopping With Us")
        clearCart()
      }
      
    } catch (error:any) {
      console.log(error.message)
    }finally{
      setOpen(false)
      setFormData({
        customerName: "",
        contactInfo: "",
        address: "",
      })
      setSubmitting(false)
    }


  }

  return(
    <Dialog open={open} onOpenChange={submitting ? undefined : setOpen}>
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
                  const itemTotal = originalPrice * item.quantity

                  return (
                    <div key={item.id} className="flex justify-between items-start text-sm border-b pb-2">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{item.productName}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>Rs {originalPrice.toFixed(2)} each</span>
                        
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs {itemTotal.toFixed(2)}</p>
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
                  <span>Total Amount</span>
                  <span className="text-primary">Rs {totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">Payment will be collected on delivery</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting} style={submitting ? { opacity: 0.5 } : {  }} className="w-full" size="lg">
              {
                submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ):
                `Confirm Order :- Rs {${totalPrice.toFixed(2)}}`
                
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
