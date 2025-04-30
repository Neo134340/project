"use client";

import React from 'react';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa'; // นำเข้าไอคอนดาว

interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    imageUrl?: string;
}

const mockReviews: Review[] = [
    {
        id: "1",
        name: "Park Bo-gum",
        rating: 5,
        comment: "ชุดสวยงามมาก บริการดีเยี่ยม!",
        imageUrl: "/images/review1.jpg",
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
        imageUrl: "/images/review2.jpg",
    },
];

const ReviewPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="px-6 py-8">
                        <h2 className="block text-gray-800 text-3xl font-bold text-center mb-8 uppercase tracking-wide">
                            <span className="text-black">ลูกค้า</span> <span className="text-gray-600">รีวิว</span>
                        </h2>
                        <div className="mb-6 text-right">
                            <Link
                                href="/review/create"
                                className="inline-flex items-center bg-black hover:bg-gray-800 text-white font-semibold py-3 px-5 rounded-md focus:outline-none focus:shadow-outline text-sm transition duration-300 ease-in-out"
                            >
                                <span className="mr-2">+</span> เขียนรีวิว
                            </Link>
                        </div>
                        {mockReviews.length > 0 ? (
                            <ul className="space-y-6">
                                {mockReviews.map((review) => (
                                    <li key={review.id} className="bg-gray-50 rounded-md shadow-sm p-6 border border-gray-200 transition duration-300 ease-in-out hover:shadow-md">
                                        <div className="flex items-start mb-3">
                                            {review.imageUrl && (
                                                <div className="mr-4 rounded-full overflow-hidden w-12 h-12 shadow-inner">
                                                    <img src={review.imageUrl} alt={`รูปรีวิวจาก ${review.name}`} className="object-cover w-full h-full" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center mb-1">
                                                    <span className="font-semibold text-gray-800 mr-3">{review.name}</span>
                                                    <div className="text-yellow-500">
                                                        {Array.from({ length: review.rating }).map((_, index) => (
                                                            <FaStar key={index} className="inline-block mr-1" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 text-center py-8">ยังไม่มีรีวิวจากลูกค้าในขณะนี้</p>
                        )}
                    </div>
                    <div className="bg-gray-100 px-6 py-4 text-center border-t border-gray-200">
                        <Link
                            href="/"
                            className="inline-block font-semibold text-black hover:text-gray-800 transition duration-300 ease-in-out"
                        >
                            ← กลับสู่หน้าหลัก
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;