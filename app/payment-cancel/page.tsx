"use client";

import { SectionTitle } from "@/components";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PaymentCancelPageContent = () => {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
  }, [searchParams]);

  return (
    <div className="bg-white">
      <SectionTitle title="Payment Cancelled" path="Home | Payment Cancelled" />
      
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-6">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600">
                <strong>Session ID:</strong> {sessionId}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <Link
              href="/checkout"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </Link>
            
            <div className="text-sm text-gray-500">
              <p>You can try again or choose a different payment method.</p>
              <p>For assistance, please contact our support team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentCancelPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCancelPageContent />
    </Suspense>
  );
};

export default PaymentCancelPage;
