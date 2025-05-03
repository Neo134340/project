// app/admin/components/AddNewProduct.tsx
"use client";

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'; // Import icons สำหรับปุ่ม Dropdown

export interface NewProduct {
  images: File[];
  name: string;
  brand: string;
  price: number | null;
  sizes: string[];
  colors: string[];
  status?: "ใหม่" | "ลดราคา";
}

interface AddNewProductProps {
  onProductAdded: (newProduct: NewProduct) => void;
}

const availableSizes = ["XS", "S", "M", "L", "XL"]; // ตัวเลือกขนาด
const AddNewProduct: React.FC<AddNewProductProps> = ({ onProductAdded }) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    images: [],
    name: '',
    brand: '',
    price: null,
    sizes: ['S'],
    colors: ['#000000'],
    status: 'ใหม่',
  });
  const [isFormVisible, setIsFormVisible] = useState(false); // State สำหรับควบคุมการแสดงผล Form

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewProduct(prevProduct => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewProduct(prevProduct => ({
        ...prevProduct,
        images: [...prevProduct.images, ...Array.from(event.target.files)],
      }));
    }
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...newProduct.sizes];
    newSizes[index] = value;
    setNewProduct(prevProduct => ({
      ...prevProduct,
      sizes: newSizes,
    }));
  };

  const handleAddSize = () => {
    setNewProduct(prevProduct => ({
      ...prevProduct,
      sizes: [...prevProduct.sizes, 'S'],
    }));
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = [...newProduct.sizes];
    if (newSizes.length > 1) {
      newSizes.splice(index, 1);
      setNewProduct(prevProduct => ({
        ...prevProduct,
        sizes: newSizes,
      }));
    }
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...newProduct.colors];
    newColors[index] = value;
    setNewProduct(prevProduct => ({
      ...prevProduct,
      colors: newColors,
    }));
  };

  const handleAddColor = () => {
    setNewProduct(prevProduct => ({
      ...prevProduct,
      colors: [...prevProduct.colors, '#000000'],
    }));
  };

  const handleRemoveColor = (index: number) => {
    const newColors = [...newProduct.colors];
    if (newColors.length > 1) {
      newColors.splice(index, 1);
      setNewProduct(prevProduct => ({
        ...prevProduct,
        colors: newColors,
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('ข้อมูลชุดใหม่:', newProduct);
    onProductAdded(newProduct);
    setNewProduct({ images: [], name: '', brand: '', price: null, sizes: ['S'], colors: ['#000000'], status: 'ใหม่' });
    setIsFormVisible(false); // ซ่อน Form หลังจากบันทึก
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">เพิ่มชุดใหม่</h2> {/* เปลี่ยนสีตัวอักษรที่นี่ */}
        <button
          type="button"
          onClick={toggleFormVisibility}
          className="p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isFormVisible ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="images" className="block text-gray-700 text-sm font-bold mb-2">
              รูปภาพชุด
            </label>
            <input type="file" id="images" multiple onChange={handleImageChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            {newProduct.images.length > 0 && (
              <div className="mt-2 flex space-x-2">
                {newProduct.images.map((image, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden">
                    <img src={URL.createObjectURL(image)} alt={image.name} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs -mt-1 -mr-1 hover:bg-red-700 focus:outline-none"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              ชื่อชุด
            </label>
            <input type="text" id="name" name="name" value={newProduct.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div>
            <label htmlFor="brand" className="block text-gray-700 text-sm font-bold mb-2">
              แบรนด์
            </label>
            <input type="text" id="brand" name="brand" value={newProduct.brand} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div>
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
              ราคา
            </label>
            <input type="number" id="price" name="price" value={newProduct.price || ''} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ขนาด
            </label>
            {newProduct.sizes.map((size, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {availableSizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {newProduct.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddSize} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm">
              เพิ่มขนาด
            </button>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              สี
            </label>
            {newProduct.colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="shadow appearance-none border rounded w-10 h-8 cursor-pointer focus:outline-none focus:shadow-outline"
                />
                <span className="text-gray-700 text-sm">{color}</span>
                {newProduct.colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddColor} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm">
              เพิ่มสี
            </button>
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
              สถานะ
            </label>
            <select
              id="status"
              name="status"
              value={newProduct.status}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="ใหม่">ใหม่</option>
              <option value="ลดราคา">ลดราคา</option>
            </select>
          </div>
          <button type="submit" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            บันทึกชุดใหม่
          </button>
        </form>
      )}
    </div>
  );
};

export default AddNewProduct;