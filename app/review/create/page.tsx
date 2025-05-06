"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaStar } from 'react-icons/fa';

const CreateReviewPage: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setImage(null);
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        console.log('ส่งรีวิว:', { name, rating, comment, image });

        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        router.push('/review');
    };

    return (
        <div className="min-h-screen bg-pink-50 py-12 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg border border-pink-100">
                <h2 className="text-center text-3xl font-bold mb-8 text-pink-600 uppercase tracking-wider">
                    เขียนรีวิว
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-pink-700 mb-2">
                            ชื่อ:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="rating" className="block text-sm font-semibold text-pink-700 mb-2">
                            คะแนน:
                        </label>
                        <select
                            id="rating"
                            className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <option key={star} value={star}>
                                    {'⭐'.repeat(star)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-semibold text-pink-700 mb-2">
                            ความคิดเห็น:
                        </label>
                        <textarea
                            id="comment"
                            rows={4}
                            className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-semibold text-pink-700 mb-2">
                            รูปภาพรีวิว (ถ้ามี):
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-pink-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                        {previewImage && (
                            <div className="mt-4">
                                <img src={previewImage} alt="ตัวอย่างรีวิว" className="rounded-lg max-h-56 shadow-md" />
                            </div>
                        )}
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                        </button>
                        <Link
                            href="/review"
                            className="text-sm text-pink-600 hover:underline font-medium"
                        >
                            ยกเลิก
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReviewPage;
