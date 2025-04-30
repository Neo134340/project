"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Outfit {
    id: string;
    image: string;
    name: string;
    brand: string;
    price: number;
    sizes: string[];
    colors?: string[];
    status?: "ใหม่" | "ลดราคา";
}

interface CartItem {
    outfit: Outfit;
    quantity: number;
    rentDate?: string | null;
    returnDate?: string | null;
    isAvailable?: boolean;
    frequently?: number;
    size?: string;
    color?: string;
}

// **จำลองข้อมูลชุด (ในความเป็นจริง ควรดึงข้อมูลจาก API หรือฐานข้อมูล)**
const outfitsData: Outfit[] = [
    { id: "1", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดสบายๆ วันหยุด", brand: "แบรนด์ X", price: 990, sizes: ["S", "M"], status: "ใหม่", colors: ["#FADCDC", "#92CEA8", "#E8CFF8"] },
    { id: "2", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/26839/49/pE2IPlnI73EQ0pkY49OH1bw9XqM.png", name: "ชุดทำงานสุดหรู", brand: "แบรนด์ Y", price: 1590, sizes: ["M", "L"], status: "ลดราคา", colors: ["#F898A4"] },
    { id: "3", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดปาร์ตี้", brand: "แบรนด์ Z", price: 1250, sizes: ["S", "L"], colors: ["#80B7A2", "#BEABA7"] },
    { id: "4", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดกีฬา", brand: "แบรนด์ Sporty", price: 790, sizes: ["XS", "M"], colors: ["blue"] },
    { id: "5", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดฤดูร้อน", brand: "แบรนด์ Summer", price: 850, sizes: ["S", "M", "L"], colors: ["yellow", "orange", "skyblue"] },
    { id: "6", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดแฟชั่นใหม่", brand: "แบรนด์ A+", price: 1690, sizes: ["M"], status: "ใหม่", colors: ["green"] },
    { id: "7", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/26839/49/pE2IPlnI73EQ0pkY9OH1bw9XqM.png", name: "ชุดคลาสสิก", brand: "แบรนด์ B+", price: 1190, sizes: ["S", "L"], status: "ลดราคา", colors: ["brown"] },
    { id: "8", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดเรียบหรู", brand: "แบรนด์ C+", price: 1990, sizes: ["M", "L", "XL"], colors: ["pink"] },
    { id: "9", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดโมเดิร์น", brand: "แบรนด์ D+", price: 1350, sizes: ["S"], colors: ["purple"] },
    { id: "10", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดสไตล์วินเทจ", brand: "แบรนด์ E+", price: 1090, sizes: ["M", "L"], colors: ["cream"] },
];

export default function ProductDetailPage() {
    const { id } = useParams();
    const outfit = outfitsData.find((item) => item.id === id);
    const [selectedSize, setSelectedSize] = useState<string | undefined>();
    const [selectedColor, setSelectedColor] = useState<string | undefined>();

    const handleAddToCart = () => {
        if (outfit && selectedSize && selectedColor) {
            const cartItemToAdd: CartItem = {
                outfit: outfit,
                quantity: 1,
                size: selectedSize,
                color: selectedColor,
            };

            const storedCart = localStorage.getItem("cartItemsWithDetails");
            let cartItems: { [key: string]: CartItem } = storedCart ? JSON.parse(storedCart) : {};

            const key = `${outfit.id}-${selectedSize}-${selectedColor}`;
            if (cartItems[key]) {
                cartItems[key].quantity += 1; // เพิ่มจำนวนถ้ามีสินค้ารายการเดียวกันอยู่แล้ว
            } else {
                cartItems[key] = cartItemToAdd;
            }

            localStorage.setItem("cartItemsWithDetails", JSON.stringify(Object.values(cartItems)));
            alert(`เพิ่ม "${outfit.name} (ขนาด: ${selectedSize}, สี: ${selectedColor})" ลงในตะกร้าแล้ว!`);
        } else if (outfit && outfit.sizes.length > 0 && !selectedSize) {
            alert("โปรดเลือกขนาด");
        } else if (outfit && outfit.colors && outfit.colors.length > 0 && !selectedColor) {
            alert("โปรดเลือกสี");
        } else if (outfit) {
            // กรณีสินค้าไม่มีตัวเลือกขนาดหรือสี
            const cartItemToAdd: CartItem = {
                outfit: outfit,
                quantity: 1,
                size: undefined,
                color: undefined,
            };
            const storedCart = localStorage.getItem("cartItemsWithDetails");
            let cartItems: { [key: string]: CartItem } = storedCart ? JSON.parse(storedCart) : {};
            const key = `${outfit.id}-undefined-undefined`;
            if (cartItems[key]) {
                cartItems[key].quantity += 1;
            } else {
                cartItems[key] = cartItemToAdd;
            }
            localStorage.setItem("cartItemsWithDetails", JSON.stringify(Object.values(cartItems)));
            alert(`เพิ่ม "${outfit.name}" ลงในตะกร้าแล้ว!`);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative aspect-w-1 aspect-h-1 overflow-hidden rounded-md">
                        <Image src={outfit?.image || ''} alt={outfit?.name || 'Product Image'} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{outfit?.name}</h2>
                        <p className="text-sm text-gray-500 mb-4">{outfit?.brand}</p>
                        <p className="text-xl text-indigo-600 font-semibold mb-4">฿ {outfit?.price}</p>

                        {outfit?.status && (
                            <div className="mb-2">
                                <span className={`inline-flex items-center rounded-full bg-${outfit.status === 'ใหม่' ? 'green' : 'red'}-100 px-2.5 py-0.5 text-xs font-medium text-black`}>
                                    {outfit.status}
                                </span>
                            </div>
                        )}

                        {outfit?.sizes && outfit.sizes.length > 0 && (
                            <div className="mb-2">
                                <span className="text-gray-700 font-bold">ขนาด:</span>
                                <div className="mt-1">
                                    <select
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                        value={selectedSize}
                                    >
                                        <option value="">เลือกขนาด</option>
                                        {outfit.sizes.map((size) => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {outfit?.colors && outfit.colors.length > 0 && (
                            <div className="mb-4">
                                <span className="text-gray-700 font-bold">สี:</span>
                                <div className="flex items-center space-x-2 mt-1">
                                    <select
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        value={selectedColor}
                                    >
                                        <option value="">เลือกสี</option>
                                        {outfit.colors.map((color) => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <button onClick={handleAddToCart} className="bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition w-full">
                            เพิ่มลงตะกร้า
                        </button>

                        <Link href="/" className="inline-block mt-4 text-blue-500 hover:underline">
                            กลับไปหน้าหลัก
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}