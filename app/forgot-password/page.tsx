'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'คำขอรีเซ็ตรหัสผ่านถูกส่งแล้ว โปรดตรวจสอบอีเมลของคุณ');
                setError('');
            } else {
                setError(data.message || 'ไม่พบอีเมลนี้ในระบบ');
                setMessage('');
            }
        } catch (error: any) {
            console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full sm:w-md lg:w-lg">
                <div className="md:flex">
                    <div className="bg-blue-500 text-white p-8 md:w-1/2 flex flex-col justify-center items-center">
                        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                        <div className="flex items-center mb-4">
                            <svg className="w-12 h-12 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span className="text-xl font-semibold">Spacer</span>
                        </div>
                        <p className="text-sm text-blue-100">กรุณากรอกอีเมลที่คุณใช้ในการลงทะเบียน เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณ</p>
                        <div className="mt-4 text-center">
                            <p className="text-xs">CREATOR HERE</p>
                            <p className="text-xs">DESIGNER HERE</p>
                        </div>
                    </div>
                    <div className="p-8 md:w-1/2">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">ลืมรหัสผ่าน</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your mail"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'กำลังส่ง...' : 'ส่งคำขוריเซ็ต'}
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800"
                                    onClick={() => router.push('/login')}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;