import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Rectangle,
} from "recharts";
import "./GanttChart.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setProductionData,
  setMachineIds,
} from "../../../redux/actions";
import { AppState } from "../../../redux/types";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const status =
      payload[0].payload.status === 1
        ? "Productive"
        : payload[0].payload.status === 0
        ? "Idle"
        : "No Data";
    return (
      <div className="custom-tooltip">
        <p>{`${new Date(payload[0].payload.dtm).toLocaleDateString()} 
                    ${new Date(
                      payload[0].payload.dtm
                    ).toLocaleTimeString()} - ${status}`}</p>
      </div>
    );
  }
  return null;
};

const getColor = (entry: any) => {
  if (entry.status === 1) {
    return "#4CAF50";
  } else if (entry.status === 0) {
    return "#FFFF00";
  } else {
    return "#FF0000";
  }
};

const formatTickItem = (tickItem: string) => {
  const date = new Date(tickItem);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const GanttChart: React.FC = () => {
  const dispatch = useDispatch();
  const productionData = useSelector((state: AppState) => state.productionData);
  const allMachineIds = useSelector((state: AppState) => state.allMachineIds);

  const [selectedMachineId, setSelectedMachineId] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<number>(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    const fetchMachineIds = async () => {
      try {
        const response = await fetch("http://localhost:3000/v1/machines/findAllMachines");
        const data = await response.json();
        const machineIds = data.map((record: any) => record.machineId);
        dispatch(setMachineIds(machineIds));
      } catch (err) {
        console.error("Error fetching machine IDs:", err);
      }
    };

    fetchMachineIds();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedMachineId) return; // Avoid fetching if no machine is selected
      try {
        const response = await fetch("http://localhost:3000/v1/data/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            machineId: selectedMachineId,
            hours: selectedHours,
          }),
        });
        const data = await response.json();
        const formattedData = data.map((d: any) => ({
          name: d._id,
          value: 1,
          status: d.data.io.di1 || -1,
          dtm: d.data.dtm,
        }));
        dispatch(setProductionData(formattedData));
      } catch (err) {
        console.error("Error fetching production data:", err);
      }
    };

    fetchData();
  }, [dispatch, selectedMachineId, selectedHours]);

  const formattedData = productionData.map((d: any) => ({
    name: d._id,
    value: 1,
    status: d.data.io.di1 !== undefined ? d.data.io.di1 : -1,
    dtm: d.data.dtm,
  }));

  const ChartLegend: React.FC = () => (
    <div className="chart-legend">
      <div className="legend-item">
        <div className="color-box" style={{ backgroundColor: "#4CAF50" }}></div>
        Productive
      </div>
      <div className="legend-item">
        <div className="color-box" style={{ backgroundColor: "#FFFF00" }}></div>
        Idle
      </div>
      <div className="legend-item">
        <div className="color-box" style={{ backgroundColor: "#FF0000" }}></div>
        No Data
      </div>
    </div>
  );

  const CustomBar = (props: any) => {
    const { x, y, width, height, fill, index } = props;
    const isHovered = hoveredBar === index;
    const newHeight = isHovered ? height + 5 : height;
    const newY = isHovered ? y - 5 : y;
    const extendedWidth = width + 1.5; // Extend the width by 1 pixel


    let radiusTopLeft = 0;
    let radiusTopRight = 0;
    let radiusBottomLeft = 0;
    let radiusBottomRight = 0;

    if (index === 0) {
      // First bar
      radiusTopLeft = 25; // Adjust these values as needed
      radiusBottomLeft = 25;
    } else if (index === formattedData.length - 1) {
      // Last bar
      radiusTopRight = 25; // Adjust these values as needed
      radiusBottomRight = 25;
    }

    return (
      <Rectangle
        x={x}
        y={newY}
        width={extendedWidth}
        height={newHeight}
        fill={fill}
        onMouseEnter={() => setHoveredBar(index)}
        onMouseLeave={() => setHoveredBar(null)}
        radius={[
          radiusTopLeft,
          radiusTopRight,
          radiusBottomRight,
          radiusBottomLeft,
        ]}
      />
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="gantt-chart-container">
      <div className="dropdown-legend-container">
      <div className="dropdown-container">
        <label>Machine ID: </label>
        <select
          value={selectedMachineId}
          onChange={(e) => setSelectedMachineId(e.target.value)}
        >
          <option value="" disabled>Select a Machine ID</option>
          {allMachineIds.map((machineId) => (
            <option key={machineId} value={machineId}>
              {machineId}
            </option>
          ))}
        </select>
      </div>
        <ChartLegend />
      </div>
      <div className="button-container">
        <button
          onClick={() => setSelectedHours(1)}
          className={selectedHours === 1 ? "selected" : ""}
        >
          Last 1 hour
        </button>
        <button
          onClick={() => setSelectedHours(8)}
          className={selectedHours === 8 ? "selected" : ""}
        >
          Last 8 hours
        </button>
        <button
          onClick={() => setSelectedHours(24)}
          className={selectedHours === 24 ? "selected" : ""}
        >
          Last 24 hours
        </button>
        <button
          onClick={() => setSelectedHours(168)}
          className={selectedHours === 168 ? "selected" : ""}
        >
          Last week
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <BarChart
            width={500}
            height={60}
            data={formattedData}
            barCategoryGap={0}
            barGap={0}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="dtm" tickFormatter={formatTickItem} axisLine={false} />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" shape={<CustomBar />}>
              {formattedData.map((entry, index) => {
                const fillColor = getColor(entry);
                return <Cell key={`cell-${index}`} fill={fillColor}stroke="none"/>;
              })}
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;

// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   Tooltip,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Cell,
//   Rectangle,
// } from "recharts";
// import "./GanttChart.css";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setProductionData,
//   fetchAllMacIds,
//   setMacIds,
// } from "../../../redux/actions";
// import { AppState } from "../../../redux/types";
// import { AppDispatch } from "../../../redux/types";

// const CustomTooltip = ({ active, payload }: any) => {
//   if (active && payload && payload.length) {
//     const status =
//       payload[0].payload.status === 1
//         ? "Productive"
//         : payload[0].payload.status === 0
//         ? "Idle"
//         : "No Data";
//     return (
//       <div className="custom-tooltip">
//         <p>{`${new Date(
//           payload[0].payload.dtm
//         ).toLocaleDateString()} ${new Date(
//           payload[0].payload.dtm
//         ).toLocaleTimeString()} - ${status}`}</p>
//       </div>
//     );
//   }
//   return null;
// };
// const getColor = (entry: any) => {
//   if (entry.status === 1) {
//     return "#4CAF50"; // Productive: Green
//   } else if (entry.status === 0) {
//     return "#FFFF00"; // Idle: Yellow
//   } else {
//     return "#FF0000"; // No Data or Other Status: Red
//   }
// };

// const formatTickItem = (tickItem: string) => {
//   const date = new Date(tickItem);
//   return date.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const GanttChart: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const productionData = useSelector((state: AppState) => state.productionData);
//   const allMacIds = useSelector((state: AppState) => state.allMacIds);
//   const [selectedMacId, setSelectedMacId] = useState<string>("608A10B60822"); // Default to the previous MAC ID
//   const [selectedHours, setSelectedHours] = useState(24);
//   useEffect(() => {
//     const fetchMacIds = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/v1/gateway/");
//         const data = await response.json();
//         console.log("API Data:", data);

//         const macIds = data.map((record: any) => record.macId);

//         console.log("Extracted MAC IDs:", macIds);

//         dispatch(setMacIds(macIds));
//       } catch (error) {
//         console.error("Error fetching MAC IDs:", error);
//       }
//     };

//     fetchMacIds();
//   }, [dispatch]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/v1/data/send", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             mac: selectedMacId,
//             hours: selectedHours,
//           }),
//         });
//         const data = await response.json();
//         console.log("Fetched MAC IDs:", data);

//         dispatch(setProductionData(data.foundData));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [dispatch, selectedHours, selectedMacId]);

//   const formattedData = productionData.map((d: any) => ({
//     name: d._id,
//     value: 1,
//     status: d.data.io.di1 !== undefined ? d.data.io.di1 : -1, // Assuming -1 means no data.
//     dtm: d.data.dtm,
//   }));

//   const CustomBar = (props: any) => {
//     const { x, y, width, height, fill } = props;
//     return <Rectangle x={x} y={y} width={width} height={height} fill={fill} />;
//   };

//   return (
//     <div className="gantt-chart-container">
//       <div className="dropdown-container">
//         <label>Select MAC ID: </label>
//         <select
//           value={selectedMacId}
//           onChange={(e) => setSelectedMacId(e.target.value)}
//         >
//           {allMacIds.map((macId) => (
//             <option key={macId} value={macId}>
//               {macId}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="button-container">
//         <button onClick={() => setSelectedHours(1)}>Last 1 hour</button>
//         <button onClick={() => setSelectedHours(8)}>Last 8 hours</button>
//         <button onClick={() => setSelectedHours(24)}>Last 24 hours</button>
//         <button onClick={() => setSelectedHours(168)}>Last week</button>
//       </div>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div>
//           <BarChart
//             width={500}
//             height={60}
//             data={formattedData}
//             barCategoryGap={0}
//             barGap={0}
//             margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="dtm" tickFormatter={formatTickItem} />
//             <YAxis hide={true} />
//             <Tooltip content={<CustomTooltip />} />8
//             <Bar dataKey="value" shape={<CustomBar />}>
//               {formattedData.map((entry, index) => {
//                 const fillColor = getColor(entry);
//                 return <Cell key={`cell-${index}`} fill={fillColor} />;
//               })}
//             </Bar>
//           </BarChart>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GanttChart;

// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   Tooltip,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Cell,
// } from "recharts";
// import "./GanttChart.css";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setProductionData,
//   fetchAllMacIds,
//   setMacIds,
// } from "../../../redux/actions";
// import { AppState } from "../../../redux/types";
// import { AppDispatch } from "../../../redux/types";

// const CustomTooltip = ({ active, payload }: any) => {
//   if (active && payload && payload.length) {
//     const status = payload[0].payload.status === 1 ? "Productive" : "Idle";
//     return (
//       <div className="custom-tooltip">
//         <p>{`${new Date(
//           payload[0].payload.dtm
//         ).toLocaleDateString()} ${new Date(
//           payload[0].payload.dtm
//         ).toLocaleTimeString()} - ${status}`}</p>
//       </div>
//     );
//   }
//   return null;
// };

// const GanttChart: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const productionData = useSelector((state: AppState) => state.productionData);
//   const allMacIds = useSelector((state: AppState) => state.allMacIds);
//   const [selectedMacId, setSelectedMacId] = useState<string>("608A10B60822"); // Default to the previous MAC ID
//   const [selectedHours, setSelectedHours] = useState(24);

//   useEffect(() => {
//     const fetchMacIds = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/v1/gateway/");
//         const data = await response.json();
//         console.log("API Data:", data);

//         const macIds = data.map((record: any) => record.macId);

//         console.log("Extracted MAC IDs:", macIds);

//         dispatch(setMacIds(macIds));
//       } catch (error) {
//         console.error("Error fetching MAC IDs:", error);
//       }
//     };

//     fetchMacIds();
//   }, [dispatch]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/v1/data/send", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             //mac:"608A10B60822",
//             mac: selectedMacId,
//             hours: selectedHours,
//           }),
//         });
//         const data = await response.json();
//         // Add the following line to inspect the fetched data:
//         console.log("Fetched MAC IDs:", data);

//         dispatch(setProductionData(data.foundData));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [dispatch, selectedHours, selectedMacId]);

//   const formattedData = productionData.map((d: any) => ({
//     name: d._id,
//     value: 1,
//     status: d.data.io.di1,
//     dtm: d.data.dtm,
//   }));

//   return (
//     <div className="gantt-chart-container">
//       {/* Dropdown for MAC IDs */}
//       <div className="dropdown-container">
//         <label>Select MAC ID: </label>
//         <select
//           value={selectedMacId}
//           onChange={(e) => setSelectedMacId(e.target.value)}
//         >
//           {allMacIds.map((macId) => (
//             <option key={macId} value={macId}>
//               {macId}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="button-container">
//         <button onClick={() => setSelectedHours(1)}>Last 1 hour</button>
//         <button onClick={() => setSelectedHours(8)}>Last 8 hours</button>
//         <button onClick={() => setSelectedHours(24)}>Last 24 hours</button>
//         <button onClick={() => setSelectedHours(168)}>Last week</button>
//       </div>

//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ marginRight: "10px" }}>Status</div>
//         <div>
//           <BarChart width={500} height={60} data={formattedData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis hide={true} />
//             <YAxis hide={true} />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar dataKey="value" maxBarSize={5}>
//               {formattedData.map((entry, index) => {
//                 const fillColor = entry.status === 1 ? "#4CAF50" : "#FFFF00";
//                 return <Cell key={`cell-${index}`} fill={fillColor} />;
//               })}
//             </Bar>
//           </BarChart>
//           <div style={{ textAlign: "center", marginTop: "5px" }}>Time</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GanttChart;

// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   Tooltip,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Cell,
// } from "recharts";
// import "./GanttChart.css";
// import { useDispatch, useSelector } from "react-redux";
// import { setProductionData } from "../../../redux/actions";
// import { AppState } from "../../../redux/types";

// const CustomTooltip = ({ active, payload }: any) => {
//   if (active && payload && payload.length) {
//     const status = payload[0].payload.status === 1 ? "Productive" : "Idle";
//     return (
//       <div className="custom-tooltip">
//         <p>{`${new Date(
//           payload[0].payload.dtm
//         ).toLocaleDateString()} ${new Date(
//           payload[0].payload.dtm
//         ).toLocaleTimeString()} - ${status}`}</p>
//       </div>
//     );
//   }
//   return null;
// };

// const GanttChart: React.FC = () => {
//   const dispatch = useDispatch();
//   const productionData = useSelector((state: AppState) => state.productionData);
//   const [selectedHours, setSelectedHours] = useState(24);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/v1/data/send", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             mac: "608A10B60822",
//             hours: selectedHours,
//           }),
//         });
//         const data = await response.json();
//         dispatch(setProductionData(data.foundData));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [dispatch, selectedHours]);

//   const formattedData = productionData.map((d: any) => ({
//     name: d._id,
//     value: 1,
//     status: d.data.io.di1,
//     dtm: d.data.dtm,
//   }));

//   return (
//     <div className="gantt-chart-container">
//       <div className="button-container">
//         <button onClick={() => setSelectedHours(1)}>Last 1 hour</button>
//         <button onClick={() => setSelectedHours(8)}>Last 8 hours</button>
//         <button onClick={() => setSelectedHours(24)}>Last 24 hours</button>
//         <button onClick={() => setSelectedHours(168)}>Last week</button>
//       </div>
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div style={{ marginRight: "10px" }}>Status</div>
//         <div>
//           <BarChart width={500} height={60} data={formattedData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis hide={true} />
//             <YAxis hide={true} />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar dataKey="value" maxBarSize={5}>
//               {formattedData.map((entry, index) => {
//                 const fillColor = entry.status === 1 ? "#4CAF50" : "#FFFF00"; // Changed red to yellow
//                 return <Cell key={`cell-${index}`} fill={fillColor} />;
//               })}
//             </Bar>
//           </BarChart>
//           <div style={{ textAlign: "center", marginTop: "5px" }}>Time</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GanttChart;
