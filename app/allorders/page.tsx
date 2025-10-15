"use client";

import { SectionTitle } from "@/components";
import { useEffect, useState } from "react";
import { isAuthenticated, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

interface Order {
  _id: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  shippingAddress?: {
    details: string;
    phone: string;
    city: string;
  };
  cartItems?: Array<{
    _id: string;
    product?: {
      _id: string;
      title: string;
      imageCover: string;
      price: number;
    };
    count: number;
    price: number;
  }>;
}

const AllOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login to view your orders");
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.orders.getAll();
      
      if (response.ok) {
        const data = await response.json();
        const ordersData = data.data || data || [];
        
        // Ensure we have an array and filter out any invalid orders
        const validOrders = Array.isArray(ordersData) 
          ? ordersData.filter(order => order && order._id)
          : [];
        
        setOrders(validOrders);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to fetch orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) return "bg-green-100 text-green-800";
    if (isPaid) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusText = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) return "Delivered";
    if (isPaid) return "Paid - Processing";
    return "Pending Payment";
  };

  if (loading) {
    return (
      <div className="bg-white">
        <SectionTitle title="My Orders" path="Home | My Orders" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SectionTitle title="My Orders" path="Home | My Orders" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-6">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">You havent placed any orders yet.</p>
            <button
              onClick={() => router.push("/shop")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Orders ({orders.length})
              </h2>
            </div>

            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/order/${order._id}`} className="hover:text-blue-600">
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order._id.slice(-8)}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${order.totalOrderPrice}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.isPaid, order.isDelivered)}`}>
                        {getStatusText(order.isPaid, order.isDelivered)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-600">
                        {order.shippingAddress ? (
                          <>
                            <p>{order.shippingAddress.details || 'N/A'}</p>
                            <p>{order.shippingAddress.city || 'N/A'}</p>
                            <p>{order.shippingAddress.phone || 'N/A'}</p>
                          </>
                        ) : (
                          <p>No shipping address available</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {order.paymentMethodType || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.cartItems && order.cartItems.length > 0 ? (
                      order.cartItems.map((item) => (
                        <div key={item._id} className="flex items-center space-x-4">
                          <Image
                            src={item.product?.imageCover || '/product_placeholder.jpg'}
                            alt={item.product?.title || 'Product'}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product?.title || 'Unknown Product'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.count || 0}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${item.price || 0}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No items found for this order</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrdersPage;
