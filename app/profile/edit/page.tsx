"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
    profileImage?: string; // เพิ่ม property สำหรับเก็บ URL รูปโปรไฟล์
}

const mockUserProfile: UserProfile = {
    name: "Kim Min-ji",
    email: "minji.kim@koreadressrental.com",
    address: "789 Hanok Village, Seoul, South Korea",
    phone: "+82 10-1234-5678",
    profileImage: "/images/default-profile.png", // URL รูปโปรไฟล์เริ่มต้น
};

const EditProfilePage: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState(mockUserProfile.name);
    const [email, setEmail] = useState(mockUserProfile.email);
    const [address, setAddress] = useState(mockUserProfile.address);
    const [phone, setPhone] = useState(mockUserProfile.phone);
    const [profileImage, setProfileImage] = useState<File | null>(null); // State สำหรับเก็บไฟล์รูปภาพที่เลือก
    const [previewImage, setPreviewImage] = useState(mockUserProfile.profileImage); // State สำหรับแสดงภาพตัวอย่าง

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfileImage(file);
            // สร้าง URL สำหรับแสดงภาพตัวอย่าง
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // ในระบบจริง:
        // 1. อัปโหลดไฟล์ profileImage ไปยัง Backend (เช่น Cloud Storage)
        // 2. รับ URL ของรูปภาพที่อัปโหลด
        // 3. ส่งข้อมูลโปรไฟล์ที่อัปเดต (รวมถึง URL รูปภาพ) ไปยัง Backend เพื่อบันทึก
        console.log('อัปเดตโปรไฟล์:', { name, email, address, phone, profileImage });
        // หลังจากบันทึกสำเร็จ อาจมีการเปลี่ยนเส้นทางกลับไปหน้าโปรไฟล์
        router.push('/profile');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-200 to-red-300">
            <div className="bg-white shadow-md rounded-lg px-10 py-8 mb-4 w-full max-w-md">
                <h2 className="block text-gray-700 text-2xl font-bold text-center mb-6">แก้ไขข้อมูลโปรไฟล์</h2>

                {/* ส่วนแก้ไขรูปโปรไฟล์ */}
                <div className="flex justify-center mb-6">
                    <div className="relative rounded-full h-24 w-24 overflow-hidden">
                        <img
                            src={previewImage}
                            alt="รูปโปรไฟล์"
                            className="object-cover h-full w-full"
                        />
                        <label
                            htmlFor="profileImageInput"
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-opacity-75 transition-opacity duration-200"
                        >
                            อัปโหลดรูปใหม่
                            <input
                                id="profileImageInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            ชื่อผู้ใช้:
                        </label>
                        <input
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            อีเมล:
                        </label>
                        <input
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                            ที่อยู่จัดส่ง:
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            เบอร์โทรศัพท์:
                        </label>
                        <input
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            บันทึกการเปลี่ยนแปลง
                        </button>
                        <Link href="/profile" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            ยกเลิก
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;