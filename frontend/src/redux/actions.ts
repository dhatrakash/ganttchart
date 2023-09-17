import { AppThunk } from './types';
import { AnyAction } from "redux";
import { SET_ALL_MAC_IDS, SET_ALL_MACHINE_IDS } from './types';
import { Dispatch } from 'redux';

export const setMacId = (macId: string): AnyAction => ({
  type: "SET_MAC_ID",
  payload: macId,
});

export const setSelectedDate = (date: Date | null): AnyAction => ({
  type: "SET_SELECTED_DATE",
  payload: date,
});

export const setUniqueMacArray = (uniqueMacArray: any[]): AnyAction => ({
  type: "SET_UNIQUE_MAC_ARRAY",
  payload: uniqueMacArray,
});

export const setProductionData = (data: any[]): AnyAction => ({
  type: "SET_PRODUCTION_DATA",
  payload: data,
});

export const setTodayAsSelectedDate = (): AnyAction => ({
  type: "SET_SELECTED_DATE",
  payload: new Date(), // Set the payload to today's date
});

export const setSelectedOption = (option: string): AnyAction => ({
  type: "SET_SELECTED_OPTION",
  payload: option,
});

export const setWidgetStartDate = (date: Date | null): AnyAction => ({
  type: "SET_WIDGET_START_DATE",
  payload: date,
});

export const setWidgetEndDate = (date: Date | null): AnyAction => ({
  type: "SET_WIDGET_END_DATE",
  payload: date,
});

export const setWidgetMacId = (data: string): AnyAction => ({
  type: "SET_Widget_MacId",
  payload: data,
});

//newly added
// ... existing imports ...

// New action to set all MAC IDs
// Define the action type
export const SET_MAC_IDS = "SET_MAC_IDS";

// Define the action creator
// ... other imports ...

// Define the action creator
export const setMacIds = (macIds: string[]) => {
  return {
      type: SET_MAC_IDS,
      payload: macIds
  };
};

export const fetchAllMacIds = (): AppThunk => async dispatch => {
try {
  const response = await fetch("http://localhost:3000/v1/gateway/");
  const data = await response.json();
  
  // Check if data is an array
  if (Array.isArray(data)) {
    const macIds = data.map((gateway: any) => gateway.macId);
    dispatch(setMacIds(macIds));

  } else {
    console.error("Unexpected data format received:", data);
  }
} catch (error) {
  console.error("Error fetching MAC IDs:", error);
}
};


export const SET_MACHINE_IDS = "SET_MACHINE_IDS";

export const setMachineIds = (machineIds: string[]) => {
  return {
      type: SET_MACHINE_IDS,
      payload: machineIds
  };
};

export const fetchAllMachineIds = (): AppThunk => async dispatch => {
    try {
        const response = await fetch("http://localhost:3000/v1/machine/findAllMachines");
        const data = await response.json();
        const machineIds = data.map((record: any) => record.machineId);
        dispatch(setMachineIds(machineIds));
    } catch (err) {
        console.error("Error fetching machine IDs:", err);
    }
};

// Adjust the fetch logic for production data
export const fetchProductionDataByMachine = (machineId: string, hours: number): AppThunk => async dispatch => {
    try {
        const response = await fetch("http://localhost:3000/v1/hardware/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                machineId: machineId,
                hours: hours,
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