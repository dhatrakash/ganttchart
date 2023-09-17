import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import axios from "axios";
import { setUniqueMacArray } from "../../../redux/actions";
import { RootState } from "../../../redux/types";

function ProductionCountTable() {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: RootState) => state.selectedDate);
  const selectedOption = useSelector(
    (state: RootState) => state.selectedOption
  );
  const [data, setData] = useState<any>([]);
  // const [selectedOption, setSelectedOption] = useState("1h");
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    if (selectedDate) {
      setFormattedDate(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/v1/data/${selectedOption}/${formattedDate}`
        );
        if (response.data && Array.isArray(response.data.data)) {
          console.log(response.data.data);
          setData(response.data.data);
        } else {
          console.error("Invalid data in response:", response.data);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };

    fetchData();
  }, [selectedOption, formattedDate]);

  const uniqueMacData: { [key: string]: number } = {};

  if (data !== null) {
    data.forEach((item: { data: { mac: any; io: { cycle: any } } }) => {
      const mac = item.data?.mac;
      const cycle = item.data?.io?.cycle;

      if (mac) {
        if (uniqueMacData[mac]) {
          uniqueMacData[mac] += cycle || 0;
        } else {
          uniqueMacData[mac] = cycle || 0;
        }
      }
    });
  }

  const uniqueMacArray = Object.keys(uniqueMacData).map((mac) => ({
    mac,
    di2Sum: uniqueMacData[mac],
  }));
  dispatch(setUniqueMacArray(uniqueMacArray));

  function currentDateTime() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return year + month + day + hours + minutes + seconds;
  }

  return (
    <table
      className="table table-striped"
      style={{ width: "300px", marginRight: "20px" }}
    >
      <thead>
        <tr>
          <th scope="col">SrNo</th>
          <th scope="col">Machine</th>
          <th scope="col">Count</th>
        </tr>
      </thead>
      <tbody>
        {uniqueMacArray.map((item, index) => (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>{item.mac}</td>
            <td>{item.di2Sum}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductionCountTable;
