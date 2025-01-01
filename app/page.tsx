'use client';
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../lib/firebase";

import { Separator } from "@/components/ui/separator";

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
          setData({});
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data || Object.keys(data).length === 0) return <p>No data found</p>;

  // Lấy dữ liệu với giá trị mặc định
  const BT1 = data?.IOT?.BT1 || { A: "-", B: "-", F: "-", S: "-", V: "-" };
  const BT2 = data?.IOT?.BT2 || { A: "-", B: "-", F: "-", S: "-", V: "-" };
  const rainfall24h = data?.Station_1?.Test
    ? Object.fromEntries(
        Object.entries(data.Station_1.Test).filter(
          ([key]) => key.startsWith("T") && parseInt(key.slice(1)) <= 24
        )
      )
    : {};
  const rainfall7d = data?.Station_1?.Test
    ? Object.fromEntries(
        Object.entries(data.Station_1.Test).filter(
          ([key]) => key.startsWith("T") && parseInt(key.slice(1)) > 30
        )
      )
    : {};

  const renderRainfallChart = (data, title) => {
    return (
      <div>
        <h4 className="text-xl font-bold">{title}</h4>
        {Object.keys(data).length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          <ul className="list-disc pl-5">
            {Object.keys(data).map((key) => (
              <li key={key}>{`${key}: ${data[key]}`}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="justify-center text-center">
        <h1 className="text-5xl font-extrabold">Hệ thống theo dõi và cảnh báo sạt lở đất</h1>
        <h2 className="text-xl font-medium">Học phần: Hệ thống IoT - Mã học phần: IT4735</h2>
        <h3 className="font-bold">Vũ Duy Khanh - Hà Mạnh Tuấn - Giang Quốc Hoàn - Đào Mạnh Tuyên</h3>
      </div>
      
      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4">
        {/* Thông tin trạm IOT */}
        <div className="p-4 border rounded shadow">
          <h4 className="text-2xl font-bold">Thông tin trạm IOT</h4>
          <p>
            <strong>BT1:</strong> A: {BT1.A}, B: {BT1.B}, F: {BT1.F}, S:{" "}
            {BT1.S}, V: {BT1.V}
          </p>
          <p>
            <strong>BT2:</strong> A: {BT2.A}, B: {BT2.B}, F: {BT2.F}, S:{" "}
            {BT2.S}, V: {BT2.V}
          </p>
        </div>

        {/* Bản đồ vị trí trạm */}
        <div className="p-4 border rounded shadow">
          <h4 className="text-2xl font-bold">Vị trí trạm trên bản đồ</h4>
          <p>Bản đồ sẽ được tích hợp tại đây.</p>
        </div>

        {/* Đồ thị lượng mưa 24 giờ */}
        <div className="p-4 border rounded shadow">
          {renderRainfallChart(rainfall24h, "Lượng mưa trong 24 giờ gần nhất")}
        </div>

        {/* Đồ thị lượng mưa 7 ngày */}
        <div className="p-4 border rounded shadow">
          {renderRainfallChart(rainfall7d, "Lượng mưa trong 7 ngày gần nhất")}
        </div>
      </div>


      <h1>Data from Firebase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
