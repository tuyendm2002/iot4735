'use client';
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../lib/firebase";

import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

// const GoogleMap = dynamic(() => import("@/components/GoogleMap"), { ssr: false });


export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = ref(database);
      try {
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

  return (
    <div className="justify-center text-center p-4">
      <h1 className="text-5xl font-extrabold">Hệ thống theo dõi và cảnh báo sạt lở đất</h1>
      <h2 className="text-xl font-medium">Học phần: Hệ thống IoT - Mã học phần: IT4735</h2>
      <h3 className="font-bold">Vũ Duy Khanh - Hà Mạnh Tuấn - Giang Quốc Hoàn - Đào Mạnh Tuyên</h3>
      <Separator className="my-4" />

      {/* Phần theo dõi thông tin trạm */}
      <div className="mb-8">
        <h4 className="text-2xl font-bold">Thông tin trạm theo dõi</h4>
        
      </div>

      {/* Phần Google Maps */}
      <div className="mb-8">
        <h4 className="text-2xl font-bold">Vị trí trạm trên bản đồ</h4>
        
      </div>

      {/* Phần cảnh báo thông tin quan trọng */}
      <div className="mb-8">
        <h4 className="text-2xl font-bold">Cảnh báo</h4>
        
      </div>

      {/* Phần đồ thị nhiệt độ và độ ẩm */}
      <div className="mb-8">
        <h4 className="text-2xl font-bold">Đồ thị nhiệt độ và độ ẩm</h4>
        
      </div>
    </div>
  );
}