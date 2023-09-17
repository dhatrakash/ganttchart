import { useSelector } from "react-redux";
import { RootState } from "../../../redux/types";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";

export default function ProductionCountChart() {
  const macId = useSelector((state: RootState) => state.macId);
  const [productionData, setProductionData] = useState<any[]>([]);

  const fetchProductionCountData = async (macId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/v1/data/oee/20230825110000/${macId}`
      );

      const data = response.data.machineData;
      setProductionData(data);

      console.log(data);
    } catch (error) {
      console.error("Error fetching production count data:", error);
    }
  };
  useEffect(() => {
    fetchProductionCountData(macId);
  }, [macId]);

  // Function to format the timestamp
  function formatTimestamp(timestamp: string) {
    const year = parseInt(timestamp.substring(0, 4), 10); // Year
    const month = parseInt(timestamp.substring(4, 6), 10) - 1; // Month (0-based)
    const day = parseInt(timestamp.substring(6, 8), 10); // Day
    const hour = parseInt(timestamp.substring(8, 10), 10); // Hour
    const minute = parseInt(timestamp.substring(10, 12), 10); // Minute

    const date = new Date(year, month, day, hour, minute);

    return format(date, "h:mm a");
  }
  const tableContainerStyle = {
    marginLeft: "900px",
  };

  return (
    <div
      className="d-none d-lg-block align-items-start"
      style={tableContainerStyle}
    >
      <ResponsiveContainer width="100%" aspect={3}>
        <AreaChart
          width={500}
          height={300}
          data={productionData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" tickFormatter={formatTimestamp} /> <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="operatingTime"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
