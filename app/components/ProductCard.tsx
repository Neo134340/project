// components/ProductCard.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

interface ProductCardProps {
    outfit: Outfit;
    onAddToCart: (item: { outfit: Outfit; size?: string; color?: string }) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ outfit, onAddToCart }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDetails, setShowDetails] = useState(false); // State สำหรับควบคุมการแสดงรายละเอียด
    const [selectedSize, setSelectedSize] = useState<string | null>(null); // State สำหรับเก็บขนาดที่เลือก
    const [selectedColor, setSelectedColor] = useState<string | null>(outfit.colors?.[0] || null);

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        setIsAvailable(null);
    };

    const handleCheckAvailability = async () => {
        if (startDate && endDate) {
            setIsChecking(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockAvailability = Math.random() > 0.3;
            setIsAvailable(mockAvailability);
            setIsChecking(false);
            setShowDatePicker(false);
        } else {
            alert('โปรดระบุวันที่เช่าและวันที่คืน');
        }
    };

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSize(event.target.value);
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedColor(event.target.value);
    };

    const handleAddToCartClick = () => {
        if (!selectedSize && outfit.sizes?.length > 0) {
            alert('โปรดเลือกขนาด');
            return;
        }
        onAddToCart({
            outfit,
            size: selectedSize === null ? undefined : selectedSize,
            color: selectedColor === null ? undefined : selectedColor
        });
    };

    return (
        <div className="bg-white p-2 shadow-md rounded-lg flex flex-col justify-between">
            <Link href={`/product/${outfit.id}`}>
                <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-md mb-2 cursor-pointer">
                    <img
                        src={outfit.image}
                        alt={outfit.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
            </Link>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{outfit.name}</h3>
            <div className="flex items-center space-x-2 mb-2"> {/* Container สำหรับ สี และ ขนาด */}
                {outfit.colors && outfit.colors.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                            {outfit.colors.map((color) => (
                                <div
                                    key={color}
                                    className="w-5 h-5 rounded-full shadow-sm cursor-pointer"
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                    title={color}
                                    aria-label={`สี ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="relative ml-2"> {/* Container สำหรับ Dropdown ขนาด */}
                    <button
                        onClick={toggleDetails}
                        className="shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs flex justify-end items-center"
                    >
                        {selectedSize ? `ขนาด: ${selectedSize}` : ''} {/* เอาคำว่า "เลือก" ออก */}
                        <svg className="w-24 h-3 fill-current text-gray-500" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </button>
                    {showDetails && outfit.sizes && outfit.sizes.length > 0 && (
                        <div className="absolute top-full left-0 z-20 bg-white shadow-md rounded-md mt-1 w-full"> {/* เพิ่ม z-index: 20 */}
                            <div className="p-2">
                                <label htmlFor={`size-select-${outfit.id}`} className="block text-gray-700 text-sm font-bold mb-1">
                                    เลือกขนาด:
                                </label>
                                <select
                                    id={`size-select-${outfit.id}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    onChange={handleSizeChange}
                                    value={selectedSize || ''}
                                >
                                    <option value="">เลือกขนาด</option>
                                    {outfit.sizes.map((size) => (
                                        <option key={size} value={size}>{size} - {outfit.brand} - ฿{outfit.price}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-2 flex flex-col space-y-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1">ตรวจสอบวันว่าง:</label>
                                <div className="relative">
                                    <button
                                        onClick={toggleDatePicker}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm flex justify-between items-center"
                                    >
                                        {startDate && endDate
                                            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                                            : 'เลือกวันที่'}
                                        <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </button>
                                    {showDatePicker && (
                                        <div className="absolute top-full left-0 z-10 bg-white shadow-md rounded-md mt-1">
                                            <DatePicker
                                                selectsRange
                                                startDate={startDate}
                                                endDate={endDate}
                                                onChange={handleDateChange}
                                                inline
                                            />
                                            <div className="p-2 flex justify-end">
                                                <button onClick={handleCheckAvailability} className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition text-sm">ตรวจสอบ</button>
                                                <button onClick={toggleDatePicker} className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400 transition text-sm ml-2">ยกเลิก</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {isAvailable !== null && (
                                    <p className={`mt-2 font-semibold text-sm ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                        สถานะ: {isAvailable ? 'ว่าง' : 'ไม่ว่าง'}
                                    </p>
                                )}
                                <button
                                    onClick={handleAddToCartClick}
                                    className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition text-sm shadow-sm w-full"
                                >
                                    เพิ่มลงตะกร้า
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;