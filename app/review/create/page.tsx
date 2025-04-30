"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaStar } from 'react-icons/fa';

const CreateReviewPage: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5); // ค่าเริ่มต้น 5 ดาว
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

        // ในระบบจริง:
        // 1. อัปโหลดรูปภาพ (ถ้ามี) ไปยัง Backend (เช่น Cloud Storage)
        // 2. รับ URL ของรูปภาพ
        // 3. ส่งข้อมูลรีวิว (ชื่อ, คะแนน, ความคิดเห็น, URL รูปภาพ) ไปยัง Backend เพื่อบันทึก
        console.log('ส่งรีวิว:', { name, rating, comment, image });

        // จำลองการส่งข้อมูลสำเร็จ
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        router.push('/review'); // กลับไปหน้าแสดงรีวิว
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="block text-gray-800 text-3xl font-bold text-center mb-8 uppercase tracking-wide">
                    <span className="text-black">เขียน</span> <span className="text-gray-600">รีวิว</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            ชื่อ:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mb-2">
                            คะแนน:
                        </label>
                        <div className="relative">
                            <select
                                id="rating"
                                className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-8"
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value))}
                            >
                                <option value={1}>⭐</option>
                                <option value={2}>⭐⭐</option>
                                <option value={3}>⭐⭐⭐</option>
                                <option value={4}>⭐⭐⭐⭐</option>
                                <option value={5}>⭐⭐⭐⭐⭐</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">
                            ความคิดเห็น:
                        </label>
                        <textarea
                            id="comment"
                            rows={5}
                            className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                            รูปภาพรีวิว (Optional):
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {previewImage && (
                            <div className="mt-3">
                                <img src={previewImage} alt="ภาพตัวอย่างรีวิว" className="max-h-48 rounded-md shadow-md" />
                            </div>
                        )}
                    </div>
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`bg-black hover:bg-gray-800 text-white font-semibold py-3 px-5 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                        </button>
                        <Link
                            href="/review"
                            className="inline-block align-baseline font-semibold text-sm text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
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