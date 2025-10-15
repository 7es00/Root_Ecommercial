"use client";

import { SectionTitle } from "@/components";
import { useEffect, useState, useCallback } from "react";
import { isAuthenticated } from "@/lib/auth";
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
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  cartItems: Array<{
    _id: string;
    product: {
      _id: string;
      title: string;
      imageCover: string;
      price: number;
    };
    count: number;
    price: number;
  }>;
}

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

const OrderPage = ({ params }: OrderPageProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const paramsAwaited = await params;
      const response = await apiClient.orders.getById(paramsAwaited.orderId);
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data.data);
      } else {
        toast.error("Failed to fetch order details");
        router.push("/allorders");
      }
    } catch (error) {
      toast.error("Error loading order details");
      router.push("/allorders");
    } finally {
      setLoading(false);
    }
  }, [params, router]);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login to view order details");
      router.push("/login");
      return;
    }

    fetchOrder();
  }, [router, fetchOrder]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <SectionTitle title="Order Details" path="Home | My Orders | Order Details" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white">
        <SectionTitle title="Order Not Found" path="Home | My Orders" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
            <Link
              href="/allorders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SectionTitle title="Order Details" path="Home | My Orders | Order Details" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/allorders"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order._id.slice(-8)}
                </h1>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  ${order.totalOrderPrice}
                </p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.isPaid, order.isDelivered)}`}>
                  {getStatusText(order.isPaid, order.isDelivered)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">{order.shippingAddress.details}</p>
                    <p>{order.shippingAddress.city}</p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-medium capitalize">{order.paymentMethodType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Status:</span>
                      <span className={`font-medium ${order.isDelivered ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.cartItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Image
                    src={item.product.imageCover}
                    alt={item.product.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.product.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.count}
                    </p>
                    <p className="text-sm text-gray-500">
                      Unit Price: ${item.product.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-gray-900">${order.totalOrderPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
