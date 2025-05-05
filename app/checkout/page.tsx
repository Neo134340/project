"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


// 🔹 Interface สำหรับชุดสินค้าและสินค้าในตะกร้า
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

// 🔹 ดึงรายการสินค้าในตะกร้าจาก localStorage
const getCartItems = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem("cartItemsWithDetails");
    if (stored) {
      try {
        const parsed: { [key: string]: { outfit: Outfit; quantity: number } } = JSON.parse(stored);
        return Object.values(parsed).map(item => ({
          ...item.outfit,
          quantity: item.quantity,
        }));
      } catch (error) {
        console.error("Error parsing cart items:", error);
      }
    }
  }
  return [];
};

// 🔹 หน้า Checkout
export default function CheckoutPage() {
  const cartItems = getCartItems();
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [adminQrCode, setAdminQrCode] = useState<string | null>(null);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 🔹 โหลดข้อมูลลูกค้าเมื่อเข้าสู่ระบบ
  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) return;

      try {
        const res = await fetch(`http://localhost:8081/api/customer/email/${email}`);
        if (res.ok) {
          const data = await res.json();
          setShippingInfo({
            name: data.name || "",
            address: data.address || "",
            phoneNumber: data.phone || "",
          });
        } else {
          console.error("ไม่สามารถโหลดข้อมูลผู้ใช้");
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", err);
      }
    };

    fetchUser();
  }, []);

  // 🔹 จัดการการเปลี่ยนค่าข้อมูลผู้รับ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 อัปโหลด QR Code จากผู้ใช้
  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setQrCodeImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const router = useRouter();

  // 🔹 ยืนยันคำสั่งซื้อ
  const handleCheckout = () => {
    console.log("ข้อมูลจัดส่ง:", shippingInfo);
    console.log("สินค้าในตะกร้า:", cartItems);
    console.log("ยอดรวม:", totalPrice);
  
    if (qrCodeImage) {
      alert("ดำเนินการสั่งซื้อและชำระเงินด้วย QR Code ที่คุณอัปโหลดแล้ว!");
    } else if (adminQrCode) {
      alert("ดำเนินการสั่งซื้อและชำระเงินด้วย QR Code จากทางร้านแล้ว!");
    } else {
      alert("กรุณาอัปโหลด QR Code สำหรับการชำระเงินผ่านธนาคาร");
      return; // ❗️หยุดไม่ให้เปลี่ยนหน้า
    }
  
    // ✅ เปลี่ยนหน้าไปยังหน้าหลัก
    router.push("/");
  };
  
  // 🔹 แสดงข้อความเมื่อไม่มีสินค้า
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">ตะกร้าสินค้าว่างเปล่า</h2>
          <p className="text-gray-600 mb-4">ไม่มีสินค้าอยู่ในตะกร้าของคุณ</p>
          <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            กลับไปเลือกสินค้า
          </Link>
        </div>
      </div>
    );
  }

  // 🔹 หน้าชำระเงิน
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto p-6 bg-white rounded-md shadow-md max-w-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">ชำระเงิน</h2>

        {/* 🔸 สรุปคำสั่งซื้อ */}
        <section className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">สรุปคำสั่งซื้อ</h3>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center py-2 text-gray-800">
                <div className="flex items-center">
                  <div className="w-10 h-10 mr-2 overflow-hidden rounded-md shadow-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span>{item.name} x {item.quantity}</span>
                </div>
                <span>฿ {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="text-right font-semibold mt-2">ยอดรวม: ฿ {totalPrice}</div>
        </section>

        {/* 🔸 ข้อมูลจัดส่ง */}
        <section className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">ข้อมูลการจัดส่ง</h3>
          <div className="mb-3">
            <label className="block text-sm font-bold mb-1 text-gray-700">ชื่อ-นามสกุล:</label>
            <input type="text" name="name" value={shippingInfo.name} onChange={handleInputChange}
              className="input-style" required />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-bold mb-1 text-gray-700">ที่อยู่:</label>
            <textarea name="address" value={shippingInfo.address} onChange={handleInputChange}
              className="input-style" required />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-bold mb-1 text-gray-700">เบอร์โทรศัพท์:</label>
            <input type="tel" name="phoneNumber" value={shippingInfo.phoneNumber} onChange={handleInputChange}
              className="input-style" required />
          </div>
        </section>

        {/* 🔸 QR Code จากร้านค้า */}
        <section className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">QR Code ชำระเงิน (จากร้านค้า)</h3>
          <input
            type="text"
            value={adminQrCode || ""}
            onChange={(e) => setAdminQrCode(e.target.value)}
            placeholder="ใส่ URL หรือ Base64 ของ QR Code"
            className="input-style"
          />
          {adminQrCode && (
            <div className="mt-3">
              <img src={adminQrCode} alt="QR จากร้าน" className="max-w-full rounded-md shadow-sm" />
            </div>
          )}
        </section>

        {/* 🔸 อัปโหลด QR Code */}
        <section className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">วิธีการชำระเงิน</h3>
          <label className="block text-sm font-bold mb-1 text-gray-700">ชำระผ่าน QR Code ของคุณ:</label>
          <input type="file" accept="image/*" onChange={handleQrCodeUpload} className="input-style" />
          {qrCodeImage && (
            <div className="mt-3">
              <img src={qrCodeImage} alt="QR Code ผู้ใช้" className="max-w-full rounded-md shadow-sm" />
            </div>
          )}
          <p className="text-gray-600 text-xs mt-1">อัปโหลด QR Code สำหรับชำระเงินผ่านธนาคาร</p>
        </section>

        {/* 🔸 ปุ่มดำเนินการ */}
        <div className="flex justify-between">
          <Link href="/cart" className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">
            กลับไปแก้ไขตะกร้า
          </Link>
          <button onClick={handleCheckout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            ยืนยันการสั่งซื้อ
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔹 สไตล์ Input ที่ใช้ซ้ำหลายที่
const inputStyle = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
