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

function AvgOeeChart() {
  const [AvgOeeData, setAvgOeeData] = useState<any[]>([]);

  const selectedDate = useSelector((state: RootState) => state.selectedDate);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [averageOEEPercentage, setAverageOEEPercentage] =
    useState<string>("0.00");

  useEffect(() => {
    if (selectedDate) {
      setFormattedDate(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate]);

  const fetchProductionCountData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/v1/data/oee/${formattedDate}`
      );

      const data = response.data.oeeData;
      setAvgOeeData(data);

      console.log("AVG OEE:", data);
      const totalOEE = data.reduce(
        (sum: any, dataPoint: { OEE: any }) => sum + dataPoint.OEE,
        0
      );
      const averageOEE = ((totalOEE / data.length) * 100).toFixed(2);
      setAverageOEEPercentage(averageOEE);
    } catch (error) {
      console.error("Error fetching production count data:", error);
    }
  };

  // Calculate the average OEE
  const calculateAverageOEE = async () => {
    if (AvgOeeData.length === 0) {
      return 0;
    }

    const totalOEE = AvgOeeData.reduce(
      (sum, dataPoint) => sum + dataPoint.OEE,
      0
    );

    const averageOEE = ((totalOEE / AvgOeeData.length) * 100).toFixed(2);
    console.log(averageOEE);
  };

  useEffect(() => {
    fetchProductionCountData();
  }, [formattedDate]);

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

  return (
    <div>
      <h6>Average Company OEE :{averageOEEPercentage} % </h6>
      <ResponsiveContainer width="100%" aspect={3}>
        <AreaChart
          width={500}
          height={100}
          data={AvgOeeData}
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
          <Area type="monotone" dataKey="OEE" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AvgOeeChart;
