'use client';
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../lib/firebase";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FaTemperatureHigh, FaTint, FaCloudRain, FaSeedling } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


// Định nghĩa kiểu dữ liệu
type BTData = {
  A: string;
  B: string;
  F: string;
  S: string;
  V: string;
};

type RainfallData = {
  [key: string]: string;
};

type FirebaseData = {
  IOT: {
    BT1: BTData;
    BT2: BTData;
  };
  Station_1: {
    Humidity: string;
    HumidityLand: string;
    RainFall: string;
    Temperature: string;
    Test: RainfallData;
  };
  Station_2: {
    Humidity: string;
    HumidityLand: string;
    RainFall: string;
    Temperature: string;
    Test: RainfallData;
  };
};

export default function Home() {
  const [data, setData] = useState<FirebaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<"Station_1" | "Station_2">("Station_1");
  const [selectedChart, setSelectedChart] = useState<"24h" | "7d">("24h");


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

  const stationData = data[selectedStation] || {
    Humidity: "0",
    HumidityLand: "0",
    RainFall: "0",
    Temperature: "0",
  };
  
  const rainfallData = data[selectedStation]?.Test || {};
  const rainfall24h = Object.entries(rainfallData)
  .filter(([key]) => key.startsWith("T") && parseInt(key.slice(1)) <= 24)
  .map(([key, value]) => ({
    time: key, // Đảm bảo là chuỗi
    rainfall: parseFloat(value) || 0, // Nếu không phải số, đặt mặc định là 0
  }));

const rainfall7d = Object.entries(rainfallData)
  .filter(([key]) => key.startsWith("T") && parseInt(key.slice(1)) > 30)
  .map(([key, value]) => ({
    time: key, // Đảm bảo là chuỗi
    rainfall: parseFloat(value) || 0, // Nếu không phải số, đặt mặc định là 0
  }));

  return (
    <div className="p-4">
      <div className="justify-center text-center">
        <h1 className="text-5xl font-extrabold">Hệ thống theo dõi và cảnh báo sạt lở đất</h1>
        <h2 className="text-xl font-medium">Học phần: Hệ thống IoT - Mã học phần: IT4735</h2>
        <h3 className="font-bold">Vũ Duy Khanh - Hà Mạnh Tuấn - Giang Quốc Hoàn - Đào Mạnh Tuyên</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Thông tin trạm IOT */}
        <Card className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 p-4 bg-amber-50 border rounded-2xl shadow">
          <div className="flex items-center justify-center text-cyan-900 text-2xl font-bold rounded-2xl p-2">
            Thông tin trạm
          </div>

          <CardContent className="items-center justify-center text-center grid grid-cols-2 p-2 gap-4">
            <Card className="col-span-1 row-span-1 bg-orange-400">
              <CardHeader className="font-semibold text-2xl text-white flex items-center p-4 gap-4">
                Nhiệt độ
                <FaTemperatureHigh />
              </CardHeader>
              <CardContent className="font-semibold text-4xl text-white">
                {parseFloat(stationData.Temperature).toFixed(2)}°C
              </CardContent>
            </Card>

            <Card className="col-span-1 row-span-1 bg-cyan-400">
              <CardHeader className="font-semibold text-2xl text-white flex items-center p-4 gap-4">
                Độ ẩm
                <FaTint />
              </CardHeader>
              <CardContent className="font-semibold text-4xl text-white">
                {parseFloat(stationData.Humidity).toFixed(2)}%
              </CardContent>
            </Card>

            <Card className="col-span-1 row-span-1 bg-blue-400">
              <CardHeader className="font-semibold text-xl text-white flex items-center p-4 gap-4">
                Lượng mưa
                <FaCloudRain />
              </CardHeader>
              <CardContent className="font-semibold text-4xl text-white">
                {parseFloat(stationData.RainFall).toFixed(2)}mm
              </CardContent>
            </Card>

            <Card className="col-span-1 row-span-1 bg-purple-400">
              <CardHeader className="font-semibold text-xl text-white flex items-center p-4 gap-4">
                Độ ẩm đất
                <FaSeedling />
              </CardHeader>
              <CardContent className="font-semibold text-4xl text-white">
                {parseFloat(stationData.HumidityLand).toFixed(2)}%
              </CardContent>
            </Card>
          </CardContent>

          <CardFooter className="justify-center p-4 gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedStation === "Station_1" ? "bg-cyan-500 text-white font-bold" : "bg-gray-300"
              }`}
              onClick={() => setSelectedStation("Station_1")}
            >
              Station 1
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedStation === "Station_2" ? "bg-cyan-500 text-white font-bold" : "bg-gray-300"
              }`}
              onClick={() => setSelectedStation("Station_2")}
            >
              Station 2
            </button>
          </CardFooter>
        </Card>
        
        <Card className="col-span-1 row-span-1 md:col-span-2 md:row-span-1 p-4 bg-amber-50 border rounded-2xl shadow">
          <div className="flex items-center justify-center text-cyan-900 text-2xl font-bold rounded-2xl p-2">
            Cảnh báo sạt lở
          </div>

          <CardContent className="items-center justify-center text-center grid grid-cols-2 p-2 gap-4">
            <Card className="col-span-1 row-span-3 bg-orange-600 h-full p-4">
              <CardHeader className="font-semibold text-3xl text-white items-center p-4 gap-4">
                Mức cảnh báo hiện tại
                
              </CardHeader>
              <Separator className="my-1" />
              <CardContent className="font-bold text-5xl text-white gap-4 p-4">
                Mức 2
              </CardContent>
              
              <CardFooter className="font-normal text-xl text-white">
                Khả năng nguy hiểm khá cao, chủ động theo dõi các bản tin thời tiết, sơ tán người và tài sản cẩn thiết
              </CardFooter>
              
            </Card>
            
            <Card className="col-span-1 row-span-2 bg-red-600 h-full">
              <CardHeader className="font-semibold text-2xl text-white flex items-center p-4 gap-4">
                Mức cảnh báo dự báo
                
              </CardHeader>
              <CardContent className="font-semibold text-3xl text-white">
                Mức 3
              </CardContent>
            </Card>

            <Card className="col-span-1 row-span-1 bg-cyan-50 h-full">
              <CardHeader className="font-semibold text-2xl text-cyan-900 flex items-center p-4 gap-4">
                Thông tin các mức cảnh báo
                
              </CardHeader>
              <CardContent className="font-semibold text-2xl text-cyan-800">
                
                <div>
                  Mức 1: 
                </div>
                <div>
                  Mức 2:
                </div>
                <div>
                  Mức 3:
                </div>
              </CardContent>
            </Card>

          </CardContent>

          <CardFooter className="justify-center p-4 gap-4">
            
          </CardFooter>
        </Card>
        {/* Bản đồ vị trí trạm */}
        <Card className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 p-4 bg-amber-50 border rounded-2xl shadow">
          <div className="flex items-center justify-center text-cyan-900 text-2xl font-bold rounded-2xl p-2">
            Vị trí trạm
          </div>

          <CardContent className="items-center justify-center text-center grid grid-cols-2 p-2 gap-4">
            
          </CardContent>

          <CardFooter className="justify-center p-4 gap-4">
            
          </CardFooter>
        </Card>

        

        <Card className="col-span-1 row-span-1 md:col-span-2 md:row-span-1 p-4 bg-amber-50 border rounded-2xl shadow">
            <div className="flex items-center justify-center text-cyan-900 text-2xl font-bold rounded-2xl p-2">
              Thông tin lượng mưa
            </div>

            <CardContent className="items-center justify-center text-center p-2 gap-4 ">
              {/* Biểu đồ hiển thị */}
              <ResponsiveContainer width="100%" height={300}>
                {selectedChart === "24h" ? (
                  <BarChart data={rainfall24h}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: "Lượng mưa (mm)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    
                    <Bar dataKey="rainfall" fill="#0369a1" radius={[4, 4, 4, 4]}/>
                  </BarChart>
                ) : (
                  <BarChart data={rainfall7d}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time"  />
                    <YAxis label={{ value: "Lượng mưa (mm)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    
                    <Bar dataKey="rainfall" fill="#0f766e" radius={[4, 4, 4, 4]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>

            {/* Footer chọn hiển thị */}
            <CardFooter className="justify-center p-4 gap-4">
              <button
                className={`px-4 py-2 rounded ${
                  selectedChart === "24h" ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setSelectedChart("24h")}
              >
                Lượng mưa 24 giờ
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  selectedChart === "7d" ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setSelectedChart("7d")}
              >
                Lượng mưa 7 ngày
              </button>
            </CardFooter>
          </Card>


      </div>

      <Separator className="my-4" />

      

      <Separator className="my-4" />

      <h1>Data from Firebase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
