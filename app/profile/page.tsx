"use client";

import React from 'react';
import Link from 'next/link';

interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
}

interface RentalStatus {
    rentalId: string;
    outfitName: string;
    rentalDate: string;
    returnDate: string;
    status: "กำลังเตรียม" | "ระหว่างจัดส่ง" | "กำลังใช้งาน" | "ส่งคืนแล้ว";
}

const mockUserProfile: UserProfile = {
    name: "Kim Min-ji",
    email: "minji.kim@koreadressrental.com",
    address: "789 Hanok Village, Seoul, South Korea",
    phone: "+82 10-1234-5678",
};

const mockRentalHistory: RentalStatus[] = [
    {
        rentalId: "RNT001",
        outfitName: "ชุดฮันบกสีชมพู",
        rentalDate: "2025-05-05",
        returnDate: "2025-05-10",
        status: "กำลังใช้งาน",
    },
    {
        rentalId: "RNT002",
        outfitName: "ชุดเจ้าชายโบราณ",
        rentalDate: "2025-04-20",
        returnDate: "2025-04-25",
        status: "ส่งคืนแล้ว",
    },
    {
        rentalId: "RNT003",
        outfitName: "ชุดกิแซง",
        rentalDate: "2025-05-15",
        returnDate: "2025-05-18",
        status: "กำลังเตรียม",
    },
];

const ProfilePage: React.FC = () => {
    const user = mockUserProfile; // ในระบบจริง คุณจะต้องดึงข้อมูลผู้ใช้ที่ Login อยู่
    const rentalHistory = mockRentalHistory; // ในระบบจริง คุณจะต้องดึงประวัติการเช่าของผู้ใช้

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-300">
            <div className="bg-white shadow-md rounded-lg px-10 py-8 mb-4 w-full max-w-lg">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full h-24 w-24 bg-pink-300 flex items-center justify-center text-white text-3xl font-semibold shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                </div>
                <h2 className="block text-gray-700 text-2xl font-bold text-center mb-6">ข้อมูลโปรไฟล์</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        ชื่อผู้ใช้:
                    </label>
                    <p className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50">
                        {user.name}
                    </p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        อีเมล:
                    </label>
                    <p className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50">
                        {user.email}
                    </p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        ที่อยู่จัดส่ง:
                    </label>
                    <p className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50">
                        {user.address}
                    </p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        เบอร์โทรศัพท์:
                    </label>
                    <p className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50">
                        {user.phone}
                    </p>
                </div>

                {/* ส่วนของการติดตามสถานะชุดเช่า */}
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">สถานะการเช่าชุด</h3>
                    {rentalHistory.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {rentalHistory.map((rental) => (
                                <li key={rental.rentalId} className="py-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-600 font-semibold">{rental.outfitName}</p>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${
                                            rental.status === 'กำลังเตรียม' ? 'yellow' :
                                            rental.status === 'ระหว่างจัดส่ง' ? 'blue' :
                                            rental.status === 'กำลังใช้งาน' ? 'green' :
                                            'gray'
                                        }-100 text-black`}>
                                            {rental.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">วันที่เช่า: {rental.rentalDate}</p>
                                    <p className="text-gray-500 text-sm">วันที่คืน: {rental.returnDate}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">ไม่มีประวัติการเช่าชุด</p>
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <Link href="/profile/edit" className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline text-sm">
                        แก้ไขโปรไฟล์
                    </Link>
                    <Link href="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;