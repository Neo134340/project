"use client";

import React from "react";
import Link from "next/link";
import { FaInstagram, FaLine, FaTiktok } from "react-icons/fa";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

const AboutUsPage: React.FC = () => {
  const shopName = "ร้านเช่าชุดเกาหลี By Kim";
  const description =
    "ร้านเช่าชุดฮันบกและชุดสไตล์เกาหลีหลากหลายรูปแบบ คุณภาพพรีเมียม ราคาเป็นกันเอง พร้อมให้คำแนะนำเพื่อให้คุณสวยสง่าในทุกโอกาส";

  const instagramUrl = "https://www.instagram.com/manchesterunited/";
  const lineId = "@koreadressrental";
  const tiktokUrl = "https://www.tiktok.com/@manutd";

  const testimonials = [
    { name: "A", quote: "ชุดสวยมากค่ะ บริการดี ประทับใจสุดๆ!" },
    { name: "B", quote: "มีชุดให้เลือกเยอะมาก ราคาไม่แพง แนะนำเลยค่ะ" },
  ];

  const address =
    "123/45 ถนน [ชื่อถนน] แขวง/ตำบล [แขวง/ตำบล] เขต/อำเภอ [เขต/อำเภอ] กรุงเทพมหานคร 10xxx";
  const phoneNumber = "081-xxx-xxxx";
  const email = "info@koreadressrental.com";
  const operatingHours =
    "จันทร์ - ศุกร์: 10:00 - 19:00 น. เสาร์ - อาทิตย์: 11:00 - 18:00 น.";

  return (
    <main className="flex justify-center items-center min-h-screen bg-pink-50 px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-extrabold text-pink-600 mb-2">เกี่ยวกับเรา</h1>
          <h2 className="text-xl font-semibold text-gray-800">{shopName}</h2>
          <p className="text-gray-600 mt-2">{description}</p>
        </section>

        {testimonials.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              คำนิยมจากลูกค้า
            </h3>
            <div className="space-y-2">
              {testimonials.map((t, i) => (
                <blockquote
                  key={i}
                  className="border-l-4 border-pink-400 pl-4 italic text-gray-600"
                >
                  "{t.quote}" — {t.name}
                </blockquote>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            ติดตามเราได้ที่
          </h3>
          <div className="flex justify-center gap-6">
            {instagramUrl && (
              <Link
                href={instagramUrl}
                target="_blank"
                className="text-pink-500 hover:text-pink-700"
              >
                <FaInstagram size={32} />
              </Link>
            )}
            {lineId && (
              <Link
                href={`https://line.me/ti/p/${lineId}`}
                target="_blank"
                className="text-green-500 hover:text-green-700"
              >
                <FaLine size={32} />
              </Link>
            )}
            {tiktokUrl && (
              <Link
                href={tiktokUrl}
                target="_blank"
                className="text-black hover:text-gray-800"
              >
                <FaTiktok size={32} />
              </Link>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">ติดต่อเรา</h3>
          <div className="space-y-2 text-gray-600">
            {address && (
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-pink-500" />
                {address}
              </div>
            )}
            {phoneNumber && (
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-pink-500" />
                {phoneNumber}
              </div>
            )}
            {email && (
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-pink-500" />
                {email}
              </div>
            )}
            {operatingHours && (
              <p>
                <span className="font-semibold">เวลาทำการ:</span> {operatingHours}
              </p>
            )}
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block text-sm font-medium text-blue-500 hover:text-blue-700"
          >
            ⬅ กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AboutUsPage;
