"use client";

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- ประเภทข้อมูลและสถานะ ---
type RentalStatus = "ทั้งหมด" | "รอการยืนยัน" | "เตรียมจัดส่ง" | "กำลังจัดส่ง" | "ระหว่างการเช่า" | "รอการคืน" | "คืนแล้ว" | "ยกเลิก";
type ActualRentalStatus = Exclude<RentalStatus, "ทั้งหมด">;

interface RentalItem { outfitId: string; outfitName: string; }
interface Rental {
  id: string;
  customerName: string;
  customerId?: string;
  rentalRequestDate: string;
  pickupDate: string;
  returnDate: string;
  items: RentalItem[];
  status: ActualRentalStatus;
  trackingNumber?: string;
  shippingAddress: string;
}
interface AdminUser { name: string; }

// --- ข้อมูลจำลอง ---
const filterStatuses: RentalStatus[] = ["ทั้งหมด", "รอการยืนยัน", "เตรียมจัดส่ง", "กำลังจัดส่ง", "ระหว่างการเช่า", "รอการคืน", "คืนแล้ว", "ยกเลิก"];
const statusColors: Record<ActualRentalStatus, string> = {
  "รอการยืนยัน": "bg-yellow-100 text-yellow-800",
  "เตรียมจัดส่ง": "bg-pink-100 text-pink-800",
  "กำลังจัดส่ง": "bg-cyan-100 text-cyan-800",
  "ระหว่างการเช่า": "bg-purple-100 text-purple-800",
  "รอการคืน": "bg-orange-100 text-orange-800",
  "คืนแล้ว": "bg-green-100 text-green-800",
  "ยกเลิก": "bg-red-100 text-red-800",
};
const mockRentals: Rental[] = [
  { id: "RNT002", customerName: "สมหญิง จริงใจ", rentalRequestDate: "2025-04-25", pickupDate: "2025-05-01", returnDate: "2025-05-03", items: [{ outfitId: "S001", outfitName: "ชุดสูททางการ" }], status: "คืนแล้ว", shippingAddress: "56/7 ซ.สุขุมวิท 77 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110" },
  { id: "RNT003", customerName: "อาทิตย์ สุขสันต์", rentalRequestDate: "2025-05-01", pickupDate: "2025-05-10", returnDate: "2025-05-15", items: [{ outfitId: "T001", outfitName: "ชุดไทยประยุกต์" }, { outfitId: "A001", outfitName: "สร้อยคอมุก" }], status: "เตรียมจัดส่ง", shippingAddress: "99/10 ถ.ลาดพร้าว จตุจักร กรุงเทพมหานคร 10900" },
  { id: "RNT004", customerName: "จันทรา งามตา", rentalRequestDate: "2025-04-20", pickupDate: "2025-04-28", returnDate: "2025-05-02", items: [{ outfitId: "D002", outfitName: "ชุดเดรสลายดอก" }], status: "ระหว่างการเช่า", shippingAddress: "789/12 ถ.สาทรเหนือ เขตบางรัก กรุงเทพมหานคร 10500" },
  { id: "RNT005", customerName: "สมชาย ใจดี", rentalRequestDate: "2025-05-05", pickupDate: "2025-05-12", returnDate: "2025-05-14", items: [{ outfitId: "S001", outfitName: "ชุดสูททางการ" }], status: "รอการยืนยัน", shippingAddress: "111/22 หมู่ 3 ต.สำโรงเหนือ อ.เมือง จ.สมุทรปราการ 10270" },
  { id: "RNT006", customerName: "อังคาร แจ่มใส", rentalRequestDate: "2025-04-15", pickupDate: "2025-04-20", returnDate: "2025-04-25", items: [{ outfitId: "D003", outfitName: "ชุดราตรีสีแดง" }], status: "รอการคืน", shippingAddress: "222/33 ถ.พระราม 4 คลองเตย กรุงเทพมหานคร 10110" },
  { id: "RNT007", customerName: "ศุกร์สิริ โชคดี", rentalRequestDate: "2025-04-29", pickupDate: "2025-05-01", returnDate: "2025-05-04", items: [{ outfitId: "D004", outfitName: "ชุดเดรสสั้น" }], status: "ยกเลิก", shippingAddress: "333/44 ซ.อารีย์สัมพันธ์ พญาไท กรุงเทพมหานคร 10400" },
  { id: "RNT008", customerName: "สมหญิง จริงใจ", rentalRequestDate: "2025-05-02", pickupDate: "2025-05-09", returnDate: "2025-05-11", items: [{ outfitId: "T001", outfitName: "ชุดไทยประยุกต์" }], status: "กำลังจัดส่ง", trackingNumber: "TH123456789", shippingAddress: "444/55 ถ.วิภาวดีรังสิต จตุจักร กรุงเทพมหานคร 10900" },
];

