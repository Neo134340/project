"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// กำหนด type ให้กับ Outfit
interface Outfit {
    id: string;
    image: string;
    name: string;
    brand: string;
    details: string;
    otherImages: string[];
    price: number;
}

// กำหนด type สำหรับ item ในตะกร้า เพื่อเก็บจำนวน, วันที่เช่า/คืน, ขนาด และสี
interface CartItem {
    outfit: Outfit;
    quantity: number;
    rentDate?: string | null;
    returnDate?: string | null;
    isAvailable?: boolean;
    frequently?: number; // เพิ่ม property frequently
    size?: string;       // เพิ่ม property size
    color?: string;      // เพิ่ม property color
}

const getCartItemsFromLocalStorage = (): CartItem[] => {
    try {
        const storedCartItemsWithDetails = localStorage.getItem("cartItemsWithDetails");
        if (storedCartItemsWithDetails) {
            const parsedItems: {
                [key: string]: {
                    outfit: Outfit;
                    quantity: number;
                    frequently?: number;
                    size?: string;
                    color?: string;
                };
            } = JSON.parse(storedCartItemsWithDetails);
            return Object.values(parsedItems).map(item => ({
                outfit: item.outfit,
                quantity: item.quantity,
                rentDate: null,
                returnDate: null,
                isAvailable: true,
                frequently: item.frequently || 0,
                size: item.size,
                color: item.color,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error getting cart items from local storage:", error);
        return [];
    }
};

const saveCartItemsToLocalStorage = (items: CartItem[]) => {
    try {
        localStorage.setItem(
            "cartItemsWithDetails",
            JSON.stringify(
                items.reduce((acc: {
                    [key: string]: {
                        outfit: Outfit;
                        quantity: number;
                        frequently?: number;
                        size?: string;
                        color?: string;
                    };
                }, item) => {
                    const key = `${item.outfit.id}-${item.size}-${item.color}`; // สร้าง key ที่มี size และ color
                    acc[key] = {
                        outfit: item.outfit,
                        quantity: item.quantity,
                        frequently: item.frequently || 0,
                        size: item.size,
                        color: item.color,
                    };
                    return acc;
                }, {})
            )
        );
    } catch (error) {
        console.error("Error saving cart items to local storage:", error);
    }
};

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(getCartItemsFromLocalStorage());
    const [globalRentDate, setGlobalRentDate] = useState<string | null>(null);
    const [globalReturnDate, setGlobalReturnDate] = useState<string | null>(null);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [allAvailable, setAllAvailable] = useState(false);

    useEffect(() => {
        // ล้างข้อมูลเก่าเมื่อ Component Mount (ถ้าต้องการ)
        if (localStorage.getItem("cartItemsWithDates")) {
            localStorage.removeItem("cartItemsWithDates");
        }
        if (localStorage.getItem("cartItems")) {
            localStorage.removeItem("cartItems");
        }
    }, []);

    useEffect(() => {
        saveCartItemsToLocalStorage(cartItems);
    }, [cartItems]);

    const removeFromCart = (id: string, size?: string, color?: string) => {
        const updatedCart = cartItems.filter(
            (item) => item.outfit.id !== id || item.size !== size || item.color !== color
        );
        setCartItems(updatedCart);
    };

    const increaseQuantity = (id: string, size?: string, color?: string) => {
        const updatedCart = cartItems.map((item) =>
            item.outfit.id === id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        setCartItems(updatedCart);
    };

    const decreaseQuantity = (id: string, size?: string, color?: string) => {
        const updatedCart = cartItems
            .map((item) =>
                item.outfit.id === id && item.size === size && item.color === color
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
            .filter((item) => item.quantity > 0);
        setCartItems(updatedCart);
    };

    const handleGlobalRentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setGlobalRentDate(date);
    };

    const handleGlobalReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setGlobalReturnDate(date);
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.outfit.price * item.quantity, 0);
    };

    const handleCheckAvailability = async () => {
        if (globalRentDate && globalReturnDate) {
            setIsCheckingAvailability(true);
            const availabilityResults = await Promise.all(
                cartItems.map(async (item) => {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    const isAvailableMock = Math.random() > 0.2;
                    return { ...item, isAvailable: isAvailableMock };
                })
            );
            setCartItems(availabilityResults);
            const allAreAvailable = availabilityResults.every((item) => item.isAvailable);
            setAllAvailable(allAreAvailable);
            setIsCheckingAvailability(false);
        } else {
            alert("โปรดระบุวันที่เช่าและวันที่คืน");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-300 p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">🛒 ตะกร้าสินค้า</h1>

            <div className="mb-4 p-4 bg-white rounded-md shadow-sm">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">ระบุวันที่เช่าและคืน</h2>
                <div className="flex space-x-4">
                    <div>
                        <label htmlFor="globalRentDate" className="block text-gray-700 text-sm font-bold mb-1">
                            วันที่เช่า:
                        </label>
                        <input
                            type="date"
                            id="globalRentDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                            onChange={handleGlobalRentDateChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="globalReturnDate" className="block text-gray-700 text-sm font-bold mb-1">
                            วันที่คืน:
                        </label>
                        <input
                            type="date"
                            id="globalReturnDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                            onChange={handleGlobalReturnDateChange}
                        />
                    </div>
                </div>
            </div>

            <ul>
                {cartItems.map((cartItem) => (
                    <li
                        key={`${cartItem.outfit.id}-${cartItem.size}-${cartItem.color}`}
                        className={`flex items-center py-4 border-b bg-white rounded-md shadow-sm mb-2 ${
                            cartItem.isAvailable === false ? "border-red-500 border-2" : ""
                        }`}
                    >
                        <img
                            src={cartItem.outfit.image}
                            alt={cartItem.outfit.name}
                            className="w-24 h-24 object-cover rounded mr-4"
                        />
                        <div className="flex-grow">
                            <h3 className="font-semibold text-gray-800">{cartItem.outfit.name}</h3>
                            <p className="text-gray-700 text-sm">{cartItem.outfit.brand}</p>
                            <p className="text-indigo-700 font-semibold">฿ {cartItem.outfit.price}</p>
                            {cartItem.size && <p className="text-gray-600 text-sm">ขนาด: {cartItem.size}</p>}
                            {cartItem.color && (
                                <div className="flex items-center space-x-1 mt-1">
                                    <span className="text-gray-700 text-sm">สี:</span>
                                    <div
                                        className="w-5 h-5 rounded-md shadow-sm"
                                        style={{ backgroundColor: cartItem.color }}
                                    />
                                </div>
                            )}
                            {cartItem.isAvailable === false && (
                                <p className="text-red-500 font-semibold mt-1">ไม่ว่างในวันที่เลือก</p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => decreaseQuantity(cartItem.outfit.id, cartItem.size, cartItem.color)}
                                className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 transition text-sm"
                            >
                                -
                            </button>
                            <span className="text-lg text-gray-800">{cartItem.quantity}</span>
                            <button
                                onClick={() => increaseQuantity(cartItem.outfit.id, cartItem.size, cartItem.color)}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition text-sm"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={() => removeFromCart(cartItem.outfit.id, cartItem.size, cartItem.color)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm ml-4"
                        >
                            ลบ
                        </button>
                    </li>
                ))}
            </ul>
            <div className="mt-6 py-4 border-t bg-white rounded-md shadow-sm p-4 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">ยอดรวม: ฿ {calculateTotalPrice()}</h2>
                    {globalRentDate && globalReturnDate && (
                        <p className="text-gray-600 text-sm mt-1">
                            วันที่เช่า: {globalRentDate}, วันที่คืน: {globalReturnDate}
                        </p>
                    )}
                    {!globalRentDate || !globalReturnDate && (
                        <p className="text-gray-600 text-sm mt-1">โปรดระบุวันที่เช่าและวันที่คืน</p>
                    )}
                </div>
                {allAvailable && cartItems.length > 0 ? (
                    <Link href="/checkout">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition shadow-md">
                            ไปยังหน้าชำระเงิน
                        </button>
                    </Link>
                ) : (
                    <button
                        onClick={handleCheckAvailability}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition shadow-md"
                        disabled={!globalRentDate || !globalReturnDate || isCheckingAvailability}
                    >
                        {isCheckingAvailability ? "กำลังตรวจสอบ..." : "ตรวจสอบวันว่าง"}
                    </button>
                )}
            </div>
            <Link href="/">
                <button className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                    กลับไปเลือกสินค้าต่อ
                </button>
            </Link>
        </div>
    );
}