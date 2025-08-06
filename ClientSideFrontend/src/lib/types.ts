export interface Product {
  id: string
  productName: string
  images: string[]
  primaryImage: string
  category?: string
  description: string
  price: string
  material?: string
  size?: string
  weight?: string
  discount?: string
  otherSpecification?: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem extends Product {
  quantity: number
}

export interface BookingDetails {
  customerName: string
  contactInfo: string
  address: string
  productId: string
  quantity: number
}