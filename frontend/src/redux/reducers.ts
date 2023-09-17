import { SET_ALL_MAC_IDS, SET_ALL_MACHINE_IDS, AppState } from "./types";
import { SET_MAC_IDS, SET_MACHINE_IDS } from "./actions";

const initialState: AppState = {
  macId: "",
  selectedDate: null,
  uniqueMacArray: [],
  productionData: [],
  widgetStartDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  widgetEndDate: new Date(),
  widgetMacId: "",
  allMacIds: [],
  allMachineIds: [], // New state for all Machine IDs
  selectedMachineId: "", // New state for the currently selected machine ID
};

type Action = {
  type: string;
  payload: any;
};

const rootReducer = (state: AppState = initialState, action: Action) => {
  switch (action.type) {
    case "SET_MAC_ID":
      return { ...state, macId: action.payload };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_UNIQUE_MAC_ARRAY":
      return { ...state, uniqueMacArray: action.payload };
    case "SET_PRODUCTION_DATA":
      return { ...state, productionData: action.payload };
    case "SET_SELECTED_OPTION":
      return { ...state, selectedOption: action.payload };
    case "SET_WIDGET_START_DATE":
      return { ...state, widgetStartDate: action.payload };
    case "SET_WIDGET_END_DATE":
      return { ...state, widgetEndDate: action.payload };
    case "SET_Widget_MacId":
      return { ...state, widgetMacId: action.payload };
    case "SET_ALL_MAC_IDS":
      return { ...state, allMacIds: action.payload };
    case "SET_MAC_IDS":
      return { ...state, allMacIds: action.payload };
    case "SET_MACHINE_IDS":
      return { ...state, allMachineIds: action.payload };

    default:
      return state;
  }
};

export default rootReducer;
