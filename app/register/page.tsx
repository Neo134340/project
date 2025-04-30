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
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-white flex justify-center items-center">
            <div className="bg-gray-100 shadow-md rounded-lg px-12 py-10 w-full max-w-md">
                <h2 className="block text-gray-800 text-2xl font-semibold text-center mb-8 uppercase tracking-wider">
                    <span className="text-gray-800">สมัคร</span> <span className="text-gray-500">สมาชิก</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                            ชื่อผู้ใช้
                        </label>
                        <input
                            className="appearance-none border border-gray-400 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            id="name"
                            type="text"
                            placeholder="ชื่อของคุณ"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                            อีเมล
                        </label>
                        <input
                            className="appearance-none border border-gray-400 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                            รหัสผ่าน
                        </label>
                        <input
                            className="appearance-none border border-gray-400 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            id="password"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-1">
                            ที่อยู่จัดส่ง
                        </label>
                        <textarea
                            className="appearance-none border border-gray-400 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            id="address"
                            placeholder="ที่อยู่สำหรับการจัดส่งสินค้า"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                            เบอร์โทรศัพท์
                        </label>
                        <input
                            className="appearance-none border border-gray-400 rounded-md w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            id="phone"
                            type="tel"
                            placeholder="เบอร์โทรศัพท์ที่ติดต่อได้"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-black text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out hover:bg-gray-800"
                            type="submit"
                        >
                            สมัครสมาชิก
                        </button>
                        <Link href="/login" className="inline-block align-baseline font-medium text-sm text-gray-500 hover:text-gray-800 transition duration-300 ease-in-out">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <Link href="/" className="inline-block align-baseline font-medium text-sm text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out">
                        ย้อนกลับ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;