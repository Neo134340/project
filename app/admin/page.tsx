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
  "เตรียมจัดส่ง": "bg-blue-100 text-blue-800",
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
// --- สิ้นสุดข้อมูลจำลอง ---

// --- Utility Functions ---
const getStatusColorClass = (status: ActualRentalStatus): string => statusColors[status] || 'bg-gray-100 text-gray-800';
const renderRentalItemsShort = (items: RentalItem[]): string => {
  if (!items || items.length === 0) return '-';
  const displayItems = items.slice(0, 1);
  const text = displayItems.map(item => item.outfitName).join(', ');
  return items.length > displayItems.length ? `<span class="math-inline">\{text\}, \.\.\. \(</span>{items.length} รายการ)` : text;
};

// --- Sub Components ---
const AdminHeader = ({ loggedInUser, onLogout }: { loggedInUser: AdminUser; onLogout: () => void }) => (
  <header className="bg-white shadow-md p-4 sticky top-0 z-10">
    <div className="container mx-auto flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">จัดการการเช่าชุด</h1>
      <div className="flex-1 min-w-0">
        <input type="text" placeholder="ค้นหาด้วยหมายเลขเช่า, ชื่อลูกค้า, ชื่อชุด..." className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="flex items-center space-x-4 flex-shrink-0">
        <span className="text-gray-700 hidden md:block">{loggedInUser.name}</span>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow">ออกจากระบบ</button>
      </div>
    </div>
  </header>
);

const StatusFilterBar = ({ statuses, activeStatus, onFilterClick }: { statuses: RentalStatus[]; activeStatus: RentalStatus; onFilterClick: (status: RentalStatus) => void }) => (
  <div className="bg-white border-b border-gray-200 sticky top-[72px] z-10">
    <div className="container mx-auto px-4 py-2 flex space-x-1 overflow-x-auto">
      {statuses.map((status) => (
        <button key={status} onClick={() => onFilterClick(status)} className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-150 ${activeStatus === status ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
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
    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800">
      <Link href={`/admin/rentals/${rental.id}`} className="text-indigo-600 hover:text-indigo-800">{rental.id}</Link>
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
        <button onClick={() => onConfirmPreparing(rental.id)} className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded text-xs">เตรียมชุด</button>
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
      {(rental.status === "รอการยืนยัน" || rental.status === "เตรียมจัดส่ง" || rental.status === "กำลังจัดส่ง" || rental.status === "รอการคืน") && (
        <button onClick={() => onCancelRental(rental.id)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-xs">ยกเลิก</button>
      )}
      <Link href={`/admin/rentals/${rental.id}`} className="text-gray-600 hover:text-gray-900">
        ดูรายละเอียด
      </Link>
    </td>
  </tr>
);

export default function AdminRentalPage() {
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<RentalStatus>("ทั้งหมด");
  const [loggedInUser, setLoggedInUser] = useState<AdminUser>(mockUser);
  const router = useRouter();

  const filteredRentals = useMemo(() => {
    return rentals.filter(rental => {
      const statusMatch = activeStatusFilter === "ทั้งหมด" || rental.status === activeStatusFilter;
      const searchMatch = !searchTerm ||
        rental.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.items.some(item => item.outfitName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        rental.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [rentals, searchTerm, activeStatusFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = (status: RentalStatus) => {
    setActiveStatusFilter(status);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    router.push('/login');
  };

  const updateRentalStatus = useCallback((rentalId: string, newStatus: ActualRentalStatus, extraData?: Partial<Rental>) => {
    setRentals(prevRentals =>
      prevRentals.map(rental =>
        rental.id === rentalId
          ? { ...rental, status: newStatus, ...extraData }
          : rental
      )
    );
    console.log(`API Call: Update rental ${rentalId} to status ${newStatus} with data:`, extraData);
  }, []);

  const handleConfirmPreparing = (rentalId: string) => {
    updateRentalStatus(rentalId, "เตรียมจัดส่ง");
  };

  const handleConfirmShipped = (rentalId: string, trackingNumber?: string) => {
    updateRentalStatus(rentalId, "กำลังจัดส่ง", { trackingNumber });
  };

  const handleConfirmReturnRequested = (rentalId: string) => {
    updateRentalStatus(rentalId, "รอการคืน");
  };

  const handleConfirmReturned = (rentalId: string) => {
    updateRentalStatus(rentalId, "คืนแล้ว");
  };

  const handleCancelRental = (rentalId: string) => {
    updateRentalStatus(rentalId, "ยกเลิก");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader loggedInUser={loggedInUser} onLogout={handleLogout} />
      <StatusFilterBar statuses={filterStatuses} activeStatus={activeStatusFilter} onFilterClick={handleFilterClick} />
      <main className="flex-1 container mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">รายการเช่า ({activeStatusFilter}) - พบ {filteredRentals.length} รายการ</h2>
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
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ที่อยู่จัดส่ง</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
                  <RentalTableRow
                    key={rental.id}
                    rental={rental}
                    onConfirmPreparing={handleConfirmPreparing}
                    onConfirmShipped={handleConfirmShipped}
                    onConfirmReturnRequested={handleConfirmReturnRequested}
                    onConfirmReturned={handleConfirmReturned}
                    onCancelRental={handleCancelRental}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-sm text-gray-500">
                    ไม่พบรายการเช่าที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between">
          <Link href="/">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
              กลับไปหน้าหลัก
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}