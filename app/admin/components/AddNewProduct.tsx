// app/admin/components/AddNewProduct.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiPlus, FiMinus } from 'react-icons/fi';

export interface NewProduct {
  id?: string; // เพิ่ม id เพื่อระบุสินค้าแต่ละรายการ
  images: File[];
  name: string;
  brand: string;
  price: number | null;
  sizes: string[];
  colors: string[];
  status?: "ใหม่" | "ลดราคา";
}

interface AddNewProductProps {
  onProductAdded: (newProduct: Omit<NewProduct, 'id'>) => void; // เมื่อเพิ่มสินค้าใหม่ จะไม่มี id
  onProductUpdated?: (updatedProduct: NewProduct) => void; // ฟังก์ชันสำหรับอัปเดตสินค้า
  existingProduct?: NewProduct; // ข้อมูลสินค้าที่มีอยู่สำหรับการแก้ไข
}

const availableSizes = ["XS", "S", "M", "L", "XL"];

const AddNewProduct: React.FC<AddNewProductProps> = ({ onProductAdded, onProductUpdated, existingProduct }) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    id: existingProduct?.id, // กำหนด id หากมีการส่ง existingProduct เข้ามา
    images: existingProduct?.images ? [] : [], // รีเซ็ต images เมื่อแก้ไข (ผู้ใช้ต้องเลือกใหม่)
    name: existingProduct?.name || '',
    brand: existingProduct?.brand || '',
    price: existingProduct?.price || null,
    sizes: existingProduct?.sizes || ['S'],
    colors: existingProduct?.colors || ['#000000'],
    status: existingProduct?.status || 'ใหม่',
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setNewProduct({
        id: existingProduct.id,
        images: [], // รีเซ็ต images เมื่อแก้ไข
        name: existingProduct.name,
        brand: existingProduct.brand,
        price: existingProduct.price,
        sizes: existingProduct.sizes,
        colors: existingProduct.colors,
        status: existingProduct.status,
      });
      setIsFormVisible(true); // แสดงฟอร์มเมื่ออยู่ในโหมดแก้ไข
    } else {
      setNewProduct({ images: [], name: '', brand: '', price: null, sizes: ['S'], colors: ['#000000'], status: 'ใหม่' });
      setIsFormVisible(false); // ซ่อนฟอร์มเมื่อไม่ใช่โหมดแก้ไข
    }
  }, [existingProduct]);

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

  const handleRemoveImage = (indexToRemove: number) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
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
    console.log('ข้อมูลที่ส่ง:', newProduct);
    if (existingProduct?.id) {
      onProductUpdated?.(newProduct); // ส่งข้อมูลที่อัปเดตพร้อม id
    } else {
      onProductAdded({ ...newProduct, id: undefined }); // ส่งข้อมูลใหม่ (ไม่รวม id)
    }
    setNewProduct({ images: [], name: '', brand: '', price: null, sizes: ['S'], colors: ['#000000'], status: 'ใหม่' });
    setIsFormVisible(false);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="p-6 rounded-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{existingProduct ? 'แก้ไขชุดสินค้า' : 'เพิ่มชุดใหม่'}</h2>
        <button
          type="button"
          onClick={toggleFormVisibility}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-500 hover:text-gray-700"
        >
          {isFormVisible ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                รูปภาพชุด
              </label>
              <input type="file" id="images" multiple onChange={handleImageChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black" />
              {newProduct.images.length > 0 && (
                <div className="mt-2 flex overflow-x-auto space-x-2">
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden">
                      <img src={URL.createObjectURL(image)} alt={image.name} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs -mt-1 -mr-1 hover:bg-red-700 focus:outline-none"
                      >
                        <FiMinus size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อชุด
              </label>
              <input type="text" id="name" name="name" value={newProduct.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black" />
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                แบรนด์
              </label>
              <input type="text" id="brand" name="brand" value={newProduct.brand} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                ราคา
              </label>
              <input type="number" id="price" name="price" value={newProduct.price || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ขนาด</label>
            {newProduct.sizes.map((size, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
                >
                  {availableSizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {newProduct.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
                  >
                    <FiMinus size={12} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddSize} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-sm">
              <FiPlus size={12} /> เพิ่มขนาด
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">สี</label>
            <div className="flex items-center space-x-2">
              {newProduct.colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer w-10 h-8"
                  />
                  {newProduct.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
                    >
                      <FiMinus size={12} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddColor} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-sm">
                <FiPlus size={12} /> เพิ่มสี
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              สถานะ
            </label>
            <select
              id="status"
              name="status"
              value={newProduct.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
            >
              <option value="ใหม่">ใหม่</option>
              <option value="ลดราคา">ลดราคา</option>
            </select>
          </div>

          <button type="submit" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {existingProduct ? 'บันทึกการแก้ไข' : 'บันทึกชุดใหม่'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddNewProduct;