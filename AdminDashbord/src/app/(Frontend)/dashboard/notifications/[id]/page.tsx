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

interface ProductOrder {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
}

interface Order {
  id: string;
  customerName: string;
  contactNumber: string;
  address: string;
  products: ProductOrder[];
  totalPrice: number;
  status: "Pending" | "Confirmed";
  orderDate: Date;
}

const mockOrders: Order[] = [
  {
    id: "ORD001",
    customerName: "Alice Smith",
    contactNumber: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    products: [
      {
        productId: "PROD001",
        productName: "Widget A",
        quantity: 2,
        pricePerUnit: 10.5,
      },
      {
        productId: "PROD003",
        productName: "Gadget C",
        quantity: 1,
        pricePerUnit: 25.0,
      },
    ],
    totalPrice: 46.0,
    status: "Pending",
    orderDate: new Date("2025-07-30T10:00:00Z"),
  },
  {
    id: "ORD002",
    customerName: "Bob Johnson",
    contactNumber: "098-765-4321",
    address: "456 Oak Ave, Otherville, USA",
    products: [
      {
        productId: "PROD002",
        productName: "Thing B",
        quantity: 5,
        pricePerUnit: 5.75,
      },
    ],
    totalPrice: 28.75,
    status: "Confirmed",
    orderDate: new Date("2025-07-29T14:30:00Z"),
  },
  {
    id: "ORD003",
    customerName: "Charlie Brown",
    contactNumber: "555-123-4567",
    address: "789 Pine Ln, Somewhere, USA",
    products: [
      {
        productId: "PROD001",
        productName: "Widget A",
        quantity: 1,
        pricePerUnit: 10.5,
      },
      {
        productId: "PROD002",
        productName: "Thing B",
        quantity: 3,
        pricePerUnit: 5.75,
      },
      {
        productId: "PROD003",
        productName: "Gadget C",
        quantity: 2,
        pricePerUnit: 25.0,
      },
    ],
    totalPrice: 87.75,
    status: "Pending",
    orderDate: new Date("2025-07-31T09:15:00Z"),
  },
];
    
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real application, you would fetch order data from an API here
    const foundOrder = mockOrders.find((o) => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      // Handle case where order is not found, e.g., redirect to 404 or notifications list
      router.push("/dashboard/notifications");
    }
  }, [orderId, router]);

  /*useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
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
      <p>Loading order details...</p>
    </div>
  )
  }
  
  */

  const handleConfirmOrder = () => {
    if (order) {
      // In a real application, you would send an API request to update the order status
      setOrder((prevOrder) =>
        prevOrder ? { ...prevOrder, status: "Confirmed" } : null
      );
      // Optionally, navigate back or show a success message
      // router.push("/dashboard/notifications");
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
              variant={order.status === "Pending" ? "destructive" : "default"}
              className={
                order.status === "Pending"
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }
            >
              {order.status}
            </Badge>
          </CardTitle>
          <CardDescription>
            Placed on {format(order.orderDate, "MMM dd, yyyy 'at' HH:mm")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Customer Information
            </h3>
            <p className="text-gray-700">
              <strong>Name:</strong> {order.customerName}
            </p>
            <p className="text-gray-700">
              <strong>Contact:</strong> {order.contactNumber}
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> {order.address}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Products Ordered
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
                    <TableRow key={product.productId}>
                      <TableCell className="font-medium">
                        {product.productName}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.pricePerUnit.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(product.quantity * product.pricePerUnit).toFixed(2)}
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
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <Separator />
          {order.status === "Pending" && (
            <div className="flex justify-end">
              <Button onClick={handleConfirmOrder} className="bg-blue-600 hover:bg-blue-700 text-white">
                Confirm Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
