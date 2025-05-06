'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // เพิ่มการ Import Link
import AdminRentalPage from './AdminRentalPage';  // หน้าแอดมินที่จัดการการเช่าชุด

export default function AdminPage() {
  const router = useRouter();
  // State เพื่อบอกว่ากำลังตรวจสอบสิทธิ์อยู่ หรือมีสิทธิ์เข้าถึงหรือไม่
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State สำหรับบอกว่ากำลังโหลด/ตรวจสอบ

  useEffect(() => {
    // เมื่อ component ถูก mount ให้เริ่มตรวจสอบสิทธิ์
    const storedRole = localStorage.getItem('role');

    if (!storedRole || storedRole !== 'ADMIN') {
      // ถ้าไม่มีค่า Role หรือค่า Role ไม่ใช่ 'ADMIN'
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้'); // แสดง Alert
      router.push('/'); // และ Redirect ไปหน้าแรก
    } else {
      // ถ้าค่า Role คือ 'ADMIN'
      setIsAuthorized(true); // ตั้งค่าว่าได้รับสิทธิ์เข้าถึง
    }

    // ไม่ว่าจะได้รับสิทธิ์หรือไม่ ให้ตั้งค่า isLoading เป็น false เมื่อตรวจสอบเสร็จ
    setIsLoading(false);

  }, [router]); // Dependency array

  // แสดง Loading Spinner หรือข้อความ "กำลังตรวจสอบสิทธิ์..." ขณะที่กำลังตรวจสอบ
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-pink-700 text-lg">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  // ถ้าตรวจสอบเสร็จแล้ว (isLoading เป็น false) และ isAuthorized เป็น false
  // ซึ่งเงื่อนไขนี้จะจริงถ้า userRole ไม่ใช่ 'ADMIN' และได้ Redirect ไปแล้ว
  if (!isAuthorized) {
    return null; // ไม่แสดงอะไรเลยหากไม่มีสิทธิ์
  }

  // ✅ ถ้ามาถึงตรงนี้ได้ แสดงว่า isLoading เป็น false และ isAuthorized เป็น true
  // คือ ตรวจสอบเสร็จแล้ว และผู้ใช้งานมีสิทธิ์เป็น Admin
  // Component จะ Render เนื้อหาส่วน Admin พร้อม Style และปุ่มกลับหน้าแรก

  return (
    // Container หลักพร้อม Styling พื้นฐาน
    <div className="min-h-screen bg-pink-50 py-6"> {/* ปรับพื้นหลัง, Padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* จัด Layout กึ่งกลาง */}

        {/* เนื้อหาของหน้า AdminRentalPage จะถูกโหลดที่นี่ */}
        <AdminRentalPage />

        {/* ✅ ส่วนนี้คือปุ่มกลับไปหน้าแรก ที่ถูกย้ายมาอยู่ด้านล่าง */}
        <div className="mt-6"> {/* เพิ่ม Margin ด้านบนเพื่อแยกจากเนื้อหา */}
          <Link
            href="/" // Link กลับไปหน้าแรก
            className="inline-block bg-pink-200 text-pink-700 px-4 py-2 rounded-md hover:bg-pink-300 transition shadow-sm"
          >
            &larr; กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}