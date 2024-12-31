"use client"
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../lib/firebase";

const DisplayData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = ref(database); // Tham chiếu toàn bộ database
      try {
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          setData(snapshot.val()); // Lưu dữ liệu vào state
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
    <div>
      <h1>Data from Firebase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DisplayData;
