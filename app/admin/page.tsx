"use client";

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- ประเภทข้อมูลและสถานะ ---
type RentalStatus =
  | "ทั้งหมด" // This is for filtering only, not a real status
  | "รอการยืนยัน"
  | "เตรียมจัดส่ง"
  | "กำลังจัดส่ง"
  | "ระหว่างการเช่า"
  | "รอการคืน"
  | "คืนแล้ว"
  | "ยกเลิก";

// Define actual statuses that a rental can have
type ActualRentalStatus = Exclude<RentalStatus, "ทั้งหมด">;

interface RentalItem {
    outfitId: string; // ID ของชุด
    outfitName: string; // ชื่อชุด
    // อาจมีรายละเอียดอื่นๆ เช่น size, color
}


interface Rental {
  id: string; // หมายเลขการเช่า
  customerName: string;
  customerId?: string; // Optional: ID ลูกค้าสำหรับลิงก์โปรไฟล์
  rentalRequestDate: string; // วันที่ทำรายการ
  pickupDate: string;       // วันที่รับชุด
  returnDate: string;       // วันที่คืนชุด
  items: RentalItem[];      // รายการชุดที่เช่า
  status: ActualRentalStatus; // สถานะจริง
  trackingNumber?: string; // Optional: เลขพัสดุ
  // เพิ่ม field อื่นๆ
}

interface AdminUser {
  name: string;
}

// --- รายการสถานะสำหรับสร้าง Filter Bar (รวม "ทั้งหมด") ---
const filterStatuses: RentalStatus[] = [
  "ทั้งหมด",
  "รอการยืนยัน",
  "เตรียมจัดส่ง",
  "กำลังจัดส่ง",
  "ระหว่างการเช่า",
  "รอการคืน",
  "คืนแล้ว",
  "ยกเลิก",
];

// --- Mapping สีสำหรับสถานะต่างๆ ---
const statusColors: Record<ActualRentalStatus, string> = {
  "รอการยืนยัน": "bg-yellow-100 text-yellow-800",
  "เตรียมจัดส่ง": "bg-blue-100 text-blue-800",
  "กำลังจัดส่ง": "bg-cyan-100 text-cyan-800",
  "ระหว่างการเช่า": "bg-purple-100 text-purple-800",
  "รอการคืน": "bg-orange-100 text-orange-800", // ใช้สีส้มสำหรับรอคืน
  "คืนแล้ว": "bg-green-100 text-green-800",
  "ยกเลิก": "bg-red-100 text-red-800",
};


// --- ข้อมูลจำลอง (ปรับแก้ให้มี items array) ---
const mockRentals: Rental[] = [
  { id: "RNT001", customerName: "สมชาย ใจดี", rentalRequestDate: "2025-04-28", pickupDate: "2025-05-05", returnDate: "2025-05-08", items: [{outfitId: "D001", outfitName: "ชุดราตรีสีน้ำเงิน"}], status: "รอการยืนยัน" },
  { id: "RNT002", customerName: "สมหญิง จริงใจ", rentalRequestDate: "2025-04-25", pickupDate: "2025-05-01", returnDate: "2025-05-03", items: [{outfitId: "S001", outfitName: "ชุดสูททางการ"}], status: "คืนแล้ว" },
  { id: "RNT003", customerName: "อาทิตย์ สุขสันต์", rentalRequestDate: "2025-05-01", pickupDate: "2025-05-10", returnDate: "2025-05-15", items: [{outfitId: "T001", outfitName: "ชุดไทยประยุกต์"}, {outfitId: "A001", outfitName:"สร้อยคอมุก"}], status: "เตรียมจัดส่ง" },
  { id: "RNT004", customerName: "จันทรา งามตา", rentalRequestDate: "2025-04-20", pickupDate: "2025-04-28", returnDate: "2025-05-02", items: [{outfitId: "D002", outfitName: "ชุดเดรสลายดอก"}], status: "ระหว่างการเช่า" },
  { id: "RNT005", customerName: "สมชาย ใจดี", rentalRequestDate: "2025-05-05", pickupDate: "2025-05-12", returnDate: "2025-05-14", items: [{outfitId: "S001", outfitName: "ชุดสูททางการ"}], status: "รอการยืนยัน" },
  { id: "RNT006", customerName: "อังคาร แจ่มใส", rentalRequestDate: "2025-04-15", pickupDate: "2025-04-20", returnDate: "2025-04-25", items: [{outfitId: "D003", outfitName: "ชุดราตรีสีแดง"}], status: "รอการคืน" },
  { id: "RNT007", customerName: "ศุกร์สิริ โชคดี", rentalRequestDate: "2025-04-29", pickupDate: "2025-05-01", returnDate: "2025-05-04", items: [{outfitId: "D004", outfitName: "ชุดเดรสสั้น"}], status: "ยกเลิก" },
  { id: "RNT008", customerName: "สมหญิง จริงใจ", rentalRequestDate: "2025-05-02", pickupDate: "2025-05-09", returnDate: "2025-05-11", items: [{outfitId: "T001", outfitName: "ชุดไทยประยุกต์"}], status: "กำลังจัดส่ง", trackingNumber: "TH123456789" },
];

