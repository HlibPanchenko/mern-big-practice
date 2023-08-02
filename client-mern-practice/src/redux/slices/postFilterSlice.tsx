import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type Sort =
  | "popularity"
  | "-popularity"
  | "date"
  | "-date"
  | "comments"
  | "-comments"
  | "visits"
  | "-visits";

interface FilterSLiceState {
  currentPage: number;
  sort:Sort;
  searchInput:string
}

const initialState: FilterSLiceState = {
  currentPage: 1,
  sort: "date",
  searchInput: ''
};

export const postFilterSlice = createSlice({
  name: "postFilter",
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setSort(state, action:PayloadAction<Sort>) {
      state.sort = action.payload;
    },
    setSearch(state, action:PayloadAction<string>) {
      state.searchInput = action.payload;
    },
  },
});

export const { setCurrentPage, setSort,setSearch } = postFilterSlice.actions;

export default postFilterSlice.reducer;
