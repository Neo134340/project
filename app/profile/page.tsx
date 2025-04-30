"use client";

import React from 'react';
import Link from 'next/link';

interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
    profileImage?: string;
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
    profileImage: "/images/default-profile.png",
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
    const user = mockUserProfile;
    const rentalHistory = mockRentalHistory;

    return (
        <div className="min-h-screen bg-gray-100 py-12 flex justify-center items-center fade-in">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-gray-200 slide-up">
                <div className="flex justify-center mb-8 animate-bounce">
                    <div className="relative rounded-full h-24 w-24 overflow-hidden border-4 border-black shadow-md transition-transform duration-300 hover:scale-105">
                        <img
                            src={user.profileImage || "/images/default-profile.png"}
                            alt="รูปโปรไฟล์"
                            className="object-cover h-full w-full grayscale"
                        />
                    </div>
                </div>
                <h2 className="block text-gray-800 text-3xl font-bold text-center mb-6 uppercase tracking-wide text-black">
                    <span className="text-black">โปรไฟล์</span> <span className="text-gray-600">ผู้ใช้</span>
                </h2>
                <div className="space-y-6 mb-8">
                    <div className="bg-gray-50 rounded-md p-4 shadow-inner">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            ชื่อผู้ใช้:
                        </label>
                        <p className="text-gray-900 font-semibold">{user.name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4 shadow-inner">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            อีเมล:
                        </label>
                        <p className="text-gray-900 font-semibold">{user.email}</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4 shadow-inner">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            ที่อยู่จัดส่ง:
                        </label>
                        <p className="text-gray-900 font-semibold">{user.address}</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4 shadow-inner">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            เบอร์โทรศัพท์:
                        </label>
                        <p className="text-gray-900 font-semibold">{user.phone}</p>
                    </div>
                </div>

                {/* ส่วนของการติดตามสถานะชุดเช่า */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide text-black">
                        <span className="text-black">สถานะ</span> <span className="text-gray-600">การเช่า</span>
                    </h3>
                    {rentalHistory.length > 0 ? (
                        <ul className="divide-y divide-gray-200 rounded-md shadow-sm">
                            {rentalHistory.map((rental) => (
                                <li key={rental.rentalId} className="py-4 px-4 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-700 font-semibold">{rental.outfitName}</p>
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-${
                                            rental.status === 'กำลังเตรียม' ? 'yellow' :
                                            rental.status === 'ระหว่างจัดส่ง' ? 'blue' :
                                            rental.status === 'กำลังใช้งาน' ? 'green' :
                                            'gray'
                                        }-200 text-gray-800`}>
                                            {rental.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">วันที่เช่า: {rental.rentalDate}</p>
                                    <p className="text-gray-500 text-sm">วันที่คืน: {rental.returnDate}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 py-4 text-center bg-white rounded-md shadow-sm">ไม่มีประวัติการเช่าชุด</p>
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <Link
                        href="/profile/edit"
                        className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-5 rounded-md focus:outline-none focus:shadow-outline text-sm transition duration-300 ease-in-out hover:scale-105"
                    >
                        แก้ไขโปรไฟล์
                    </Link>
                    <Link
                        href="/"
                        className="inline-block align-baseline font-semibold text-sm text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out hover:underline"
                    >
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>
            <style jsx>{`
                .fade-in {
                    animation: fadein 0.5s;
                }

                .slide-up {
                    animation: slideup 0.5s;
                }

                @keyframes fadein {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                @keyframes slideup {
                    from { transform: translateY(20px); opacity: 0; }
                    to   { transform: translateY(0); opacity: 1; }
                }

                .grayscale {
                    filter: grayscale(100%);
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;