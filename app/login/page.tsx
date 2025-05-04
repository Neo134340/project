"use client"; // Ensure the client-side execution

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State สำหรับตรวจสอบสถานะ Login
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('เข้าสู่ระบบ:', { email, password });

    // เรียก API ตรวจสอบการเข้าสู่ระบบ ---> เหวินเพิ่มเข้ามาหลังบ้าน
    const response = await fetch('http://localhost:8081/api/customer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json(); // ดึงข้อมูลที่ backend ส่งกลับมา
      localStorage.setItem('token', data.token); // เก็บ token
      localStorage.setItem('userId', data.userId); // เก็บ userId ไว้เรียกใช้ตอนดึงข้อมูลผู้ใช้
      localStorage.setItem('userEmail', email); // ✅ เพิ่ม email ผู้ใช้ไว้ใน localStorage


      alert("เข้าสู่ระบบสำเร็จ");
      setIsLoggedIn(true); // เปลี่ยนสถานะเป็น Logged In
      router.push('/'); // เปลี่ยนเส้นทางไปหน้าแรก
    } else {
      const error = await response.text();
      alert(error); // แจ้งข้อผิดพลาด
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="bg-gray-100 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={isLoggedIn} // ปิดการใช้งานเมื่อ Login แล้ว
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={isLoggedIn} // ปิดการใช้งานเมื่อ Login แล้ว
            />
          </div>
          {!isLoggedIn && ( // แสดงปุ่ม Login เฉพาะเมื่อยังไม่ได้ Logged In
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Log In
            </button>
          )}
        </form>
        {isLoggedIn && ( // แสดงข้อความเมื่อ Logged In แล้ว
          <div className="mt-4 text-center text-green-500">
            เข้าสู่ระบบสำเร็จแล้ว กำลังนำทาง...
          </div>
        )}
        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-600 hover:underline">
            ย้อนกลับหน้าแรก
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="/register" className="text-blue-600 hover:underline">Don&apos;t have an account? Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;