// // import React from 'react';
// import { useParams } from 'next/navigation'; // ใช้ hook เพื่อดึง params จาก URL
// import { Outfit } from '../../page'; // นำเข้า Interface Outfit ถ้าคุณใช้ Interface สำหรับข้อมูลสินค้า
// import Link from 'next/link'; // ใช้สำหรับสร้างลิงค์กลับไปหน้าหลัก

// interface ProductDetailPageProps {
//     params: { // ระบุประเภทของ params ที่จะรับจาก URL
//       id: string; // id ของสินค้า
//     };
// }

// const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
//   // ดึงค่า id จาก params ที่ได้จาก URL
//   const { id } = params;

//   // **จำลองการดึงข้อมูลสินค้า (แทนที่ด้วย Logic การดึงข้อมูลจริงของคุณ)**
//   // ในที่นี้ เราจะใช้ Array outfits ที่เราเคยสร้างไว้ในหน้าหลัก
//   const outfits: Outfit[] = [
//     { id: "1", image: "https://via.placeholder.com/400x300/FF0000", name: "ชุดสบายๆ วันหยุด", brand: "แบรนด์ X", price: 990, sizes: ["S", "M"], status: "ใหม่", colors: ["ดำ", "เทา"], description: "ชุดลำลองใส่สบายสำหรับวันพักผ่อนของคุณ ทำจากผ้าฝ้าย 100% เนื้อนุ่ม" },
//     { id: "2", image: "https://via.placeholder.com/400x300/00FF00", name: "ชุดทำงานสุดหรู", brand: "แบรนด์ Y", price: 1590, sizes: ["M", "L"], status: "ลดราคา", colors: ["ขาว"], description: "ชุดทำงานดีไซน์เรียบหรู เหมาะสำหรับทุกโอกาสสำคัญ ตัดเย็บจากผ้าไหมอิตาลีคุณภาพสูง" },
//     { id: "3", image: "https://via.placeholder.com/400x300/0000FF", name: "ชุดปาร์ตี้", brand: "แบรนด์ Z", price: 1250, sizes: ["S", "L"], colors: ["แดง", "ทอง"], description: "ชุดออกงานสุดแซ่บที่จะทำให้คุณโดดเด่นในทุกปาร์ตี้ ประดับด้วยเลื่อมสวยงาม" },
//     // ... สินค้าอื่นๆ ของคุณ
//   ];

//   // ค้นหาสินค้าที่มี id ตรงกับที่เราดึงมา
//   const outfit = outfits.find((item) => item.id === id);

//   // ถ้าไม่พบสินค้าที่ตรงกับ id ที่ดึงมา จะแสดงข้อความ "ไม่พบสินค้า"
//   if (!outfit) {
//     return (
//       <div className="container mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h1>
//         <p>ไม่พบรายละเอียดของสินค้า ID: {id}</p>
//         <Link href="/">กลับไปหน้าหลัก</Link> {/* ลิงค์กลับไปหน้าหลัก */}
//       </div>
//     );
//   }

//   // ถ้าพบสินค้า จะแสดงข้อมูลรายละเอียดของสินค้า
//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">{outfit.name}</h1> {/* ชื่อสินค้า */}
      
//       {/* การจัด layout ให้แสดงเป็นรูปภาพและรายละเอียดข้างๆ */}
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="md:w-1/2">
//           <img src={outfit.image} alt={outfit.name} className="w-full rounded-md shadow-md" /> {/* รูปภาพสินค้า */}
//           {/* คุณสามารถเพิ่มรูปภาพเพิ่มเติมได้ที่นี่ */}
//         </div>
//         <div className="md:w-1/2">
//           <p className="text-gray-500 mb-2">{outfit.brand}</p> {/* แบรนด์สินค้า */}
//           <p className="text-indigo-600 font-semibold text-lg mb-4">฿ {outfit.price}</p> {/* ราคา */}
          
//           {/* ถ้ามีคำอธิบายสินค้า จะแสดงคำอธิบาย */}
//           {outfit.description && <p className="text-gray-700 mb-4">{outfit.description}</p>}

//           {/* ถ้ามีขนาดที่สามารถเลือกได้ */}
//           // การกำหนด type สำหรับ parameter size และ color เพื่อหลีกเลี่ยงการใช้ 'any'
// {outfit.sizes && outfit.sizes.length > 0 && (
//   <div className="mb-4">
//     <label htmlFor="size" className="block text-sm font-bold text-gray-700 mb-1">ขนาด:</label>
//     <select id="size" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
//       <option value="">เลือกขนาด</option>
//       {/* เพิ่มการกำหนด type ให้กับ size ใน map() */}
//       {outfit.sizes.map((size: string) => ( // กำหนดให้ size เป็น string
//         <option key={size} value={size}>{size}</option>
//       ))}
//     </select>
//   </div>
// )}

// {outfit.colors && outfit.colors.length > 0 && (
//   <div className="mb-4">
//     <label htmlFor="color" className="block text-sm font-bold text-gray-700 mb-1">สี:</label>
//     <select id="color" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
//       <option value="">เลือกสี</option>
//       {/* เพิ่มการกำหนด type ให้กับ color ใน map() */}
//       {outfit.colors.map((color: string) => ( // กำหนดให้ color เป็น string
//         <option key={color} value={color}>{color}</option>
//       ))}
//     </select>
//   </div>
// )}

          
//           {/* ปุ่มเพิ่มสินค้าลงตะกร้า */}
//           <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
//             เพิ่มลงตะกร้า
//           </button>
//         </div>
//       </div>

//       {/* ลิงค์กลับไปหน้าหลัก */}
//       <div className="mt-6">
//         <Link href="/" className="text-blue-500 hover:underline">กลับไปหน้าหลัก</Link>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;
