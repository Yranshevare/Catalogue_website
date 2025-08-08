"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/types"

interface BookingDialogProps {
  product: Product
  children: React.ReactNode
}

export function BookingDialog({ product, children }: BookingDialogProps){
    const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    contactInfo: "",
    address: "",
    quantity: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically send the booking data to your backend
    console.log("Booking submitted:", {
      ...formData,
      productId: product.id,
      productName: product.productName,
    })


    setOpen(false)
    setFormData({
      customerName: "",
      contactInfo: "",
      address: "",
      quantity: 1,
    })
  }

  const originalPrice = Number.parseFloat(product.price)
  const discount = Number.parseFloat(product.discount || "0")
  const discountedPrice = originalPrice * (1 - discount / 100)
  const totalPrice = discountedPrice * formData.quantity

  return(
     <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Product</DialogTitle>
          <DialogDescription>
            Fill in your details to book {product.productName}. Payment will be collected on delivery.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Payment on delivery</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Confirm Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}