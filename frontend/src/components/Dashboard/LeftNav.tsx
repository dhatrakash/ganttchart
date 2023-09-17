import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import axios from "axios";

import { setSelectedOption, setUniqueMacArray } from "../../redux/actions";
import { RootState } from "../../redux/types";
import ProductionCountTable from "./Tables/ProductionCountTable";

// interface LeftNavProps {
//   selectedDate: Date | null;
// }

function LeftNav() {
  const dispatch = useDispatch();
  const [data, setData] = useState<any>([]);
  const selectedOption = useSelector(
    (state: RootState) => state.selectedOption
  );
  // const [selectedOption, setSelectedOption] = useState("1h");
  const [formattedDate, setFormattedDate] = useState<string>("");
  const selectedDate = useSelector((state: RootState) => state.selectedDate);
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
        // Check if the response contains data property and it's an array
        if (response.data && Array.isArray(response.data.data)) {
          console.log(response.data.data);
          setData(response.data.data);
        } else {
          // Handle the case where the response is not as expected
          console.error("Invalid data in response:", response.data);
          setData([]); // Set an empty array to prevent further errors
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Set an empty array in case of an error
      }
    };

    fetchData();
  }, [selectedOption, formattedDate]);

  // Create an object to store unique mac values and their corresponding sums
  const uniqueMacData: { [key: string]: number } = {};

  // Loop through the tdata array and calculate the sums
  if (data !== null) {
    data.forEach((item: { data: { mac: any; io: { cycle: any } } }) => {
      const mac = item.data?.mac;
      const di2 = item.data?.io?.cycle;

      if (mac) {
        if (uniqueMacData[mac]) {
          // If the mac already exists in the object, add the di2 value to the sum
          uniqueMacData[mac] += di2 || 0;
        } else {
          // If the mac is not in the object, initialize the sum with di2 value
          uniqueMacData[mac] = di2 || 0;
        }
      }
    });
  }

  // Convert the uniqueMacData object into an array of objects
  const uniqueMacArray = Object.keys(uniqueMacData).map((mac) => ({
    mac,
    di2Sum: uniqueMacData[mac],
  }));
  dispatch(setUniqueMacArray(uniqueMacArray));
  // To get current dataTime
  function currentDateTime() {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return year + month + day + hours + minutes + seconds;
  }
  const handleSelectedOptionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newOption = e.target.value;
    dispatch(setSelectedOption(newOption));
  };

  return (
    <>
      <div style={{ width: "200px", marginRight: "20px" }}>
        <div className="mb-3">
          <h3>Parts Produced</h3>

          <h3>{formattedDate}</h3>
          {/* <h3> {formattedDate}</h3> */}

          <label htmlFor="timeRange" className="form-label">
            Select Time Range
          </label>
          <select
            className="form-select"
            id="timeRange"
            value={selectedOption}
            // onChange={(e) => setSelectedOption(e.target.value)}
            onChange={handleSelectedOptionChange}
          >
            <option value="1h">1 Hour</option>
            <option value="8h">8 Hours</option>
            <option value="24h">24 Hours</option>
          </select>
        </div>
      </div>

      {/* <table
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
      </table> */}

      <ProductionCountTable />
    </>
  );
}

export default LeftNav;
