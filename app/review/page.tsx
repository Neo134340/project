"use client";

import React from 'react';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

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
        <div className="min-h-screen bg-pink-50 py-12">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="px-8 py-10">
                        <h2 className="text-pink-700 text-4xl font-bold text-center mb-10 uppercase tracking-widest">
                            รีวิวจากลูกค้า
                        </h2>
                        <div className="mb-8 text-right">
                            <Link
                                href="/review/create"
                                className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm transition duration-300 ease-in-out"
                            >
                                <span className="mr-2 text-lg">+</span> เขียนรีวิว
                            </Link>
                        </div>
                        {mockReviews.length > 0 ? (
                            <ul className="space-y-6">
                                {mockReviews.map((review) => (
                                    <li
                                        key={review.id}
                                        className="bg-pink-100 rounded-xl shadow-md p-6 border border-pink-200 transition duration-300 ease-in-out hover:shadow-lg"
                                    >
                                        <div className="flex items-start mb-4">
                                            {review.imageUrl && (
                                                <div className="mr-4 rounded-full overflow-hidden w-14 h-14 border-2 border-pink-300 shadow-sm">
                                                    <img
                                                        src={review.imageUrl}
                                                        alt={`รูปรีวิวจาก ${review.name}`}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <span className="font-bold text-gray-800 mr-3 text-lg">
                                                        {review.name}
                                                    </span>
                                                    <div className="text-yellow-400">
                                                        {Array.from({ length: review.rating }).map((_, index) => (
                                                            <FaStar key={index} className="inline-block mr-1" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed text-sm">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 text-center py-10">
                                ยังไม่มีรีวิวจากลูกค้าในขณะนี้
                            </p>
                        )}
                    </div>
                    <div className="bg-pink-100 px-6 py-4 text-center border-t border-pink-200">
                        <Link
                            href="/"
                            className="inline-block font-semibold text-pink-700 hover:text-pink-900 transition duration-300 ease-in-out"
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
