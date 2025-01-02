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

const defaultData: FirebaseData = {
  IOT: {
    BT1: { A: "0", B: "0", F: "0", S: "0", V: "0" },
    BT2: { A: "0", B: "0", F: "0", S: "0", V: "0" },
  },
  Station_1: {
    Humidity: "0",
    HumidityLand: "0",
    RainFall: "0",
    Temperature: "0",
    Test: {},
  },
  Station_2: {
    Humidity: "0",
    HumidityLand: "0",
    RainFall: "0",
    Temperature: "0",
    Test: {},
  },
};

export default function Home() {
  const [data, setData] = useState<FirebaseData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<"Station_1" | "Station_2">("Station_1");
  const [selectedChart, setSelectedChart] = useState<"24h" | "7d">("24h");
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("00:00:00");

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = ref(database);
      try {
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          setData(snapshot.val() as FirebaseData);
          setLastUpdateTime(new Date().toLocaleTimeString("vi-VN"));
        } else {
          setData(defaultData);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setData(defaultData);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const stationData = data[selectedStation] || defaultData.Station_1;

  const rainfallData = stationData.Test || {};
  const rainfall24h = Object.entries(rainfallData)
    .filter(([key]) => key.startsWith("T") && parseInt(key.slice(1)) <= 24)
    .map(([key, value]) => ({
      time: key,
      rainfall: parseFloat(value) || 0,
    }))
    .sort((a, b) => parseInt(b.time.slice(1)) - parseInt(a.time.slice(1)));

  const rainfall7d = Object.entries(rainfallData)
    .filter(([key]) => key.startsWith("T") && parseInt(key.slice(1)) > 30)
    .map(([key, value]) => ({
      time: key,
      rainfall: parseFloat(value) || 0,
    }))
    .sort((a, b) => parseInt(b.time.slice(1)) - parseInt(a.time.slice(1)));

  // Cảnh báo sạt lở dựa trên RainFall
  const rainFallValue = parseFloat(stationData.RainFall) || 0;
  let alertLevel = "";
  let alertMessage = "";

  if (rainFallValue < 25) {
    alertLevel = "Mức 1: An toàn";
    alertMessage =
      "Hãy chú ý an toàn, luôn đảm bảo cập nhật thông tin thời tiết từ trung tâm khí tượng thủy văn ở khu vực của bạn.";
  } else if (rainFallValue < 100) {
    alertLevel = "Mức 2: Cảnh báo";
    alertMessage =
      "Cần di tản người và tài sản cần thiết, báo cho tất cả mọi người xung quanh về nguy cơ thiệt hại. Luôn theo dõi thông tin thời tiết từ trung tâm khí tượng thủy văn ở khu vực của bạn.";
  } else {
    alertLevel = "Mức 3: Nguy hiểm";
    alertMessage =
      "Cần di tản người khẩn cấp, hãy bỏ qua tài sản nếu có thể, hô hoán tất cả mọi người xung quanh. Di chuyển đến nơi an toàn nhất có thể.";
  }

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
        
        <Card className="col-span-1 row-span-1 md:col-span-2 md:row-span-1 p-4 bg-amber-50 border rounded-2xl shadow h-full">
          <div className="flex items-center justify-center text-cyan-900 text-2xl font-bold rounded-2xl p-2">
            Cảnh báo sạt lở
          </div>

          <CardContent className="items-center justify-center text-center grid grid-cols-2 p-2 gap-4">
            <Card
              className={`col-span-1 row-span-1 h-full p-4 ${
                rainFallValue < 25
                  ? "bg-green-600"
                  : rainFallValue < 100
                  ? "bg-orange-600"
                  : "bg-red-600"
              }`}
            >
              <CardHeader className="font-semibold text-3xl text-white items-center p-4 gap-4">
                Dự báo sạt lở
              </CardHeader>
              <Separator className="my-1" />
              <CardContent className="font-bold text-5xl text-white gap-4 p-4">
                {alertLevel}
                
              </CardContent>
              
              <CardFooter className="font-normal text-xl text-white">
              <div>
                {alertMessage}
              </div>
              
              </CardFooter>

              <div className="text-sm italic">
                {loading
                  ? "Chưa kết nối được server"
                  : `Cập nhật: ${lastUpdateTime}`}
              </div>
            </Card>
            
            

            <Card className="col-span-1 row-span-1 bg-cyan-50 h-full">
              <CardHeader className="font-semibold text-2xl text-cyan-900 flex items-center p-4 gap-4">
                Thông tin các mức cảnh báo
                
              </CardHeader>
              <CardContent className="font-semibold text-2xl ">
                
                <div className="text-green-600">
                  Mức 1: An toàn
                </div>
                <div className="text-yellow-600">
                  Mức 2: Cảnh báo
                </div>
                <div className="text-red-600">
                  Mức 3: Nguy hiểm
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

          <CardContent className="items-center justify-center text-center p-2 gap-4">
          <iframe
              className="rounded-2xl"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.684617639564!2d105.8451778!3d21.0052757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad3592853133%3A0x20992b190671769b!2zTmjDoCBDNyAsIMSQ4bqhaSBI4buNYyBCw6FjaCBLaG9hIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1735801651893!5m2!1svi!2s"
              width="100%"
              height="300"
              style={{ border: 0 }}
              
              loading="lazy"
            ></iframe>
          </CardContent>
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
