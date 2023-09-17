import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import store from "./redux/store";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import OeeChart from "./components/Dashboard/Charts/OeeChart";
import PortCountChart from "./components/Dashboard/Charts/PortCountChart";
import ProductionCountChart from "./components/Dashboard/Charts/ProductionCountChart";
import IdleTimeChart from "./components/Dashboard/Charts/IdleTimeChart";
import MainDash from "./components/Dashboard/MainDash";
import Navbar from "./components/Navbar";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
        <Routes>
          <Route path="/dashboard" element={<MainDash />}>
            <Route index element={<Navbar />} />
            <Route path="oee" element={<OeeChart />} />
            <Route path="port-count" element={<PortCountChart />} />
            <Route path="production-count" element={<ProductionCountChart />} />
            <Route path="idle-time" element={<IdleTimeChart />} />
          </Route>
        </Routes>
      </Router>
    </Provider>,
    rootElement
  );
} else {
  console.error("The 'root' element was not found in the document.");
}

reportWebVitals();

// import ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";
// import reportWebVitals from "./reportWebVitals";

// import { Provider } from "react-redux";
// import store from "./redux/store";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Dashboard from "./components/Dashboard/Dashboard";
// import OeeChart from "./components/Dashboard/Charts/OeeChart";
// import PortCountChart from "./components/Dashboard/Charts/PortCountChart";
// import ProductionCountChart from "./components/Dashboard/Charts/ProductionCountChart";
// import IdleTimeChart from "./components/Dashboard/Charts/IdleTimeChart";

// const rootElement = document.getElementById("root");

// if (rootElement) {
//   ReactDOM.render(
//     <Provider store={store}>
//       <Router>
//         <App />
//         <Routes>
//           <Route path="/dashboard" element={<Dashboard />}>
//             <Route index element={<Dashboard />} />
//             <Route path="oee" element={<OeeChart />} />
//             <Route path="port-count" element={<PortCountChart />} />
//             <Route path="production-count" element={<ProductionCountChart />} />
//             <Route path="idle-time" element={<IdleTimeChart />} />
//           </Route>
//         </Routes>
//       </Router>
//     </Provider>,
//     rootElement
//   );
// } else {
//   console.error("The 'root' element was not found in the document.");
// }

// reportWebVitals();