const mockUser: AdminUser = {
  name: "Admin",
};
// --- สิ้นสุดข้อมูลจำลอง ---

export default function AdminRentalPage() {
  // const router = useRouter();
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<RentalStatus>("ทั้งหมด");
  const [loggedInUser, setLoggedInUser] = useState<AdminUser>(mockUser);

  // --- Logic การกรองและค้นหา ---
  const filteredRentals = useMemo(() => {
    return rentals.filter(rental => {
      const statusMatch = activeStatusFilter === "ทั้งหมด" || rental.status === activeStatusFilter;
      const searchMatch = !searchTerm ||
        rental.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.items.some(item => item.outfitName.toLowerCase().includes(searchTerm.toLowerCase())); // ค้นหาชื่อชุดใน items

      return statusMatch && searchMatch;
    });
  }, [rentals, searchTerm, activeStatusFilter]);

  // --- Event Handlers ---
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = (status: RentalStatus) => {
    setActiveStatusFilter(status);
  };

  const router = useRouter();

  const handleLogout = () => {
    console.log("Logout clicked");
    router.push('/login');

    
  };
  

  // --- ฟังก์ชัน อัปเดตสถานะการเช่า (สำคัญ: ใช้ useCallback เพื่อประสิทธิภาพ) ---
  const updateRentalStatus = useCallback((rentalId: string, newStatus: ActualRentalStatus, extraData?: Partial<Rental>) => {
    setRentals(prevRentals =>
      prevRentals.map(rental =>
        rental.id === rentalId
          ? { ...rental, status: newStatus, ...extraData } // อัปเดตสถานะและข้อมูลเพิ่มเติม (ถ้ามี)
          : rental
      )
    );
     // --- ในแอปจริง: เรียก API เพื่ออัปเดตข้อมูลในฐานข้อมูล ---
     console.log(`API Call: Update rental ${rentalId} to status ${newStatus} with data:`, extraData);
     // try {
     //   await fetch(`/api/rentals/${rentalId}/status`, {
     //     method: 'PUT',
     //     headers: { 'Content-Type': 'application/json' },
     //     body: JSON.stringify({ status: newStatus, ...extraData }),
     //   });
     // } catch (error) {
     //   console.error("Failed to update rental status:", error);
     //   // อาจจะต้อง revert state กลับถ้า API ล้มเหลว
     // }
  }, []); // Dependency array ว่างเปล่า เพราะมันไม่ได้ขึ้นกับ state ภายนอกโดยตรง (ใช้ prevRentals)


  // --- Action Handlers (Placeholder) ---
  const handleViewDetails = (rentalId: string) => {
      alert(`(ตัวอย่าง) ดูรายละเอียดการเช่า ID: ${rentalId}`);
      // router.push(`/admin/rentals/${rentalId}`);
  };

  const handleConfirmRental = (rentalId: string) => {
       if (window.confirm(`ยืนยันการเช่าสำหรับ ID: ${rentalId} หรือไม่? สถานะจะเปลี่ยนเป็น "เตรียมจัดส่ง"`)) {
            updateRentalStatus(rentalId, "เตรียมจัดส่ง");
            alert(`(ตัวอย่าง) ยืนยันการเช่า ID: ${rentalId} สำเร็จ`);
       }
  };

  const handleMarkShipped = (rentalId: string) => {
      // อาจมี prompt ให้ใส่ tracking number
      const tracking = prompt(`กรอกหมายเลขพัสดุสำหรับการเช่า ID: ${rentalId} (ถ้ามี):`);
      if (tracking !== null) { // Check if user pressed Cancel
            updateRentalStatus(rentalId, "กำลังจัดส่ง", { trackingNumber: tracking || undefined });
            alert(`(ตัวอย่าง) แจ้งจัดส่ง ID: ${rentalId} ${tracking ? ' Tracking: ' + tracking : ''} สำเร็จ`);
      }
  };

  const handleConfirmReturn = (rentalId: string) => {
      if (window.confirm(`ยืนยันการรับคืนสำหรับ ID: ${rentalId} หรือไม่? สถานะจะเปลี่ยนเป็น "คืนแล้ว"`)) {
           updateRentalStatus(rentalId, "คืนแล้ว");
           alert(`(ตัวอย่าง) ยืนยันการรับคืน ID: ${rentalId} สำเร็จ`);
      }
  };

   const handleEditRental = (rentalId: string) => {
       alert(`(ตัวอย่าง) แก้ไขการเช่า ID: ${rentalId}`);
       // router.push(`/admin/rentals/edit/${rentalId}`);
   };

   const handleCancelRental = (rentalId: string) => {
       if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการเช่า ID: ${rentalId}?`)) {
           // อาจมี prompt ให้ใส่เหตุผล
           updateRentalStatus(rentalId, "ยกเลิก");
            alert(`(ตัวอย่าง) ยกเลิกการเช่า ID: ${rentalId} สำเร็จ`);
       }
   };

  // --- Helper function to render items ---
  const renderRentalItems = (items: RentalItem[]) => {
      if (!items || items.length === 0) return '-';
      const displayItems = items.slice(0, 1); // แสดงแค่ 1-2 รายการแรกพอ
      let text = displayItems.map(item => item.outfitName).join(', ');
      if (items.length > displayItems.length) {
          text += `, ... (${items.length} รายการ)`;
      }
      return text;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* --- ส่วนหัว (Header) --- */}
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between gap-4"> {/* Added gap */}
          <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">จัดการการเช่าชุด</h1>
          <div className="flex-1 min-w-0"> {/* Allow search to shrink */}
            <input
              type="text"
              placeholder="ค้นหาด้วยหมายเลขเช่า, ชื่อลูกค้า, ชื่อชุด..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0"> {/* Prevent user info from shrinking too much */}
            <span className="text-gray-700 hidden md:block">{loggedInUser.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* --- แถบตัวกรองสถานะ (Status Filter Bar) --- */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-10"> {/* Adjust top value if header height changes */}
         <div className="container mx-auto px-4 py-2 flex space-x-1 overflow-x-auto">
          {filterStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleFilterClick(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-150 ${ // Adjusted padding
                activeStatusFilter === status
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* --- ส่วนแสดงเนื้อหารายการเช่า (Main Content Area) --- */}
      <main className="flex-1 container mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          รายการเช่า ({activeStatusFilter}) - พบ {filteredRentals.length} รายการ
        </h2>

        {/* --- ตารางแสดงรายการเช่า --- */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมายเลขเช่า</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อลูกค้า</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ทำรายการ</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่รับ</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่คืน</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายการชุด</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    <Link href={`/admin/rentals/${rental.id}`} className="text-indigo-600 hover:text-indigo-800">
                      {rental.id}
                    </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{rental.customerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rental.rentalRequestDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rental.pickupDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rental.returnDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{renderRentalItems(rental.items)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[rental.status] || 'bg-gray-100 text-gray-800'}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                        {/* ปุ่มจะแสดงตามเงื่อนไขของสถานะ */}
                        <button onClick={() => handleViewDetails(rental.id)} className="text-gray-600 hover:text-gray-900" title="ดูรายละเอียด">🔍</button>

                        {rental.status === "รอการยืนยัน" && (
                            <button onClick={() => handleConfirmRental(rental.id)} className="text-green-600 hover:text-green-900" title="ยืนยันการเช่า">✔️</button>
                        )}

                        {rental.status === "เตรียมจัดส่ง" && (
                            <button onClick={() => handleMarkShipped(rental.id)} className="text-blue-600 hover:text-blue-900" title="แจ้งจัดส่ง">🚚</button>
                        )}

                        {(rental.status === "ระหว่างการเช่า" || rental.status === "รอการคืน" || rental.status === "กำลังจัดส่ง") && (
                             <button onClick={() => handleConfirmReturn(rental.id)} className="text-teal-600 hover:text-teal-900" title="ยืนยันการคืน">📦</button>
                        )}

                        {/* ปุ่มแก้ไข อาจแสดงในบางสถานะ */}
                        {(rental.status === "รอการยืนยัน" || rental.status === "เตรียมจัดส่ง") && (
                            <button onClick={() => handleEditRental(rental.id)} className="text-indigo-600 hover:text-indigo-900" title="แก้ไข">✏️</button>
                        )}

                        {/* ปุ่มยกเลิก อาจแสดงในบางสถานะ */}
                         {(rental.status === "รอการยืนยัน" || rental.status === "เตรียมจัดส่ง") && (
                              <button onClick={() => handleCancelRental(rental.id)} className="text-red-600 hover:text-red-900" title="ยกเลิก">❌</button>
                         )}
                    </td>
                  </tr>
                ))
              ) : (
                // กรณีไม่พบข้อมูล
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                    ไม่พบรายการเช่าที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
         {/* --- (Optional) Pagination --- */}
         {/* หากมีข้อมูลเยอะ ควรเพิ่มระบบ Pagination ตรงนี้ */}
         <Link href="/">
                <button className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                    กลับไปหน้าหลัก
                </button>
            </Link>
      </main>
    </div>
  );
}