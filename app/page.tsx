'use client';
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../lib/firebase";
import { Separator } from "@/components/ui/separator";

// Định nghĩa kiểu dữ liệu
type BTData = {
  A: string;
  B: string;
  F: string;
  S: string;
  V: string;
};

type RainfallData = {
  [key: string]: number;
};

type FirebaseData = {
  IOT: {
    BT1: BTData;
    BT2: BTData;
  };
  Station_1: {
    Test: RainfallData;
  };
};

export default function Home() {
  const [data, setData] = useState<FirebaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = ref(database);
      try {
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          setData(snapshot.val() as FirebaseData);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

  const BT1 = data.IOT.BT1;
  const BT2 = data.IOT.BT2;

  const rainfall24h = Object.fromEntries(
    Object.entries(data.Station_1.Test).filter(
      ([key]) => key.startsWith("T") && parseInt(key.slice(1)) <= 24
    )
  );

  const rainfall7d = Object.fromEntries(
    Object.entries(data.Station_1.Test).filter(
      ([key]) => key.startsWith("T") && parseInt(key.slice(1)) > 30
    )
  );

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

        <div className="p-4 border rounded shadow">
          <h4 className="text-2xl font-bold">Lượng mưa 24 giờ</h4>
          <ul>
            {Object.entries(rainfall24h).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded shadow">
          <h4 className="text-2xl font-bold">Lượng mưa 7 ngày</h4>
          <ul>
            {Object.entries(rainfall7d).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
      </div>


      <h1>Data from Firebase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
