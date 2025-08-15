import type { CartItem, Product } from "./types"

class CartStore {
  private items: CartItem[] = []
  private listeners: (() => void)[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage()
    }
  }

  private loadFromStorage() {
    const stored = localStorage.getItem("cart")
    if (stored) {
      this.items = JSON.parse(stored)
    }
  }
  /*private async loadFromBackend() {
  const res = await axios.get("https://api/cart")
  this.items = res.data
  }
  */

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(this.items))
    }
  }
  /*private async saveToBackend() {
  await axios.post("https://api/cart", this.items)
  }
  */

  private notify() {
    this.listeners.forEach((listener) => listener())
  }

  addItem(product: Product, quantity = 1) {
    const existingItem = this.items.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.items.push({ ...product, quantity })
    }

    this.saveToStorage()
    this.notify()
  }

  removeItem(productId: string) {
    this.items = this.items.filter((item) => item.id !== productId)
    this.saveToStorage()
    this.notify()
  }

  updateQuantity(productId: string, quantity: number) {
    const item = this.items.find((item) => item.id === productId)
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) {
        this.removeItem(productId)
      } else {
        this.saveToStorage()
        this.notify()
      }
    }
  }

  getItems(): CartItem[] {
    return [...this.items]
  }

  getItemCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      const price = Number.parseFloat(item.price)
      const discount = Number.parseFloat(item.discount || "0")
      const discountedPrice = price * (1 - discount / 100)
      return total + price * item.quantity
    }, 0)
  }

  clearCart() {
    this.items = []
    this.saveToStorage()
    this.notify()
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }
}

export const cartStore = new CartStore()
