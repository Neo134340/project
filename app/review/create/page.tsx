"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
        <div className="flex justify-center items-center min-h-screen bg-yellow-100">
            <div className="bg-white shadow-md rounded-lg px-10 py-8 mb-4 w-full max-w-md">
                <h2 className="block text-gray-700 text-2xl font-bold text-center mb-6">เขียนรีวิว</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            ชื่อ:
                        </label>
                        <input
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                            คะแนน:
                        </label>
                        <select
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                        >
                            <option value={1}>⭐</option>
                            <option value={2}>⭐⭐</option>
                            <option value={3}>⭐⭐⭐</option>
                            <option value={4}>⭐⭐⭐⭐</option>
                            <option value={5}>⭐⭐⭐⭐⭐</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                            ความคิดเห็น:
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="comment"
                            rows={5}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            รูปภาพรีวิว (Optional):
                        </label>
                        <input
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {previewImage && (
                            <div className="mt-2">
                                <img src={previewImage} alt="ภาพตัวอย่างรีวิว" className="max-h-48 rounded-md" />
                            </div>
                        )}
                    </div>
                    {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                        </button>
                        <Link href="/review" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            ยกเลิก
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReviewPage;