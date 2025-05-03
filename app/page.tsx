"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { FaUserCog } from 'react-icons/fa'; // import Admin
import ProductCard from './components/ProductCard'; // Import ProductCard component
import { NewProduct } from '@/app/admin/components/AddNewProduct'; // Import NewProduct interface
import AddNewProduct from '@/app/admin/components/AddNewProduct'; // Import AddNewProduct component ที่นี่!

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

export default function Home() {
  const initialOutfits: Outfit[] = [
    { id: "1", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "Casual Holiday Set", brand: "Brand X", price: 990, sizes: ["S", "M"], status: "ใหม่", colors: ["#FADCDC", "#92CEA8", "#E8CFF8"] },
    { id: "2", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/26839/49/pE2IPlnI73EQ0pkY49OH1bw9XqM.png", name: "Luxury Work Outfit", brand: "Brand Y", price: 1590, sizes: ["M", "L"], status: "ลดราคา", colors: ["#F898A4"] },
    { id: "3", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "Party Dress", brand: "Brand Z", price: 1250, sizes: ["S", "L"], colors: ["#80B7A2", "#BEABA7"] },
    { id: "4", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "Sportswear", brand: "Sporty Brand", price: 790, sizes: ["XS", "M"], colors: ["blue"] },
    { id: "5", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "Summer Outfit", brand: "Summer Brand", price: 850, sizes: ["S", "M", "L"], colors: ["yellow", "orange", "skyblue"] },
    { id: "6", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "New Fashion Set", brand: "Brand A+", price: 1690, sizes: ["M"], status: "ใหม่", colors: ["green"] },
    { id: "7", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "Classic Outfit", brand: "Brand B+", price: 1190, sizes: ["S", "L"], status: "ลดราคา", colors: ["brown"] },
    { id: "8", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "Elegant Set", brand: "Brand C+", price: 1990, sizes: ["M", "L", "XL"], colors: ["pink"] },
    { id: "9", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "Modern Outfit", brand: "Brand D+", price: 1350, sizes: ["S"], colors: ["purple"] },
    { id: "10", image: "https://cdn.wconcept.com/products/resize/632x843/migration/i/imgpin.wconceptusa.com/18647a1de60/36fd7/44/s0dWLfWXStJlYnd3qU-kFgkr0HA.png", name: "Vintage Style Set", brand: "Brand E+", price: 1090, sizes: ["M", "L"], colors: ["cream"] },
  ];

  const otherProducts: OtherProduct[] = [
    { id: "shoe1", image: "https://via.placeholder.com/150/808080/FFFFFF?Text=Shoe+1", name: "Stylish Shoe 1" },
    { id: "shoe2", image: "https://via.placeholder.com/150/808080/FFFFFF?Text=Shoe+2", name: "Stylish Shoe 2" },
    { id: "bag1", image: "https://via.placeholder.com/150/A9A9A9/FFFFFF?Text=Bag+1", name: "Chic Bag 1" },
    { id: "bag2", image: "https://via.placeholder.com/150/A9A9A9/FFFFFF?Text=Bag+2", name: "Chic Bag 2" },
    { id: "shoe3", image: "https://via.placeholder.com/150/808080/FFFFFF?Text=Shoe+3", name: "Stylish Shoe 3" },
    { id: "bag3", image: "https://via.placeholder.com/150/A9A9A9/FFFFFF?Text=Bag+3", name: "Chic Bag 3" },
    { id: "shoe4", image: "https://via.placeholder.com/150/808080/FFFFFF?Text=Shoe+4", name: "Stylish Shoe 4" },
    { id: "bag4", image: "https://via.placeholder.com/150/A9A9A9/FFFFFF?Text=Bag+4", name: "Chic Bag 4" },
    { id: "acc1", image: "https://via.placeholder.com/150/D3D3D3/000000?Text=Acc+1", name: "Accessory 1" },
    { id: "acc2", image: "https://via.placeholder.com/150/D3D3D3/000000?Text=Acc+2", name: "Accessory 2" },
  ];

  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<{ [id: string]: { outfit: Outfit; quantity: number; size?: string; color?: string } }>(getInitialCartItems());
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>(initialOutfits);
  const [newProducts, setNewProducts] = useState<Outfit[]>([]); // State สำหรับเก็บสินค้าใหม่

  const handleAddToCart = (item: { outfit: Outfit; size?: string; color?: string }) => {
    setCartItems((prevItems) => {
      const key = `<span class="math-inline">\{item\.outfit\.id\}\-</span>{item.size}-${item.color}`;
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
      router.push('/');
    } else if (selectedValue === "Login") {
      router.push('/login');
    } else if (selectedValue === "Profile") {
      router.push('/profile');
    } else if (selectedValue === "Contact") {
      router.push('/contact');
    } else if (selectedValue === "Review") {
      router.push('/review');
    } else if (selectedValue === "Logout") {
      console.log('Logout clicked');
      router.push('/');
    }
    event.target.value = "";
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const results = initialOutfits.filter(outfit =>
      outfit.name.toLowerCase().includes(term)
    );
    setFilteredOutfits(results);
  };

  const handleAddNewProduct = (newProductData: NewProduct) => {
    const newOutfit: Outfit = {
      id: `new-${Date.now()}`,
      image: newProductData.images[0] ? URL.createObjectURL(newProductData.images[0]) : "https://via.placeholder.com/300/CCCCCC/000000?Text=New+Product", // ใช้ placeholder ถ้าไม่มีรูป
      name: newProductData.name,
      brand: newProductData.brand,
      price: newProductData.price || 0,
      sizes: newProductData.sizes,
      colors: newProductData.colors,
      status: newProductData.status,
    };
    setNewProducts(prevProducts => [...prevProducts, newOutfit]);
    console.log('เพิ่มสินค้าใหม่ที่หน้า Home:', newOutfit);
  };

  useEffect(() => {
    const totalQuantity = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
    localStorage.setItem("cartItemsWithDetails", JSON.stringify(cartItems));
  }, [cartItems]);

  // รวม outfits เริ่มต้นและสินค้าใหม่
  const allOutfits = [...filteredOutfits, ...newProducts];

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 shadow-md p-3 rounded-lg bg-white/80">
            Rent Your Style
          </h1>
          <select
            className="shadow-sm focus:ring-gray-500 focus:border-gray-500 block sm:text-sm border-gray-300 rounded-md py-2 px-3 text-gray-700"
            onChange={handleNavigation}
            defaultValue=""
          >
            <option value="" className="text-gray-500">Home</option>
            <option value="Login" className="text-gray-700">Login</option>
            <option value="Profile" className="text-gray-700">Profile</option>
            <option value="Contact" className="text-gray-700">About Us</option>
            <option value="Review" className="text-gray-700">Review</option>
            <option value="Logout" className="text-gray-700">Logout</option>
          </select>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search outfit names..."
            className="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            className="shadow-sm focus:ring-gray-500 focus:border-gray-500 block sm:text-sm border-gray-300 rounded-md py-2 px-3 text-gray-700"
          >
            <option value="" className="text-gray-500">All Brands</option>
            <option value="Brand X" className="text-gray-700">Brand X</option>
            <option value="Brand Y" className="text-gray-700">Brand Y</option>
            {/* Add other brands */}
          </select>
        </div>

        {/* Add New Product Section */}
        <div className="mb-8 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">เพิ่มชุดใหม่</h2>
          {/* คุณอาจจะต้องสร้าง Form component แยกออกมา หรือใส่ไว้ที่นี่ */}
          {/* ตัวอย่างง่ายๆ: */}
          {/* <AddNewProduct onProductAdded={handleAddNewProduct} /> */}
          {/* **สำคัญ:** คุณจะต้องมี `<AddNewProduct />` component อยู่ในหน้านี้ด้วย */}
          {/* หากคุณต้องการให้ Form เพิ่มสินค้าแสดงที่หน้านี้ คุณจะต้องนำ `<AddNewProduct />` component มาใส่ไว้ใน JSX ของหน้านี้ */}
          {/* และให้แน่ใจว่า `handleAddNewProduct` ถูกส่งเป็น prop ไปให้ */}
          {/* ตัวอย่าง: */}
          <AddNewProduct onProductAdded={handleAddNewProduct} />
        </div>

        {/* Outfit Grid (Clothes) */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Outfits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {allOutfits.map((outfit) => (
            <ProductCard key={outfit.id} outfit={outfit} onAddToCart={handleAddToCart} />
          ))}
        </div>

        {/* See More Outfits */}
        <div className="flex justify-center mb-8">
          <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 transition shadow-sm">
            See More Outfits +
          </button>
        </div>

        {/* Other Products (Shoes, Bags) */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Other Interesting Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {otherProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 shadow-md rounded-lg flex flex-col justify-center items-center hover:shadow-lg transition">
              <div className="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-md mb-2 w-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale"
                  style={{ filter: 'grayscale(100%)' }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">{product.name}</h3>
              {/* You can add more details for other product types here */}
              <Link href={`/other-product/${product.id}`} className="mt-2 text-sm text-gray-600 hover:underline">View Details</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Button */}
      <div className="relative">
        <Link
          href="/cart"
          className="fixed bottom-8 right-8 bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition cursor-pointer text-xl"
        >
          🛒
        </Link>
        {Object.keys(cartItems).length > 0 && (
          <div className="absolute top-0 right-0 translate-x-[65%] -translate-y-[65%] bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold border border-red-500">
            {Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0)}
          </div>
        )}
      </div>

      <div className="text-xl font-semibold text-gray-800 mt-2">
        {cartCount > 0 ? `Cart: ${cartCount} items` : "Your Cart is Empty"}
      </div>


      <Link
        href="/admin"
        className="fixed bottom-24 right-8 z-50 bg-gradient-to-br from-white to-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:from-gray-100 hover:to-gray-800 transition cursor-pointer text-xl"
      >
        <FaUserCog size={24} />
      </Link>
    </div>
  );
}