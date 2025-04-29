"use client";

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaLine, FaTiktok } from 'react-icons/fa'; // Import icons

const AboutUsPage: React.FC = () => {
    const shopName = "ร้านเช่าชุดเกาหลี By Kim";
    const description = "ร้านเช่าชุดฮันบกและชุดสไตล์เกาหลีหลากหลายรูปแบบ คุณภาพพรีเมียม ราคาเป็นกันเอง พร้อมให้คำแนะนำเพื่อให้คุณสวยสง่าในทุกโอกาส";
    const instagramUrl = "https://www.instagram.com/koreadressrental"; // ใส่ URL Instagram ของร้าน
    const lineId = "@koreadressrental"; // ใส่ LINE ID ของร้าน
    const tiktokUrl = "https://www.tiktok.com/@koreadressrental"; // ใส่ URL TikTok ของร้าน

    return (
        <div className="flex justify-center items-center min-h-screen bg-pink-100">
            <div className="bg-white shadow-md rounded-lg px-10 py-8 mb-4 w-full max-w-md">
                <h2 className="block text-gray-700 text-2xl font-bold text-center mb-6">เกี่ยวกับเรา</h2>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{shopName}</h3>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">ติดตามเราได้ที่</h3>
                    <div className="flex justify-center space-x-4">
                        {instagramUrl && (
                            <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700">
                                <FaInstagram size={32} />
                            </Link>
                        )}
                        {lineId && (
                            <Link href={`https://line.me/ti/p/${lineId}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
                                <FaLine size={32} />
                            </Link>
                        )}
                        {tiktokUrl && (
                            <Link href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800">
                                <FaTiktok size={32} />
                            </Link>
                        )}
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <Link href="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;