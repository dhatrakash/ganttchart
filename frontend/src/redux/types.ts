import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export type AppDispatch = ThunkDispatch<AppState, unknown, AnyAction>;

export interface AppState {
  macId: string;
  selectedDate: Date | null;
  uniqueMacArray: { mac: string; di2Sum: number }[];
  productionData: any[];
  widgetStartDate: Date | null;
  widgetEndDate: Date | null;
  widgetMacId: string;
  allMacIds: string[];
  allMachineIds: string[]; // New state for all Machine IDs
  selectedMachineId: string; // New state for the currently selected machine ID
}

export type MacIds = string[];

export interface RootState {
  widgetEndDate: any;
  widgetStartDate: any;
  macId: string;
  selectedDate: Date | null;
  selectedOption: string;
  widgetMacId: string;
}

export const SET_ALL_MAC_IDS = 'SET_ALL_MAC_IDS';
export const SET_ALL_MACHINE_IDS = 'SET_ALL_MACHINE_IDS'; // New constant

export interface SetAllMacIdsAction {
  type: typeof SET_ALL_MAC_IDS;
  payload: string[];
}

export interface SetAllMachineIdsAction { // New interface
  type: typeof SET_ALL_MACHINE_IDS;
  payload: string[];
}

// Thunk related types
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  AnyAction
>;
