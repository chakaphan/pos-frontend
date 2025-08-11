"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function TestTransactionPage(){
    const [loading, setLoading] = useState(false);
    const [testResults, setTestResults] = useState({});
    const router = useRouter();

    const testSuccessful = async () => {
        setLoading(true);
        try {
            const productsRersponse = await axiosInstance.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?pagination[limit]=2`
            );

            const product = productsRersponse.data.data;
            if(product.length < 2){
                toast.error("Need at least 2 products for testing");
                return;
            }

            const product1 = product[0];
            const product2 = product[1];

            const transactionPayload = {
                customer_name: "Test Customer",
                invoice_number: `TEST-${Date.now()}`,
                customer_email: "test@example.com",
                customer_phone: "123456789",
                data: new Data().toISOString().split("T")[0],
                notes: "Transaction test",
                products: [
                    {
                        product: product1.id,
                        quantity: 1,
                        price: product1.price || 100,
                    },
                    {
                        product: product12.id,
                        quantity: 1,
                        price: product12.price || 150,
                    },
                ],
                subtotal: (product1.price || 100) + (product12.price || 150),
                discount_amount: 0,
                tax_amount: 0,
                total: (product1.price || 100) + (product2.price || 100)
            };

            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sale-transactions`,
                { data: transactionPayload }
            );

            toast.success("Test successful! Transaction completed properly");
            setTestResults((prev) => ({
                ...prev,
                successful: {
                    success: true,
                    message: `Created sale with ID: ${response.data.data.id}`,
                    data: response.data,
                },
            }));
        } catch (error) {
            console.error("Test failed:", error);
            toast.error(
                `Test failed: ${error.response?.data?.error?.message || error.message}`
            );
            setTestResults((prev) => ({
                ...prev,
                successful: {
                    success: false,
                    message: error.response?.data?.error?.message || error.message,
                },
            }));
        } finally {
            setLoading(false);
        }
    };

    const testFailed = async () => {
        setLoading(true);
        try {
            const productResponse = await axiosInstance.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?pagination[limit]=2`
            );

            const product = productsRersponse.data.data;
            if(product.length < 2){
                toast.error("Need at least 2 products for testing");
                return;
            }

            const product1 = product[0];
            const product2 = product[1];

            const product2Response = await axiosInstance.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products/${product2.id}`
            );
            const currentStock = product2Response.data.data.stock;

            const transactionPayload = {
                customer_name: "Test Customer Fail",
                invoice_number: `TEST-FAIL-${Date.now()}`,
                customer_email: "test@example.com",
                customer_phone: "123456789",
                date: new Date().toISOString().split("T")[0],
                notes: "Failed transaction test",
                products: [
                    {
                        product: product1.id,
                        quantity: 1,
                        price: product1.price || 100,
                    },  
                    {
                        product: product2.id,
                        quantity: currentStock + 100,
                        price: product2.price || 150,
                    },                 
                ],
                subtotal: (product1.price || 100) + (product2.price || 150),
                discount_amount: 0,
                tax_amount: 0,
                total: (product1.price || 100) + (product2.price || 150),
            };

            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api.sale-transactions`,
                { data: transactionPayload }
            );

            toast.error("Test failed! Transaction should have failed but succeeded");
            setTestResults((prev) => ({
                ...prev,
                failed: {
                    success: false,
                    message: "Transacation should have failed but succeeded",
                    data: response.data,
                },
            }));
        } catch (error) {
            toast.success("Test successful! Transaction failed as expected");

            try {
                
            } catch (error) {
                
            }
        }
    }
}