const mockUser: AdminUser = { name: "Admin" };

// --- Utility Functions ---
const getStatusColorClass = (status: ActualRentalStatus): string => statusColors[status] || 'bg-gray-100 text-gray-800';
const renderRentalItemsShort = (items: RentalItem[]): string => {
  if (!items || items.length === 0) return '-';
  const displayItems = items.slice(0, 1);
  const text = displayItems.map(item => item.outfitName).join(', ');
  return items.length > displayItems.length ? `${text}, ... (${items.length} รายการ)` : text;
};

// --- Sub Components ---
const AdminHeader = ({ loggedInUser, onLogout }: { loggedInUser: AdminUser; onLogout: () => void }) => (
  <header className="bg-white shadow-md p-4 sticky top-0 z-10">
    <div className="container mx-auto flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-pink-600">จัดการการเช่าชุด</h1>
      <div className="flex-1 min-w-0">
        <input
          type="text"
          placeholder="ค้นหาด้วยหมายเลขเช่า, ชื่อลูกค้า, ชื่อชุด..."
          className="w-full px-4 py-2 border border-pink-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-black"
        />
      </div>
      <div className="flex items-center space-x-4 flex-shrink-0">
        <span className="text-pink-700">{loggedInUser.name}</span>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow">ออกจากระบบ</button>
      </div>
    </div>
  </header>
);

