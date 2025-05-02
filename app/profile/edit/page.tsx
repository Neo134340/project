"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';


interface UserProfile {
  name: string;
  email: string;
  address: string;
  phone: string;
  profileImage?: string;
}

const EditProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>('');

  // ฟังก์ชันสำหรับดึงข้อมูลโปรไฟล์
  const fetchUserProfile = async () => {
    const email = localStorage.getItem("userEmail"); // หรือลองดึงจาก sessionStorage
    if (email) {
      try {
        const response = await fetch(`http://localhost:8081/api/customer/profile?email=${email}`);
        const data: UserProfile = await response.json();
        setName(data.name);
        setEmail(data.email);
        setAddress(data.address);
        setPhone(data.phone);
        setPreviewImage(data.profileImage);
      } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้', error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile(); // เรียกใช้ฟังก์ชันดึงข้อมูลโปรไฟล์
  }, []);

  // ฟังก์ชันสำหรับการอัปเดตโปรไฟล์
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("phone", phone);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const res = await fetch("http://localhost:8081/api/customer/update", {
        method: "POST",
        body: formData,
      });

      const result = await res.text();
      if (res.ok) {
        alert("อัปเดตสำเร็จ");
      } else {
        alert("ไม่สามารถอัปเดตข้อมูลได้: " + result);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  };



  // ฟังก์ชันสำหรับการเลือกภาพโปรไฟล์ใหม่
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 py-12 flex justify-center items-center fade-in">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md slide-up">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-8 uppercase">
            <span className="text-black">แก้ไข</span> <span className="text-gray-600">โปรไฟล์</span>
          </h2>

          <div className="flex justify-center mb-8">
            <div className="relative rounded-full h-24 w-24 overflow-hidden border-2 border-gray-300 shadow-md">
              <img src={previewImage} alt="รูปโปรไฟล์" className="object-cover h-full w-full" />
              <label
                  htmlFor="profileImageInput"
                  className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-sm font-semibold cursor-pointer"
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
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                ชื่อผู้ใช้:
              </label>
              <input
                  type="text"
                  id="name"
                  className="w-full border rounded-md py-3 px-4 shadow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                อีเมล:
              </label>
              <input
                  type="email"
                  id="email"
                  className="w-full border rounded-md py-3 px-4 shadow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">
                ที่อยู่จัดส่ง:
              </label>
              <textarea
                  id="address"
                  className="w-full border rounded-md py-3 px-4 shadow"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                เบอร์โทรศัพท์:
              </label>
              <input
                  type="tel"
                  id="phone"
                  className="w-full border rounded-md py-3 px-4 shadow"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                  type="submit"
                  className="bg-black text-white font-semibold py-3 px-5 rounded-md hover:bg-gray-800 transition"
              >
                บันทึก
              </button>
              <Link
                  href="/profile"
                  className="text-sm text-gray-600 hover:underline hover:text-gray-800"
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideup {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      </div>
  );
};

export default EditProfilePage;
