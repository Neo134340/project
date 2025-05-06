"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('สมัครสมาชิก:', { name, email, password, address, phone });

        try {
            const response = await fetch('http://localhost:8081/api/customer/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, address, phone }),
            });

            if (response.ok) {
                localStorage.setItem('userEmail', email);
                alert("คุณเป็นสมาชิกกับเราสำเร็จ");
                router.push('/profile');
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg px-12 py-10 w-full max-w-md border border-pink-200">
                <h2 className="text-pink-600 text-2xl font-bold text-center mb-8 uppercase tracking-wider">
                    <span className="text-pink-600">สมัคร</span> <span className="text-pink-400">สมาชิก</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-pink-600 text-sm font-medium mb-1">
                            ชื่อผู้ใช้
                        </label>
                        <input
                            className="appearance-none border border-pink-300 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                            id="name"
                            type="text"
                            placeholder="ชื่อของคุณ"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-pink-600 text-sm font-medium mb-1">
                            อีเมล
                        </label>
                        <input
                            className="appearance-none border border-pink-300 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-pink-600 text-sm font-medium mb-1">
                            รหัสผ่าน
                        </label>
                        <input
                            className="appearance-none border border-pink-300 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                            id="password"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-pink-600 text-sm font-medium mb-1">
                            ที่อยู่จัดส่ง
                        </label>
                        <textarea
                            className="appearance-none border border-pink-300 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                            id="address"
                            placeholder="ที่อยู่สำหรับการจัดส่งสินค้า"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-pink-600 text-sm font-medium mb-1">
                            เบอร์โทรศัพท์
                        </label>
                        <input
                            className="appearance-none border border-pink-300 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                            id="phone"
                            type="tel"
                            placeholder="เบอร์โทรศัพท์ที่ติดต่อได้"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 hover:bg-pink-600 transition duration-300"
                            type="submit"
                        >
                            สมัครสมาชิก
                        </button>
                        <Link href="/login" className="text-sm font-medium text-pink-500 hover:text-pink-700 transition duration-300">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm font-medium text-pink-400 hover:text-pink-600 transition duration-300">
                        ย้อนกลับ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
