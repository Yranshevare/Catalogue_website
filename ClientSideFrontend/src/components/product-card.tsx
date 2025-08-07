import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Product } from "@/lib/types"
import { Divide } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const originalPrice = parseFloat(product.price || "0")
  const discount = parseFloat(String(product.discount || "0"))
  const discountedPrice = originalPrice * (1 - discount / 100)

  return (
     <Link href={`/product/${product.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.primaryImage || "/placeholder.svg"}
            alt={product.productName}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{discount}%</Badge>}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.productName}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">${discountedPrice.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>    
  )
}
