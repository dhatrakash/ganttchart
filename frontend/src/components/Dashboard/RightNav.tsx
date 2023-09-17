import BaseNav from "./BaseNav";
import AlertTable from "./Tables/AlertTable";

export default function RightNav() {
  const tableContainerStyle = {
    marginLeft: "600px",
  };

  return (
    <div>
      <AlertTable />
      <BaseNav />
    </div>
  );
}
