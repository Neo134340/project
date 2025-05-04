"use client";

import React, { useState } from "react";
import Link from "next/link";
import  Outfit  from '../page';
import { useEffect } from "react";

export interface Outfit {
    id: string;
    image: string;
    name: string;
    brand: string;
    price: number;
    sizes: string[];
    colors?: string[];
    status?: "ใหม่" | "ลดราคา";
}

interface CartItem extends Outfit {
    quantity: number;
}

const getCartItems = (): CartItem[] => {
    if (typeof window !== 'undefined') {
        const storedCartItemsWithDetails = localStorage.getItem("cartItemsWithDetails");
        if (storedCartItemsWithDetails) {
            try {
                const parsedItems: { [key: string]: { outfit: Outfit; quantity: number } } = JSON.parse(storedCartItemsWithDetails);
                return Object.values(parsedItems).map(item => ({
                    ...item.outfit,
                    quantity: item.quantity,
                }));
            } catch (error) {
                console.error("Error parsing cart items from local storage:", error);
                return [];
            }
        }
    }
    return [];
}

export default function CheckoutPage() {
    const cartItems = getCartItems();
    const [shippingInfo, setShippingInfo] = useState({
        name: "",
        address: "",
        phoneNumber: "",
    });
    const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    //ดึงข้อมูลผู้ใช้ตอนล้อคอิน---> เหวินเพิ่มเข้ามา ห้ามแก้
    useEffect(() => {
        const fetchUser = async () => {
            const email = localStorage.getItem('userEmail');
            if (!email) return;

            try {
                const response = await fetch(`http://localhost:8081/api/customer/email/${email}`);
                if (response.ok) {
                    const data = await response.json();
                    setShippingInfo({
                        name: data.name || "",
                        address: data.address || "",
                        phoneNumber: data.phone || "", // ใส่ชือ่ฐานข้อมูล
                    });
                } else {
                    console.error("ไม่สามารถโหลดข้อมูลผู้ใช้");
                }
            } catch (err) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", err);
            }
        };

        fetchUser();
    }, []);//----- ถึงนี้

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrCodeImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleCheckout = () => {
        console.log("ดำเนินการสั่งซื้อ:", shippingInfo, "รายการ:", cartItems, "ยอดรวม:", totalPrice);
        if (qrCodeImage) {
            console.log("QR Code:", qrCodeImage);
            alert("ดำเนินการสั่งซื้อและชำระเงินด้วย QR Code แล้ว!");
            // หลังจากดำเนินการเสร็จสิ้น อาจจะ redirect ไปหน้าขอบคุณ
        } else {
            alert("กรุณาอัปโหลด QR Code สำหรับการชำระเงินผ่านธนาคาร");
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 py-6 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">ตะกร้าสินค้าว่างเปล่า</h2>
                    <p className="text-gray-600 mb-4">ไม่มีสินค้าอยู่ในตะกร้าของคุณ</p>
                    <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        กลับไปเลือกสินค้า
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="container mx-auto p-6 bg-white rounded-md shadow-md max-w-lg">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">ชำระเงิน</h2>

                {/* สรุปคำสั่งซื้อ */}
                <div className="mb-6 p-4 border rounded-md border-gray-300 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">สรุปคำสั่งซื้อ</h3>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.id} className="flex items-center justify-between py-2 text-gray-800">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 mr-2 overflow-hidden rounded-md shadow-sm flex justify-center items-center">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span>{item.name} x {item.quantity}</span>
                                </div>
                                <span>฿ {item.price * item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="font-semibold text-right mt-2 text-gray-800">ยอดรวม: ฿ {totalPrice}</div>
                </div>

                {/* ข้อมูลการจัดส่ง */}
                <div className="mb-6 p-4 border rounded-md border-gray-300 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">ข้อมูลการจัดส่ง</h3>
                    <div className="mb-3">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">ชื่อ-นามสกุล:</label>
                        <input type="text" id="name" name="name" value={shippingInfo.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">ที่อยู่:</label>
                        <textarea id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">เบอร์โทรศัพท์:</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" value={shippingInfo.phoneNumber} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                </div>

                {/* วิธีการชำระเงิน */}
                <div className="mb-6 p-4 border rounded-md border-gray-300 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">วิธีการชำระเงิน</h3>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">ชำระผ่านธนาคาร (QR Code):</label>
                        <input type="file" accept="image/*" onChange={handleQrCodeUpload} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        {qrCodeImage && (
                            <div className="mt-3">
                                <img src={qrCodeImage} alt="QR Code สำหรับชำระเงิน" className="max-w-full rounded-md shadow-sm" />
                            </div>
                        )}
                        <p className="text-gray-600 text-xs mt-1">อัปโหลด QR Code สำหรับชำระเงินผ่านธนาคาร</p>
                    </div>
                    {/* คุณสามารถเพิ่มตัวเลือกการชำระเงินอื่นๆ ได้ที่นี่ */}
                </div>

                {/* ปุ่มดำเนินการ */}
                <div className="flex justify-between">
                    <Link href="/cart" className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200">
                        กลับไปแก้ไขตะกร้าสินค้า
                    </Link>
                    <button onClick={handleCheckout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200">
                        ยืนยันการสั่งซื้อและชำระเงิน
                    </button>
                </div>
            </div>
        </div>
    );
}