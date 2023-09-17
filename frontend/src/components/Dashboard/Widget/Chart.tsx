import { useSelector } from "react-redux";
import { RootState } from "../../../redux/types";

const Chart = () => {
  const widgetStartDate = useSelector(
    (state: RootState) => state.widgetStartDate
  );
  const widgetEndDate = useSelector((state: RootState) => state.widgetEndDate);
  const widgetMacId = useSelector((state: RootState) => state.widgetMacId);

  console.log(widgetStartDate.toString());
  console.log(widgetEndDate.toString());
  console.log(widgetMacId);

  return <div></div>;
};

export default Chart;
