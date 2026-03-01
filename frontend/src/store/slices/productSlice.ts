import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
    searchQuery: string;
}

const initialState: ProductState = {
    searchQuery: '',
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        clearSearchQuery: (state) => {
            state.searchQuery = '';
        },
    },
});

export const { setSearchQuery, clearSearchQuery } = productSlice.actions;
export default productSlice.reducer;
