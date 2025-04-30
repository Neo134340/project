// app/admin/add-product/page.tsx
"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
}

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editId ? { id: editId, name, description, price } : product
        )
      );
      setEditId(null);
    } else {
      const newProduct = {
        id: Date.now(),
        name,
        description,
        price,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setName("");
    setDescription("");
    setPrice("");
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setEditId(product.id);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <div className="flex">
      <main className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">
          {editId !== null ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1">ชื่อสินค้า</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">รายละเอียด</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-1">ราคา (บาท)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId !== null ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
          </button>
        </form>

        {products.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">รายการสินค้า</h2>
            <ul className="space-y-2">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-sm">ราคา: {product.price} บาท</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}