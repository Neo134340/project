"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  address: string;
  phone: string;
  profileImage?: string;
}

const mockUserProfile: UserProfile = {
  name: "Kim Min-ji",
  email: "minji.kim@koreadressrental.com",
  address: "789 Hanok Village, Seoul, South Korea",
  phone: "+82 10-1234-5678",
  profileImage: "/images/default-profile.png",
};

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState(mockUserProfile.name);
  const [email, setEmail] = useState(mockUserProfile.email);
  const [address, setAddress] = useState(mockUserProfile.address);
  const [phone, setPhone] = useState(mockUserProfile.phone);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(mockUserProfile.profileImage);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('อัปเดตโปรไฟล์:', { name, email, address, phone, profileImage });
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 flex justify-center items-center fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md slide-up">
        <h2 className="block text-gray-800 text-3xl font-bold text-center mb-8 uppercase tracking-wide">
          <span className="text-black">แก้ไข</span> <span className="text-gray-600">โปรไฟล์</span>
        </h2>

        {/* ส่วนแก้ไขรูปโปรไฟล์ */}
        <div className="flex justify-center mb-8">
          <div className="relative rounded-full h-24 w-24 overflow-hidden border-2 border-gray-300 shadow-md hover:scale-105 transition-transform duration-300">
            <img
              src={previewImage}
              alt="รูปโปรไฟล์"
              className="object-cover h-full w-full"
            />
            <label
              htmlFor="profileImageInput"
              className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-opacity-80 transition-opacity duration-200"
            >
              อัปโหลดใหม่
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              ชื่อผู้ใช้:
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              อีเมล:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
              ที่อยู่จัดส่ง:
            </label>
            <textarea
              id="address"
              className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
              เบอร์โทรศัพท์:
            </label>
            <input
              type="tel"
              id="phone"
              className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-5 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out hover:scale-105"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
            <Link
              href="/profile"
              className="inline-block align-baseline font-semibold text-sm text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out hover:underline"
            >
              ยกเลิก
            </Link>
          </div>
        </form>
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
      `}</style>
    </div>
  );
};

export default EditProfilePage;