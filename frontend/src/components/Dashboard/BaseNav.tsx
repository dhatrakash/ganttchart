import { Link } from "react-router-dom";

export default function BaseNav() {
  return (
    <div>
      <nav className="nav nav-pills nav-justified">
        <Link to="/dashboard/oee" className="nav-item nav-link ">
          OEE
        </Link>
        <Link to="/dashboard/port-count" className="nav-item nav-link">
          Port Count
        </Link>
        <Link to="/dashboard/production-count" className="nav-item nav-link">
          Production Count
        </Link>
        <Link to="/dashboard/idle-time" className="nav-item nav-link ">
          Idle Time
        </Link>
      </nav>
    </div>
  );
}
