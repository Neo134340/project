"use client";

import React from 'react';
import Link from 'next/link';

interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    imageUrl?: string; // เพิ่ม property สำหรับ URL รูปภาพรีวิว
}

const mockReviews: Review[] = [
    {
        id: "1",
        name: "Park Bo-gum",
        rating: 5,
        comment: "ชุดสวยงามมาก บริการดีเยี่ยม!",
        imageUrl: "/images/review1.jpg", // ตัวอย่างรูปภาพรีวิว
    },
    {
        id: "2",
        name: "Kim Go-eun",
        rating: 4,
        comment: "คุณภาพชุดดี คุ้มค่ากับราคา",
    },
    {
        id: "3",
        name: "Lee Min-ho",
        rating: 5,
        comment: "ประทับใจกับการออกแบบและรายละเอียดของชุด",
        imageUrl: "/images/review2.jpg", // ตัวอย่างรูปภาพรีวิว
    },
];

const ReviewPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-purple-100">
            <div className="bg-white shadow-md rounded-lg px-10 py-8 mb-4 w-full max-w-md">
                <h2 className="block text-gray-700 text-2xl font-bold text-center mb-6">รีวิวจากลูกค้า</h2>
                <div className="mb-4 text-right">
                    <Link href="/review/create" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline text-sm">
                        เขียนรีวิว
                    </Link>
                </div>
                {mockReviews.length > 0 ? (
                    <ul>
                        {mockReviews.map((review) => (
                            <li key={review.id} className="mb-4 p-4 border rounded-md shadow-sm">
                                <div className="flex items-center mb-2">
                                    <span className="font-semibold text-gray-800 mr-2">{review.name}</span>
                                    <span className="text-yellow-500">
                                        {'⭐'.repeat(review.rating)}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{review.comment}</p>
                                {review.imageUrl && (
                                    <img src={review.imageUrl} alt={`รูปรีวิวจาก ${review.name}`} className="w-full rounded-md" />
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">ยังไม่มีรีวิว</p>
                )}
                <div className="mt-8 text-center">
                    <Link href="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;