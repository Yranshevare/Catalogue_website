"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";

interface ProductOrder {
  productId: string;
  productName: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  fromName: string;
  fromPhone: string;
  fromAddress: string;
  products: ProductOrder[];
  totalPrice: number;
  status: "Pending" | "Confirmed";
  createdAt: Date;
}


    
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);



  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/notification/getAll?id=${orderId}`);
        console.log(response.data.data.notification)
        setOrder(response.data.data.notification);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        router.push("/dashboard/notifications"); // fallback
      }finally {
      setLoading(false)
      }
    };

    fetchOrder();
  }, [orderId, router]);
  
  if (loading) {


  return (
      <div className="flex items-center justify-center h-64">
        <p className="flex items-center"><Loader2 className="animate-spin mr-2"/>Loading order details...</p>
      </div>
    )
  }
  
  

  const handleConfirmOrder =async (id:string) => {
    if (!order) return 

    try {
      setDeleteLoading(true)
      const response:any = await axios.put(`/api/notification/confirm?id=${id}`);
      console.log(response.data)
      if(response.status === 200){
        setOrder((prev:any)=>{
          return {
            ...prev,
            status:"ACCEPTED"
          }
        })
      }
      // setOrder(response.data); // update with confirmed status
    } catch (error) {
      console.error("Failed to confirm order:", error);
    }finally{
      setDeleteLoading(false)
    }
  };

  /*const handleConfirmOrder = async () => {
    if (!order) return;

    try {
      const response = await axios.put(`/api/orders/${order.id}/confirm`);
      setOrder(response.data); // update with confirmed status
    } catch (error) {
      console.error("Failed to confirm order:", error);
    }
  };*/

  const deleteProduct = async(id:String)=> {
    if (!order) return 
    try {
      setDeleteLoading(true)
      await axios.delete(`/api/notification/delete?id=${id}`)
      router.push("/dashboard/notifications")
    } catch (error:any) {
      console.log(error.message)
    }
    finally{
      setDeleteLoading(false)
    }

  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Order #{order.id}
            <Badge
              variant={order.status.toLocaleLowerCase() === "pending" ? "destructive" : "default"}
              className={
                order.status.toLocaleLowerCase() === "pending"
                  ? "bg-red-300 text-white"
                  : "bg-green-500 text-white"
              }
            >
              {order.status}
            </Badge>
          </CardTitle>
          <CardDescription>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Customer Information
            </h3>
            <p className="text-gray-700">
              <strong>Name:</strong> {order.fromName}
            </p>
            <p className="text-gray-700">
              <strong>Contact:</strong> {order.fromPhone}
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> {order.fromAddress}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Products Ordered ({order.products.length})
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price per Unit</TableHead>
                    <TableHead className="text-right">Final Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products.map((product) => (
                    <TableRow key={product.productId} onClick={()=>{router.push(`/dashboard/products/${product.productId}`)}} className="cursor-pointer">
                      <TableCell  className="font-medium ">
                        {product.productName}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.price}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(product.quantity * parseFloat(product.price))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-xl font-bold text-gray-900">
                Total Order Amount:
              </span>
              <span className="text-xl font-bold text-gray-900">
                ${order.totalPrice}
              </span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              disabled={deleteLoading} 
              onClick={() => deleteProduct(order.id)} 
              className="mx-1 text-red-600 cursor-pointer hover:text-red-700 bg-transparent"
              style={deleteLoading ? { pointerEvents: "none", opacity: 0.5} : {}}
              >
              {
                <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
                </>
              }
            </Button>
            {order.status.toLowerCase() === "pending" && (
              <Button 
                onClick={()=> handleConfirmOrder(order.id)} 
                className="mx-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                disabled={deleteLoading}
                style={deleteLoading ? { pointerEvents: "none", opacity: 0.5} : {}}
              >
                Confirm Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
