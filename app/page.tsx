"use client"; // Ensure the client-side execution

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { FaUserCog } from 'react-icons/fa';
import ProductCard from './components/ProductCard';
import AddNewProduct, { NewProduct } from '@/app/admin/components/AddNewProduct';

// Interfaces ยังคงเหมือนเดิม
interface Outfit { id: string; image: string; name: string; brand: string; price: number; sizes: string[]; colors?: string[]; status?: "ใหม่" | "ลดราคา"; }
// ตรวจสอบ interface OtherProduct ดูเหมือนจะมี 'string: string' ซ้ำกัน อาจจะเป็น name หรือ brand ครับ
interface OtherProduct { id: string; image: string; name: string; brand: string; }


const getInitialCartItems = (): { [id: string]: { outfit: Outfit; quantity: number; size?: string; color?: string } } =>
  typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem("cartItemsWithDetails") || '{}')
    : {};

const initialOutfits: Outfit[] = [
  { id: "1", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "Casual Holiday Set", brand: "Brand X", price: 990, sizes: ["S", "M"], status: "ใหม่", colors: ["#FADCDC", "#92CEA8", "#E8CFF8"] },
  { id: "2", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/26839/49/pE2IPlnI73EQ0pkY9OH1bw9XqM.png", name: "Luxury Work Outfit", brand: "Brand Y", price: 1590, sizes: ["M", "L"], status: "ลดราคา", colors: ["#F898A4"] },
];

const otherProducts: OtherProduct[] = []; // ตรวจสอบการใช้งาน otherProducts ในโค้ด ถ้าไม่ได้ใช้ สามารถลบได้ครับ

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState(getInitialCartItems());
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>(''); // สำหรับกรองแบรนด์
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>(initialOutfits);
  const [newProducts, setNewProducts] = useState<Outfit[]>([]);

  // ส่วนที่ต้องมี: State สำหรับเก็บ Role ของผู้ใช้งานที่ Login
  const [userRole, setUserRole] = useState<string | null>(null); // เก็บค่า Role เป็น String หรือ null

  const handleAddToCart = (item: { outfit: Outfit; size?: string; color?: string }) => {
    const key = `${item.outfit.id}-${item.size}-${item.color}`;
    setCartItems(prevItems => ({ ...prevItems, [key]: { ...item, quantity: (prevItems[key]?.quantity || 0) + 1 } }));
  };

  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      // ลบข้อมูลผู้ใช้งานและ Role ออกจาก localStorage เมื่อ Logout
      localStorage.removeItem("user"); // อาจจะลบ key "user" ถ้าใช้เก็บทั้ง Object
      localStorage.removeItem("token"); // ลบ token
      localStorage.removeItem("userId"); // ลบ userId
      localStorage.removeItem("userEmail"); // ลบ userEmail
      localStorage.removeItem("role"); // **สำคัญ:** ลบ Role ด้วย
      localStorage.removeItem("cartItemsWithDetails");

      setCartItems({});
      setUserRole(null); // รีเซ็ตค่า Role ใน state
      router.push("/"); // Redirect ไปหน้าแรก
    }
  };

   // ปรับปรุง handleNavigation เพื่อให้ Logout ล้างค่า userRole ใน state ด้วย
  const handleNavigation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "Logout") {
      handleLogout();
    } else if (value) {
      router.push(`/${value.toLowerCase()}`);
    }

    e.target.value = "";
  };


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterOutfits(term, selectedBrand); // ควรใช้ selectedBrand ด้วยในการ filter
  };

  // ส่วนนี้มีอยู่แล้ว แต่ไม่มีการใช้งาน State selectedBrand
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    filterOutfits(searchTerm, brand); // เรียก filter พร้อม brand
  };

  // ปรับปรุง filterOutfits ให้ใช้ brand ด้วย
  const filterOutfits = (term: string, brand: string) => {
     const filtered = initialOutfits.filter(outfit => {
       const matchesSearchTerm = outfit.name.toLowerCase().includes(term);
       const matchesBrand = brand ? outfit.brand === brand : true; // กรองตาม brand ถ้ามีการเลือก brand
       return matchesSearchTerm && matchesBrand;
     });
     setFilteredOutfits(filtered);
   };


  const handleAddNewProduct = (newProductData: NewProduct) => {
    // **หมายเหตุ:** ในระบบจริง การเพิ่มสินค้าใหม่ควรเรียก API Backend เพื่อบันทึกลงฐานข้อมูล
    // โค้ดส่วนนี้เป็นการเพิ่มใน State ของ Frontend เท่านั้น
    const newOutfit: Outfit = {
      id: `new-${Date.now()}`,
      image: newProductData.images[0] ? URL.createObjectURL(newProductData.images[0]) : "https://via.placeholder.com/300/CCCCCC/000000?Text=New+Product",
      name: newProductData.name,
      brand: newProductData.brand,
      price: newProductData.price || 0,
      sizes: newProductData.sizes,
      colors: newProductData.colors,
      status: newProductData.status,
    };
    setNewProducts(prevProducts => [...prevProducts, newOutfit]);
    console.log('เพิ่มสินค้าใหม่ที่หน้า Home (Frontend State):', newOutfit);
  };

  // ส่วนที่ต้องมี: useEffect สำหรับโหลด Role ของผู้ใช้งานเมื่อ Component Mount
  // โค้ดส่วนนี้จะอ่านค่า "role" จาก localStorage และนำมาตั้งค่า userRole state
  useEffect(() => {
    setCartCount(Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0));
    localStorage.setItem("cartItemsWithDetails", JSON.stringify(cartItems));

    // อ่านค่า Role จาก localStorage ที่บันทึกไว้ตอน Login
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole); // ตั้งค่า Role ใน State ของ Component
    } else {
        setUserRole(null); // ถ้าไม่มี role ใน localStorage แสดงว่ายังไม่ Login หรือ Login ไม่สำเร็จ
    }


  }, [cartItems]); // Dependency array: ทำงานเมื่อ cartItems เปลี่ยน หรือเมื่อ Component Mount ครั้งแรก

  const allOutfits = [...filteredOutfits, ...newProducts];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-rose-600 shadow-md p-3 rounded-lg bg-pink-100/80">Rent Your Style</h1>
          <select
            className="shadow-md focus:ring-rose-400 focus:border-rose-400 block sm:text-sm border border-rose-300 rounded-md py-2 px-3 text-rose-700 appearance-none bg-white cursor-pointer"
            onChange={handleNavigation}
            defaultValue=""
          >
            <option value="" className="text-gray-500">Home</option>
             {/* แสดง Login ถ้ายังไม่มี Role (ยังไม่ Login หรือ Logout ไปแล้ว) */}
             {userRole === null && (
                <option value="Login" className="text-rose-700 hover:bg-rose-50 transition">Login</option>
             )}
            {/* แสดง Profile ถ้า Login แล้ว */}
             {userRole !== null && (
                <option value="Profile" className="text-rose-700 hover:bg-rose-50 transition">Profile</option>
             )}
            <option value="Contact" className="text-rose-700 hover:bg-rose-50 transition">About Us</option>
            <option value="Review" className="text-rose-700 hover:bg-rose-50 transition">Review</option>
            {/* แสดง Logout ถ้า Login แล้ว */}
            {userRole !== null && (
                 <option value="Logout" className="text-rose-700 hover:bg-rose-50 transition">Logout</option>
            )}
          </select>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search outfit names..."
            className="shadow-sm focus:ring-rose-400 focus:border-rose-400 block w-full sm:text-sm border border-rose-300 rounded-md py-2 px-3 text-rose-700"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
             className="shadow-md focus:ring-rose-400 focus:border-rose-400 block sm:text-sm border border-rose-300 rounded-md py-2 px-3 text-rose-700 appearance-none bg-white cursor-pointer"
             value={selectedBrand} // เพิ่ม value และ onChange
             onChange={handleBrandChange}
           >
            <option value="" className="text-gray-500">All Brands</option>
            <option value="Brand X" className="text-rose-700 hover:bg-rose-50 transition">Brand X</option>
            <option value="Brand Y" className="text-rose-700 hover:bg-rose-50 transition">Brand Y</option>
          </select>
        </div>

        {/* ส่วนที่ต้องมี: แสดง AddNewProduct เฉพาะ Admin */}
        {/* ใช้เงื่อนไข userRole === 'ADMIN' && (...) ในการแสดง */}
        {userRole === 'ADMIN' && ( // โค้ดส่วนนี้จะทำให้ Component AddNewProduct แสดงเฉพาะ Admin
            <AddNewProduct onProductAdded={handleAddNewProduct} />
        )}


        <h2 className="text-2xl font-semibold text-rose-700 mb-4">Our Outfits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {allOutfits.map(outfit => <ProductCard key={outfit.id} outfit={outfit} onAddToCart={handleAddToCart} />)}
        </div>

        <div className="flex justify-center mb-8">
          <button className="bg-rose-100 text-rose-700 px-5 py-2 rounded-md hover:bg-rose-200 transition shadow-sm">See More Outfits +</button>
        </div>

        <div className="relative">
          <Link
            href="/cart"
            className="fixed bottom-8 right-8 bg-rose-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-800 transition cursor-pointer text-xl"
          >
            🛒
            {Object.keys(cartItems).length > 0 && (
              <div className="absolute top-0 right-0 translate-x-[0%] -translate-y-[50%] bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold border border-red-500">
                {Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            )}
          </Link>
        </div>

        {/* ส่วนที่ต้องมี: แสดงปุ่ม Admin เฉพาะ Admin */}
        {/* ใช้เงื่อนไข userRole === 'ADMIN' && (...) ในการแสดง */}
        {userRole === 'ADMIN' && ( // โค้ดส่วนนี้จะทำให้ปุ่มไอคอน Admin แสดงเฉพาะ Admin
            <Link
              href="/admin"
              className="fixed bottom-24 right-8 z-50 bg-gradient-to-br from-rose-200 to-rose-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:from-rose-100 hover:to-rose-700 transition cursor-pointer text-xl"
            >
              <FaUserCog size={24} />
            </Link>
        )}
      </div>
    </div>
  );
}