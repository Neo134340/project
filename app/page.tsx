"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS ของ Library
import { useRouter } from 'next/navigation'; // Import useRouter สำหรับ Next.js

interface Outfit {
    id: string;
    image: string;
    name: string;
    brand: string;
    price: number;
    sizes: string[]; // Field sizes
    colors?: string[]; // Field colors (Optional)
    status?: "ใหม่" | "ลดราคา"; // Field status (Optional)
}

interface OtherProduct {
    id: string;
    image: string;
    name: string;
}

const getInitialCartItems = (): { [id: string]: { outfit: Outfit; quantity: number; size?: string; color?: string } } => {
    if (typeof window !== 'undefined') {
        const storedCartItems = localStorage.getItem("cartItemsWithDetails");
        if (storedCartItems) {
            try {
                return JSON.parse(storedCartItems);
            } catch (error) {
                console.error("Error parsing cart items from local storage:", error);
                return {};
            }
        }
    }
    return {};
};

const ProductCard: React.FC<{ outfit: Outfit; onAddToCart: (item: { outfit: Outfit; size?: string; color?: string }) => void }> = ({ outfit, onAddToCart }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null); // State สำหรับเก็บขนาดที่เลือก (จะถูกใช้งานเมื่อกดเพิ่มลงตะกร้า)
    const [selectedColor, setSelectedColor] = useState<string | null>(null); // State สำหรับเก็บสีที่เลือก (จะถูกใช้งานเมื่อกดเพิ่มลงตะกร้า)

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        setIsAvailable(null);
    };

    const handleCheckAvailability = async () => {
        if (startDate && endDate) { // ตรวจสอบแค่วันที่เริ่มต้นและสิ้นสุด
            setIsChecking(true);
            // **จำลองการตรวจสอบความพร้อม (แทนที่ด้วย API จริง โดยส่ง startDate และ endDate ไปด้วย)**
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockAvailability = Math.random() > 0.3;
            setIsAvailable(mockAvailability);
            setIsChecking(false);
            setShowDatePicker(false);
        } else {
            alert('โปรดระบุวันที่เช่าและวันที่คืน'); // แจ้งเตือนแค่วันที่
        }
    };

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    // ฟังก์ชันนี้จะถูกเรียกเมื่อมีการเลือกขนาด (แต่จะไม่แสดงผลโดยตรง)
    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSize(event.target.value);
        setIsAvailable(null); // รีเซ็ตสถานะว่างเมื่อเปลี่ยนขนาด
    };

    // ฟังก์ชันนี้จะถูกเรียกเมื่อมีการเลือกสี (แต่จะไม่แสดงผลโดยตรง)
    const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedColor(event.target.value);
    };

    const handleAddToCartClick = () => {
        onAddToCart({
            outfit,
            size: selectedSize === null ? undefined : selectedSize,
            color: selectedColor === null ? undefined : selectedColor
        });
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-lg flex flex-col justify-between">
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
            <p className="text-sm text-gray-500 mb-1">{outfit.brand}</p>
            <p className="text-sm text-indigo-600 font-semibold">฿ {outfit.price}</p>

            {outfit.status && (
                <div className="mb-1">
                    <span className={`inline-flex items-center rounded-full bg-${outfit.status === 'ใหม่' ? 'green' : 'red'}-100 px-2.5 py-0.5 text-xs font-medium text-black`}>
                        {outfit.status}
                    </span>
                </div>
            )}

            <div className="mb-2 flex flex-col space-y-1">
                {outfit.sizes && outfit.sizes.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <span className="block text-gray-700 text-sm font-bold">
                            ขนาด:
                        </span>
                        <span className="text-sm text-gray-600">
                            {outfit.sizes.join(', ')}
                        </span>
                        {/* Dropdown เลือกขนาด (ไม่ได้ใช้แล้ว เอาออก) */}
                    </div>
                )}
                {outfit.colors && outfit.colors.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <span className="block text-gray-700 text-sm font-bold">
                            สี:
                        </span>
                        <div className="flex space-x-1">
                            {outfit.colors.map((color) => (
                                <div
                                    key={color}
                                    className="w-5 h-5 rounded-md shadow-sm"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        {/* Dropdown เลือกสี (ซ่อนไว้ แต่ยังใช้งานได้เมื่อเพิ่มลงตะกร้า) */}
                        <select
                            id={`color-select-${outfit.id}`}
                            className="hidden shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                            onChange={handleColorChange}
                            value={selectedColor || ''}
                        >
                            <option value="">เลือกสี</option>
                            {outfit.colors.map((color) => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="mt-2">
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
            </div>

            {isAvailable !== null && (
                <p className={`mt-2 font-semibold text-sm ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    สถานะ: {isAvailable ? 'ว่าง' : 'ไม่ว่าง'}
                </p>
            )}

            <button
                onClick={handleAddToCartClick}
                className="mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition text-sm shadow-sm w-full"
            >
                เพิ่มลงตะกร้า
            </button>
        </div>
    );
};

export default function Home() {
    const outfits: Outfit[] = [
        // ข้อมูลสินค้าของคุณ (ชุดเสื้อ)
        { id: "1", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดสบายๆ วันหยุด", brand: "แบรนด์ X", price: 990, sizes: ["S", "M"], status: "ใหม่", colors: ["#FADCDC", "#92CEA8", "#E8CFF8"] },
        { id: "2", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/26839/49/pE2IPlnI73EQ0pkY49OH1bw9XqM.png", name: "ชุดทำงานสุดหรู", brand: "แบรนด์ Y", price: 1590, sizes: ["M", "L"], status: "ลดราคา", colors: ["#F898A4"] },
        { id: "3", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดปาร์ตี้", brand: "แบรนด์ Z", price: 1250, sizes: ["S", "L"], colors: ["#80B7A2", "#BEABA7"] },
        { id: "4", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดกีฬา", brand: "แบรนด์ Sporty", price: 790, sizes: ["XS", "M"], colors: ["blue"] },
        { id: "5", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดฤดูร้อน", brand: "แบรนด์ Summer", price: 850, sizes: ["S", "M", "L"], colors: ["yellow", "orange", "skyblue"] },
        { id: "6", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดแฟชั่นใหม่", brand: "แบรนด์ A+", price: 1690, sizes: ["M"], status: "ใหม่", colors: ["green"] },
        { id: "7", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/26839/49/pE2IPlnI73EQ0pkY49OH1bw9XqM.png", name: "ชุดคลาสสิก", brand: "แบรนด์ B+", price: 1190, sizes: ["S", "L"], status: "ลดราคา", colors: ["brown"] },
        { id: "8", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดเรียบหรู", brand: "แบรนด์ C+", price: 1990, sizes: ["M", "L", "XL"], colors: ["pink"] },
        { id: "9", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดโมเดิร์น", brand: "แบรนด์ D+", price: 1350, sizes: ["S"], colors: ["purple"] },
        { id: "10", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "ชุดสไตล์วินเทจ", brand: "แบรนด์ E+", price: 1090, sizes: ["M", "L"], colors: ["cream"] },
    ];

    const otherProducts: OtherProduct[] = [
        // ข้อมูลสินค้าประเภทอื่น (รองเท้า, กระเป๋า) - ใช้รูปภาพจำลอง
        { id: "shoe1", image: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=Shoe+1", name: "รองเท้าสวย 1" },
        { id: "shoe2", image: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=Shoe+2", name: "รองเท้าสวย 2" },
        { id: "bag1", image: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Bag+1", name: "กระเป๋าเก๋ 1" },
        { id: "bag2", image: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Bag+2", name: "กระเป๋าเก๋ 2" },
        { id: "shoe3", image: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=Shoe+3", name: "รองเท้าสวย 3" },
        { id: "bag3", image: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Bag+3", name: "กระเป๋าเก๋ 3" },
        { id: "shoe4", image: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=Shoe+4", name: "รองเท้าสวย 4" },
        { id: "bag4", image: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Bag+4", name: "กระเป๋าเก๋ 4" },
        { id: "acc1", image: "https://via.placeholder.com/150/008000/FFFFFF?Text=Acc+1", name: "เครื่องประดับ 1" },
        { id: "acc2", image: "https://via.placeholder.com/150/008000/FFFFFF?Text=Acc+2", name: "เครื่องประดับ 2" },
    ];

    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<{ [id: string]: { outfit: Outfit; quantity: number; size?: string; color?: string } }>(getInitialCartItems()); // Initialize with data from localStorage
    const router = useRouter(); // Initialize useRouter สำหรับ Next.js

    const handleAddToCart = (item: { outfit: Outfit; size?: string; color?: string }) => {
        setCartItems((prevItems) => {
            const key = `${item.outfit.id}-${item.size}-${item.color}`;
            const existingItem = prevItems[key];
            if (existingItem) {
                return {
                    ...prevItems,
                    [key]: {
                        ...existingItem,
                        quantity: existingItem.quantity + 1,
                    },
                };
            } else {
                return { ...prevItems, [key]: { ...item, quantity: 1 } };
            }
        });
    };

    const handleNavigation = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (selectedValue === "") {
            router.push('/'); // กลับไปหน้า Home หากเลือกค่าเริ่มต้น
        } else if (selectedValue === "Login") {
            router.push('/login');
        } else if (selectedValue === "Profile") {
            router.push('/profile');
        } else if (selectedValue === "Contact") {
            router.push('/contact');
        } else if (selectedValue === "Review") {
            router.push('/review'); // เพิ่มเงื่อนไขนี้
        } else if (selectedValue === "Logout") {
            // Logic สำหรับ Logout (ล้าง session, token, etc.)
            console.log('Logout clicked');
            router.push('/'); // หรือพาไปยังหน้า Login อีกครั้ง
        }
        // ถ้าต้องการให้ Dropdown กลับไปเป็นค่าเริ่มต้นหลังการเลือก
        event.target.value = "";
    };

    useEffect(() => {
        const totalQuantity = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQuantity);
        localStorage.setItem("cartItemsWithDetails", JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-300">
            <div className="container mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 shadow-md p-2 rounded-md bg-white/80">
                        เลือกชุดของคุณ
                    </h1>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อชุด..."
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                    {/* ตัวอย่าง Dropdown Filter (ปรับสีสันได้) */}
                    <select
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300 rounded-md py-2 px-3 text-blue-500"
                        onChange={handleNavigation}
                        defaultValue="" // กำหนดค่าเริ่มต้นเป็นค่าว่าง
                    >
                        <option value="" className="text-gray-500">HOME</option>
                        <option value="Login" className="text-green-500">Login</option>
                        <option value="Profile" className="text-purple-500">Profile</option>
                        <option value="Contact" className="text-blue-500">About Us</option>
                        <option value="Review" className="text-yellow-500">Review</option>
                        <option value="Logout" className="text-red-500">Logout</option>
                    </select>
                    <select
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300 rounded-md py-2 px-3 text-purple-500"
                    >
                        <option value="" className="text-gray-500">ทุกแบรนด์</option>
                        <option value="แบรนด์ X" className="text-indigo-500">แบรนด์ X</option>
                        <option value="แบรนด์ Y" className="text-yellow-500">แบรนด์ Y</option>
                        {/* เพิ่มแบรนด์อื่นๆ */}
                    </select>
                </div>

                {/* Outfit Grid (ชุดเสื้อ) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                    {outfits.map((outfit) => (
                        <ProductCard key={outfit.id} outfit={outfit} onAddToCart={handleAddToCart} />
                    ))}
                </div>

                {/* ดูสินค้าเพิ่มเติม (ชุดเสื้อ) */}
                <div className="flex justify-center mb-8">
                    <button className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-400 transition">
                        ดูสินค้าเพิ่มเติม +
                    </button>
                </div>

                {/* สินค้าประเภทอื่น (รองเท้า, กระเป๋า) */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">สินค้าอื่นๆ ที่น่าสนใจ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {otherProducts.map((product) => (
                        <div key={product.id} className="bg-white p-4 shadow-md rounded-lg flex flex-col justify-center items-center">
                            <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-md mb-2 w-full">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 text-center">{product.name}</h3>
                            {/* คุณสามารถเพิ่มรายละเอียดเพิ่มเติมของสินค้าประเภทอื่นได้ที่นี่ */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Colorful Cart Button */}
            <div className="relative">
                <Link
                    href="/cart"
                    className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:from-blue-600 hover:to-purple-700 transition cursor-pointer text-xl"
                >
                    🛒
                </Link>
                {Object.keys(cartItems).length > 0 && (
                    <div className="absolute top-0 right-0 translate-x-[65%] -translate-y-[65%] bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold border border-red-500">
                        {Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                )}
            </div>
        </div>
    );
}