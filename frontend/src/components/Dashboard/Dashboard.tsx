import React from 'react';
import Header from "./Header";
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";
import GanttChart from './Charts/GanttChart';

function Dashboard() {
  return (
    <div>
      {/* Left Div */}
      <div style={{ float: "left", width: "25%" }}>
        <LeftNav />
      </div>
      {/* Middle Div */}
      <div style={{ float: "left", width: "50%" }}>
        <Header /> 
        <GanttChart />
      </div>
      {/* Right Div */}
      <div style={{ float: "left", width: "25%" }}>
        <RightNav />
      </div>
    </div>
  );
}

export default Dashboard;
