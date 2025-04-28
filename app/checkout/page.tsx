"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Outfit } from '../page'; // Import Outfit interface จากหน้าแรก

interface CartItem extends Outfit { // CartItem ควรมี properties เหมือน Outfit และ quantity
    quantity: number;
}

const getCartItems = (): CartItem[] => {
    if (typeof window !== 'undefined') {
        const storedCartItemsWithDetails = localStorage.getItem("cartItemsWithDetails");
        if (storedCartItemsWithDetails) {
            try {
                const parsedItems: { [id: string]: { outfit: Outfit; quantity: number } } = JSON.parse(storedCartItemsWithDetails);
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
  const totalPrice = cartItems.reduce((sum, item: CartItem) => sum + (item.price * item.quantity), 0);

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
    // ในส่วนนี้คุณจะเขียนโค้ดเพื่อส่งข้อมูลการสั่งซื้อ
    // และดำเนินการชำระเงิน (ถ้ามีการเชื่อมต่อกับระบบ)
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
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">ตะกร้าสินค้าว่างเปล่า</h2>
        <p>ไม่มีสินค้าอยู่ในตะกร้าของคุณ <Link href="/" className="text-blue-500 hover:underline">กลับไปเลือกสินค้า</Link></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-300 py-6">
      <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-black">ชำระเงิน</h2>
  
        {/* สรุปคำสั่งซื้อ */}
        <div className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 text-black">สรุปคำสั่งซื้อ</h3>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-2 overflow-hidden rounded flex justify-center items-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-black">{item.name} x {item.quantity}</span>
                </div>
                <span className="text-black">฿ {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="font-semibold text-right mt-2 text-black">ยอดรวม: ฿ {totalPrice}</div> {/* เปลี่ยนเป็นสีดำ */}
        </div>
  
        {/* ข้อมูลการจัดส่ง */}
        <div className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 text-black">ข้อมูลการจัดส่ง</h3>
          <div className="mb-2">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">ชื่อ-นามสกุล:</label>
            <input type="text" id="name" name="name" value={shippingInfo.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-2">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">ที่อยู่:</label>
            <textarea id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-2">
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">เบอร์โทรศัพท์:</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value={shippingInfo.phoneNumber} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
        </div>
  
        {/* วิธีการชำระเงิน */}
        <div className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 text-black">วิธีการชำระเงิน</h3>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">ชำระผ่านธนาคาร (QR Code):</label>
            <input type="file" accept="image/*" onChange={handleQrCodeUpload} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            {qrCodeImage && (
              <div className="mt-2">
                <img src={qrCodeImage} alt="QR Code สำหรับชำระเงิน" className="max-w-sm rounded" />
              </div>
            )}
            <p className="text-gray-800 text-xs mt-1">อัปโหลด QR Code สำหรับชำระเงินผ่านธนาคาร</p>
          </div>
          {/* คุณสามารถเพิ่มตัวเลือกการชำระเงินอื่นๆ ได้ที่นี่ */}
        </div>
  
        {/* ปุ่มดำเนินการ */}
        <div className="flex justify-between">
          <Link href="/cart" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            กลับไปแก้ไขตะกร้าสินค้า
          </Link>
          <button onClick={handleCheckout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            ยืนยันการสั่งซื้อและชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
}