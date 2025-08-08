"use client"

import { useState, useEffect } from "react"
import { cartStore } from "@/lib/cart-store"
import type { CartItem } from "@/lib/types"

export function useCart(){
    const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const updateCart = () => {
      setItems(cartStore.getItems())
      setItemCount(cartStore.getItemCount())
      setTotalPrice(cartStore.getTotalPrice())
    }

    updateCart()
    const unsubscribe = cartStore.subscribe(updateCart)

    return unsubscribe
  }, [])

  /*useEffect(() => {
  const fetchCart = async () => {
    const res = await axios.get("https://your-api.com/cart")
    setItems(res.data)
    setItemCount(res.data.length)
    // calculate totalPrice
  }

  fetchCart()
  }, [])
  */

  return {
    items,
    itemCount,
    totalPrice,
    addItem: cartStore.addItem.bind(cartStore),
    removeItem: cartStore.removeItem.bind(cartStore),
    updateQuantity: cartStore.updateQuantity.bind(cartStore),
    clearCart: cartStore.clearCart.bind(cartStore),
  }
}