const StatusFilterBar = ({ statuses, activeStatus, onFilterClick }: { statuses: RentalStatus[]; activeStatus: RentalStatus; onFilterClick: (status: RentalStatus) => void }) => (
  <div className="bg-white border-b border-pink-200 sticky top-[72px] z-10">
    <div className="container mx-auto px-4 py-2 flex space-x-1 overflow-x-auto">
      {statuses.map((status) => (
        <button key={status} onClick={() => onFilterClick(status)} className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-150 ${activeStatus === status ? 'bg-pink-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          {status}
        </button>
      ))}
    </div>
  </div>
);

const RentalTableRow = ({
  rental,
  onConfirmPreparing,
  onConfirmShipped,
  onConfirmReturnRequested,
  onConfirmReturned,
  onCancelRental,
}: {
  rental: Rental;
  onConfirmPreparing: (id: string) => void;
  onConfirmShipped: (id: string, trackingNumber?: string) => void;
  onConfirmReturnRequested: (id: string) => void;
  onConfirmReturned: (id: string) => void;
  onCancelRental: (id: string) => void;
}) => (
  <tr key={rental.id} className="hover:bg-gray-50">
    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-pink-600 hover:text-pink-800">
      <Link href={`/admin/rentals/${rental.id}`} className="text-pink-600 hover:text-pink-800">{rental.id}</Link>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{rental.customerName}</td>
    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rental.rentalRequestDate}</td>
    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rental.pickupDate}</td>
    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rental.returnDate}</td>
    <td className="px-4 py-3 text-sm text-gray-600">{renderRentalItemsShort(rental.items)}</td>
    <td className="px-4 py-3 whitespace-nowrap">
      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(rental.status)}`}>{rental.status}</span>
    </td>
    <td className="px-4 py-3 whitespace-normal text-sm text-gray-500">{rental.shippingAddress}</td>
    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
      {rental.status === "รอการยืนยัน" && (
        <button onClick={() => onConfirmPreparing(rental.id)} className="bg-pink-500 hover:bg-pink-700 text-white py-1 px-2 rounded text-xs">เตรียมชุด</button>
      )}
      {rental.status === "เตรียมจัดส่ง" && (
        <button onClick={() => {
          const trackingNumber = prompt(`กรุณากรอกหมายเลขพัสดุสำหรับ ${rental.id}:`);
          onConfirmShipped(rental.id, trackingNumber || undefined);
        }} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs">แจ้งจัดส่ง</button>
      )}
      {rental.status === "กำลังจัดส่ง" && (
        <button onClick={() => onConfirmReturnRequested(rental.id)} className="bg-orange-500 hover:bg-orange-700 text-white py-1 px-2 rounded text-xs">รอคืน</button>
      )}
      {rental.status === "รอการคืน" && (
        <button onClick={() => onConfirmReturned(rental.id)} className="bg-teal-500 hover:bg-teal-700 text-white py-1 px-2 rounded text-xs">คืนแล้ว</button>
      )}
      {(rental.status === "รอการยืนยัน" || rental.status === "เตรียมจัดส่ง") && (
        <button onClick={() => onCancelRental(rental.id)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-xs">ยกเลิก</button>
      )}
    </td>
  </tr>
);

// --- Main Component ---
const AdminRentalPage = () => {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState<RentalStatus>("ทั้งหมด");
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [user, setUser] = useState<AdminUser>(mockUser);

  const filteredRentals = useMemo(() => {
    return activeStatus === "ทั้งหมด" ? rentals : rentals.filter(rental => rental.status === activeStatus);
  }, [activeStatus, rentals]);

  const handleFilterClick = useCallback((status: RentalStatus) => setActiveStatus(status), []);
  const handleLogout = () => {
    localStorage.removeItem('user'); // ลบข้อมูลผู้ใช้
    router.push('/admin/login');
  };
  const handleConfirmPreparing = (id: string) => alert(`Confirmed preparing for rental ${id}`);
  const handleConfirmShipped = (id: string, trackingNumber?: string) => alert(`Confirmed shipped for rental ${id} with tracking number: ${trackingNumber}`);
  const handleConfirmReturnRequested = (id: string) => alert(`Confirmed return requested for rental ${id}`);
  const handleConfirmReturned = (id: string) => alert(`Confirmed returned for rental ${id}`);
  const handleCancelRental = (id: string) => alert(`Cancelled rental ${id}`);

  return (
    <div className="min-h-screen bg-pink-50">
      <AdminHeader loggedInUser={user} onLogout={handleLogout} />
      <StatusFilterBar statuses={filterStatuses} activeStatus={activeStatus} onFilterClick={handleFilterClick} />
      <div className="container mx-auto py-6">
        <table className="min-w-full table-auto bg-white shadow-md rounded-md overflow-hidden">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">หมายเลขเช่า</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">ชื่อลูกค้า</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">วันที่ยืนยันการเช่า</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">วันที่รับ</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">วันที่คืน</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">รายการชุด</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">สถานะ</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">ที่อยู่จัดส่ง</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredRentals.map(rental => (
              <RentalTableRow
                key={rental.id}
                rental={rental}
                onConfirmPreparing={handleConfirmPreparing}
                onConfirmShipped={handleConfirmShipped}
                onConfirmReturnRequested={handleConfirmReturnRequested}
                onConfirmReturned={handleConfirmReturned}
                onCancelRental={handleCancelRental}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRentalPage;

