import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface FilterSLiceState {
  //   seacrhValue: string;
  currentPage: number;
  //   categoryId: number;
}

const initialState: FilterSLiceState = {
  //   seacrhValue: "",
  currentPage: 1,
  //   categoryId: 0,
};

export const postFilterSlice = createSlice({
  name: "postFilter",
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = postFilterSlice.actions;

export default postFilterSlice.reducer;
