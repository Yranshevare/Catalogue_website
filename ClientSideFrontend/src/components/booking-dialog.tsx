"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import axios from "axios"

interface BookingDialogProps {
  product: Product
  children: React.ReactNode
  Quantity: number
}

export function BookingDialog({ product, children,Quantity }: BookingDialogProps){
    const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    contactInfo: "",
    address: "",
    quantity: 1,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      quantity: Quantity,
    }))
  }, [Quantity])

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()

    if(totalPrice === 0){
      alert("Please Select Quantity")
      return
    }

    // Here you would typically send the booking data to your backend
    console.log("Booking submitted:", {
      ...formData,
      productId: product.id,
      productName: product.productName,
    })
    try {
      setSubmitting(true)
      const data = {
        fromName: formData.customerName,
        fromPhone: formData.contactInfo,
        fromAddress: formData.address,
        totalPrice: totalPrice.toFixed(2),
        products:[
          {
            productId: product.id,
            quantity: formData.quantity,
            price: product.price
          }
        ]
      }
      const res = await axios.post("/api/notification/create", data)
      // console.log(res)
      console.log(res.data) 
      if(res.status === 200){
        alert("Order Placed Successfully, Thank You For Shopping With Us")
      }
      // console.log(data)
    } catch (error:any) {
      console.log(error.message)
    }finally{
      setOpen(false)
      setFormData({
        customerName: "",
        contactInfo: "",
        address: "",
        quantity: 1,
      })
      setSubmitting(false)
    }



  }

  const originalPrice = Number.parseFloat(product.price)
  // const discount = Number.parseFloat(product.discount || "0")
  // const discountedPrice = originalPrice * (1 - discount / 100)
  const totalPrice = originalPrice * formData.quantity

  return(
     <Dialog open={open} onOpenChange={submitting ? undefined : setOpen}>
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
              <Label htmlFor="name">Full Name / Shop Name</Label>
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
                min="0"
                value={formData.quantity === 0 ? "" : formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 0 }))}
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
            <div className="w-full flex flex-col items-center justify-center">
              <Button type="submit" disabled={submitting} style={submitting ? {cursor: "not-allowed", opacity: 0.5} : {cursor: "pointer"}} className="w-full">
              Confirm Booking
            </Button>
            <p className="text-[12px] text-center text-[#acacac] mt-2">NOTE: If you are eligible for any discount it will be conducted at the time of delivery</p>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}