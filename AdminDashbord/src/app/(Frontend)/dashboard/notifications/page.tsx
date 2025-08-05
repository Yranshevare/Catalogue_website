"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { BellRing } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

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

export default function NotificationsPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Confirmed"
  >("All");
  const [loading, setLoading] = useState<boolean>(true);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contactNumber.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /*useEffect(()=>{
    fetchOrders()
  },[])

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders")
      setOrders(response.data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }*/

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 py-4">
      <div className="flex items-center gap-4 mb-6">
        <BellRing className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Order Notifications
          </h2>
          <p className="text-gray-600">
            View and manage incoming customer orders.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by customer name, order ID, phone, or address..."
            className="pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: "All" | "Pending" | "Confirmed") =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Orders</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Click on an order to view full details and confirm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {orders.length === 0 ? (
                <>
                  <p>No new orders to display.</p>
                  <p>Check back later!</p>
                </>
              ) : (
                <>
                  <p>No orders found matching your search criteria.</p>
                  <p>Try adjusting your search or filter settings.</p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table >
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Order ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/notifications/${order.id}`}
                          className="block py-2"
                        >
                          {order.id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/notifications/${order.id}`}
                          className="block py-2"
                        >
                          {order.customerName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/notifications/${order.id}`}
                          className="block py-2"
                        >
                          ${order.totalPrice.toFixed(2)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/notifications/${order.id}`}
                          className="block py-2"
                        >
                          {format(order.orderDate, "MMM dd, yyyy HH:mm")}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/notifications/${order.id}`}
                          className="block py-2"
                        >
                          <Badge
                            variant={
                              order.status === "Pending"
                                ? "destructive"
                                : "default"
                            }
                            className={
                              order.status === "Pending"
                                ? "bg-red-500 text-white"
                                : "bg-green-500 text-white"
                            }
                          >
                            {order.status}
                          </Badge>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
