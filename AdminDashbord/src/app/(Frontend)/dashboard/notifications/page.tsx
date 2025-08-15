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
import { BellRing, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import axios from "axios";

interface ProductOrder {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  fromName: string;
  fromPhone: string;
  fromAddress: string;
  products: ProductOrder[];
  totalPrice: number;
  status: "PENDING" | "ACCEPTED";
  createdAt: Date;
}

export default function NotificationsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "PENDING" | "ACCEPTED"
  >("All");
  const [loading, setLoading] = useState<boolean>(true);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.fromPhone.includes(searchTerm) ||
      order.fromAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(()=>{
    fetchOrders()
  },[])

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/notification/get")
      console.log(res.data.data)
      setOrders(res.data.data)
    } catch (error:any) {
      console.error("Failed to fetch orders:", error.message)
    } finally {
      setLoading(false)
    }
  }
  if(loading){return <div className="text-center flex items-center justify-center w-full h-[80vh]"><Loader2 className="animate-spin mr-5"/>Loading...</div>}

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
          onValueChange={(value: "All" | "PENDING" | "ACCEPTED") =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Orders</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACCEPTED">Confirmed</SelectItem>
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
                          {order.id.slice(15)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/notifications/${order.id}`}
                          className="block py-2"
                        >
                          {order.fromName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/notifications/${order.id}`}
                          className="block py-2"
                        >
                          ${order.totalPrice}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/notifications/${order.id}`}
                          className="block py-2"
                        >
                          {format(order.createdAt, "MMM dd, yyyy HH:mm")}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/notifications/${order.id}`}
                          className="block py-2"
                        >
                          <Badge
                            variant={
                              order.status === "PENDING"
                                ? "destructive"
                                : "default"
                            }
                            className={
                              order.status === "PENDING"
                                ? "bg-red-500 text-white"
                                : "bg-green-500 text-white"
                            }
                          >
                            {order.status.toLowerCase()}
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
